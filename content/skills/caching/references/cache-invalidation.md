# Cache Invalidation

Guide to keeping cache consistent with source data.

## Invalidation Strategies

| Strategy | Consistency | Complexity | Best For |
|----------|-------------|------------|----------|
| TTL-based | Eventual | Low | Read-heavy, tolerates staleness |
| Event-driven | Strong | Medium | Write consistency critical |
| Write-through | Strong | Medium | Simple data models |
| Versioning | Strong | Medium | Complex cache dependencies |

## TTL-Based Invalidation

Simplest approach - let cache expire naturally.

```python
# Set with TTL
cache.setex("user:123", 3600, user_json)  # 1 hour

# Different TTLs for different data types
TTL_CONFIG = {
    "user_profile": 3600,      # 1 hour - changes rarely
    "product_list": 300,       # 5 min - moderate changes
    "stock_count": 30,         # 30 sec - changes frequently
    "feature_flags": 60,       # 1 min - quick updates needed
}

def cache_with_ttl(key: str, data: dict, data_type: str):
    ttl = TTL_CONFIG.get(data_type, 300)
    cache.setex(key, ttl, json.dumps(data))
```

**When to use:**
- Read-heavy workloads
- Data staleness is acceptable
- Simple implementation needed

## Event-Driven Invalidation

Invalidate cache when data changes.

```python
# Direct invalidation on write
class UserService:
    def update_user(self, user_id: int, data: dict):
        # Update database
        db.execute("UPDATE users SET ... WHERE id = %s", user_id)
        
        # Invalidate cache
        cache.delete(f"user:{user_id}")
        cache.delete(f"user:{user_id}:profile")
        cache.delete(f"user:{user_id}:settings")
    
    def delete_user(self, user_id: int):
        db.execute("DELETE FROM users WHERE id = %s", user_id)
        
        # Invalidate all user-related keys
        self._invalidate_user_cache(user_id)
    
    def _invalidate_user_cache(self, user_id: int):
        keys = [
            f"user:{user_id}",
            f"user:{user_id}:profile",
            f"user:{user_id}:posts",
            f"user:{user_id}:settings",
        ]
        cache.delete(*keys)
```

### Using Message Queue

```python
# Publisher (on data change)
def on_user_updated(user_id: int):
    message = {
        "event": "user.updated",
        "user_id": user_id,
        "timestamp": time.time(),
    }
    redis.publish("cache_invalidation", json.dumps(message))

# Subscriber (cache service)
def cache_invalidation_listener():
    pubsub = redis.pubsub()
    pubsub.subscribe("cache_invalidation")
    
    for message in pubsub.listen():
        if message["type"] == "message":
            event = json.loads(message["data"])
            handle_invalidation(event)

def handle_invalidation(event: dict):
    if event["event"] == "user.updated":
        user_id = event["user_id"]
        cache.delete(f"user:{user_id}")
        cache.delete(f"user:{user_id}:*")  # Pattern delete
```

## Write-Through Invalidation

Update cache and database together.

```python
class WriteThroughCache:
    def update(self, key: str, value: dict):
        # Update database first
        db.update(key, value)
        
        # Update cache (not delete)
        cache.setex(key, 3600, json.dumps(value))
    
    def delete(self, key: str):
        # Delete from database
        db.delete(key)
        
        # Delete from cache
        cache.delete(key)
```

## Versioned Cache Keys

Include version in cache key to invalidate all at once.

```python
class VersionedCache:
    def __init__(self):
        self.version_key = "cache:version"
    
    def _get_version(self) -> int:
        version = cache.get(self.version_key)
        return int(version) if version else 1
    
    def _make_key(self, key: str) -> str:
        version = self._get_version()
        return f"v{version}:{key}"
    
    def get(self, key: str):
        versioned_key = self._make_key(key)
        return cache.get(versioned_key)
    
    def set(self, key: str, value: str, ttl: int = 3600):
        versioned_key = self._make_key(key)
        cache.setex(versioned_key, ttl, value)
    
    def invalidate_all(self):
        """Increment version to invalidate all keys."""
        cache.incr(self.version_key)

# Usage
vc = VersionedCache()
vc.set("user:123", user_json)
vc.get("user:123")  # Returns data

# Deploy new version - invalidate everything
vc.invalidate_all()
vc.get("user:123")  # Returns None (different version)
```

## Pattern-Based Invalidation

