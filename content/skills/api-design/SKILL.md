---
name: api-design
description: API design patterns for full-stack development. Use when designing REST APIs, GraphQL schemas, or API documentation. Triggers include "API design", "REST", "endpoint", "GraphQL", "OpenAPI", "Swagger", "API versioning", "pagination", or when building backend services. Covers REST conventions, error handling, authentication, pagination, and documentation.
---

# API Design Skill

Comprehensive API design patterns for building robust backends. This skill covers:
1. **REST Conventions** - Resource naming, HTTP methods, status codes
2. **Error Handling** - Consistent error responses
3. **Authentication** - JWT, API keys, OAuth patterns
4. **Pagination & Filtering** - Handling large datasets

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| Design REST endpoints | See [rest-conventions.md](references/rest-conventions.md) |
| Handle errors | See [error-handling.md](references/error-handling.md) |
| Add authentication | See [authentication.md](references/authentication.md) |
| Paginate/filter data | See [pagination-filtering.md](references/pagination-filtering.md) |

## REST Quick Reference

### Resource Naming

```
# Collections (plural nouns)
GET    /users          # List users
POST   /users          # Create user
GET    /users/:id      # Get user
PUT    /users/:id      # Replace user
PATCH  /users/:id      # Update user
DELETE /users/:id      # Delete user

# Nested resources
GET    /users/:id/posts      # User's posts
POST   /users/:id/posts      # Create post for user

# Actions (when CRUD doesn't fit)
POST   /users/:id/activate   # Custom action
POST   /orders/:id/cancel    # Custom action
```

### HTTP Methods

| Method | Purpose | Idempotent | Request Body |
|--------|---------|------------|--------------|
| GET | Read | Yes | No |
| POST | Create | No | Yes |
| PUT | Replace | Yes | Yes |
| PATCH | Partial update | Yes | Yes |
| DELETE | Remove | Yes | No |

### Status Codes

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable | Semantic error |
| 429 | Too Many Requests | Rate limited |
| 500 | Server Error | Unexpected error |

## Response Formats

### Success Response

```json
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Collection Response

```json
{
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## API Versioning

```
# URL versioning (most common)
/api/v1/users
/api/v2/users

# Header versioning
Accept: application/vnd.api+json;version=1
```

## Output Format

When designing APIs:

```markdown
## API Design: [Feature]

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /resource | List resources |

### Request/Response Examples
[JSON examples]

### Error Codes
[Specific errors for this API]
```
