# Generate API Docs

Document REST/HTTP API endpoints from codebase analysis.

---

## Context

Gather before starting:
- API route definitions (Express, FastAPI, Gin, Axum, etc.)
- Request/response type definitions or schemas
- Middleware configuration (auth, validation)
- Existing API documentation or OpenAPI specs
- Test files with API call examples
- Error handling patterns

## Instructions

1. **Locate API route definitions**
   - Search for route decorators/handlers by framework:
     - Express: `app.get()`, `router.post()`, etc.
     - FastAPI: `@app.get()`, `@router.post()`
     - Gin: `r.GET()`, `r.POST()`
     - NestJS: `@Get()`, `@Post()` decorators
   - Map file structure to API organization
   - Note route prefixes and versioning

2. **Extract endpoint details for each route**
   - HTTP method (GET, POST, PUT, DELETE, PATCH)
   - Full path including parameters
   - Path parameters and their types
   - Query parameters and defaults
   - Request body schema
   - Response schema and status codes

3. **Document authentication/authorization**
   - Auth middleware applied to routes
   - Required headers (Authorization, API keys)
   - Permission or role requirements
   - Rate limiting if applicable

4. **Identify request/response schemas**
   - Find TypeScript interfaces, Pydantic models, Go structs
   - Document required vs optional fields
   - Note validation rules and constraints
   - Include nested object structures

5. **Document error responses**
   - Standard error format
   - Common error codes and meanings
   - Validation error structure
   - Authentication/authorization errors

6. **Generate examples**
   - Pull from test files when available
   - Create curl examples for each endpoint
   - Show request body examples
   - Show success and error response examples

7. **Organize documentation**
   - Group by resource or domain
   - Order by CRUD operations
   - Include overview and authentication section

## Output Format

### Markdown Format

```markdown
# API Reference

Base URL: `https://api.example.com/v1`

## Authentication

All endpoints require Bearer token authentication:
```bash
Authorization: Bearer <token>
```

---

## Resources

### Users

#### List Users

```
GET /users
```

**Query Parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Items per page (default: 20) |

**Response**

```json
{
  "data": [
    {
      "id": "usr_123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

**Example**

```bash
curl -X GET "https://api.example.com/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer <token>"
```

---

#### Create User

```
POST /users
```

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| name | string | Yes | Display name |
| role | string | No | User role (default: "user") |

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin"
}
```

**Response** `201 Created`

```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errors**

| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request body |
| 409 | EMAIL_EXISTS | Email already registered |

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```
```

### OpenAPI/Swagger Format

```yaml
openapi: 3.0.3
info:
  title: API Name
  version: 1.0.0
  description: API description

servers:
  - url: https://api.example.com/v1

paths:
  /users:
    get:
      summary: List users
      tags: [Users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserList'
    post:
      summary: Create user
      tags: [Users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUser'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
        name:
          type: string
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
```

## Interactive Decisions

Ask the user about:
- **Output format**: Markdown tables, OpenAPI YAML, or both?
- **Scope**: All endpoints or specific resources/tags?
- **Example source**: Generate synthetic examples or extract from tests?
- **Auth documentation**: Include detailed auth flow or just requirements?
- **Versioning**: Document multiple API versions?
- **Internal endpoints**: Include internal/admin endpoints or public only?
