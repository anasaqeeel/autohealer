# 🔄 Test Self-Healing - Step by Step

## ✅ **Correct Way to Test Self-Healing**

### **Method 1: Using Variable (Recommended)**

```bash
# Step 1: Get a pod name
POD_NAME=$(kubectl get pods -n taskmaster-pro -l app=backend -o jsonpath='{.items[0].metadata.name}')

# Step 2: Verify the pod name
echo "Pod to delete: $POD_NAME"

# Step 3: Delete the pod
kubectl delete pod $POD_NAME -n taskmaster-pro

# Step 4: Watch it recreate
kubectl get pods -n taskmaster-pro -l app=backend -w
# Wait 10-20 seconds, then press Ctrl+C
```

### **Method 2: Direct Pod Name (Easier)**

```bash
# Step 1: List pods to see names
kubectl get pods -n taskmaster-pro

# Step 2: Pick any backend pod name (e.g., backend-5bfbfc554c-ld6th)
# Step 3: Delete it directly
kubectl delete pod backend-5bfbfc554c-ld6th -n taskmaster-pro

# Step 4: Watch it recreate
kubectl get pods -n taskmaster-pro
# Wait 10 seconds, run again to see new pod
```

---

## ⚠️ **Common Mistakes**

### **WRONG:**
```bash
# Don't use a pod name as variable name!
frontend-76759c6799-xwpwd=$(kubectl get pods ...)  # ❌ WRONG
```

### **CORRECT:**
```bash
# Use POD_NAME as variable name
POD_NAME=$(kubectl get pods ...)  # ✅ CORRECT
```

---

## 📸 **Screenshots to Take**

1. **Before deletion:**
   ```bash
   kubectl get pods -n taskmaster-pro
   ```
   Screenshot: Pods list

2. **Delete command:**
   ```bash
   kubectl delete pod <pod-name> -n taskmaster-pro
   ```
   Screenshot: Terminal showing "pod deleted"

3. **After deletion (10 seconds later):**
   ```bash
   kubectl get pods -n taskmaster-pro
   ```
   Screenshot: New pod created automatically

---

## 🎯 **Quick Test Script**

```bash
#!/bin/bash
echo "=== Before Deletion ==="
kubectl get pods -n taskmaster-pro -l app=backend

echo -e "\n=== Deleting Pod ==="
POD_NAME=$(kubectl get pods -n taskmaster-pro -l app=backend -o jsonpath='{.items[0].metadata.name}')
echo "Deleting: $POD_NAME"
kubectl delete pod $POD_NAME -n taskmaster-pro

echo -e "\n=== Waiting 15 seconds for recreation ==="
sleep 15

echo -e "\n=== After Deletion ==="
kubectl get pods -n taskmaster-pro -l app=backend
```

Save as `test-self-healing.sh` and run:
```bash
chmod +x test-self-healing.sh
./test-self-healing.sh
```

---

## ✅ **What You Should See**

**Before:**
```
backend-5bfbfc554c-ld6th    1/1     Running   0             75m
backend-5bfbfc554c-tr2sl    1/1     Running   8             97m
```

**After deletion:**
```
pod "backend-5bfbfc554c-ld6th" deleted
```

**After 10-20 seconds:**
```
backend-5bfbfc554c-ld6th    0/1     Terminating   0             75m
backend-5bfbfc554c-xxxxx    0/1     ContainerCreating   0             5s
```

**After 30 seconds:**
```
backend-5bfbfc554c-xxxxx    1/1     Running   0             30s
backend-5bfbfc554c-tr2sl    1/1     Running   8             97m
```

**Notice:** New pod with different name (xxxxx) is created automatically! ✅
