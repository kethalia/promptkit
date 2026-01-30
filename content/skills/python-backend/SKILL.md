---
name: python-backend
description: Python backend development patterns for FastAPI and Django. Use when building APIs, working with async code, or implementing backend features. Triggers include "FastAPI", "Django", "Python API", "async Python", "Pydantic", "SQLAlchemy", or when developing Python backends. Covers FastAPI patterns, Django patterns, testing, and async best practices.
---

# Python Backend Skill

Comprehensive Python backend development patterns. This skill covers:
1. **FastAPI** - Modern async API framework
2. **Django** - Full-featured web framework
3. **Testing** - pytest patterns and best practices
4. **Async** - asyncio patterns and performance

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| FastAPI development | See [fastapi-patterns.md](references/fastapi-patterns.md) |
| Django development | See [django-patterns.md](references/django-patterns.md) |
| Testing Python code | See [testing-patterns.md](references/testing-patterns.md) |
| Async programming | See [async-patterns.md](references/async-patterns.md) |

## FastAPI Quick Reference

### Basic App

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}

@app.post("/items", status_code=201)
async def create_item(item: Item):
    return item
```

### Dependency Injection

```python
from fastapi import Depends

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
async def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()
```

## Django Quick Reference

### Model

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
```

### View

```python
from django.http import JsonResponse
from django.views import View

class PostListView(View):
    def get(self, request):
        posts = Post.objects.all()
        return JsonResponse({'posts': list(posts.values())})
```

## Common Patterns

### Error Handling

```python
# FastAPI
@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"error": str(exc)}
    )

# Django
from django.http import JsonResponse

def custom_exception_handler(exc, context):
    return JsonResponse({"error": str(exc)}, status=400)
```

### Validation

```python
from pydantic import BaseModel, EmailStr, validator

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    
    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v
```

## Output Format

When providing Python backend solutions:

```markdown
## Implementation: [Feature]

### Models/Schemas
```python
[Pydantic/Django models]
```

### Routes/Views
```python
[Endpoint implementations]
```

### Tests
```python
[Test cases]
```
```
