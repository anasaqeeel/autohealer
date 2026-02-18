# 📸 Screenshot Commands - Exact Commands to Run

## 🎯 **Quick Reference - Run These Commands**

### **1. Live Application** ✅
```bash
# Just open browser
# URL: https://autohealer-production-b5d6.up.railway.app
# Screenshot: Login page or dashboard
```

---

### **2. Kubernetes Cluster Status** ✅
```bash
minikube status
```
**Screenshot:** Terminal showing all components "Running"

---

### **3. All Kubernetes Pods** ✅
```bash
kubectl get pods -n taskmaster-pro
```
**Screenshot:** All 5 pods showing "Running" status

**Expected Output:**
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxx                 1/1     Running   0          10m
backend-yyy                 1/1     Running   8          30m
frontend-xxx                1/1     Running   0          30m
frontend-yyy                1/1     Running   0          30m
mysql-xxx                   1/1     Running   0          25m
```

---

### **4. All Kubernetes Resources** ✅
```bash
kubectl get all -n taskmaster-pro
```
**Screenshot:** Shows pods, services, deployments, replicasets

---

### **5. Self-Healing Demo** ✅

**Step 1 - Before:**
```bash
kubectl get pods -n taskmaster-pro -o wide
```
**Screenshot 1:** Pods list (note one pod name)

**Step 2 - Delete:**
```bash
# Get a pod name first (IMPORTANT: Use POD_NAME as variable name, not a pod name!)
POD_NAME=$(kubectl get pods -n taskmaster-pro -l app=backend -o jsonpath='{.items[0].metadata.name}')
echo "Deleting pod: $POD_NAME"
kubectl delete pod $POD_NAME -n taskmaster-pro
```

**OR simpler - just pick a pod name from the list:**
```bash
# Pick any backend pod name from the list above, then:
kubectl delete pod backend-5bfbfc554c-ld6th -n taskmaster-pro
```

**Screenshot 2:** Terminal showing "pod deleted"

**Step 3 - After (Watch Recreation):**
```bash
kubectl get pods -n taskmaster-pro -w
# Wait 10-20 seconds, then Ctrl+C
```
**Screenshot 3:** New pod being created automatically

**Step 4 - Final Status:**
```bash
kubectl get pods -n taskmaster-pro
```
**Screenshot 4:** New pod running

---

### **6. Auto-Scaling (HPA)** ✅
```bash
kubectl get hpa -n taskmaster-pro
```
**Screenshot:** HPA showing min 2, max 10 pods

**Expected Output:**
```
NAME          REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS
backend-hpa   Deployment/backend   .../70%   2         10        2
```

---

### **7. Docker Images** ✅
```bash
docker images | grep -E "taskmaster|mysql"
```
**Screenshot:** List of Docker images

**Expected Output:**
```
taskmaster-pro-backend    latest    xxx    184MB
taskmaster-pro-frontend   latest    xxx    281MB
mysql                     8.0       xxx    786MB
```

---

### **8. Running Containers** ✅
```bash
docker ps
```
**Screenshot:** Running containers (if using docker-compose)

---

### **9. Kubernetes Services** ✅
```bash
kubectl get services -n taskmaster-pro
```
**Screenshot:** Services list

**Expected Output:**
```
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)
backend-service    ClusterIP      10.97.49.2      <none>        3001/TCP
frontend-service   LoadBalancer   10.108.114.180  <pending>     80:32321/TCP
mysql-service      ClusterIP      10.110.104.16   <none>        3306/TCP
```

---

### **10. Kubernetes Deployments** ✅
```bash
kubectl get deployments -n taskmaster-pro
```
**Screenshot:** Deployments showing "2/2" or "1/1" ready

---

### **11. Backend Health Check** ✅
```bash
# Port forward first (in one terminal)
kubectl port-forward -n taskmaster-pro service/backend-service 3001:3001 &

# Then test (in another terminal)
curl http://localhost:3001/health
```
**Screenshot:** JSON response showing `{"status":"ok"}`

---

### **12. Database Connection** ✅
```bash
kubectl exec -it -n taskmaster-pro $(kubectl get pod -n taskmaster-pro -l app=mysql -o jsonpath='{.items[0].metadata.name}') -- mysql -u root -proot_password_2024 taskmaster_pro -e "SHOW TABLES;"
```
**Screenshot:** List of database tables

---

### **13. CI/CD Pipeline** ✅
**Browser Screenshot:**
- Go to: `https://github.com/anasaqeeel/autohealer/actions`
- Screenshot: Workflow runs page

---

### **14. GitHub Packages (Container Registry)** ✅
**Browser Screenshot:**
- Go to: `https://github.com/anasaqeeel/autohealer?tab=packages`
- Screenshot: Container images (if CD pipeline ran)

---

### **15. Application Dashboard** ✅
**Browser Screenshot:**
- Login to application
- Navigate to Dashboard
- Screenshot: Dashboard with stats

---

## 🎬 **Recommended Screenshot Sequence**

### **For Group Message (5-7 screenshots):**

1. ✅ **Live Application** - Browser showing Railway URL
2. ✅ **Kubernetes Pods** - `kubectl get pods -n taskmaster-pro`
3. ✅ **Self-Healing** - Before/After pod deletion
4. ✅ **Docker Images** - `docker images | grep taskmaster`
5. ✅ **CI/CD Pipeline** - GitHub Actions page
6. ✅ **HPA** - `kubectl get hpa -n taskmaster-pro` (optional)
7. ✅ **Application Dashboard** - Browser showing app (optional)

---

## 📋 **Quick Script to Run All Commands**

```bash
#!/bin/bash
echo "=== 1. Kubernetes Status ==="
minikube status

echo -e "\n=== 2. All Pods ==="
kubectl get pods -n taskmaster-pro

echo -e "\n=== 3. All Resources ==="
kubectl get all -n taskmaster-pro

echo -e "\n=== 4. HPA ==="
kubectl get hpa -n taskmaster-pro

echo -e "\n=== 5. Services ==="
kubectl get services -n taskmaster-pro

echo -e "\n=== 6. Deployments ==="
kubectl get deployments -n taskmaster-pro

echo -e "\n=== 7. Docker Images ==="
docker images | grep -E "taskmaster|mysql"

echo -e "\n=== 8. Pod Details ==="
kubectl get pods -n taskmaster-pro -o wide
```

**Save as `screenshot-commands.sh` and run:**
```bash
chmod +x screenshot-commands.sh
./screenshot-commands.sh
```

---

## 🖼️ **Screenshot Tips**

### **Terminal Screenshots:**
- ✅ Use full-screen terminal
- ✅ Clear terminal first (`clear`)
- ✅ Run command
- ✅ Wait for output
- ✅ Take screenshot

### **Browser Screenshots:**
- ✅ Use full-screen browser
- ✅ Hide bookmarks bar
- ✅ Take clean screenshot

### **What to Include:**
- ✅ Command you ran
- ✅ Output showing success
- ✅ Clean, readable text

---

**Run these commands and take screenshots! 📸**
