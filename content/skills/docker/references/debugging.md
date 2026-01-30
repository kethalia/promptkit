# Docker Debugging

Guide to troubleshooting Docker containers and images.

## Container Debugging

### View Logs

```bash
# View logs
docker logs <container>

# Follow logs
docker logs -f <container>

# Last N lines
docker logs --tail 100 <container>

# With timestamps
docker logs -t <container>

# Since specific time
docker logs --since 2024-01-15T10:00:00 <container>
docker logs --since 10m <container>
```

### Shell into Container

```bash
# Running container
docker exec -it <container> /bin/sh
docker exec -it <container> /bin/bash

# As root (if running as non-root)
docker exec -it -u root <container> /bin/sh

# Run command without shell
docker exec <container> ls -la /app
```

### Inspect Container

```bash
# Full inspection
docker inspect <container>

# Specific fields
docker inspect --format='{{.State.Status}}' <container>
docker inspect --format='{{.NetworkSettings.IPAddress}}' <container>
docker inspect --format='{{json .Config.Env}}' <container> | jq

# Environment variables
docker exec <container> env

# Running processes
docker exec <container> ps aux
docker top <container>
```

### Container Stats

```bash
# Resource usage
docker stats <container>
docker stats --no-stream  # Snapshot

# Disk usage
docker system df
```

## Image Debugging

### Inspect Image

```bash
# Image details
docker inspect <image>

# Image history (layers)
docker history <image>
docker history --no-trunc <image>

# Image size breakdown
docker history --format "{{.Size}}\t{{.CreatedBy}}" <image>
```

### Run Image Interactively

```bash
# Start with shell (override CMD)
docker run -it <image> /bin/sh

# Start with shell (override ENTRYPOINT)
docker run -it --entrypoint /bin/sh <image>

# Don't remove container after exit
docker run -it <image> /bin/sh
# Container remains for inspection after exit
```

### Debug Build

```bash
# Build with progress output
docker build --progress=plain -t myapp .

# Build without cache
docker build --no-cache -t myapp .

# Build specific stage
docker build --target builder -t myapp:builder .

# Keep intermediate containers on failure
DOCKER_BUILDKIT=0 docker build -t myapp .
# Then inspect the last successful layer
```

## Common Issues

### Container Won't Start

```bash
# Check exit code
docker ps -a --filter "name=<container>"
docker inspect --format='{{.State.ExitCode}}' <container>

# Common exit codes:
# 0   - Success (but might have exited immediately)
# 1   - General error
# 137 - Killed (OOM or docker stop)
# 139 - Segfault
# 143 - SIGTERM

# Check logs for error
docker logs <container>

# Try running interactively
docker run -it <image> /bin/sh
```

### Container Exits Immediately

```bash
# Check if CMD/ENTRYPOINT is correct
docker inspect --format='{{.Config.Cmd}}' <image>
docker inspect --format='{{.Config.Entrypoint}}' <image>

# Common causes:
# - Process runs in background (use foreground mode)
# - Missing dependencies
# - Permissions issue

# Keep container running for debugging
docker run -d <image> tail -f /dev/null
docker exec -it <container> /bin/sh
```

### Out of Memory

```bash
# Check if OOM killed
docker inspect --format='{{.State.OOMKilled}}' <container>

# Check memory usage
docker stats <container>

# Increase memory limit
docker run -m 1g <image>
```

### Permission Denied

```bash
# Check file permissions in container
docker exec <container> ls -la /app

# Check user running container
docker exec <container> id

# Run as root to debug
docker exec -u root <container> ls -la /app

# Fix: In Dockerfile
RUN chown -R node:node /app
USER node
```

### Can't Connect to Service

```bash
# Check if port is exposed
docker port <container>

# Check if service is listening
docker exec <container> netstat -tlnp
docker exec <container> ss -tlnp

# Check from host
curl localhost:3000
curl -v localhost:3000

# Check container networking
docker network ls
docker network inspect <network>

# Test connectivity between containers
docker exec <container1> ping <container2>
docker exec <container1> curl http://<container2>:3000
```

### Volume Not Mounting

```bash
# Check mounts
docker inspect --format='{{json .Mounts}}' <container> | jq

# Verify host path exists
ls -la /path/on/host

# Check SELinux (Linux)
# Add :Z or :z suffix
docker run -v /host/path:/container/path:Z <image>

# Check Docker Desktop file sharing settings (Mac/Windows)
```

## Debugging Docker Compose

```bash
# Check config is valid
docker compose config

# View generated config
docker compose config --services
docker compose config --volumes

# Start with verbose output
docker compose --verbose up

# Check service logs
docker compose logs <service>
docker compose logs -f <service>

# Check service status
docker compose ps

# Restart single service
docker compose restart <service>

# Rebuild and restart
docker compose up -d --build <service>
```

## Network Debugging

```bash
# List networks
docker network ls

# Inspect network
docker network inspect bridge
docker network inspect <network>

# Create debug container on network
docker run -it --network <network> alpine sh
# Then: ping, curl, nslookup, etc.

# Check DNS resolution
docker exec <container> nslookup <service_name>

# Check iptables (Linux)
sudo iptables -L -n -t nat
```

## Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune
docker image prune -a  # Including unused

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything unused
docker system prune
docker system prune -a --volumes  # Nuclear option

# Check disk usage
docker system df
```

## Debug Toolkit Container

Create a debug container with useful tools:

```dockerfile
# Dockerfile.debug
FROM alpine:3.19

RUN apk add --no-cache \
    curl \
    wget \
    bind-tools \
    netcat-openbsd \
    postgresql-client \
    redis \
    mysql-client \
    jq \
    vim \
    htop

CMD ["sh"]
```

```bash
# Build and use
docker build -f Dockerfile.debug -t debug-tools .

# Run on same network as your services
docker run -it --network myapp_default debug-tools

# Inside: test connections
curl http://api:3000/health
psql -h db -U postgres
redis-cli -h redis ping
```

## Quick Reference

| Problem | Command |
|---------|---------|
| View logs | `docker logs -f <container>` |
| Shell into container | `docker exec -it <container> sh` |
| Check exit code | `docker inspect --format='{{.State.ExitCode}}' <container>` |
| Check OOM | `docker inspect --format='{{.State.OOMKilled}}' <container>` |
| Resource usage | `docker stats <container>` |
| Check ports | `docker port <container>` |
| Check mounts | `docker inspect --format='{{json .Mounts}}' <container>` |
| Network debug | `docker network inspect <network>` |
| Disk usage | `docker system df` |
