---
title: "Python Async Patterns"
---
# Python Async Patterns

Guide to asynchronous programming in Python.

## asyncio Basics

### Coroutines and Tasks

```python
import asyncio

# Define coroutine
async def fetch_data(url: str) -> dict:
    await asyncio.sleep(1)  # Simulate I/O
    return {"url": url, "data": "..."}

# Run coroutine
async def main():
    result = await fetch_data("https://api.example.com")
    print(result)

asyncio.run(main())
```

### Running Multiple Coroutines

```python
import asyncio

async def fetch_url(url: str) -> dict:
    await asyncio.sleep(1)
    return {"url": url}

async def main():
    # Sequential (slow)
    result1 = await fetch_url("url1")
    result2 = await fetch_url("url2")
    # Takes ~2 seconds
    
    # Concurrent (fast)
    results = await asyncio.gather(
        fetch_url("url1"),
        fetch_url("url2"),
        fetch_url("url3"),
    )
    # Takes ~1 second
    
    # With exception handling
    results = await asyncio.gather(
        fetch_url("url1"),
        fetch_url("url2"),
        return_exceptions=True,  # Don't fail fast
    )
    
asyncio.run(main())
```

### Tasks

```python
async def main():
    # Create task (starts immediately)
    task = asyncio.create_task(fetch_data("url"))
    
    # Do other work...
    await asyncio.sleep(0.5)
    
    # Wait for task
    result = await task
    
    # Cancel task
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("Task was cancelled")
```

### Timeouts

```python
async def main():
    try:
        # Timeout after 5 seconds
        result = await asyncio.wait_for(
            slow_operation(),
            timeout=5.0,
        )
    except asyncio.TimeoutError:
        print("Operation timed out")
    
    # Using async with
    async with asyncio.timeout(5.0):
        result = await slow_operation()
```

## Common Patterns

### Async Context Manager

```python
class AsyncDatabaseConnection:
    async def __aenter__(self):
        self.conn = await create_connection()
        return self.conn
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.conn.close()

# Usage
async with AsyncDatabaseConnection() as conn:
    result = await conn.execute("SELECT * FROM users")

# Using contextlib
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_db_connection():
    conn = await create_connection()
    try:
        yield conn
    finally:
        await conn.close()
```

### Async Iterator

```python
class AsyncRange:
    def __init__(self, start: int, end: int):
        self.start = start
        self.end = end
    
    def __aiter__(self):
        self.current = self.start
        return self
    
    async def __anext__(self):
        if self.current >= self.end:
            raise StopAsyncIteration
        await asyncio.sleep(0.1)  # Simulate async work
        value = self.current
        self.current += 1
        return value

# Usage
async for num in AsyncRange(0, 5):
    print(num)

# Async generator (simpler)
async def async_range(start: int, end: int):
    for i in range(start, end):
        await asyncio.sleep(0.1)
        yield i

async for num in async_range(0, 5):
    print(num)
```

### Semaphore (Rate Limiting)

```python
import asyncio

async def fetch_with_limit(url: str, semaphore: asyncio.Semaphore):
    async with semaphore:
        # Only N concurrent requests
        return await fetch_url(url)

async def main():
    urls = ["url1", "url2", "url3", ...]
    
    # Limit to 10 concurrent requests
    semaphore = asyncio.Semaphore(10)
    
    tasks = [fetch_with_limit(url, semaphore) for url in urls]
    results = await asyncio.gather(*tasks)
```

### Lock

```python
import asyncio

class Counter:
    def __init__(self):
        self.value = 0
        self._lock = asyncio.Lock()
    
    async def increment(self):
        async with self._lock:
            current = self.value
            await asyncio.sleep(0.01)  # Simulate work
            self.value = current + 1
```

### Queue

