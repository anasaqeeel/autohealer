# 🎨 Deploy Frontend to Railway

## Current Status

✅ **Backend is deployed and working!**
- URL: `https://autohealer-production.up.railway.app`
- API is responding correctly

❌ **Frontend is NOT deployed yet**
- That's why you're seeing JSON instead of the UI

## Deploy Frontend (Separate Service)

The frontend needs to be deployed as a **separate service** on Railway.

### Step 1: Create New Service

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"GitHub Repo"**
3. Select the same repository: `anasaqeeel/autohealer`

### Step 2: Configure Service

1. **Root Directory:** Set to `frontend`
2. **Dockerfile Path:** Set to `frontend/Dockerfile`
3. Railway should auto-detect this, but verify in Settings

### Step 3: Add Environment Variables

Go to the frontend service → **Variables** tab → Add:

```
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://autohealer-production.up.railway.app/api
```

**Important:** Use your actual backend URL (replace if different)

### Step 4: Configure Port

1. Go to **Settings** → **Networking**
2. Set **Target port** to `3000` (Next.js default)

### Step 5: Update Backend CORS

After frontend is deployed, update backend CORS:

1. Go to backend service → **Variables**
2. Find `CORS_ORIGIN`
3. Update to your frontend URL:
   ```
   CORS_ORIGIN=https://your-frontend-service.railway.app
   ```

## Quick Test

While frontend is deploying, you can test the API:

- **Health Check:** `https://autohealer-production.up.railway.app/health`
- **API Root:** `https://autohealer-production.up.railway.app/api`
- **Metrics:** `https://autohealer-production.up.railway.app/metrics`

## After Frontend Deploys

1. You'll get a new URL like: `https://your-frontend-service.railway.app`
2. Visit that URL to see the UI
3. The frontend will connect to your backend API automatically

---

**TL;DR:** Create a new service, set root directory to `frontend`, add `NEXT_PUBLIC_API_BASE_URL`, and deploy! 🚀
