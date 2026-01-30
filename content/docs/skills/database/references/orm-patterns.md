---
title: "ORM Patterns"
---
# ORM Patterns

Guide to using ORMs effectively: Prisma, SQLAlchemy, GORM, and Drizzle.

## Prisma (TypeScript/JavaScript)

### Setup

```bash
npm install prisma @prisma/client
npx prisma init
```

### Schema Definition

```prisma
// prisma/schema.prisma
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
  name      String?
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId  Int      @map("author_id")
  tags      Tag[]
  createdAt DateTime @default(now()) @map("created_at")

  @@index([authorId])
  @@map("posts")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]

  @@map("tags")
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId Int    @unique @map("user_id")

  @@map("profiles")
}
```

### CRUD Operations

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
      ],
    },
  },
  include: { posts: true },
});

// Read
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true, profile: true },
});

const users = await prisma.user.findMany({
  where: { 
    email: { contains: '@gmail.com' },
    posts: { some: { published: true } },
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Update
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' },
});

// Upsert
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated Name' },
  create: { email: 'user@example.com', name: 'New User' },
});

// Delete
await prisma.user.delete({ where: { id: 1 } });

// Delete many
await prisma.post.deleteMany({
  where: { authorId: 1, published: false },
});
```

### Transactions

```typescript
// Sequential transaction
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'a@b.com', name: 'A' } }),
  prisma.post.create({ data: { title: 'Post', authorId: 1 } }),
]);

// Interactive transaction
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'a@b.com', name: 'A' },
  });
  await tx.post.create({
    data: { title: 'Post', authorId: user.id },
  });
});
```

### Raw Queries

```typescript
// Raw query
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email LIKE ${`%@gmail.com`}
`;

// Raw execute
await prisma.$executeRaw`
  UPDATE users SET status = 'inactive' WHERE last_login < NOW() - INTERVAL '30 days'
`;
```

## SQLAlchemy (Python)

### Setup

```bash
pip install sqlalchemy psycopg2-binary
# or with async
pip install sqlalchemy[asyncio] asyncpg
```

### Model Definition

```python
from datetime import datetime
from sqlalchemy import create_engine, ForeignKey, String, Text, Boolean
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, Session

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str | None] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    posts: Mapped[list["Post"]] = relationship(back_populates="author", cascade="all, delete-orphan")
    profile: Mapped["Profile | None"] = relationship(back_populates="user", uselist=False)

class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str | None] = mapped_column(Text)
    published: Mapped[bool] = mapped_column(default=False)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    author: Mapped["User"] = relationship(back_populates="posts")

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    bio: Mapped[str | None] = mapped_column(Text)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    
    user: Mapped["User"] = relationship(back_populates="profile")
```

### CRUD Operations

```python
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

engine = create_engine("postgresql://user:pass@localhost/db")

with Session(engine) as session:
    # Create
    user = User(email="user@example.com", name="John")
    user.posts.append(Post(title="First Post"))
    session.add(user)
    session.commit()
    session.refresh(user)

    # Read
    user = session.get(User, 1)
    
    # Query
    stmt = (
        select(User)
        .where(User.email.contains("@gmail.com"))
        .options(selectinload(User.posts))
        .order_by(User.created_at.desc())
        .limit(10)
    )
    users = session.scalars(stmt).all()
    
    # Update
    user = session.get(User, 1)
    user.name = "Jane"
    session.commit()
    
    # Delete
    session.delete(user)
    session.commit()
```

### Async SQLAlchemy

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")

async with AsyncSession(engine) as session:
    result = await session.execute(select(User).where(User.id == 1))
    user = result.scalar_one_or_none()
```

## GORM (Go)

### Setup

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
```

### Model Definition

```go
package models

import (
    "time"
    "gorm.io/gorm"
)

type User struct {
    ID        uint           `gorm:"primaryKey"`
    Email     string         `gorm:"uniqueIndex;size:255;not null"`
    Name      string         `gorm:"size:100"`
    Posts     []Post         `gorm:"foreignKey:AuthorID;constraint:OnDelete:CASCADE"`
    Profile   *Profile       `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
    CreatedAt time.Time
    UpdatedAt time.Time
    DeletedAt gorm.DeletedAt `gorm:"index"`
}

type Post struct {
    ID        uint   `gorm:"primaryKey"`
    Title     string `gorm:"size:255;not null"`
    Content   string
    Published bool   `gorm:"default:false"`
    AuthorID  uint   `gorm:"index;not null"`
    Author    User   `gorm:"foreignKey:AuthorID"`
    CreatedAt time.Time
}

