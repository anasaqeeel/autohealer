# 🚀 TaskMaster Pro

A full-stack project management SaaS application with modern DevOps infrastructure.

## 🌐 Live Application

- **Frontend:** https://autohealer-production-b5d6.up.railway.app
- **Backend API:** https://autohealer-production.up.railway.app
- **Repository:** https://github.com/anasaqeeel/autohealer

## 🛠️ Tech Stack

### Frontend
- Next.js 16, React 19, TypeScript
- Tailwind CSS, shadcn/ui
- React Query for state management

### Backend
- Node.js, Express, TypeScript
- MySQL with Sequelize ORM
- JWT authentication

### Infrastructure
- Docker containerization
- Kubernetes orchestration (Minikube)
- Railway deployment
- GitHub Actions CI/CD

## ✨ Features

- ✅ Multi-tenant organization support
- ✅ Project and task management
- ✅ Real-time activity tracking
- ✅ User authentication and authorization
- ✅ RESTful API with comprehensive endpoints
- ✅ Self-healing Kubernetes deployment
- ✅ Auto-scaling with HPA
- ✅ CI/CD pipeline with automated testing

## 📚 Documentation

- [Project Status](./PROJECT_COMPLETE_STATUS.md)
- [All Services & Tools](./ALL_SERVICES_AND_TOOLS.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Docker Setup](./DOCKER_SETUP.md)
- [Kubernetes Deployment](./k8s/README.md)
- [Backend API](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- MySQL 8.0

### Local Development

```bash
# Start all services
docker-compose up -d

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## 🏗️ Architecture

- **Frontend:** Next.js application on port 3000
- **Backend:** Express API on port 3001
- **Database:** MySQL on port 3306
- **Monitoring:** Prometheus & Grafana

## 🔧 DevOps Features

- **Containerization:** Docker images for all services
- **Orchestration:** Kubernetes with self-healing
- **CI/CD:** Automated testing and deployment
- **Monitoring:** Health checks and metrics
- **Auto-scaling:** Horizontal Pod Autoscaler (2-10 pods)

## 📝 License

MIT
