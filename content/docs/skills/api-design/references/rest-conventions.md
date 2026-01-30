---
title: "REST Conventions"
---
# REST Conventions

Guide to designing RESTful APIs following best practices.

## Resource Naming

### Use Nouns, Not Verbs

```
# ✅ Good - nouns
GET  /users
GET  /users/123
GET  /users/123/orders

# ❌ Bad - verbs
GET  /getUsers
GET  /getUserById/123
POST /createUser
```

### Use Plural Names

```
# ✅ Good - plural
/users
/products
/orders

# ❌ Bad - singular
/user
/product
/order
```

### Use Kebab-Case for Multi-Word

```
# ✅ Good
/user-profiles
/order-items
/shopping-carts

# ❌ Bad
/userProfiles
/user_profiles
/UserProfiles
```

### Nested Resources

```
# User's orders
GET  /users/123/orders

# Order's items
GET  /orders/456/items

# Limit nesting depth (max 2-3 levels)
# ❌ Too deep
GET  /users/123/orders/456/items/789/reviews

# ✅ Better - flatten when needed
GET  /order-items/789/reviews
```

## HTTP Methods

### GET - Read

```
# List collection
GET /users
GET /users?status=active&sort=-created_at

# Get single resource
GET /users/123

# Never modify state with GET
```

### POST - Create

```
# Create resource
POST /users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

# Response: 201 Created
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  }
}

# Also used for actions that don't fit CRUD
POST /users/123/send-verification-email
POST /orders/456/cancel
```

### PUT - Replace

```
# Replace entire resource
PUT /users/123
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890"
}

# All fields required - missing fields become null/default
# Response: 200 OK
```

### PATCH - Partial Update

```
# Update specific fields only
PATCH /users/123
Content-Type: application/json

{
  "phone": "+1234567890"
}

# Only provided fields are updated
# Response: 200 OK
```

### DELETE - Remove

```
# Delete resource
DELETE /users/123

# Response: 204 No Content (success, no body)
# Or: 200 OK with deleted resource

# Soft delete vs hard delete
# Soft: Mark as deleted, keep data
# Hard: Actually remove from database
```

## Request/Response Design

### Request Headers

```
Content-Type: application/json      # Request body format
Accept: application/json            # Desired response format
Authorization: Bearer <token>       # Authentication
X-Request-ID: uuid                  # Request tracking
```

### Response Headers

```
Content-Type: application/json
X-Request-ID: uuid                  # Echo back for tracking
X-RateLimit-Limit: 100             # Rate limit info
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Envelope Pattern

```json
// With envelope (recommended for consistency)
{
  "data": { ... },
  "meta": { ... },
  "links": { ... }
}

// Without envelope (simpler)
{ "id": "123", "name": "John" }
```

### Timestamps

```json
// Use ISO 8601 format with timezone
{
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T14:45:30Z"
}
```

### IDs

```json
// String IDs (recommended - flexible)
{ "id": "123" }
{ "id": "usr_abc123" }
{ "id": "550e8400-e29b-41d4-a716-446655440000" }

// Numeric IDs (simpler but less flexible)
{ "id": 123 }
```

## URL Design

### Query Parameters

```
# Filtering
GET /users?status=active
GET /users?role=admin&status=active
GET /products?price_min=10&price_max=100
GET /orders?created_after=2024-01-01

# Sorting
GET /users?sort=name           # Ascending
GET /users?sort=-created_at    # Descending (- prefix)
GET /users?sort=status,-name   # Multiple fields

# Pagination
GET /users?page=2&per_page=20
GET /users?offset=20&limit=20
GET /users?cursor=abc123

# Field selection (sparse fieldsets)
GET /users?fields=id,name,email
GET /users/123?fields=id,name

# Including related resources
GET /users/123?include=orders,profile
```

### Search

```
# Simple search
GET /users?q=john

# Search specific fields
GET /users?search[name]=john
GET /users?name_contains=john
```

## Common Patterns

### Bulk Operations

```
# Bulk create
POST /users/bulk
{
  "users": [
    { "name": "User 1", "email": "user1@example.com" },
    { "name": "User 2", "email": "user2@example.com" }
  ]
}

# Bulk update
PATCH /users/bulk
{
  "users": [
    { "id": "1", "status": "active" },
    { "id": "2", "status": "active" }
  ]
}

# Bulk delete
DELETE /users/bulk
{
  "ids": ["1", "2", "3"]
}
```

### Actions/RPC-Style Endpoints

```
# When CRUD doesn't fit, use POST with action verb
POST /users/123/activate
POST /users/123/deactivate
POST /orders/456/cancel
POST /orders/456/refund
POST /emails/send
POST /reports/generate

# Request body for action parameters
POST /orders/456/refund
{
  "amount": 50.00,
  "reason": "Customer request"
}
```

### File Upload

```
# Single file
POST /users/123/avatar
Content-Type: multipart/form-data

# Multiple files
POST /posts/456/attachments
Content-Type: multipart/form-data

# Presigned URL pattern (recommended for large files)
# 1. Get upload URL
POST /uploads
{ "filename": "image.jpg", "content_type": "image/jpeg" }

# Response
{
  "upload_url": "https://s3.amazonaws.com/...",
  "file_id": "file_123"
}

# 2. Upload directly to storage
PUT https://s3.amazonaws.com/...

# 3. Confirm upload
POST /uploads/file_123/complete
```

## API Versioning

### URL Versioning (Recommended)

```
/api/v1/users
/api/v2/users

# Pros: Clear, easy to understand
# Cons: URL changes between versions
```

### Header Versioning

```
GET /api/users
Accept: application/vnd.myapi.v1+json

# Pros: Clean URLs
# Cons: Less discoverable
```

### When to Version

- Breaking changes to response structure
- Removing fields or endpoints
- Changing field types
- Changing error formats

### Non-Breaking Changes (No Version Needed)

- Adding new endpoints
- Adding optional fields
- Adding new query parameters
- Bug fixes

## Endpoint Design Examples

### User Management

```
# Users
GET    /users              # List users
POST   /users              # Create user
GET    /users/:id          # Get user
PATCH  /users/:id          # Update user
DELETE /users/:id          # Delete user

# User relationships
GET    /users/:id/orders   # User's orders
GET    /users/:id/profile  # User's profile
PATCH  /users/:id/profile  # Update profile

# User actions
POST   /users/:id/verify-email
POST   /users/:id/reset-password
POST   /users/:id/change-password
```

### E-commerce

```
# Products
GET    /products
GET    /products/:id
GET    /products/:id/reviews
GET    /categories/:id/products

# Cart
GET    /cart
POST   /cart/items
PATCH  /cart/items/:id
DELETE /cart/items/:id
DELETE /cart              # Clear cart

# Orders
GET    /orders
POST   /orders            # Create from cart
GET    /orders/:id
POST   /orders/:id/cancel
POST   /orders/:id/refund

# Checkout
POST   /checkout/start
POST   /checkout/complete
```
