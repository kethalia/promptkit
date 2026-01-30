---
title: "Multi-Stage Builds"
---
# Multi-Stage Builds

Guide to optimizing Docker images with multi-stage builds.

## Why Multi-Stage Builds?

| Problem | Solution |
|---------|----------|
| Large images from build tools | Build in one stage, copy artifacts to minimal runtime |
| Secrets in build layer | Build stage discarded, secrets don't persist |
| Slow builds | Cache build dependencies separately |
| Dev vs prod differences | Different final stages for different environments |

## Basic Pattern

```dockerfile
# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/server.js"]
```

## Named Stages

```dockerfile
# Dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Test stage (optional)
FROM builder AS tester
RUN npm run test

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["npm", "run", "dev"]
```

### Build Specific Stage

```bash
# Build production image (default, last stage)
docker build -t myapp .

# Build specific stage
docker build --target development -t myapp:dev .
docker build --target production -t myapp:prod .
docker build --target tester -t myapp:test .
```

## Language-Specific Patterns

### Node.js with TypeScript

```dockerfile
# Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM deps AS builder
COPY . .
RUN npm run build
RUN npm prune --production

# Production
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy only production node_modules and built code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Python with uv

```dockerfile
# Build stage
FROM python:3.12-slim AS builder

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-editable

COPY . .

# Production stage
FROM python:3.12-slim AS production

WORKDIR /app

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/src ./src

ENV PATH="/app/.venv/bin:$PATH"

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0"]
```

### Go (Minimal Final Image)

```dockerfile
# Build stage
FROM golang:1.22-alpine AS builder

RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Build
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o /app/server ./cmd/server

# Production stage - scratch (smallest possible)
FROM scratch AS production

# Copy CA certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy binary
COPY --from=builder /app/server /server

EXPOSE 8080
ENTRYPOINT ["/server"]
```

### Rust (Optimized)

```dockerfile
# Chef stage for dependency caching
FROM rust:1.75-alpine AS chef
RUN apk add --no-cache musl-dev
RUN cargo install cargo-chef
WORKDIR /app

# Planner - analyze dependencies
FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# Builder - build dependencies then app
FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

# Production
FROM alpine:3.19 AS production
RUN apk add --no-cache ca-certificates
COPY --from=builder /app/target/release/myapp /usr/local/bin/
EXPOSE 8080
ENTRYPOINT ["myapp"]
```

### Frontend + API (Monorepo)

```dockerfile
# Base with shared dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY packages/shared/package.json ./packages/shared/
RUN npm ci

# Build shared library
FROM base AS shared-builder
COPY packages/shared ./packages/shared
RUN npm run build -w packages/shared

# Build frontend
FROM base AS frontend-builder
COPY --from=shared-builder /app/packages/shared/dist ./packages/shared/dist
COPY packages/frontend ./packages/frontend
RUN npm run build -w packages/frontend

# Build API
FROM base AS api-builder
COPY --from=shared-builder /app/packages/shared/dist ./packages/shared/dist
COPY packages/api ./packages/api
RUN npm run build -w packages/api

# Frontend production (nginx)
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/packages/frontend/dist /usr/share/nginx/html

# API production
FROM node:20-alpine AS api
WORKDIR /app
COPY --from=api-builder /app/packages/api/dist ./dist
COPY --from=api-builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

## Optimization Tips

### Cache Dependencies Effectively

```dockerfile
# Copy dependency files first
COPY package.json package-lock.json ./
# or for monorepo
COPY package.json package-lock.json ./
COPY packages/*/package.json ./packages/

# Install dependencies (cached if no changes)
RUN npm ci

# Then copy source (changes frequently)
COPY . .
```

### Minimize Final Image

```dockerfile
# Remove dev dependencies
RUN npm prune --production

# Or in Python
RUN pip install --no-cache-dir -r requirements.txt

# Or use smaller base
FROM node:20-alpine  # Instead of node:20
FROM gcr.io/distroless/nodejs20-debian12  # Even smaller
```

### Combine RUN Commands

```dockerfile
# ❌ Multiple layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# ✅ Single layer
RUN apt-get update \
    && apt-get install -y curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

## Build Arguments

```dockerfile
# Define build args
ARG NODE_VERSION=20
ARG APP_ENV=production

FROM node:${NODE_VERSION}-alpine AS builder

# Use in build
ARG APP_ENV
ENV NODE_ENV=${APP_ENV}

RUN if [ "$APP_ENV" = "development" ]; then \
      npm install; \
    else \
      npm ci --only=production; \
    fi
```

```bash
# Build with args
docker build --build-arg NODE_VERSION=18 --build-arg APP_ENV=development -t myapp:dev .
```

## Image Size Comparison

| Approach | Node.js App Size |
|----------|------------------|
| `node:20` + all deps | ~1.2GB |
| `node:20-slim` + prod deps | ~300MB |
| `node:20-alpine` + prod deps | ~180MB |
| Multi-stage alpine | ~120MB |
| Distroless | ~100MB |

```bash
# Check image size
docker images myapp
docker history myapp:latest
```
