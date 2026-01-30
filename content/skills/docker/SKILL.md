---
name: docker
description: Docker containerization workflows for full-stack development. Use when creating Dockerfiles, setting up docker-compose, debugging containers, or deploying applications. Triggers include "Docker", "Dockerfile", "container", "docker-compose", "image", "deployment", or when containerizing applications. Covers Dockerfiles, multi-stage builds, compose files, debugging, and best practices.
---

# Docker Skill

Comprehensive Docker workflows for containerizing and deploying applications. This skill covers:
1. **Dockerfiles** - Building images for any stack
2. **Multi-Stage Builds** - Optimized production images
3. **Docker Compose** - Multi-container applications
4. **Debugging** - Troubleshooting containers
5. **Best Practices** - Security and optimization

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| Write Dockerfile | See [dockerfiles.md](references/dockerfiles.md) |
| Multi-stage builds | See [multi-stage-builds.md](references/multi-stage-builds.md) |
| Docker Compose | See [docker-compose.md](references/docker-compose.md) |
| Debug containers | See [debugging.md](references/debugging.md) |

## Essential Commands

```bash
# Build
docker build -t myapp:latest .
docker build -t myapp:latest -f Dockerfile.prod .

# Run
docker run -d -p 3000:3000 --name myapp myapp:latest
docker run -it --rm myapp:latest /bin/sh

# Manage containers
docker ps                    # Running containers
docker ps -a                 # All containers
docker logs myapp            # View logs
docker logs -f myapp         # Follow logs
docker exec -it myapp /bin/sh  # Shell into container
docker stop myapp            # Stop container
docker rm myapp              # Remove container

# Manage images
docker images                # List images
docker rmi myapp:latest      # Remove image
docker image prune           # Remove unused images

# Docker Compose
docker compose up -d         # Start services
docker compose down          # Stop services
docker compose logs -f       # Follow all logs
docker compose exec app sh   # Shell into service
```

## Dockerfile Quick Reference

```dockerfile
# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Run command
CMD ["node", "server.js"]
```

## Docker Compose Quick Reference

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db
    volumes:
      - .:/app
    
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Image Size Comparison

| Base Image | Size | Use Case |
|------------|------|----------|
| `node:20` | ~1GB | Development |
| `node:20-slim` | ~200MB | Smaller, most deps |
| `node:20-alpine` | ~130MB | Production |
| `python:3.12` | ~1GB | Development |
| `python:3.12-slim` | ~150MB | Production |
| `python:3.12-alpine` | ~50MB | Minimal (may have issues) |
| `golang:1.22` | ~800MB | Building |
| `golang:1.22-alpine` | ~250MB | Building |
| `alpine` | ~5MB | Final stage |
| `distroless` | ~20MB | Secure final stage |

## Best Practices Summary

1. **Use specific tags** - `node:20.10-alpine` not `node:latest`
2. **Multi-stage builds** - Separate build and runtime
3. **Order layers** - Least changing first (deps before code)
4. **Minimize layers** - Combine RUN commands
5. **Use .dockerignore** - Exclude unnecessary files
6. **Non-root user** - Run as non-root in production
7. **Health checks** - Add HEALTHCHECK instruction

## Output Format

When creating Docker configurations:

```markdown
## Docker Setup: [Application]

### Dockerfile
```dockerfile
[Dockerfile content]
```

### docker-compose.yml
```yaml
[Compose content]
```

### Commands
```bash
[Build and run commands]
```
```
