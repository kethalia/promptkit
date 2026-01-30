---
title: "SQL Patterns"
---
# SQL Patterns

Common SQL query patterns for application development.

## Basic CRUD

### Create (INSERT)

```sql
-- Single row
INSERT INTO users (email, name) 
VALUES ('user@example.com', 'John Doe');

-- Multiple rows
INSERT INTO users (email, name) VALUES
  ('user1@example.com', 'User One'),
  ('user2@example.com', 'User Two'),
  ('user3@example.com', 'User Three');

-- Insert and return
INSERT INTO users (email, name) 
VALUES ('user@example.com', 'John Doe')
RETURNING id, created_at;

-- Insert from select
INSERT INTO archived_users (id, email, name)
SELECT id, email, name FROM users WHERE created_at < '2023-01-01';

-- Upsert (PostgreSQL)
INSERT INTO users (email, name) 
VALUES ('user@example.com', 'John Doe')
ON CONFLICT (email) 
DO UPDATE SET name = EXCLUDED.name, updated_at = NOW();

-- Upsert (MySQL)
INSERT INTO users (email, name) 
VALUES ('user@example.com', 'John Doe')
ON DUPLICATE KEY UPDATE name = VALUES(name);
```

### Read (SELECT)

```sql
-- Basic
SELECT * FROM users WHERE id = 1;

-- Specific columns
SELECT id, email, name FROM users;

-- With alias
SELECT 
  u.id,
  u.name AS user_name,
  COUNT(p.id) AS post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id;

-- Conditional
SELECT * FROM users 
WHERE status = 'active' 
  AND created_at > '2024-01-01';
```

### Update

```sql
-- Single row
UPDATE users SET name = 'Jane Doe' WHERE id = 1;

-- Multiple columns
UPDATE users 
SET name = 'Jane Doe', updated_at = NOW() 
WHERE id = 1;

-- Conditional update
UPDATE posts 
SET status = 'archived' 
WHERE status = 'published' 
  AND created_at < NOW() - INTERVAL '1 year';

-- Update and return (PostgreSQL)
UPDATE users SET name = 'Jane' WHERE id = 1
RETURNING *;

-- Update from another table
UPDATE posts p
SET author_name = u.name
FROM users u
WHERE p.user_id = u.id;
```

### Delete

```sql
-- Single row
DELETE FROM users WHERE id = 1;

-- With condition
DELETE FROM sessions WHERE expires_at < NOW();

-- Delete and return (PostgreSQL)
DELETE FROM users WHERE id = 1 RETURNING *;

-- Soft delete (recommended)
UPDATE users SET deleted_at = NOW() WHERE id = 1;
```

## Filtering

### WHERE Clauses

```sql
-- Equality
WHERE status = 'active'

-- Not equal
WHERE status != 'deleted'
WHERE status <> 'deleted'

-- NULL checks
WHERE deleted_at IS NULL
WHERE deleted_at IS NOT NULL

-- IN list
WHERE status IN ('active', 'pending')
WHERE id IN (SELECT user_id FROM admins)

-- NOT IN
WHERE id NOT IN (1, 2, 3)

-- BETWEEN
WHERE created_at BETWEEN '2024-01-01' AND '2024-12-31'
WHERE price BETWEEN 10 AND 100

-- LIKE (pattern matching)
WHERE email LIKE '%@gmail.com'
WHERE name LIKE 'John%'
WHERE code LIKE 'ABC___'  -- _ matches single char

-- ILIKE (case-insensitive, PostgreSQL)
WHERE email ILIKE '%@Gmail.com'

-- Regular expression (PostgreSQL)
WHERE email ~ '^[a-z]+@'

-- Combining conditions
WHERE (status = 'active' OR status = 'pending')
  AND created_at > '2024-01-01'
```

### Full-Text Search (PostgreSQL)

```sql
-- Simple search
SELECT * FROM posts
WHERE to_tsvector('english', title || ' ' || content) 
  @@ to_tsquery('english', 'database & performance');

-- With ranking
SELECT *, ts_rank(search_vector, query) AS rank
FROM posts, to_tsquery('english', 'database') query
WHERE search_vector @@ query
ORDER BY rank DESC;

-- Create search index
CREATE INDEX idx_posts_search ON posts 
USING GIN(to_tsvector('english', title || ' ' || content));
```

## Joins

### INNER JOIN

```sql
-- Only matching rows
SELECT u.name, p.title
FROM users u
INNER JOIN posts p ON u.id = p.user_id;
```

### LEFT JOIN

```sql
-- All left rows, matching right (or NULL)
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id;
```

### Multiple Joins

```sql
SELECT 
  u.name AS author,
  p.title AS post_title,
  c.content AS comment
FROM users u
JOIN posts p ON u.id = p.user_id
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.status = 'published';
```

### Self Join

