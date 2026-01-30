# Pagination & Filtering

Guide to handling large datasets in APIs.

## Pagination Strategies

| Strategy | Best For | Pros | Cons |
|----------|----------|------|------|
| Offset | Simple lists, random access | Easy to implement, page jumping | Slow on large datasets, inconsistent with changes |
| Cursor | Feeds, real-time data | Fast, consistent | No page jumping, complex |
| Keyset | Large datasets, sorted data | Very fast | Requires unique sort key |

## Offset Pagination

### Request

```
GET /users?page=2&per_page=20
GET /users?offset=20&limit=20
```

### Response

```json
{
  "data": [
    { "id": "21", "name": "User 21" },
    { "id": "22", "name": "User 22" }
  ],
  "meta": {
    "current_page": 2,
    "per_page": 20,
    "total_pages": 5,
    "total_count": 100
  },
  "links": {
    "first": "/users?page=1&per_page=20",
    "prev": "/users?page=1&per_page=20",
    "next": "/users?page=3&per_page=20",
    "last": "/users?page=5&per_page=20"
  }
}
```

### Implementation

```javascript
// Express.js
app.get('/users', async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(req.query.per_page) || 20));
  const offset = (page - 1) * perPage;

  const [users, totalCount] = await Promise.all([
    User.find().skip(offset).limit(perPage),
    User.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalCount / perPage);

  res.json({
    data: users,
    meta: {
      current_page: page,
      per_page: perPage,
      total_pages: totalPages,
      total_count: totalCount,
    },
  });
});
```

```python
# FastAPI
@app.get("/users")
async def list_users(page: int = 1, per_page: int = 20):
    page = max(1, page)
    per_page = min(100, max(1, per_page))
    offset = (page - 1) * per_page

    users = await User.find().skip(offset).limit(per_page).to_list()
    total_count = await User.count()
    total_pages = (total_count + per_page - 1) // per_page

    return {
        "data": users,
        "meta": {
            "current_page": page,
            "per_page": per_page,
            "total_pages": total_pages,
            "total_count": total_count,
        },
    }
```

## Cursor Pagination

### Request

```
# First page
GET /posts?limit=20

# Next page (using cursor from previous response)
GET /posts?limit=20&after=eyJpZCI6MTAwfQ
```

### Response

```json
{
  "data": [
    { "id": "101", "title": "Post 101" },
    { "id": "102", "title": "Post 102" }
  ],
  "meta": {
    "has_more": true,
    "count": 20
  },
  "cursors": {
    "after": "eyJpZCI6MTIwfQ",
    "before": "eyJpZCI6MTAxfQ"
  }
}
```

### Implementation

```javascript
// Cursor is typically base64-encoded JSON
function encodeCursor(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function decodeCursor(cursor) {
  return JSON.parse(Buffer.from(cursor, 'base64').toString('utf8'));
}

app.get('/posts', async (req, res) => {
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const after = req.query.after ? decodeCursor(req.query.after) : null;

  let query = Post.find().sort({ id: 1 }).limit(limit + 1);
  
  if (after) {
    query = query.where('id').gt(after.id);
  }

  const posts = await query.exec();
  const hasMore = posts.length > limit;
  
  if (hasMore) {
    posts.pop(); // Remove extra item
  }

  res.json({
    data: posts,
    meta: { has_more: hasMore, count: posts.length },
    cursors: posts.length > 0 ? {
      after: encodeCursor({ id: posts[posts.length - 1].id }),
      before: encodeCursor({ id: posts[0].id }),
    } : null,
  });
});
```

## Keyset Pagination

Best for large datasets with consistent ordering.

### Request

```
# First page
GET /logs?limit=100&sort=created_at

# Next page
GET /logs?limit=100&sort=created_at&after_created_at=2024-01-15T10:30:00Z&after_id=12345
```

### SQL Query

```sql
-- First page
SELECT * FROM logs
ORDER BY created_at DESC, id DESC
LIMIT 100;

-- Next pages (using values from last row)
SELECT * FROM logs
WHERE (created_at, id) < ('2024-01-15T10:30:00Z', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 100;
```

## Filtering

### Query Parameter Patterns

```
# Exact match
GET /products?status=active
GET /products?category=electronics

# Multiple values (OR)
GET /products?status=active,pending
GET /products?status[]=active&status[]=pending

# Comparison operators
GET /products?price_min=10&price_max=100
GET /products?price[gte]=10&price[lte]=100
GET /products?price_gt=10&price_lt=100

# Date ranges
GET /orders?created_after=2024-01-01
GET /orders?created_before=2024-12-31
GET /orders?created_at[gte]=2024-01-01&created_at[lte]=2024-12-31

# Text search
GET /products?q=laptop
GET /products?search=laptop
GET /products?name_contains=pro

# Boolean
GET /users?is_active=true
GET /products?in_stock=true

# Null checks
GET /users?deleted_at=null
GET /users?deleted_at[is]=null
```

### Implementation

