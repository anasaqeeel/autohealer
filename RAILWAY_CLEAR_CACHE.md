# 🗑️ Clear Railway Build Cache

## The Problem

Railway is using **cached build layers** from the backend Dockerfile, even though it found the correct frontend Dockerfile.

The build logs show it's trying to execute:
```
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/package*.json ./
```

These commands are **NOT** in the frontend Dockerfile - they're from cached layers!

## Solution: Clear Build Cache

### Option 1: Delete and Recreate Service (Recommended)

This will completely clear all cache:

1. Go to your frontend service
2. Click **Settings** → Scroll to bottom
3. Click **"Delete Service"**
4. Create a **new service**:
   - Click **"+ New"** → **"GitHub Repo"**
   - Select `anasaqeeel/autohealer`
   - Set **Root Directory:** `frontend` (no leading slash!)
   - Set **Dockerfile Path:** `Dockerfile` (relative, not absolute!)
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://autohealer-production.up.railway.app/api
   ```

### Option 2: Force Rebuild (If Available)

1. Go to your frontend service
2. Click on the latest failed deployment
3. Look for **"Rebuild"** or **"Clear Cache"** button
4. Click it to force a fresh build

### Option 3: Change Dockerfile Slightly

I've updated the Dockerfile with a cache-busting comment. After pushing, Railway should detect the change and rebuild.

## Verify After Rebuild

Check the build logs. You should see:

✅ **Correct (Frontend Dockerfile):**
```
COPY package*.json ./
COPY . .
RUN npm ci --no-cache
```

❌ **Wrong (Cached Backend Dockerfile):**
```
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/package*.json ./
```

## Why This Happens

Railway caches Docker build layers to speed up builds. When you switch from backend to frontend, it tries to reuse cached layers from the backend build, which reference `backend/` paths that don't exist in the frontend build context.

---

**The easiest fix is to delete and recreate the frontend service - this clears all cache!** 🗑️
