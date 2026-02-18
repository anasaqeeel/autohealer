# 📸 SCREENSHOT GUIDE - Step by Step

This guide shows you EXACTLY what commands to run and what to screenshot for your presentation.

---

## 🎯 **QUICK START - Take These Screenshots First**

### **1. Application is Live** ✅

**Command:**
```bash
# Open browser and go to:
https://autohealer-production-b5d6.up.railway.app
```

**Screenshot:** Login page of your live application

**What to say:** "This is my live production application deployed on Railway"

---

### **2. Kubernetes Cluster Running** ✅

**Command:**
```bash
minikube status
```

**Screenshot:** Terminal showing all components "Running"

**What to say:** "I have a local Kubernetes cluster running via Minikube for testing orchestration features"

---

### **3. All Pods Running** ✅

**Command:**
```bash
kubectl get pods -n taskmaster-pro
```

**Screenshot:** All 5 pods showing "Running" status

**What to say:** "All application components are running in Kubernetes pods - backend, frontend, and database"

---

### **4. Self-Healing Demonstration** ✅

**Step 1 - Show current pods:**
```bash
kubectl get pods -n taskmaster-pro
```
**Screenshot:** Pods list (note one pod name)

**Step 2 - Delete a pod:**
```bash
# Pick any backend pod name from above
kubectl delete pod backend-5bfbfc554c-ld6th -n taskmaster-pro
```
**Screenshot:** Terminal showing "pod deleted"

**Step 3 - Watch it recreate:**
```bash
kubectl get pods -n taskmaster-pro
```
**Screenshot:** New pod being created automatically

**What to say:** "When I delete a pod, Kubernetes automatically creates a new one - this is self-healing in action"

---

### **5. Auto-Scaling (HPA)** ✅

**Command:**
```bash
kubectl get hpa -n taskmaster-pro
```

**Screenshot:** HPA showing min 2, max 10 pods

**What to say:** "I've configured Horizontal Pod Autoscaler to automatically scale from 2 to 10 pods based on CPU and memory usage"

---

### **6. Docker Images** ✅

**Command:**
```bash
docker images | grep taskmaster
```

**Screenshot:** List of Docker images (backend, frontend, mysql)

**What to say:** "I've containerized my application using Docker - these are the images for backend, frontend, and database"

---

### **7. CI/CD Pipeline** ✅

**Steps:**
1. Go to: `https://github.com/anasaqeeel/autohealer/actions`
2. Click on the latest workflow run

**Screenshot:** GitHub Actions page showing workflow runs

**What to say:** "I've set up a complete CI/CD pipeline using GitHub Actions that automatically tests, builds, and deploys my application"

---

### **8. Database Connection** ✅

**Command:**
```bash
kubectl exec -it -n taskmaster-pro $(kubectl get pod -n taskmaster-pro -l app=mysql -o jsonpath='{.items[0].metadata.name}') -- mysql -u root -proot_password_2024 taskmaster_pro -e "SHOW TABLES;"
```

**Screenshot:** List of database tables

**What to say:** "My application uses MySQL database with all tables properly configured"

---

### **9. Health Checks** ✅

**Command:**
```bash
kubectl logs -n taskmaster-pro -l app=backend --tail=10 | grep health
```

**Screenshot:** Health check logs showing 200 responses

**What to say:** "Kubernetes health checks are monitoring my application and automatically restarting unhealthy containers"

---

### **10. Application Features** ✅

**Screenshots to take:**
1. **Login Page** - `http://localhost:3000/login` or Railway URL
2. **Dashboard** - After logging in
3. **Projects Page** - Show projects list
4. **Tasks Page** - Show kanban board
5. **Create Task** - Show task creation form

**What to say:** "My application includes full CRUD operations for projects and tasks, with a modern UI built with Next.js and React"

---

## 📋 **DETAILED SCREENSHOT SCRIPT**

Run these commands in order and take screenshots:

### **Section 1: Infrastructure**

```bash
# 1. Show Kubernetes cluster
minikube status

# 2. Show all resources
kubectl get all -n taskmaster-pro

# 3. Show services
kubectl get services -n taskmaster-pro

# 4. Show deployments
kubectl get deployments -n taskmaster-pro

# 5. Show HPA
kubectl get hpa -n taskmaster-pro
```

### **Section 2: Self-Healing**

```bash
# 1. Before deletion
kubectl get pods -n taskmaster-pro -o wide

# 2. Delete pod (replace with actual pod name)
kubectl delete pod <pod-name> -n taskmaster-pro

# 3. Watch recreation
watch -n 1 kubectl get pods -n taskmaster-pro

# 4. Show restart count
kubectl get pods -n taskmaster-pro
```

### **Section 3: Docker**

```bash
# 1. List images
docker images

# 2. List containers
docker ps

# 3. Show container logs
docker logs taskmaster-backend --tail=20
```

### **Section 4: Application**

```bash
# 1. Backend health
curl http://localhost:3001/health

# 2. Backend metrics
curl http://localhost:3001/metrics | head -20

# 3. Frontend (open in browser)
# http://localhost:3000
```

### **Section 5: Database**

```bash
# Connect to database
kubectl exec -it -n taskmaster-pro $(kubectl get pod -n taskmaster-pro -l app=mysql -o jsonpath='{.items[0].metadata.name}') -- mysql -u root -proot_password_2024 taskmaster_pro

# Then run:
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM tasks;
```

### **Section 6: CI/CD**

1. Go to GitHub: `https://github.com/anasaqeeel/autohealer`
2. Click "Actions" tab
3. Click on latest workflow run
4. Screenshot each job showing green checkmarks

---

## 🎬 **PRESENTATION FLOW**

### **Slide 1: Introduction**
- Screenshot: Live application URL
- Say: "This is TaskMaster Pro, a full-stack SaaS application"

### **Slide 2: Architecture**
- Screenshot: `kubectl get all -n taskmaster-pro`
- Say: "I've deployed it using Kubernetes for orchestration"

### **Slide 3: Self-Healing**
- Screenshots: Before deletion, deletion command, after recreation
- Say: "Kubernetes automatically recovers from failures"

### **Slide 4: Auto-Scaling**
- Screenshot: `kubectl get hpa`
- Say: "HPA automatically scales pods based on load"

### **Slide 5: Containerization**
- Screenshot: `docker images`
- Say: "Application is containerized using Docker"

### **Slide 6: CI/CD**
- Screenshot: GitHub Actions workflow
- Say: "Automated testing and deployment pipeline"

### **Slide 7: Application Features**
- Screenshots: Dashboard, Projects, Tasks
- Say: "Full-featured project management application"

---

## ✅ **CHECKLIST - Before Presenting**

- [ ] All 10+ screenshots taken
- [ ] Can explain each screenshot
- [ ] Know what each command does
- [ ] Can demonstrate self-healing live
- [ ] Can show CI/CD pipeline
- [ ] Can access live application
- [ ] All code pushed to GitHub

---

**You're ready! 🚀**
