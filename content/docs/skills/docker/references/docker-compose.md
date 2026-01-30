---
title: "Docker Compose"
---
# Docker Compose

Guide to defining and running multi-container applications.

## Basic Structure

```yaml
version: '3.8'

services:
  # Service definitions
  app:
    # ...
  db:
    # ...

volumes:
  # Named volumes
  db_data:

networks:
  # Custom networks
  backend:
```

## Service Configuration

### Build from Dockerfile

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        NODE_ENV: production
    image: myapp:latest
```

### Use Pre-built Image

```yaml
services:
  db:
    image: postgres:16-alpine
```

### Ports

```yaml
services:
  app:
    ports:
      - "3000:3000"           # host:container
      - "127.0.0.1:3000:3000" # localhost only
      - "3000"                # random host port
```

### Environment Variables

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    
    # Or from file
    env_file:
      - .env
      - .env.local
```

### Volumes

```yaml
services:
  app:
    volumes:
      # Named volume
      - app_data:/app/data
      
      # Bind mount (development)
      - ./src:/app/src
      
      # Read-only bind mount
      - ./config:/app/config:ro
      
      # Anonymous volume (persist node_modules)
      - /app/node_modules

volumes:
  app_data:
```

### Dependencies

```yaml
services:
  app:
    depends_on:
      - db
      - redis
    
    # With health check (Compose v2.1+)
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
```

### Health Checks

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
  
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Restart Policy

```yaml
services:
  app:
    restart: unless-stopped
    # Options: no, always, on-failure, unless-stopped
```

### Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Complete Examples

### Node.js + PostgreSQL + Redis

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Python FastAPI + MongoDB

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/myapp
    depends_on:
      - mongo
    volumes:
      - ./app:/app/app  # Development hot reload
    command: uvicorn app.main:app --host 0.0.0.0 --reload

  mongo:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongo_data:
```

### Full Stack (React + API + DB)

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      target: development
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
    environment:
      - REACT_APP_API_URL=http://localhost:4000

  api:
    build:
      context: ./api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgres://postgres:password@db:5432/myapp
      - JWT_SECRET=your-secret-key
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./api/src:/app/src

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 5s
      timeout: 5s
      retries: 5

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
```

### Development vs Production

```yaml
# docker-compose.yml (base)
version: '3.8'

services:
  app:
    image: myapp:latest
    environment:
      - NODE_ENV=production

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```yaml
# docker-compose.override.yml (development, auto-loaded)
version: '3.8'

services:
  app:
    build: .
    volumes:
      - ./src:/app/src
      - /app/node_modules
    environment:
      - NODE_ENV=development
    ports:
      - "3000:3000"
      - "9229:9229"  # Debug port

  db:
    ports:
      - "5432:5432"
```

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          memory: 512M
```

```bash
# Development (uses base + override)
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Networks

```yaml
version: '3.8'

services:
  frontend:
    networks:
      - frontend

  api:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend

networks:
  frontend:
  backend:
```

## Commands

```bash
# Start services
docker compose up              # Foreground
docker compose up -d           # Detached
docker compose up --build      # Rebuild images

# Stop services
docker compose stop            # Stop
docker compose down            # Stop and remove containers
docker compose down -v         # Also remove volumes

# View status
docker compose ps
docker compose logs
docker compose logs -f app     # Follow specific service

# Execute commands
docker compose exec app sh     # Shell into running service
docker compose run app npm test  # Run one-off command

# Scale (if no port conflicts)
docker compose up -d --scale app=3

# Rebuild single service
docker compose build app
docker compose up -d --no-deps app
```

## Environment Files

```bash
# .env (default)
POSTGRES_PASSWORD=secret
APP_PORT=3000

# Use in compose
services:
  app:
    ports:
      - "${APP_PORT}:3000"
  db:
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```