```python
import asyncio

async def producer(queue: asyncio.Queue):
    for i in range(10):
        await queue.put(i)
        await asyncio.sleep(0.1)
    await queue.put(None)  # Signal done

async def consumer(queue: asyncio.Queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"Processing {item}")
        await asyncio.sleep(0.2)
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=5)
    
    producer_task = asyncio.create_task(producer(queue))
    consumer_task = asyncio.create_task(consumer(queue))
    
    await asyncio.gather(producer_task, consumer_task)
```

## Database Async Patterns

### SQLAlchemy Async

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Create async engine
engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/db",
    echo=True,
)

# Async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# Usage
async def get_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()

async def create_user(db: AsyncSession, user_data: dict):
    user = User(**user_data)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
```

### Connection Pooling

```python
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/db",
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=3600,
)
```

## HTTP Client Patterns

### httpx

```python
import httpx

# Single request
async def fetch_data(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()

# Reuse client (recommended)
class APIClient:
    def __init__(self, base_url: str):
        self.client = httpx.AsyncClient(
            base_url=base_url,
            timeout=30.0,
            headers={"User-Agent": "MyApp/1.0"},
        )
    
    async def get(self, path: str) -> dict:
        response = await self.client.get(path)
        response.raise_for_status()
        return response.json()
    
    async def close(self):
        await self.client.aclose()

# Multiple concurrent requests
async def fetch_all(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient() as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        results = []
        for response in responses:
            if isinstance(response, Exception):
                results.append({"error": str(response)})
            else:
                results.append(response.json())
        return results
```

### aiohttp

```python
import aiohttp

async def fetch_data(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# Reuse session
class APIClient:
    def __init__(self):
        self.session = None
    
    async def start(self):
        self.session = aiohttp.ClientSession()
    
    async def close(self):
        if self.session:
            await self.session.close()
    
    async def get(self, url: str) -> dict:
        async with self.session.get(url) as response:
            return await response.json()
```

## Error Handling

### Exception Groups

```python
async def main():
    try:
        async with asyncio.TaskGroup() as tg:
            tg.create_task(task1())
            tg.create_task(task2())
            tg.create_task(task3())
    except* ValueError as eg:
        for exc in eg.exceptions:
            print(f"ValueError: {exc}")
    except* TypeError as eg:
        for exc in eg.exceptions:
            print(f"TypeError: {exc}")
```

### Graceful Shutdown

```python
import signal
import asyncio

async def main():
    # Handle shutdown signals
    loop = asyncio.get_running_loop()
    stop_event = asyncio.Event()
    
    def shutdown():
        stop_event.set()
    
    loop.add_signal_handler(signal.SIGINT, shutdown)
    loop.add_signal_handler(signal.SIGTERM, shutdown)
    
    # Start background tasks
    task = asyncio.create_task(background_worker())
    
    # Wait for shutdown signal
    await stop_event.wait()
    
    # Cleanup
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    
    print("Shutdown complete")
```

## Performance Tips

### Avoid Blocking Calls

```python
import asyncio
from functools import partial

# ❌ Bad: Blocks event loop
def blocking_io():
    time.sleep(1)
    return "result"

async def bad_example():
    result = blocking_io()  # Blocks!

# ✅ Good: Run in executor
async def good_example():
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, blocking_io)
    return result

# ✅ Better: Use async library
async def better_example():
    await asyncio.sleep(1)
    return "result"
```

### Batch Database Operations

```python
# ❌ Slow: N+1 queries
async def get_users_with_posts():
    users = await db.execute(select(User))
    for user in users.scalars():
        posts = await db.execute(
            select(Post).where(Post.author_id == user.id)
        )  # N queries!

# ✅ Fast: Eager loading
async def get_users_with_posts():
    result = await db.execute(
        select(User).options(selectinload(User.posts))
    )
    return result.scalars().all()  # 2 queries total
```

### Connection Reuse

```python
# ❌ Bad: New connection per request
async def fetch(url):
    async with httpx.AsyncClient() as client:
        return await client.get(url)

# ✅ Good: Reuse connection
client = httpx.AsyncClient()

async def fetch(url):
    return await client.get(url)

# Cleanup on shutdown
async def shutdown():
    await client.aclose()
```
