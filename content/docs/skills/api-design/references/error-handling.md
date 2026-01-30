---
title: "API Error Handling"
---
# API Error Handling

Guide to consistent, helpful error responses.

## Error Response Format

### Standard Structure

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request contains invalid data",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address"
      },
      {
        "field": "age",
        "code": "OUT_OF_RANGE",
        "message": "Must be between 18 and 120"
      }
    ],
    "request_id": "req_abc123"
  }
}
```

### Minimal Structure

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

### With Help Links

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "documentation_url": "https://api.example.com/docs/rate-limits",
    "retry_after": 60
  }
}
```

## HTTP Status Codes

### 4xx Client Errors

| Code | Name | When to Use |
|------|------|-------------|
| 400 | Bad Request | Malformed syntax, invalid JSON |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 405 | Method Not Allowed | Wrong HTTP method |
| 409 | Conflict | Resource already exists, version conflict |
| 410 | Gone | Resource permanently deleted |
| 422 | Unprocessable Entity | Validation failed (semantic error) |
| 429 | Too Many Requests | Rate limit exceeded |

### 5xx Server Errors

| Code | Name | When to Use |
|------|------|-------------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Upstream service error |
| 503 | Service Unavailable | Maintenance, overload |
| 504 | Gateway Timeout | Upstream timeout |

### 400 vs 422

```
400 Bad Request:
- Malformed JSON
- Missing required header
- Invalid content type

422 Unprocessable Entity:
- Valid JSON but invalid data
- Business rule violations
- Validation errors
```

## Error Codes

### Define Application-Specific Codes

```javascript
// Error codes enum
const ErrorCodes = {
  // Authentication
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  
  // Authorization
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_FORMAT: 'INVALID_FORMAT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Rate limiting
  RATE_LIMITED: 'RATE_LIMITED',
  
  // Server
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
};
```

## Error Examples

### Validation Error (422)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address",
        "value": "not-an-email"
      },
      {
        "field": "password",
        "code": "TOO_SHORT",
        "message": "Must be at least 8 characters",
        "min_length": 8
      }
    ]
  }
}
```

### Authentication Error (401)

```json
{
  "error": {
    "code": "AUTH_TOKEN_EXPIRED",
    "message": "Your session has expired. Please log in again."
  }
}
```

### Authorization Error (403)

```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to delete this resource",
    "required_permission": "admin:delete"
  }
}
```

### Not Found (404)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found",
    "resource_type": "user",
    "resource_id": "123"
  }
}
```

### Conflict (409)

```json
{
  "error": {
    "code": "ALREADY_EXISTS",
    "message": "A user with this email already exists",
    "conflicting_field": "email"
  }
}
```

### Rate Limited (429)

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60,
    "limit": 100,
    "remaining": 0,
    "reset_at": "2024-01-15T10:30:00Z"
  }
}
```

### Internal Error (500)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "request_id": "req_abc123"
  }
}
```

## Implementation

### Express.js

```javascript
// Error class
class AppError extends Error {
  constructor(code, message, status = 400, details = null) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Specific errors
class ValidationError extends AppError {
  constructor(details) {
    super('VALIDATION_ERROR', 'Invalid input data', 422, details);
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super('NOT_FOUND', `${resource} not found`, 404);
    this.resource = resource;
    this.resourceId = id;
  }
}

// Error handler middleware
function errorHandler(err, req, res, next) {
  // Log error
  console.error(err);

  // Known errors
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
        request_id: req.id,
      },
    });
  }

  // Unknown errors - don't leak details
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      request_id: req.id,
    },
  });
}

// Usage in routes
app.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User', req.params.id);
    }
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
});
```

### FastAPI (Python)

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

class ErrorDetail(BaseModel):
    field: str | None = None
    code: str
    message: str

class ErrorResponse(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] | None = None
    request_id: str | None = None

class AppException(Exception):
    def __init__(self, code: str, message: str, status: int = 400, details: list = None):
        self.code = code
        self.message = message
        self.status = status
        self.details = details

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request.state.request_id,
            }
        },
    )

# Usage
@app.get("/users/{user_id}")
async def get_user(user_id: str):
    user = await User.get(user_id)
    if not user:
        raise AppException("NOT_FOUND", "User not found", 404)
    return {"data": user}
```

## Best Practices

### Do

- ✅ Use consistent error format across all endpoints
- ✅ Include error codes for programmatic handling
- ✅ Provide human-readable messages
- ✅ Include field-level validation details
- ✅ Add request IDs for debugging
- ✅ Log all errors server-side
- ✅ Document all error codes

### Don't

- ❌ Expose stack traces in production
- ❌ Leak sensitive information (passwords, keys)
- ❌ Use generic messages for all errors
- ❌ Return 200 for errors
- ❌ Use inconsistent error formats
- ❌ Ignore errors silently

## Error Documentation

Document errors in your API docs:

```markdown
## Errors

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 422 | Request validation failed |
| NOT_FOUND | 404 | Resource not found |
| AUTH_REQUIRED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| RATE_LIMITED | 429 | Too many requests |

### Endpoint-Specific Errors

#### POST /users

| Code | Description |
|------|-------------|
| EMAIL_TAKEN | Email already registered |
| INVALID_PASSWORD | Password doesn't meet requirements |
```