```sql
-- Employees with their managers
SELECT 
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

## Aggregation

### Basic Aggregates

```sql
SELECT 
  COUNT(*) AS total,
  COUNT(DISTINCT user_id) AS unique_users,
  SUM(amount) AS total_amount,
  AVG(amount) AS avg_amount,
  MIN(amount) AS min_amount,
  MAX(amount) AS max_amount
FROM orders;
```

### GROUP BY

```sql
-- Count posts per user
SELECT 
  user_id,
  COUNT(*) AS post_count
FROM posts
GROUP BY user_id;

-- With user details
SELECT 
  u.name,
  COUNT(p.id) AS post_count,
  MAX(p.created_at) AS last_post
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name;
```

### HAVING (Filter Groups)

```sql
-- Users with more than 5 posts
SELECT user_id, COUNT(*) AS post_count
FROM posts
GROUP BY user_id
HAVING COUNT(*) > 5;
```

### Window Functions

```sql
-- Row number
SELECT 
  *,
  ROW_NUMBER() OVER (ORDER BY created_at) AS row_num
FROM posts;

-- Rank within partition
SELECT 
  user_id,
  title,
  created_at,
  ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS user_post_rank
FROM posts;

-- Running total
SELECT 
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) AS running_total
FROM daily_sales;

-- Moving average
SELECT 
  date,
  amount,
  AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS weekly_avg
FROM daily_sales;
```

## Pagination

### Offset Pagination

```sql
-- Page 3 with 20 items per page
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- With total count
SELECT COUNT(*) OVER() AS total_count, *
FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;
```

### Cursor Pagination (Better for Large Datasets)

```sql
-- First page
SELECT * FROM posts
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- Next page (after last item's created_at and id)
SELECT * FROM posts
WHERE (created_at, id) < ('2024-01-15 10:00:00', 12345)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

## Subqueries

### In SELECT

```sql
SELECT 
  u.*,
  (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS post_count
FROM users u;
```

### In WHERE

```sql
-- Users who have posts
SELECT * FROM users
WHERE id IN (SELECT DISTINCT user_id FROM posts);

-- Users with no posts
SELECT * FROM users
WHERE id NOT IN (SELECT user_id FROM posts);

-- Better with EXISTS
SELECT * FROM users u
WHERE EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);

SELECT * FROM users u
WHERE NOT EXISTS (SELECT 1 FROM posts p WHERE p.user_id = u.id);
```

### In FROM (Derived Table)

```sql
SELECT user_id, avg_score
FROM (
  SELECT user_id, AVG(score) AS avg_score
  FROM reviews
  GROUP BY user_id
) AS user_scores
WHERE avg_score > 4.0;
```

## Common Table Expressions (CTEs)

### Basic CTE

```sql
WITH active_users AS (
  SELECT * FROM users WHERE status = 'active'
)
SELECT au.name, COUNT(p.id)
FROM active_users au
LEFT JOIN posts p ON au.id = p.user_id
GROUP BY au.id;
```

### Multiple CTEs

```sql
WITH 
  active_users AS (
    SELECT * FROM users WHERE status = 'active'
  ),
  recent_posts AS (
    SELECT * FROM posts WHERE created_at > NOW() - INTERVAL '7 days'
  )
SELECT au.name, COUNT(rp.id) AS recent_post_count
FROM active_users au
LEFT JOIN recent_posts rp ON au.id = rp.user_id
GROUP BY au.id;
```

### Recursive CTE

```sql
-- Category tree
WITH RECURSIVE category_tree AS (
  -- Base case: root categories
  SELECT id, name, parent_id, 0 AS depth
  FROM categories
  WHERE parent_id IS NULL
  
  UNION ALL
  
  -- Recursive case: children
  SELECT c.id, c.name, c.parent_id, ct.depth + 1
  FROM categories c
  JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY depth, name;
```

## JSON Operations (PostgreSQL)

```sql
-- Create with JSON
INSERT INTO products (name, metadata)
VALUES ('Widget', '{"color": "red", "size": "large"}');

-- Query JSON field
SELECT * FROM products
WHERE metadata->>'color' = 'red';

-- Extract JSON value
SELECT 
  name,
  metadata->>'color' AS color,
  metadata->'dimensions'->>'width' AS width
FROM products;

-- JSON aggregation
SELECT json_agg(row_to_json(u)) 
FROM users u 
WHERE status = 'active';

-- Update JSON field
UPDATE products
SET metadata = jsonb_set(metadata, '{color}', '"blue"')
WHERE id = 1;
```

## Transactions

```sql
-- Basic transaction
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- With rollback on error
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  -- If next statement fails, rollback
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- On error: ROLLBACK;

-- Savepoints
BEGIN;
  INSERT INTO orders (...) VALUES (...);
  SAVEPOINT before_items;
  INSERT INTO order_items (...) VALUES (...);
  -- If items fail, rollback to savepoint
  ROLLBACK TO before_items;
  -- Try again or continue
COMMIT;
```