```javascript
app.get('/products', async (req, res) => {
  const query = {};

  // Exact match
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Multiple values
  if (req.query.category) {
    const categories = req.query.category.split(',');
    query.category = { $in: categories };
  }

  // Price range
  if (req.query.price_min || req.query.price_max) {
    query.price = {};
    if (req.query.price_min) query.price.$gte = parseFloat(req.query.price_min);
    if (req.query.price_max) query.price.$lte = parseFloat(req.query.price_max);
  }

  // Date range
  if (req.query.created_after) {
    query.created_at = query.created_at || {};
    query.created_at.$gte = new Date(req.query.created_after);
  }

  // Text search
  if (req.query.q) {
    query.$text = { $search: req.query.q };
  }

  const products = await Product.find(query);
  res.json({ data: products });
});
```

```python
# FastAPI with query builder
from typing import Optional
from datetime import datetime

@app.get("/products")
async def list_products(
    status: Optional[str] = None,
    category: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    created_after: Optional[datetime] = None,
    q: Optional[str] = None,
):
    query = select(Product)

    if status:
        query = query.where(Product.status == status)
    if category:
        categories = category.split(",")
        query = query.where(Product.category.in_(categories))
    if price_min:
        query = query.where(Product.price >= price_min)
    if price_max:
        query = query.where(Product.price <= price_max)
    if created_after:
        query = query.where(Product.created_at >= created_after)
    if q:
        query = query.where(Product.name.ilike(f"%{q}%"))

    products = await db.execute(query)
    return {"data": products.scalars().all()}
```

## Sorting

### Request

```
# Single field (ascending)
GET /users?sort=name

# Descending (prefix with -)
GET /users?sort=-created_at

# Multiple fields
GET /users?sort=-created_at,name
GET /users?sort=status,-created_at

# Alternative syntax
GET /users?sort_by=created_at&sort_order=desc
```

### Implementation

```javascript
app.get('/users', async (req, res) => {
  const allowedSortFields = ['name', 'email', 'created_at', 'status'];
  let sortObj = {};

  if (req.query.sort) {
    const sortFields = req.query.sort.split(',');
    
    for (const field of sortFields) {
      const isDesc = field.startsWith('-');
      const fieldName = isDesc ? field.slice(1) : field;
      
      if (allowedSortFields.includes(fieldName)) {
        sortObj[fieldName] = isDesc ? -1 : 1;
      }
    }
  } else {
    sortObj = { created_at: -1 }; // Default sort
  }

  const users = await User.find().sort(sortObj);
  res.json({ data: users });
});
```

## Field Selection

### Request

```
# Select specific fields
GET /users?fields=id,name,email
GET /users/123?fields=id,name

# Include related resources
GET /users/123?include=orders,profile
GET /posts?include=author,comments
```

### Response

```json
// With include=author
{
  "data": {
    "id": "123",
    "title": "My Post",
    "author": {
      "id": "456",
      "name": "John Doe"
    }
  }
}
```

### Implementation

```javascript
app.get('/users', async (req, res) => {
  const allowedFields = ['id', 'name', 'email', 'status', 'created_at'];
  let projection = {};

  if (req.query.fields) {
    const requestedFields = req.query.fields.split(',');
    for (const field of requestedFields) {
      if (allowedFields.includes(field)) {
        projection[field] = 1;
      }
    }
  }

  const users = await User.find({}, projection);
  res.json({ data: users });
});
```

## Combined Example

### Full-Featured List Endpoint

```javascript
app.get('/products', async (req, res) => {
  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(req.query.per_page) || 20));
  const offset = (page - 1) * perPage;

  // Filtering
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = { $in: req.query.category.split(',') };
  if (req.query.price_min) filter.price = { ...filter.price, $gte: parseFloat(req.query.price_min) };
  if (req.query.price_max) filter.price = { ...filter.price, $lte: parseFloat(req.query.price_max) };
  if (req.query.q) filter.$text = { $search: req.query.q };

  // Sorting
  const sortFields = { created_at: -1 }; // Default
  if (req.query.sort) {
    // Parse sort parameter
  }

  // Field selection
  const projection = {};
  if (req.query.fields) {
    req.query.fields.split(',').forEach(f => projection[f] = 1);
  }

  // Execute query
  const [products, totalCount] = await Promise.all([
    Product.find(filter, projection).sort(sortFields).skip(offset).limit(perPage),
    Product.countDocuments(filter),
  ]);

  res.json({
    data: products,
    meta: {
      current_page: page,
      per_page: perPage,
      total_pages: Math.ceil(totalCount / perPage),
      total_count: totalCount,
    },
  });
});
```

## Best Practices

### Limits

```javascript
// Always set max limits
const MAX_PER_PAGE = 100;
const DEFAULT_PER_PAGE = 20;

const perPage = Math.min(MAX_PER_PAGE, Math.max(1, parseInt(req.query.per_page) || DEFAULT_PER_PAGE));
```

### Whitelist Fields

```javascript
// Only allow sorting/filtering on indexed fields
const ALLOWED_SORT_FIELDS = ['created_at', 'name', 'price'];
const ALLOWED_FILTER_FIELDS = ['status', 'category', 'price'];
```

### Document in API Spec

```yaml
# OpenAPI
parameters:
  - name: page
    in: query
    schema:
      type: integer
      minimum: 1
      default: 1
  - name: per_page
    in: query
    schema:
      type: integer
      minimum: 1
      maximum: 100
      default: 20
  - name: sort
    in: query
    schema:
      type: string
      example: "-created_at,name"
  - name: status
    in: query
    schema:
      type: string
      enum: [active, inactive, pending]
```