Delete multiple keys matching a pattern.

```python
def invalidate_pattern(pattern: str):
    """Delete all keys matching pattern."""
    cursor = 0
    while True:
        cursor, keys = cache.scan(cursor, match=pattern, count=100)
        if keys:
            cache.delete(*keys)
        if cursor == 0:
            break

# Usage
invalidate_pattern("user:123:*")  # All user 123's cached data
invalidate_pattern("product:*")   # All products
invalidate_pattern("cache:api:*") # All API response caches
```

**Warning:** KEYS command blocks Redis. Use SCAN for production.

## Tag-Based Invalidation

Group cache entries by tags for bulk invalidation.

```python
class TaggedCache:
    def set(self, key: str, value: str, tags: list[str], ttl: int = 3600):
        # Store the value
        cache.setex(key, ttl, value)
        
        # Add key to each tag's set
        for tag in tags:
            cache.sadd(f"tag:{tag}", key)
            cache.expire(f"tag:{tag}", ttl * 2)  # Tag lives longer
    
    def get(self, key: str):
        return cache.get(key)
    
    def invalidate_tag(self, tag: str):
        """Delete all keys with this tag."""
        tag_key = f"tag:{tag}"
        keys = cache.smembers(tag_key)
        
        if keys:
            cache.delete(*keys)
        cache.delete(tag_key)

# Usage
tc = TaggedCache()

# Cache product with tags
tc.set(
    "product:123",
    product_json,
    tags=["products", "category:electronics", "featured"]
)

# Invalidate all electronics
tc.invalidate_tag("category:electronics")

# Invalidate all featured items
tc.invalidate_tag("featured")
```

## Cascading Invalidation

When one entity changes, related caches must update.

```python
class CascadingInvalidator:
    # Define dependencies
    DEPENDENCIES = {
        "user": ["user:*:profile", "user:*:posts", "feed:*"],
        "post": ["post:*", "user:*:posts", "feed:*", "tag:*:posts"],
        "comment": ["post:*:comments", "user:*:comments"],
    }
    
    def invalidate(self, entity_type: str, entity_id: str):
        patterns = self.DEPENDENCIES.get(entity_type, [])
        
        for pattern in patterns:
            # Replace * with entity_id where applicable
            resolved = pattern.replace("*", entity_id, 1)
            
            if "*" in resolved:
                # Pattern still has wildcard - scan and delete
                invalidate_pattern(resolved)
            else:
                # Specific key
                cache.delete(resolved)

# Usage
invalidator = CascadingInvalidator()

# User updated - invalidate all related caches
invalidator.invalidate("user", "123")
```

## Cache Invalidation Checklist

### Before Implementing
- [ ] Map all cache keys for each entity
- [ ] Identify write operations that affect cache
- [ ] Define acceptable staleness per data type
- [ ] Plan for cache failures

### Implementation
- [ ] Invalidate on all write paths (create, update, delete)
- [ ] Handle related/dependent caches
- [ ] Use transactions where needed
- [ ] Log invalidation events

### Monitoring
- [ ] Track cache hit/miss ratio
- [ ] Monitor invalidation frequency
- [ ] Alert on high miss rates
- [ ] Track stale data incidents

## Common Pitfalls

### Race Condition

```python
# ❌ Problem: Read-modify-write race
def update_counter_bad():
    value = cache.get("counter")
    cache.set("counter", int(value) + 1)

# ✅ Solution: Atomic operation
def update_counter_good():
    cache.incr("counter")
```

### Forgetting Related Keys

```python
# ❌ Problem: Only invalidate main key
def update_user_bad(user_id, data):
    db.update_user(user_id, data)
    cache.delete(f"user:{user_id}")
    # Forgot: user's posts, profile, etc.

# ✅ Solution: Invalidate all related
def update_user_good(user_id, data):
    db.update_user(user_id, data)
    invalidate_user_cache(user_id)  # Helper that handles all keys
```

### Database Updated, Cache Failed

```python
# ❌ Problem: DB updated but cache not invalidated
def update_bad(key, value):
    db.update(key, value)
    cache.delete(key)  # What if this fails?

# ✅ Solution: Handle failures
def update_good(key, value):
    db.update(key, value)
    try:
        cache.delete(key)
    except RedisError:
        # Queue for retry or set short TTL
        logger.error(f"Cache invalidation failed: {key}")
        queue_retry_invalidation(key)
```
