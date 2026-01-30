# Caching Strategies

Guide to choosing and implementing caching strategies.

## Strategy Overview

| Strategy | Read | Write | Best For |
|----------|------|-------|----------|
| Cache-Aside | App checks cache, then DB | App updates DB, invalidates cache | General purpose |
| Read-Through | Cache fetches from DB | N/A | Read-heavy |
| Write-Through | N/A | Cache writes to DB | Write consistency |
| Write-Behind | N/A | Cache writes async to DB | Write-heavy |
| Refresh-Ahead | Cache refreshes before expiry | N/A | Predictable access |

## Cache-Aside (Lazy Loading)

Most common pattern. Application manages cache.

```
Read:
1. Check cache
2. If miss, read from DB
3. Store in cache
4. Return data

Write:
1. Write to DB
2. Invalidate cache
```

```python
class CacheAsideRepository:
    def __init__(self, cache, db):
        self.cache = cache
        self.db = db
        self.ttl = 3600
    
    def get(self, key: str):
        # 1. Check cache
        data = self.cache.get(key)
        if data:
            return json.loads(data)
        
        # 2. Cache miss - fetch from DB
        data = self.db.get(key)
        if data is None:
            return None
        
        # 3. Store in cache
        self.cache.setex(key, self.ttl, json.dumps(data))
        
        return data
    
    def set(self, key: str, value: dict):
        # 1. Write to DB
        self.db.set(key, value)
        
        # 2. Invalidate cache
        self.cache.delete(key)
```

**Pros:**
- Simple to implement
- Only caches requested data
- Cache failures don't block operations

**Cons:**
- Cache miss = slow response
- Stale data possible
- "Thundering herd" on cold cache

## Read-Through

Cache sits in front of database. Cache handles fetches.

```
Read:
1. Request data from cache
2. Cache fetches from DB if miss
3. Cache stores and returns data
```

```python
class ReadThroughCache:
    def __init__(self, cache, db_fetcher):
        self.cache = cache
        self.db_fetcher = db_fetcher
        self.ttl = 3600
    
    def get(self, key: str):
        data = self.cache.get(key)
        if data:
            return json.loads(data)
        
        # Cache handles DB fetch
        data = self.db_fetcher(key)
        if data:
            self.cache.setex(key, self.ttl, json.dumps(data))
        
        return data
```

**Pros:**
- Simplifies application code
- Consistent caching logic

**Cons:**
- Cache library must support it
- More complex cache setup

## Write-Through

Writes go through cache to database synchronously.

```
Write:
1. Write to cache
2. Cache writes to DB (sync)
3. Return success
```

```python
class WriteThroughCache:
    def __init__(self, cache, db):
        self.cache = cache
        self.db = db
        self.ttl = 3600
    
    def set(self, key: str, value: dict):
        # Write to DB first
        self.db.set(key, value)
        
        # Then update cache
        self.cache.setex(key, self.ttl, json.dumps(value))
    
    def get(self, key: str):
        data = self.cache.get(key)
        if data:
            return json.loads(data)
        
        # Fallback to DB
        data = self.db.get(key)
        if data:
            self.cache.setex(key, self.ttl, json.dumps(data))
        return data
```

**Pros:**
- Cache always consistent with DB
- No stale data

**Cons:**
- Write latency (sync DB write)
- Cache may hold unused data

## Write-Behind (Write-Back)

Writes to cache, async write to database.

```
Write:
1. Write to cache
2. Return success immediately
3. Async: flush to DB later
```

```python
import asyncio
from collections import deque

class WriteBehindCache:
    def __init__(self, cache, db):
        self.cache = cache
        self.db = db
        self.write_queue = deque()
        self.flush_interval = 5  # seconds
    
    def set(self, key: str, value: dict):
        # Write to cache immediately
        self.cache.set(key, json.dumps(value))
        
        # Queue for async DB write
        self.write_queue.append((key, value))
    
    async def flush_loop(self):
        while True:
            await asyncio.sleep(self.flush_interval)
            await self.flush()
    
    async def flush(self):
        while self.write_queue:
            key, value = self.write_queue.popleft()
            try:
                self.db.set(key, value)
            except Exception as e:
                # Re-queue on failure
                self.write_queue.appendleft((key, value))
                raise
```

**Pros:**
- Fast writes
- Reduces DB load
- Good for write-heavy workloads

