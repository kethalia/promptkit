---
title: "Redis Patterns"
---
# Redis Patterns

Guide to using Redis effectively in applications.

## Data Structures

### Strings

```bash
# Basic operations
SET name "John"
GET name                    # "John"
SETNX name "Jane"          # Set if not exists
SETEX session 3600 "data"  # Set with expiry

# Atomic counters
INCR visits               # Increment by 1
INCRBY visits 10          # Increment by N
DECR stock                # Decrement by 1
DECRBY stock 5            # Decrement by N

# Multiple keys
MSET key1 "v1" key2 "v2"
MGET key1 key2
```

### Hashes

```bash
# Store objects
HSET user:1 name "John" email "john@example.com" age 30
HGET user:1 name           # "John"
HGETALL user:1             # All fields
HMGET user:1 name email    # Multiple fields

# Update fields
HINCRBY user:1 age 1       # Increment numeric field
HDEL user:1 age            # Delete field
HEXISTS user:1 email       # Check field exists
```

### Lists

```bash
# Queue (FIFO)
RPUSH queue "task1"        # Add to right
LPOP queue                 # Remove from left

# Stack (LIFO)
LPUSH stack "item"         # Add to left
LPOP stack                 # Remove from left

# Range operations
LRANGE list 0 -1           # Get all
LRANGE list 0 9            # First 10
LLEN list                  # Length
LTRIM list 0 99            # Keep only first 100
```

### Sets

```bash
# Unique collections
SADD tags "js" "python" "go"
SMEMBERS tags              # All members
SISMEMBER tags "python"    # Check membership
SCARD tags                 # Count

# Set operations
SUNION set1 set2           # Union
SINTER set1 set2           # Intersection
SDIFF set1 set2            # Difference
```

### Sorted Sets

```bash
# Leaderboard
ZADD leaderboard 100 "player1" 200 "player2"
ZRANGE leaderboard 0 9 REV WITHSCORES  # Top 10
ZRANK leaderboard "player1"             # Rank (0-based)
ZSCORE leaderboard "player1"            # Score
ZINCRBY leaderboard 50 "player1"        # Add to score
```

## Common Patterns

### Cache-Aside (Lazy Loading)

```python
import redis
import json

r = redis.Redis()

def get_user(user_id: int) -> dict:
    cache_key = f"user:{user_id}"
    
    # Try cache
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)
    
    # Cache miss - fetch from database
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    
    # Store in cache
    r.setex(cache_key, 3600, json.dumps(user))
    
    return user

def update_user(user_id: int, data: dict):
    # Update database
    db.execute("UPDATE users SET ... WHERE id = %s", user_id)
    
    # Invalidate cache
    r.delete(f"user:{user_id}")
```

### Write-Through

```python
def update_user(user_id: int, data: dict):
    cache_key = f"user:{user_id}"
    
    # Update database
    db.execute("UPDATE users SET ... WHERE id = %s", user_id)
    
    # Update cache
    user = db.query("SELECT * FROM users WHERE id = %s", user_id)
    r.setex(cache_key, 3600, json.dumps(user))
    
    return user
```

### Rate Limiting

```python
def is_rate_limited(user_id: str, limit: int = 100, window: int = 60) -> bool:
    key = f"rate:{user_id}"
    
    current = r.incr(key)
    if current == 1:
        r.expire(key, window)
    
    return current > limit

# Sliding window (more accurate)
def sliding_window_rate_limit(user_id: str, limit: int, window: int) -> bool:
    key = f"rate:{user_id}"
    now = time.time()
    
    pipe = r.pipeline()
    pipe.zremrangebyscore(key, 0, now - window)  # Remove old entries
    pipe.zadd(key, {str(now): now})              # Add current request
    pipe.zcard(key)                               # Count requests
    pipe.expire(key, window)                      # Set expiry
    results = pipe.execute()
    
    return results[2] > limit
```

### Session Storage

```python
import secrets

def create_session(user_id: int, data: dict) -> str:
    session_id = secrets.token_urlsafe(32)
    key = f"session:{session_id}"
    
    r.hset(key, mapping={
        "user_id": user_id,
        **data,
    })
    r.expire(key, 86400)  # 24 hours
    
    return session_id

def get_session(session_id: str) -> dict | None:
    key = f"session:{session_id}"
    data = r.hgetall(key)
    
    if data:
        r.expire(key, 86400)  # Refresh TTL
        return {k.decode(): v.decode() for k, v in data.items()}
    return None

def delete_session(session_id: str):
    r.delete(f"session:{session_id}")
```

### Distributed Lock

```python
import uuid

def acquire_lock(lock_name: str, timeout: int = 10) -> str | None:
    lock_key = f"lock:{lock_name}"
    lock_id = str(uuid.uuid4())
    
    # SET NX with expiry
    acquired = r.set(lock_key, lock_id, nx=True, ex=timeout)
    
    return lock_id if acquired else None

def release_lock(lock_name: str, lock_id: str) -> bool:
    lock_key = f"lock:{lock_name}"
    
    # Only release if we own the lock
    script = """
    if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
    else
        return 0
    end
    """
    return r.eval(script, 1, lock_key, lock_id) == 1

# Usage
lock_id = acquire_lock("process-orders")
if lock_id:
    try:
        process_orders()
    finally:
        release_lock("process-orders", lock_id)
```

### Pub/Sub

```python
# Publisher
def publish_event(channel: str, message: dict):
    r.publish(channel, json.dumps(message))

# Subscriber
def subscribe_to_events(channel: str):
    pubsub = r.pubsub()
    pubsub.subscribe(channel)
    
    for message in pubsub.listen():
        if message["type"] == "message":
            data = json.loads(message["data"])
            handle_event(data)
```

### Job Queue

```python
def enqueue_job(queue: str, job: dict):
    r.lpush(f"queue:{queue}", json.dumps(job))

def process_jobs(queue: str):
    while True:
        # Blocking pop with timeout
        result = r.brpop(f"queue:{queue}", timeout=5)
        if result:
            _, job_data = result
            job = json.loads(job_data)
            process_job(job)
```

### Leaderboard

```python
def add_score(user_id: str, score: int):
    r.zincrby("leaderboard", score, user_id)

def get_top_players(n: int = 10) -> list:
    return r.zrange("leaderboard", 0, n-1, desc=True, withscores=True)

def get_user_rank(user_id: str) -> int | None:
    rank = r.zrevrank("leaderboard", user_id)
    return rank + 1 if rank is not None else None

def get_user_score(user_id: str) -> int:
    return int(r.zscore("leaderboard", user_id) or 0)
```

## Connection Management

### Python (redis-py)

```python
import redis

# Single connection
r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# Connection pool
pool = redis.ConnectionPool(
    host='localhost',
    port=6379,
    db=0,
    max_connections=10,
    decode_responses=True,
)
r = redis.Redis(connection_pool=pool)

# Async (aioredis)
import redis.asyncio as aioredis

async def get_redis():
    return await aioredis.from_url("redis://localhost")
```

### Node.js (ioredis)

```javascript
import Redis from 'ioredis';

// Single connection
const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

// Cluster
const cluster = new Redis.Cluster([
  { host: 'node1', port: 6379 },
  { host: 'node2', port: 6379 },
]);
```

## Pipelining

```python
# Batch operations for better performance
pipe = r.pipeline()
for i in range(1000):
    pipe.set(f"key:{i}", f"value:{i}")
pipe.execute()

# Transaction (atomic)
pipe = r.pipeline(transaction=True)
pipe.incr("counter")
pipe.expire("counter", 3600)
pipe.execute()
```
