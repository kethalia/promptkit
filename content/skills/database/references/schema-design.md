# Schema Design

Guide to designing database schemas for applications.

## Design Process

```
1. Identify Entities     → What are the "things"?
2. Define Attributes     → What properties do they have?
3. Establish Relations   → How are they connected?
4. Normalize             → Remove redundancy
5. Add Constraints       → Enforce data integrity
6. Plan Indexes          → Optimize for queries
```

## Naming Conventions

### Tables
```sql
-- Plural, snake_case
users
blog_posts
order_items
user_roles

-- Join tables: alphabetical or logical
post_tags        -- posts <-> tags
user_permissions -- users <-> permissions
```

### Columns
```sql
-- snake_case, descriptive
id                -- Primary key
user_id           -- Foreign key
email             -- Simple attribute
is_active         -- Boolean (is_, has_, can_)
created_at        -- Timestamp
deleted_at        -- Soft delete
```

## Data Types

### PostgreSQL

| Use Case | Type | Notes |
|----------|------|-------|
| Primary key | `SERIAL` / `BIGSERIAL` | Auto-increment |
| UUID key | `UUID` | Use `gen_random_uuid()` |
| Short text | `VARCHAR(n)` | Variable length |
| Long text | `TEXT` | Unlimited |
| Integer | `INTEGER` / `BIGINT` | 4 / 8 bytes |
| Decimal | `DECIMAL(p,s)` | Exact precision |
| Money | `DECIMAL(10,2)` | NOT `MONEY` type |
| Boolean | `BOOLEAN` | true/false |
| Timestamp | `TIMESTAMP` | Without timezone |
| Timestamp TZ | `TIMESTAMPTZ` | With timezone (preferred) |
| JSON | `JSONB` | Binary JSON (indexed) |
| Array | `TEXT[]` | Array of any type |
| Enum | `CREATE TYPE` | Custom enum |

### MySQL

| Use Case | Type | Notes |
|----------|------|-------|
| Primary key | `INT AUTO_INCREMENT` | |
| UUID | `CHAR(36)` or `BINARY(16)` | |
| Short text | `VARCHAR(n)` | Max 65,535 |
| Long text | `TEXT` / `MEDIUMTEXT` | |
| Integer | `INT` / `BIGINT` | |
| Decimal | `DECIMAL(p,s)` | |
| Boolean | `TINYINT(1)` | 0/1 |
| Timestamp | `DATETIME` / `TIMESTAMP` | |
| JSON | `JSON` | Native JSON |

## Relationships

### One-to-One

```sql
-- User has one Profile (profile extends user)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url VARCHAR(500)
);
```

### One-to-Many

```sql
-- User has many Posts
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index the foreign key
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### Many-to-Many

```sql
-- Posts have many Tags, Tags have many Posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Join table
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);
```

### Self-Referential

```sql
-- Categories with subcategories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- Comments with replies
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL
);
```

## Constraints

### Primary Keys

```sql
-- Single column
id SERIAL PRIMARY KEY

-- Composite
PRIMARY KEY (user_id, role_id)
```

### Foreign Keys

```sql
-- Basic
user_id INTEGER REFERENCES users(id)

-- With actions
user_id INTEGER REFERENCES users(id) 
  ON DELETE CASCADE    -- Delete children when parent deleted
  ON UPDATE CASCADE    -- Update children when parent key changes

-- Options: CASCADE, SET NULL, SET DEFAULT, RESTRICT, NO ACTION
```

### Unique

```sql
-- Single column
email VARCHAR(255) UNIQUE

-- Composite unique
UNIQUE (user_id, slug)

-- Named constraint
CONSTRAINT unique_user_email UNIQUE (user_id, email)
```

### Check

```sql
-- Single column
price DECIMAL(10,2) CHECK (price >= 0)

-- Complex
CHECK (end_date > start_date)
CHECK (status IN ('draft', 'published', 'archived'))
```

### Not Null

```sql
name VARCHAR(255) NOT NULL
```

## Common Patterns

### Timestamps

```sql
-- Always include these
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()

-- Trigger to auto-update updated_at (PostgreSQL)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Soft Delete

```sql
-- Add deleted_at column
deleted_at TIMESTAMPTZ NULL

-- Query active records
SELECT * FROM users WHERE deleted_at IS NULL;

-- "Delete" a record
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- Create view for convenience
CREATE VIEW active_users AS
SELECT * FROM users WHERE deleted_at IS NULL;
```

### Status/State

```sql
-- Using enum
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status order_status DEFAULT 'pending'
);

-- Or using check constraint
status VARCHAR(20) CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled'))
```

### Slugs

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  UNIQUE (slug)  -- Or UNIQUE (user_id, slug) for per-user uniqueness
);
```

### Polymorphic Relations

```sql
-- Comments on multiple entity types
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  commentable_type VARCHAR(50) NOT NULL,  -- 'post', 'video', 'image'
  commentable_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  
  -- Index for lookups
  CONSTRAINT idx_commentable UNIQUE (commentable_type, commentable_id, id)
);

CREATE INDEX idx_comments_target ON comments(commentable_type, commentable_id);
```

## Normalization Quick Guide

### 1NF (First Normal Form)
- No repeating groups
- Each cell contains single value

```sql
-- ❌ Bad
CREATE TABLE orders (tags VARCHAR(255)); -- "red,blue,green"

-- ✅ Good
CREATE TABLE order_tags (order_id INT, tag VARCHAR(50));
```

### 2NF (Second Normal Form)
- 1NF + no partial dependencies on composite key

### 3NF (Third Normal Form)
- 2NF + no transitive dependencies

```sql
-- ❌ Bad: city depends on zip, not directly on id
CREATE TABLE users (id, name, zip, city);

-- ✅ Good: separate table
CREATE TABLE users (id, name, zip);
CREATE TABLE zip_codes (zip PRIMARY KEY, city);
```

### When to Denormalize

- Read-heavy workloads
- Expensive joins affecting performance
- Caching/materialized views as alternative

## Schema Template

```sql
-- Example: Blog Application

-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

-- Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL
);

-- Post Tags (many-to-many)
CREATE TABLE post_tags (
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
```
