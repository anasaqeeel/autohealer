# 🛠️ All Services & Tools in TaskMaster Pro

## 📊 Complete Stack Overview

This document shows **every service, tool, and technology** used in your project and how to view/access them.

---

## 🎯 Application Services

### 1. **Backend API** (Node.js/Express/TypeScript)
- **Technology**: Node.js 20, Express.js, TypeScript
- **Port**: 3001 (local), Railway (production)
- **URLs**:
  - Local: http://localhost:3001
  - Production: https://autohealer-production.up.railway.app
- **Health Check**: http://localhost:3001/health
- **Metrics**: http://localhost:3001/metrics
- **API Docs**: http://localhost:3001/api

**How to View:**
```bash
# Check if running
curl http://localhost:3001/health

# View logs
docker-compose logs -f backend

# Or if running locally
cd backend && npm run dev
```

**What it does:**
- REST API for all application features
- Authentication (JWT)
- Database operations
- Activity logging
- Metrics collection

---

### 2. **Frontend** (Next.js/React/TypeScript)
- **Technology**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Port**: 3000 (local), Railway (production)
- **URLs**:
  - Local: http://localhost:3000
  - Production: https://autohealer-production-b5d6.up.railway.app
- **Admin Panel**: http://localhost:3000/dashboard

**How to View:**
```bash
# Check if running
curl http://localhost:3000

# View logs
docker-compose logs -f frontend

# Or if running locally
cd frontend && npm run dev
```

**What it does:**
- User interface
- Authentication UI
- Project/Task management UI
- Dashboard and analytics
- Settings and profile management

---

## 🗄️ Database Services

### 3. **MySQL Database**
- **Technology**: MySQL 8.0
- **Port**: 3306
- **Database Name**: `taskmaster_pro`
- **Connection**: `mysql://root:root_password@localhost:3306/taskmaster_pro`

**How to View:**
```bash
# Connect via Docker
docker exec -it taskmaster-mysql mysql -u root -proot_password taskmaster_pro

# Or via MySQL client
mysql -h localhost -u root -proot_password taskmaster_pro

# View all tables
SHOW TABLES;

# View users
SELECT id, email, name FROM users;

# View projects
SELECT id, name, status FROM projects;

# View tasks
SELECT id, title, status, priority FROM tasks;
```

**What it stores:**
- Users
- Organizations
- Projects
- Tasks
- Comments
- Activity logs

---

### 4. **Redis Cache**
- **Technology**: Redis 7
- **Port**: 6379
- **Connection**: `redis://localhost:6379`

**How to View:**
```bash
# Connect via Docker
docker exec -it taskmaster-redis redis-cli

# View all keys
KEYS *

# Get a value
GET <key>

# View info
INFO
```

**What it does:**
- Session storage
- API response caching
- Rate limiting data

---

## 📊 Monitoring & Observability

### 5. **Prometheus** (Metrics Collection)
- **Technology**: Prometheus
- **Port**: 9090
- **URL**: http://localhost:9090

**How to View:**
```bash
# Open in browser
http://localhost:9090

# Check targets
# Go to: Status → Targets
# Should see: backend:3001/metrics (UP)

# Query metrics
# Go to: Graph
# Try: http_requests_total
# Or: http_request_duration_seconds
```

**What it collects:**
- HTTP request count
- Request duration
- Error rates
- Business metrics (tasks created/completed)
- System metrics (CPU, memory)

**Metrics Available:**
- `http_requests_total` - Total HTTP requests
- `http_request_duration_seconds` - Request latency
- `tasks_created_total` - Tasks created counter
- `tasks_completed_total` - Tasks completed counter

---

### 6. **Grafana** (Visualization)
- **Technology**: Grafana
- **Port**: 3002
- **URL**: http://localhost:3002
- **Login**: admin / admin

**How to View:**
```bash
# Open in browser
http://localhost:3002

# Login with:
# Username: admin
# Password: admin

# View dashboard
# Go to: Dashboards → TaskMaster Pro Dashboard
```

**What it shows:**
- HTTP request graphs
- Response time charts
- Error rate visualization
- Business metrics (tasks created/completed)
- System resource usage

**Dashboards:**
- **TaskMaster Pro Dashboard** - Main application metrics
- Pre-configured panels for all key metrics

---

## 🐳 Containerization

### 7. **Docker** (Container Runtime)
- **Technology**: Docker, Docker Compose
- **Services**: 6 containers

**How to View:**
```bash
# View all containers
docker-compose ps

# View running containers
docker ps

# View container logs
docker-compose logs -f [service-name]

# View container stats
docker stats

# View all services
docker-compose config
```

**Services Running:**
1. `taskmaster-backend` - Backend API
2. `taskmaster-frontend` - Frontend UI
3. `taskmaster-mysql` - MySQL database
4. `taskmaster-redis` - Redis cache
5. `taskmaster-prometheus` - Prometheus metrics
6. `taskmaster-grafana` - Grafana dashboards