type Profile struct {
    ID     uint   `gorm:"primaryKey"`
    Bio    string
    UserID uint   `gorm:"uniqueIndex;not null"`
    User   User   `gorm:"foreignKey:UserID"`
}
```

### CRUD Operations

```go
import (
    "gorm.io/gorm"
    "gorm.io/driver/postgres"
)

dsn := "host=localhost user=user password=pass dbname=db port=5432"
db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

// Auto migrate
db.AutoMigrate(&User{}, &Post{}, &Profile{})

// Create
user := User{Email: "user@example.com", Name: "John"}
db.Create(&user)

// Create with associations
user := User{
    Email: "user@example.com",
    Name:  "John",
    Posts: []Post{{Title: "First Post"}},
}
db.Create(&user)

// Read
var user User
db.First(&user, 1)  // By primary key
db.First(&user, "email = ?", "user@example.com")

// With preloading
db.Preload("Posts").Preload("Profile").First(&user, 1)

// Query
var users []User
db.Where("email LIKE ?", "%@gmail.com").
    Order("created_at desc").
    Limit(10).
    Find(&users)

// Update
db.Model(&user).Update("name", "Jane")
db.Model(&user).Updates(User{Name: "Jane", Email: "jane@example.com"})

// Delete (soft delete if DeletedAt field exists)
db.Delete(&user, 1)

// Hard delete
db.Unscoped().Delete(&user, 1)
```

### Transactions

```go
err := db.Transaction(func(tx *gorm.DB) error {
    if err := tx.Create(&user).Error; err != nil {
        return err
    }
    if err := tx.Create(&post).Error; err != nil {
        return err
    }
    return nil
})
```

## Drizzle (TypeScript)

### Setup

```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Schema Definition

```typescript
// db/schema.ts
import { pgTable, serial, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  published: boolean('published').default(false),
  authorId: integer('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
}));
```

### CRUD Operations

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, like, desc } from 'drizzle-orm';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Create
const [user] = await db.insert(schema.users)
  .values({ email: 'user@example.com', name: 'John' })
  .returning();

// Read
const user = await db.query.users.findFirst({
  where: eq(schema.users.id, 1),
  with: { posts: true },
});

// Query
const users = await db.query.users.findMany({
  where: like(schema.users.email, '%@gmail.com'),
  orderBy: desc(schema.users.createdAt),
  limit: 10,
  with: { posts: true },
});

// Update
await db.update(schema.users)
  .set({ name: 'Jane' })
  .where(eq(schema.users.id, 1));

// Delete
await db.delete(schema.users)
  .where(eq(schema.users.id, 1));
```

## ORM Best Practices

### Eager vs Lazy Loading

```typescript
// Prisma: Always explicit (eager)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },  // Explicit eager load
});

// Avoid N+1: Load what you need upfront
const users = await prisma.user.findMany({
  include: { posts: true },  // One query for users, one for posts
});
```

### Pagination

```typescript
// Offset pagination (simple, but slow for large offsets)
const posts = await prisma.post.findMany({
  skip: 20,
  take: 10,
  orderBy: { createdAt: 'desc' },
});

// Cursor pagination (better for large datasets)
const posts = await prisma.post.findMany({
  take: 10,
  cursor: { id: lastPostId },
  skip: 1,  // Skip the cursor
  orderBy: { id: 'desc' },
});
```

### Select Only What You Need

```typescript
// Prisma: Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    _count: { select: { posts: true } },
  },
});
```

### Handle Errors

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

try {
  await prisma.user.create({ data: { email: 'existing@email.com' } });
} catch (e) {
  if (e instanceof PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      // Unique constraint violation
      throw new Error('Email already exists');
    }
  }
  throw e;
}
```

## Quick Reference

| Operation | Prisma | SQLAlchemy | GORM |
|-----------|--------|------------|------|
| Create | `create()` | `session.add()` | `db.Create()` |
| Find one | `findUnique()` | `session.get()` | `db.First()` |
| Find many | `findMany()` | `session.scalars()` | `db.Find()` |
| Update | `update()` | `session.commit()` | `db.Updates()` |
| Delete | `delete()` | `session.delete()` | `db.Delete()` |
| Include | `include: {}` | `selectinload()` | `Preload()` |
| Transaction | `$transaction()` | `session.begin()` | `db.Transaction()` |
