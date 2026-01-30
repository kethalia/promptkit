---
title: "Query Optimization"
---
# Query Optimization

Guide to optimizing database query performance.

## Optimization Process

```
1. Identify slow queries (logs, monitoring)
2. Analyze with EXPLAIN
3. Check indexes
4. Optimize query structure
5. Consider caching
6. Measure improvement
```

## EXPLAIN Analysis

### PostgreSQL

```sql
-- Basic explain
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- With execution stats (actually runs query)
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Verbose with buffers
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) 
SELECT * FROM users WHERE email = 'test@example.com';

-- JSON format for tools
EXPLAIN (ANALYZE, FORMAT JSON) SELECT ...;
```

### Reading EXPLAIN Output

```
Seq Scan on users  (cost=0.00..155.00 rows=1 width=100) (actual time=0.015..1.234 rows=1 loops=1)
  Filter: (email = 'test@example.com'::text)
  Rows Removed by Filter: 9999

-- Key metrics:
-- cost: Estimated startup..total cost
-- rows: Estimated rows returned
-- actual time: Real execution time (ms)
-- Rows Removed: Rows scanned but not returned
```

### Scan Types

| Scan Type | Meaning | Performance |
|-----------|---------|-------------|
| Seq Scan | Full table scan | Slow for large tables |
| Index Scan | Uses index, fetches rows | Good |
| Index Only Scan | Uses index only | Best |
| Bitmap Index Scan | Combines multiple indexes | Good for OR conditions |

### Join Types

| Join Type | Meaning | Best For |
|-----------|---------|----------|
| Nested Loop | For each row, scan other table | Small tables, indexed lookups |
| Hash Join | Build hash table, probe | Medium tables, equality joins |
| Merge Join | Sort both, merge | Large tables, sorted data |

## Indexes

### When to Index

✅ **Index these:**
- Primary keys (automatic)
- Foreign keys
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns with high selectivity

❌ **Don't index:**
- Small tables (< 1000 rows)
- Low selectivity columns (e.g., boolean, status with few values)
- Columns rarely queried
- Frequently updated columns (index maintenance overhead)

### Index Types

```sql
-- B-tree (default, most common)
CREATE INDEX idx_users_email ON users(email);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Composite index (column order matters!)
CREATE INDEX idx_posts_user_status ON posts(user_id, status);

-- Partial index (subset of rows)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Expression index
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- GIN index (for arrays, JSONB, full-text)
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- GiST index (for geometric, full-text)
CREATE INDEX idx_locations_coords ON locations USING GIST(coordinates);

-- BRIN index (for large sequential data)
CREATE INDEX idx_logs_created ON logs USING BRIN(created_at);
```

### Composite Index Column Order

```sql
-- Index on (user_id, status, created_at)

-- ✅ Uses index (leftmost columns)
WHERE user_id = 1
WHERE user_id = 1 AND status = 'active'
WHERE user_id = 1 AND status = 'active' AND created_at > '2024-01-01'

-- ❌ Cannot use index efficiently
WHERE status = 'active'  -- Skips user_id
WHERE created_at > '2024-01-01'  -- Skips user_id and status
```

### Index Maintenance

```sql
-- Check index usage (PostgreSQL)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT 
  indexrelname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexrelname NOT LIKE '%_pkey';

-- Rebuild index (PostgreSQL)
REINDEX INDEX idx_name;

-- Create index without locking (PostgreSQL)
CREATE INDEX CONCURRENTLY idx_name ON table(column);
```

## Query Optimization Techniques

### Use Specific Columns

```sql
-- ❌ Bad
SELECT * FROM users;

-- ✅ Good
SELECT id, name, email FROM users;
```

### Avoid SELECT in WHERE

```sql
-- ❌ Slow (subquery per row)
SELECT * FROM posts 
WHERE user_id IN (SELECT id FROM users WHERE status = 'active');

-- ✅ Better (single join)
SELECT p.* FROM posts p
JOIN users u ON p.user_id = u.id
WHERE u.status = 'active';

-- ✅ Or with EXISTS
SELECT * FROM posts p
WHERE EXISTS (
  SELECT 1 FROM users u 
  WHERE u.id = p.user_id AND u.status = 'active'
);
```

