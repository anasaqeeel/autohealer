# 🐳 Docker Setup Guide - TaskMaster Pro

This guide explains how to run TaskMaster Pro using Docker and Docker Compose.

## 📋 Prerequisites

- **Docker** (v20.10 or higher) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0 or higher) - Usually comes with Docker Desktop

Verify installation:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### Option 1: Run Everything with Docker Compose (Recommended)

This is the easiest way to run the entire stack:

```bash
# Navigate to project root
cd /home/anas/anas/dev-ops/taskmaster-pro

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

**What this does:**
- Builds Docker images for backend and frontend
- Starts MySQL database
- Starts Redis cache
- Starts backend API
- Starts frontend UI
- Sets up networking between services

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

### Option 2: Build and Run Individual Containers

#### Build Backend Image
```bash
cd backend
docker build -t taskmaster-backend .
```

#### Run Backend Container
```bash
docker run -d \
  --name taskmaster-backend \
  -p 3001:3001 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=taskmaster_user \
  -e DB_PASSWORD=taskmaster_password \
  -e DB_NAME=taskmaster_pro \
  taskmaster-backend
```

#### Build Frontend Image
```bash
cd frontend
docker build -t taskmaster-frontend .
```

#### Run Frontend Container
```bash
docker run -d \
  --name taskmaster-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api \
  taskmaster-frontend
```

## 🔧 Docker Compose Commands

### Start Services
```bash
# Start in background (detached mode)
docker-compose up -d

# Start and view logs
docker-compose up

# Rebuild images before starting
docker-compose up -d --build
```

### Stop Services
```bash
# Stop services (keeps containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (⚠️ deletes database data)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check resource usage
docker stats
```

### Execute Commands in Containers
```bash
# Access backend container shell
docker-compose exec backend sh

# Access MySQL
docker-compose exec mysql mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro

# Run database seed script
docker-compose exec backend npm run seed
```

## 🗄️ Database Setup

### First Time Setup

The database is automatically initialized when MySQL container starts. However, you need to run migrations and seed data:

```bash
# Wait for MySQL to be ready (takes ~30 seconds)
docker-compose exec backend npm run seed
```

### Access Database Directly

```bash
# Using docker-compose
docker-compose exec mysql mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro

# Or using MySQL client
mysql -h localhost -P 3306 -u taskmaster_user -ptaskmaster_password taskmaster_pro
```

## 🔍 Troubleshooting

### Containers Won't Start

**Check logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

**Common issues:**
1. **Port already in use:**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :3001
   lsof -i :3306
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Database connection errors:**
   - Wait for MySQL to be healthy (check with `docker-compose ps`)
   - Verify environment variables in docker-compose.yml

3. **Build failures:**
   ```bash
   # Rebuild without cache
   docker-compose build --no-cache
   ```

### View Container Logs

```bash
# All logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

## 📊 Health Checks

All services have health checks configured:

```bash
# Check health status
docker-compose ps

# Manual health check
curl http://localhost:3001/health
curl http://localhost:3000
```

## 🔐 Environment Variables

Environment variables are set in `docker-compose.yml`. To override:

1. **Create `.env` file** in project root:
```env
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
```

2. **Update docker-compose.yml** to use `.env`:
```yaml
environment:
  DB_PASSWORD: ${DB_PASSWORD}
  JWT_SECRET: ${JWT_SECRET}
```

## 🎯 Development vs Production

### Development Mode

For development, you might want to:
- Mount source code as volumes (hot reload)
- Use development dependencies
- Enable debug logging

**Example docker-compose.dev.yml:**
```yaml
services:
  backend:
    volumes:
      - ./backend/src:/app/src
    environment:
      NODE_ENV: development
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production Mode

Current setup is production-ready:
- Multi-stage builds (smaller images)
- Non-root users (security)
- Health checks
- Proper logging

## 📈 Next Steps

After Docker setup:
1. ✅ **Test everything works** - Login, create projects, tasks
2. ⏭️ **Set up monitoring** - Prometheus, Grafana
3. ⏭️ **Deploy to Kubernetes** - Use these Docker images
4. ⏭️ **CI/CD pipeline** - Build and push images automatically

## 🐛 Common Issues

### "Cannot connect to database"
- Wait for MySQL to be healthy: `docker-compose ps`
- Check MySQL logs: `docker-compose logs mysql`
- Verify DB credentials in docker-compose.yml

### "Frontend can't connect to backend"
- Check backend is running: `docker-compose ps`
- Verify `NEXT_PUBLIC_API_BASE_URL` in frontend container
- Check network: `docker network ls`

### "Port already in use"
- Change ports in docker-compose.yml
- Or stop the service using the port

## 📚 Docker Concepts Explained

### Multi-Stage Builds
- **Why:** Smaller final images (only production code)
- **How:** Build in one stage, copy artifacts to final stage
- **Result:** Backend image ~150MB instead of ~500MB

### Health Checks
- **Why:** Docker/Kubernetes can detect unhealthy containers
- **How:** Periodic HTTP requests to `/health` endpoint
- **Result:** Automatic restart of unhealthy containers

### Named Volumes
- **Why:** Data persists even if containers are removed
- **How:** MySQL data stored in `mysql_data` volume
- **Result:** Database survives container restarts

### Networks
- **Why:** Services can communicate by name (e.g., `mysql` instead of IP)
- **How:** Docker creates internal network
- **Result:** Backend connects to `mysql:3306` instead of `localhost:3306`

---

**Your application is now containerized! 🎉**

Next: Set up monitoring (Prometheus + Grafana) to observe these containers.
