# Database Migrations

Guide to version-controlled database schema changes.

## Migration Principles

1. **Version Control** - Migrations are code, track in git
2. **Idempotent** - Safe to run multiple times (when possible)
3. **Reversible** - Include rollback (down) migrations
4. **Atomic** - Each migration is one logical change
5. **Sequential** - Run in order, never modify past migrations

## Migration Workflow

```
1. Create migration file
2. Write UP migration (apply change)
3. Write DOWN migration (revert change)
4. Test locally
5. Commit to git
6. Run on staging
7. Run on production
```

## Raw SQL Migrations

### File Naming

```
migrations/
├── 001_create_users.sql
├── 002_create_posts.sql
├── 003_add_users_email_index.sql
├── 004_add_posts_published_at.sql
└── 005_create_comments.sql

# Or with timestamps
├── 20240115120000_create_users.sql
├── 20240115120100_create_posts.sql
```

### Migration File Template

```sql
-- Migration: 001_create_users
-- Description: Create users table

-- UP
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOWN
DROP TABLE users;
```

## Prisma Migrations

### Setup

```bash
# Initialize Prisma
npx prisma init

# After schema changes, create migration
npx prisma migrate dev --name create_users

# Apply to production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset
```

### Schema File (schema.prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int      @map("author_id")
  createdAt DateTime @default(now()) @map("created_at")

  @@index([authorId])
  @@map("posts")
}
```

### Generated Migration

```sql
-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
```

## Alembic (SQLAlchemy)

### Setup

```bash
# Initialize Alembic
alembic init alembic

# Create migration
alembic revision --autogenerate -m "create users table"

# Run migrations
alembic upgrade head

# Rollback
alembic downgrade -1

# Show current version
alembic current
```

### Configuration (alembic.ini)

```ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql://user:pass@localhost/dbname
```

### Migration File

```python
"""create users table

Revision ID: 001
Revises: 
Create Date: 2024-01-15 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )


def downgrade():
    op.drop_table('users')
```

## Knex.js Migrations

### Setup

```bash
# Initialize
npx knex init

# Create migration
npx knex migrate:make create_users

# Run migrations
npx knex migrate:latest

# Rollback
npx knex migrate:rollback
```

### Migration File

```javascript
// migrations/20240115120000_create_users.js

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('name', 100).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
```

## golang-migrate

### Setup

```bash
# Install
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Create migration
migrate create -ext sql -dir migrations -seq create_users

# Run migrations
migrate -path migrations -database "postgres://..." up

# Rollback
migrate -path migrations -database "postgres://..." down 1
```

### Migration Files

```sql
-- migrations/000001_create_users.up.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- migrations/000001_create_users.down.sql
DROP TABLE users;
```

## Common Migration Operations

### Add Column

```sql
-- UP
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- DOWN
ALTER TABLE users DROP COLUMN phone;
```

### Add Column with Default (Safe)

```sql
-- UP (PostgreSQL - safe for large tables)
ALTER TABLE users ADD COLUMN is_active BOOLEAN;
ALTER TABLE users ALTER COLUMN is_active SET DEFAULT true;
UPDATE users SET is_active = true WHERE is_active IS NULL;
ALTER TABLE users ALTER COLUMN is_active SET NOT NULL;

-- DOWN
ALTER TABLE users DROP COLUMN is_active;
```

### Rename Column

```sql
-- UP
ALTER TABLE users RENAME COLUMN name TO full_name;

-- DOWN
ALTER TABLE users RENAME COLUMN full_name TO name;
```

### Add Index

```sql
-- UP (CONCURRENTLY for no locks in PostgreSQL)
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);

-- DOWN
DROP INDEX idx_users_email;
```

### Add Foreign Key

```sql
-- UP
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- DOWN
ALTER TABLE posts DROP CONSTRAINT fk_posts_user;
```

### Create Enum

```sql
-- UP
CREATE TYPE status_enum AS ENUM ('pending', 'active', 'inactive');
ALTER TABLE users ADD COLUMN status status_enum DEFAULT 'pending';

-- DOWN
ALTER TABLE users DROP COLUMN status;
DROP TYPE status_enum;
```

### Modify Enum (PostgreSQL)

```sql
-- UP (add value)
ALTER TYPE status_enum ADD VALUE 'suspended';

-- DOWN (cannot remove enum values easily - recreate)
-- This is complex; consider using VARCHAR with CHECK instead
```

## Migration Safety

### Safe Operations (No/Minimal Locking)

- Creating new tables
- Adding nullable columns
- Adding indexes CONCURRENTLY (PostgreSQL)
- Adding constraints (with NOT VALID)

### Dangerous Operations (Requires Care)

| Operation | Risk | Mitigation |
|-----------|------|------------|
| Adding NOT NULL column | Table lock | Add nullable, backfill, then add constraint |
| Adding column with default | Table rewrite (old PG) | Use NULL + trigger (or PG 11+) |
| Dropping column | Data loss | Soft deprecate first |
| Renaming column | App breakage | Deploy app changes first |
| Adding index | Table lock | Use CONCURRENTLY |
| Changing column type | Table rewrite | Create new column, migrate data |

### Large Table Strategy

```sql
-- For tables with millions of rows:

-- 1. Add column without default
ALTER TABLE large_table ADD COLUMN new_col INTEGER;

-- 2. Backfill in batches
UPDATE large_table SET new_col = computed_value 
WHERE id BETWEEN 1 AND 10000;
-- Repeat for batches...

-- 3. Add constraints after data is filled
ALTER TABLE large_table ALTER COLUMN new_col SET NOT NULL;
ALTER TABLE large_table ALTER COLUMN new_col SET DEFAULT 0;
```

## Migration Checklist

### Before Creating
- [ ] Understand current schema state
- [ ] Plan both UP and DOWN migrations
- [ ] Consider table size and locking
- [ ] Test on copy of production data

### Migration Content
- [ ] Single logical change per migration
- [ ] Reversible (DOWN migration exists)
- [ ] Idempotent where possible
- [ ] Indexes for new foreign keys

### Before Deploying
- [ ] Tested locally
- [ ] Tested on staging
- [ ] Backup exists
- [ ] Rollback plan ready
- [ ] Off-peak hours for large migrations