---

## ☸️ Kubernetes (K8s)

### 8. **Kubernetes** (Orchestration)
- **Status**: ✅ **Fully Implemented** - Manifests ready, not deployed yet
- **Location**: `/k8s/` directory
- **Cluster**: Needs Minikube or cloud K8s

**What's Implemented:**
- ✅ Namespace (`taskmaster-pro`)
- ✅ ConfigMap (configuration)
- ✅ Secrets (credentials)
- ✅ Backend Deployment (with self-healing)
- ✅ Frontend Deployment (with self-healing)
- ✅ MySQL Deployment
- ✅ Services (ClusterIP, LoadBalancer)
- ✅ Ingress (external access)
- ✅ HPA (Horizontal Pod Autoscaler)
- ✅ Persistent Volume Claims (database storage)

**How to View/Deploy:**

#### Option 1: Local with Minikube
```bash
# Install Minikube (if not installed)
# macOS: brew install minikube
# Linux: https://minikube.sigs.k8s.io/docs/start/

# Start Minikube
minikube start

# Enable ingress
minikube addons enable ingress

# Deploy to Kubernetes
cd /home/anas/anas/dev-ops/taskmaster-pro/k8s

# Create secrets first (edit secrets.yaml.example)
cp secrets.yaml.example secrets.yaml
# Edit secrets.yaml with your values
kubectl apply -f secrets.yaml

# Deploy everything
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml

# View all resources
kubectl get all -n taskmaster-pro

# View pods
kubectl get pods -n taskmaster-pro

# View services
kubectl get svc -n taskmaster-pro

# View deployments
kubectl get deployments -n taskmaster-pro

# View logs
kubectl logs -f <pod-name> -n taskmaster-pro

# Test self-healing
kubectl delete pod <pod-name> -n taskmaster-pro
# Watch it restart automatically
kubectl get pods -n taskmaster-pro -w
```

#### Option 2: View Manifests
```bash
# List all K8s files
ls -la k8s/

# View a specific manifest
cat k8s/backend-deployment.yaml
cat k8s/hpa.yaml
```

**Self-Healing Features:**
- **Liveness Probe**: Restarts dead pods automatically
- **Readiness Probe**: Removes unhealthy pods from traffic
- **HPA**: Auto-scales based on CPU usage
- **Restart Policy**: Automatically restarts failed containers

---

## 🔄 CI/CD Pipeline

### 9. **GitHub Actions** (CI/CD)
- **Technology**: GitHub Actions
- **Workflows**: 2 workflows
- **Location**: `.github/workflows/`

**How to View:**
```bash
# View workflows
cat .github/workflows/ci.yml
cat .github/workflows/cd.yml

# Or view on GitHub
# Go to: https://github.com/anasaqeeel/autohealer/actions
```

**What it does:**
- **CI Pipeline** (`ci.yml`):
  - Runs on every push
  - Tests backend code
  - Lints code
  - Builds TypeScript
  - Runs security scans
  - Builds Docker images

- **CD Pipeline** (`cd.yml`):
  - Runs on main branch pushes
  - Builds Docker images
  - Pushes to GitHub Container Registry
  - Deploys to Railway (optional)

**View Status:**
1. Go to: https://github.com/anasaqeeel/autohealer/actions
2. Click on any workflow run
3. See job status, logs, and artifacts

---

## 🔒 Security Tools

### 10. **Trivy** (Vulnerability Scanner)
- **Technology**: Trivy
- **Runs**: In CI/CD pipeline
- **Output**: SARIF format

**How to View:**
```bash
# Run locally
docker run --rm -v $(pwd):/app aquasec/trivy:latest fs /app

# Or in CI/CD
# Check GitHub Actions → Security Scan job
```

**What it scans:**
- Docker images
- Dependencies (npm packages)
- Configuration files
- Code vulnerabilities

---

### 11. **ESLint** (Code Quality)
- **Technology**: ESLint
- **Runs**: In CI/CD and locally
- **Config**: `.eslintrc.json`

**How to View:**
```bash
# Run locally
cd backend && npm run lint
cd frontend && npm run lint
```

**What it checks:**
- Code style
- Best practices
- Potential bugs
- TypeScript issues

---

### 12. **Prettier** (Code Formatting)
- **Technology**: Prettier
- **Runs**: Locally
- **Config**: `.prettierrc.json`

**How to View:**
```bash
# Format code
cd backend && npm run format
```

---

## 🧪 Testing Tools

### 13. **Jest** (Testing Framework)
- **Technology**: Jest, Supertest
- **Location**: `backend/tests/`
- **Config**: `backend/jest.config.js`

**How to View:**
```bash
# Run tests
cd backend && npm test

# Run with coverage
cd backend && npm test -- --coverage
```