**Cons:**
- Data loss risk if cache fails
- Eventual consistency
- Complex error handling

## Multi-Level Caching

Multiple cache layers for different use cases.

```
L1: In-memory (fastest, smallest)
L2: Redis (fast, shared)
L3: Database (slowest, persistent)
```

```python
class MultiLevelCache:
    def __init__(self):
        self.l1 = {}  # Local memory
        self.l2 = redis.Redis()  # Redis
        self.l1_ttl = 60  # 1 minute
        self.l2_ttl = 3600  # 1 hour
    
    def get(self, key: str):
        # L1: Local memory
        if key in self.l1:
            entry = self.l1[key]
            if entry['expires'] > time.time():
                return entry['data']
            del self.l1[key]
        
        # L2: Redis
        data = self.l2.get(key)
        if data:
            data = json.loads(data)
            # Populate L1
            self.l1[key] = {
                'data': data,
                'expires': time.time() + self.l1_ttl
            }
            return data
        
        # L3: Database
        data = self.db.get(key)
        if data:
            # Populate L1 and L2
            self.l2.setex(key, self.l2_ttl, json.dumps(data))
            self.l1[key] = {
                'data': data,
                'expires': time.time() + self.l1_ttl
            }
        
        return data
```

## What to Cache

### Good Candidates

| Data Type | TTL | Reason |
|-----------|-----|--------|
| User profiles | 1-24h | Read often, changes rarely |
| Product catalog | 1h | High read volume |
| API responses | 5-60min | Expensive external calls |
| Computed results | Varies | Expensive calculations |
| Session data | 24h | Frequent access |
| Configuration | 1h-1d | Rarely changes |
| Feature flags | 5min | Quick updates needed |

### Avoid Caching

- Rapidly changing data (stock prices)
- Highly personalized data (without careful key design)
- Security-sensitive data that must be real-time
- Data that's cheap to compute

## Cache Warming

Pre-populate cache before traffic hits.

```python
async def warm_cache():
    """Warm cache on application startup."""
    # Popular products
    products = await db.query("SELECT * FROM products WHERE popular = true")
    for product in products:
        cache.setex(f"product:{product.id}", 3600, product.json())
    
    # Active users
    users = await db.query("SELECT * FROM users WHERE last_active > NOW() - INTERVAL '1 day'")
    for user in users:
        cache.setex(f"user:{user.id}", 3600, user.json())

# Run on startup
@app.on_event("startup")
async def startup():
    await warm_cache()
```

## Handling Cache Failures

```python
def get_with_fallback(key: str):
    try:
        data = cache.get(key)
        if data:
            return json.loads(data)
    except RedisError:
        # Cache unavailable - fall through to DB
        pass
    
    # Always have DB fallback
    return db.get(key)

def set_with_fallback(key: str, value: dict):
    # Always write to DB
    db.set(key, value)
    
    try:
        cache.setex(key, 3600, json.dumps(value))
    except RedisError:
        # Log but don't fail the request
        logger.warning(f"Cache write failed for {key}")
```

## Thundering Herd Prevention

When cache expires, many requests hit DB simultaneously.

```python
import threading

class ThunderingHerdPrevention:
    def __init__(self, cache, db):
        self.cache = cache
        self.db = db
        self.locks = {}
        self.lock_mutex = threading.Lock()
    
    def get(self, key: str):
        data = self.cache.get(key)
        if data:
            return json.loads(data)
        
        # Get or create lock for this key
        with self.lock_mutex:
            if key not in self.locks:
                self.locks[key] = threading.Lock()
            lock = self.locks[key]
        
        with lock:
            # Double-check cache
            data = self.cache.get(key)
            if data:
                return json.loads(data)
            
            # Only one thread fetches from DB
            data = self.db.get(key)
            if data:
                self.cache.setex(key, 3600, json.dumps(data))
            
            return data
```

Or use cache stampede prevention with probabilistic early refresh:

```python
def get_with_early_refresh(key: str):
    data = cache.get(key)
    ttl = cache.ttl(key)
    
    if data:
        # Probabilistically refresh if TTL < 10% remaining
        if ttl < 360 and random.random() < 0.1:
            # Refresh in background
            asyncio.create_task(refresh_cache(key))
        
        return json.loads(data)
    
    return fetch_and_cache(key)
```
