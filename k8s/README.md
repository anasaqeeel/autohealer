# Kubernetes Deployment Guide

This directory contains Kubernetes manifests for deploying TaskMaster Pro with **self-healing capabilities**.

## 🎯 Self-Healing Features

### Liveness Probes
- **Backend**: Checks `/health` endpoint every 10 seconds
- **Frontend**: Checks root path every 10 seconds
- **MySQL**: Uses `mysqladmin ping` to check database health
- **Action**: If probe fails 3 times → Kubernetes **automatically restarts the pod**

### Readiness Probes
- **Backend**: Checks `/health` endpoint every 5 seconds
- **Frontend**: Checks root path every 5 seconds
- **Action**: If probe fails → Pod is **removed from load balancer** until healthy

### Restart Policies
- All deployments use `restartPolicy: Always`
- Kubernetes automatically restarts failed containers
- Exponential backoff prevents restart loops

### Horizontal Pod Autoscaler (HPA)
- Automatically scales backend based on CPU/memory usage
- Min: 2 replicas, Max: 10 replicas
- Scales up when CPU > 70% or Memory > 80%

---

## 📋 Prerequisites

1. **Kubernetes Cluster**
   - Minikube (local): `minikube start`
   - kind (local): `kind create cluster`
   - Cloud: GKE, EKS, AKS

2. **kubectl** installed and configured

3. **Docker images** built and pushed to registry

---

## 🚀 Quick Start

### 1. Create Namespace
```bash
kubectl apply -f namespace.yaml
```

### 2. Create Secrets
```bash
# Copy example and edit with real values
cp secrets.yaml.example secrets.yaml
# Edit secrets.yaml with your actual secrets
kubectl apply -f secrets.yaml
```

### 3. Create ConfigMap
```bash
kubectl apply -f configmap.yaml
```

### 4. Deploy MySQL
```bash
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
```

### 5. Deploy Backend
```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
```

### 6. Deploy Frontend
```bash
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
```

### 7. Deploy Ingress (Optional)
```bash
kubectl apply -f ingress.yaml
```

### 8. Deploy HPA (Auto-scaling)
```bash
kubectl apply -f hpa.yaml
```

---

## 🔄 Deploy Everything at Once

```bash
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secrets.yaml  # Make sure to create this first!
kubectl apply -f mysql-pvc.yaml
kubectl apply -f mysql-deployment.yaml
kubectl apply -f mysql-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml
```

---

## 🧪 Testing Self-Healing

### Test 1: Kill a Pod
```bash
# Get pod name
kubectl get pods -n taskmaster-pro

# Delete a pod
kubectl delete pod <pod-name> -n taskmaster-pro

# Watch it restart automatically
kubectl get pods -n taskmaster-pro -w
```

**Expected Result**: Pod is automatically recreated by Kubernetes

### Test 2: Simulate Health Check Failure
```bash
# Port-forward to backend
kubectl port-forward -n taskmaster-pro svc/backend-service 3001:3001

# In another terminal, make health check fail (simulate)
# Or just wait - if health check fails, pod will restart
```

### Test 3: Check Liveness Probe
```bash
# Describe pod to see probe status
kubectl describe pod <pod-name> -n taskmaster-pro

# Check probe events
kubectl get events -n taskmaster-pro --sort-by='.lastTimestamp'
```

---

## 📊 Monitoring Self-Healing

### Check Pod Status
```bash
kubectl get pods -n taskmaster-pro
```

### Check Pod Restarts
```bash
kubectl get pods -n taskmaster-pro -o wide
# Look at RESTARTS column
```

### Check Events
```bash
kubectl get events -n taskmaster-pro --sort-by='.lastTimestamp'
```

### Check HPA Status
```bash
kubectl get hpa -n taskmaster-pro
kubectl describe hpa backend-hpa -n taskmaster-pro
```

---

## 🔍 Troubleshooting

### Pods Not Starting
```bash
# Check pod logs
kubectl logs <pod-name> -n taskmaster-pro

# Check pod events
kubectl describe pod <pod-name> -n taskmaster-pro
```

### Health Checks Failing
```bash
# Test health endpoint manually
kubectl port-forward -n taskmaster-pro svc/backend-service 3001:3001
curl http://localhost:3001/health
```

### Secrets Not Working
```bash
# Verify secrets exist
kubectl get secrets -n taskmaster-pro

# Check secret values (base64 encoded)
kubectl get secret taskmaster-secrets -n taskmaster-pro -o yaml
```

---

## 📝 Files Overview

- `namespace.yaml` - Creates taskmaster-pro namespace
- `configmap.yaml` - Non-sensitive configuration
- `secrets.yaml.example` - Template for secrets (DO NOT COMMIT REAL SECRETS!)
- `backend-deployment.yaml` - Backend deployment with **liveness/readiness probes**
- `backend-service.yaml` - Backend service (ClusterIP)
- `frontend-deployment.yaml` - Frontend deployment with **liveness/readiness probes**
- `frontend-service.yaml` - Frontend service (LoadBalancer)
- `mysql-deployment.yaml` - MySQL deployment with health checks
- `mysql-service.yaml` - MySQL service
- `mysql-pvc.yaml` - Persistent volume for MySQL data
- `ingress.yaml` - Ingress for external access
- `hpa.yaml` - Horizontal Pod Autoscaler for auto-scaling

---

## 🎯 Self-Healing Summary

✅ **Liveness Probes** - Detect dead pods → Auto-restart  
✅ **Readiness Probes** - Detect ready pods → Route traffic  
✅ **Restart Policies** - Always restart failed containers  
✅ **HPA** - Auto-scale based on load  
✅ **Health Checks** - Monitor application health  

**Result**: Your application automatically recovers from failures! 🎉
