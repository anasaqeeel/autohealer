# 🚂 Railway Deployment Guide

## Quick Setup

### Step 1: Connect Repository
1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `autohealer` repository

### Step 2: Configure Service
Railway should auto-detect the root `Dockerfile` and `railway.json` config.

**If it doesn't work:**
1. Go to service settings
2. Set **Root Directory** to: `/` (root)
3. Set **Dockerfile Path** to: `Dockerfile` (or `backend/Dockerfile`)

### Step 3: Add Environment Variables

Go to **Variables** tab and add:

```env
NODE_ENV=production
PORT=3001
DB_HOST=${{MySQL.HOSTNAME}}
DB_PORT=${{MySQL.PORT}}
DB_NAME=${{MySQL.DATABASE}}
DB_USER=${{MySQL.USER}}
DB_PASSWORD=${{MySQL.PASSWORD}}
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-domain.railway.app
REDIS_HOST=${{Redis.HOSTNAME}}
REDIS_PORT=${{Redis.PORT}}
```

### Step 4: Add MySQL Database

1. Click **+ New** → **Database** → **Add MySQL**
2. Railway will automatically create:
   - `MySQL.HOSTNAME`
   - `MySQL.PORT`
   - `MySQL.DATABASE`
   - `MySQL.USER`
   - `MySQL.PASSWORD`

These are automatically injected as environment variables!

### Step 5: Add Redis (Optional)

1. Click **+ New** → **Database** → **Add Redis**
2. Railway will create `Redis.HOSTNAME` and `Redis.PORT`

### Step 6: Deploy Frontend (Separate Service)

For the frontend, create a **new service**:

1. Click **+ New** → **GitHub Repo** → Select same repo
2. Set **Root Directory** to: `frontend`
3. Set **Dockerfile Path** to: `Dockerfile`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-service.railway.app/api
   ```

## Environment Variables Reference

### Backend Service
```env
NODE_ENV=production
PORT=3001
DB_HOST=${{MySQL.HOSTNAME}}
DB_PORT=${{MySQL.PORT}}
DB_NAME=${{MySQL.DATABASE}}
DB_USER=${{MySQL.USER}}
DB_PASSWORD=${{MySQL.PASSWORD}}
JWT_SECRET=generate-a-random-secret-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.railway.app
REDIS_HOST=${{Redis.HOSTNAME}}
REDIS_PORT=${{Redis.PORT}}
```

### Frontend Service
```env
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-backend.railway.app/api
```

## Generate JWT Secret

```bash
# Generate a secure random secret
openssl rand -base64 32
```

## After Deployment

### 1. Seed Database

```bash
# Connect to Railway service shell
railway run npm run seed

# Or use Railway CLI
railway connect
railway run --service backend npm run seed
```

### 2. Get Your URLs

- Backend: Check **Settings** → **Networking** → **Public Domain**
- Frontend: Check frontend service **Settings** → **Networking** → **Public Domain**

### 3. Update CORS

Update `CORS_ORIGIN` in backend variables to match your frontend URL.

## Troubleshooting

### Build Fails
- Check build logs in Railway dashboard
- Verify Dockerfile path is correct
- Make sure `railway.json` exists

### Database Connection Fails
- Verify MySQL service is running
- Check environment variables are set correctly
- Wait for MySQL to be ready (takes ~30 seconds)

### Frontend Can't Connect
- Check `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify backend is deployed and running
- Check CORS settings in backend

## Railway CLI (Optional)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Run commands
railway run npm run seed
```

---

**Your app will be live at:** `https://your-service.railway.app` 🚀