### Optimize LIKE Queries

```sql
-- ❌ Cannot use index (leading wildcard)
WHERE name LIKE '%john%'

-- ✅ Can use index (trailing wildcard)
WHERE name LIKE 'john%'

-- For full-text search, use proper FTS
WHERE to_tsvector('english', name) @@ to_tsquery('john');
```

### Avoid Functions on Indexed Columns

```sql
-- ❌ Cannot use index on email
WHERE LOWER(email) = 'test@example.com'

-- ✅ Create expression index
CREATE INDEX idx_users_lower_email ON users(LOWER(email));

-- Or normalize data on write
-- Store email as lowercase
```

### Optimize OR Conditions

```sql
-- ❌ May not use indexes efficiently
WHERE status = 'active' OR status = 'pending'

-- ✅ Use IN
WHERE status IN ('active', 'pending')

-- For complex OR, consider UNION
SELECT * FROM users WHERE email = 'a@b.com'
UNION ALL
SELECT * FROM users WHERE phone = '123456';
```

### Limit Data Early

```sql
-- ❌ Joins before filtering
SELECT u.*, p.* 
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.status = 'active'
LIMIT 10;

-- ✅ Filter users first with CTE
WITH active_users AS (
  SELECT id FROM users WHERE status = 'active' LIMIT 100
)
SELECT u.*, p.*
FROM active_users au
JOIN users u ON au.id = u.id
JOIN posts p ON u.id = p.user_id
LIMIT 10;
```

### Batch Operations

```sql
-- ❌ Many individual inserts
INSERT INTO logs (message) VALUES ('msg1');
INSERT INTO logs (message) VALUES ('msg2');
-- ... 1000 times

-- ✅ Batch insert
INSERT INTO logs (message) VALUES 
  ('msg1'), ('msg2'), ('msg3'), ... ;

-- ❌ Many individual updates
UPDATE users SET status = 'inactive' WHERE id = 1;
UPDATE users SET status = 'inactive' WHERE id = 2;

-- ✅ Batch update
UPDATE users SET status = 'inactive' WHERE id IN (1, 2, 3, ...);
```

## N+1 Query Problem

```sql
-- ❌ N+1: One query for users, N queries for posts
SELECT * FROM users;
-- For each user:
SELECT * FROM posts WHERE user_id = ?;

-- ✅ Single query with JOIN
SELECT u.*, p.*
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;

-- ✅ Or two queries (often better for ORMs)
SELECT * FROM users WHERE id IN (...);
SELECT * FROM posts WHERE user_id IN (...);
```

## Caching Strategies

### Query Result Caching

```sql
-- Materialized view (PostgreSQL)
CREATE MATERIALIZED VIEW monthly_stats AS
SELECT 
  date_trunc('month', created_at) AS month,
  COUNT(*) AS total
FROM orders
GROUP BY 1;

-- Refresh
REFRESH MATERIALIZED VIEW monthly_stats;
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_stats;  -- No lock
```

### Application-Level Caching

- Cache frequent, stable queries in Redis/Memcached
- Use query result caching in ORM
- Implement cache invalidation strategy

## Performance Checklist

### For Every Query
- [ ] Only select needed columns
- [ ] Indexes exist for WHERE/JOIN columns
- [ ] EXPLAIN shows index usage
- [ ] No N+1 queries
- [ ] Appropriate LIMIT

### For Slow Queries
- [ ] Run EXPLAIN ANALYZE
- [ ] Check for Seq Scans on large tables
- [ ] Verify index is being used
- [ ] Consider query restructuring
- [ ] Check for lock contention

### Database Health
- [ ] Regular VACUUM (PostgreSQL)
- [ ] Update statistics (ANALYZE)
- [ ] Monitor slow query log
- [ ] Check index bloat
- [ ] Review unused indexes

## Quick Reference

| Problem | Solution |
|---------|----------|
| Seq Scan on large table | Add index |
| Index not used | Check column order, functions |
| Slow JOIN | Index foreign keys |
| Slow ORDER BY | Index sort columns |
| Slow LIKE '%x%' | Use full-text search |
| N+1 queries | Use JOIN or batch fetch |
| Slow aggregations | Materialized view |
