---
name: caching
description: Caching strategies and Redis patterns for web applications. Use when implementing caching layers, session storage, or real-time features. Triggers include "cache", "Redis", "caching strategy", "cache invalidation", "session storage", "rate limiting", or when optimizing application performance. Covers Redis patterns, caching strategies, and cache invalidation.
---

# Caching Skill

Comprehensive caching patterns for web applications. This skill covers:
1. **Redis** - Data structures, commands, patterns
2. **Caching Strategies** - When and what to cache
3. **Cache Invalidation** - Keeping cache consistent

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| Redis commands & patterns | See [redis-patterns.md](references/redis-patterns.md) |
| Caching strategies | See [caching-strategies.md](references/caching-strategies.md) |
| Cache invalidation | See [cache-invalidation.md](references/cache-invalidation.md) |

## When to Cache

| Cache | Don't Cache |
|-------|-------------|
| Expensive computations | Frequently changing data |
| Database query results | User-specific sensitive data |
| API responses | Small, fast operations |
| Static assets | Data that must be real-time |
| Session data | One-time operations |

## Redis Quick Reference

```bash
# Strings
SET key "value" EX 3600   # Set with 1hr expiry
GET key
INCR counter

# Hashes
HSET user:1 name "John" email "john@example.com"
HGETALL user:1

# Lists (queues)
LPUSH queue "task"
RPOP queue

# Sets
SADD tags "js" "python"
SMEMBERS tags

# Sorted Sets (leaderboards)
ZADD scores 100 "player1"
ZRANGE scores 0 9 REV WITHSCORES
```

## Cache Key Naming

```
prefix:entity:id:field

user:123              # User object
user:123:profile      # User's profile
cache:api:users:page:1  # API response
session:abc123        # Session data
rate:ip:192.168.1.1   # Rate limit
```

## TTL Guidelines

| Data Type | TTL | Reason |
|-----------|-----|--------|
| Session | 24h | Security |
| User profile | 1h | Infrequent changes |
| API response | 5-60min | Balance freshness |
| Rate limit | 1min-1h | Window size |
| Config | 1d+ | Rarely changes |

## Common Patterns

```python
# Cache-aside
def get_user(user_id: int):
    cached = redis.get(f"user:{user_id}")
    if cached:
        return json.loads(cached)
    
    user = db.get_user(user_id)
    redis.setex(f"user:{user_id}", 3600, json.dumps(user))
    return user

# Rate limiting
def is_rate_limited(user_id: str, limit: int = 100):
    key = f"rate:{user_id}"
    current = redis.incr(key)
    if current == 1:
        redis.expire(key, 60)
    return current > limit
```

## Output Format

When implementing caching:

```markdown
## Caching: [Feature]

### Cache Keys
- `key:pattern` - Description

### Strategy
[Cache-aside/Write-through/etc.]

### TTL
[Expiration with rationale]

### Invalidation
[When and how to invalidate]
```
