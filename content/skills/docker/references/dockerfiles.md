# Dockerfiles

Guide to writing efficient Dockerfiles for various stacks.

## Dockerfile Basics

### Instructions

| Instruction | Purpose | Example |
|-------------|---------|---------|
| `FROM` | Base image | `FROM node:20-alpine` |
| `WORKDIR` | Set working directory | `WORKDIR /app` |
| `COPY` | Copy files | `COPY package*.json ./` |
| `ADD` | Copy + extract/download | `ADD app.tar.gz /app` |
| `RUN` | Execute command | `RUN npm install` |
| `ENV` | Set environment variable | `ENV NODE_ENV=production` |
| `ARG` | Build-time variable | `ARG VERSION=1.0` |
| `EXPOSE` | Document port | `EXPOSE 3000` |
| `CMD` | Default command | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | Fixed command | `ENTRYPOINT ["node"]` |
| `USER` | Set user | `USER node` |
| `HEALTHCHECK` | Health check | `HEALTHCHECK CMD curl -f http://localhost/` |

### Layer Caching

```dockerfile
# ❌ Bad: Busts cache on any code change
COPY . .
RUN npm install

# ✅ Good: Dependencies cached unless package.json changes
COPY package*.json ./
RUN npm install
COPY . .
```

## Node.js

### Production

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
```

### With Build Step (TypeScript)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Next.js

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

## Python

### Production (pip)

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Non-root user
RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### With uv (Fast)

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy source
COPY . .

# Activate virtualenv
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Django

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

## Go

### Simple

```dockerfile
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Minimal runtime
FROM alpine:3.19

COPY --from=builder /app/server /server

EXPOSE 8080

ENTRYPOINT ["/server"]
```

### Distroless (More Secure)

```dockerfile
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/server ./cmd/server

# Distroless - no shell, minimal attack surface
FROM gcr.io/distroless/static-debian12

COPY --from=builder /app/server /server

EXPOSE 8080

ENTRYPOINT ["/server"]
```

## Rust

```dockerfile
FROM rust:1.75-alpine AS builder

RUN apk add --no-cache musl-dev

WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Build real app
COPY src ./src
RUN touch src/main.rs
RUN cargo build --release

# Minimal runtime
FROM alpine:3.19

COPY --from=builder /app/target/release/myapp /myapp

EXPOSE 8080

ENTRYPOINT ["/myapp"]
```

## Static Sites (Nginx)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Nginx for serving
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## .dockerignore

```dockerignore
# Dependencies
node_modules
.venv
vendor
target

# Build outputs
dist
build
.next
__pycache__

# Git
.git
.gitignore

# IDE
.idea
.vscode
*.swp

# Environment
.env
.env.*
!.env.example

# Docker
Dockerfile*
docker-compose*
.docker

# Docs
README.md
docs
*.md

# Tests
tests
__tests__
*.test.*
coverage

# Misc
.DS_Store
*.log
```

## Security Best Practices

### Run as Non-Root

```dockerfile
# Node (has built-in node user)
USER node

# Python (create user)
RUN useradd --create-home appuser
USER appuser

# Alpine (create user)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

### Don't Store Secrets in Image

```dockerfile
# ❌ Bad
ENV API_KEY=secret123
COPY .env .

# ✅ Good: Pass at runtime
# docker run -e API_KEY=secret123 myapp
```

### Use Specific Tags

```dockerfile
# ❌ Bad: Unpredictable
FROM node:latest
FROM python

# ✅ Good: Reproducible
FROM node:20.10-alpine3.19
FROM python:3.12.1-slim-bookworm
```

### Minimize Attack Surface

```dockerfile
# Remove unnecessary tools
RUN apt-get purge -y --auto-remove curl wget \
    && rm -rf /var/lib/apt/lists/*

# Use distroless for final image
FROM gcr.io/distroless/nodejs20-debian12
```

## HEALTHCHECK

```dockerfile
# HTTP check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# For images without curl
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"
```