**What it tests:**
- API endpoints
- Health checks
- Metrics endpoints
- Integration tests

---

## 📦 Package Management

### 14. **npm** (Node Package Manager)
- **Backend**: `backend/package.json`
- **Frontend**: `frontend/package.json`

**How to View:**
```bash
# View backend dependencies
cat backend/package.json

# View frontend dependencies
cat frontend/package.json

# List installed packages
cd backend && npm list
cd frontend && npm list
```

---

## 🌐 Deployment Platforms

### 15. **Railway** (Cloud Deployment)
- **Backend**: https://autohealer-production.up.railway.app
- **Frontend**: https://autohealer-production-b5d6.up.railway.app
- **Database**: MySQL on Railway

**How to View:**
```bash
# Check backend
curl https://autohealer-production.up.railway.app/health

# Check frontend
curl https://autohealer-production-b5d6.up.railway.app

# View logs (via Railway dashboard)
# Go to: https://railway.app
```

---

## 📋 Quick Reference: All Services

| Service | Technology | Port | URL | Status |
|---------|-----------|------|-----|--------|
| Backend API | Node.js/Express | 3001 | http://localhost:3001 | ✅ Running |
| Frontend | Next.js/React | 3000 | http://localhost:3000 | ✅ Running |
| MySQL | MySQL 8.0 | 3306 | localhost:3306 | ✅ Running |
| Redis | Redis 7 | 6379 | localhost:6379 | ✅ Running |
| Prometheus | Prometheus | 9090 | http://localhost:9090 | ✅ Running |
| Grafana | Grafana | 3002 | http://localhost:3002 | ✅ Running |
| Kubernetes | K8s Manifests | - | `/k8s/` | ✅ Ready (not deployed) |
| CI/CD | GitHub Actions | - | GitHub Actions | ✅ Running |
| Security | Trivy | - | CI/CD | ✅ Running |
| Testing | Jest | - | `npm test` | ✅ Ready |

---

## 🚀 How to Start Everything

### Start All Services Locally
```bash
cd /home/anas/anas/dev-ops/taskmaster-pro

# Start everything with Docker Compose
docker-compose up -d

# Wait 30 seconds, then check
docker-compose ps

# View logs
docker-compose logs -f
```

### Access All Services:
1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:3001
3. **Backend Health**: http://localhost:3001/health
4. **Backend Metrics**: http://localhost:3001/metrics
5. **Prometheus**: http://localhost:9090
6. **Grafana**: http://localhost:3002 (admin/admin)

---

## 📊 Kubernetes Status

### ✅ What's Implemented:
- All Kubernetes manifests created
- Self-healing configured (liveness/readiness probes)
- Auto-scaling configured (HPA)
- Persistent storage configured
- Ingress configured
- Services configured

### ⚠️ What's Not Deployed:
- Not deployed to a Kubernetes cluster yet
- Need to set up Minikube or cloud K8s
- Need to create secrets

### 🎯 How to Deploy K8s:
1. **Install Minikube** (local) or use cloud K8s
2. **Create secrets** from `secrets.yaml.example`
3. **Apply manifests** with `kubectl apply -f k8s/`
4. **Verify** with `kubectl get all -n taskmaster-pro`

**Full instructions**: See `k8s/README.md`

---

## 🔍 How to View Everything at Once

### Docker Compose Dashboard
```bash
# View all services
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Kubernetes Dashboard (When Deployed)
```bash
# View all resources
kubectl get all -n taskmaster-pro

# View pods
kubectl get pods -n taskmaster-pro -w

# View services
kubectl get svc -n taskmaster-pro

# View deployments
kubectl get deployments -n taskmaster-pro
```

### Monitoring Dashboard
- **Grafana**: http://localhost:3002
  - Login: admin/admin
  - View: Dashboards → TaskMaster Pro Dashboard

---

## 📝 Summary

**All Services & Tools:**
1. ✅ Backend API (Node.js/Express)
2. ✅ Frontend (Next.js/React)
3. ✅ MySQL Database
4. ✅ Redis Cache
5. ✅ Prometheus (Metrics)
6. ✅ Grafana (Visualization)
7. ✅ Docker (Containers)
8. ✅ Kubernetes (Orchestration - ready, not deployed)
9. ✅ GitHub Actions (CI/CD)
10. ✅ Trivy (Security)
11. ✅ ESLint (Code Quality)
12. ✅ Jest (Testing)
13. ✅ Railway (Deployment)

**Everything is implemented and working!** 🎉

**Kubernetes is ready to deploy** - just needs a cluster (Minikube or cloud).

---

**To see everything running:**
```bash
docker-compose up -d
# Then open all URLs in browser
```

**To deploy Kubernetes:**
```bash
# Follow k8s/README.md
# Or ask me to help set it up!
```
