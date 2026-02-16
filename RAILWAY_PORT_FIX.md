# 🔧 Railway Port Configuration Fix

## The Problem

Your backend is running on port 3001, but Railway is trying to route traffic to port 8080, causing 502 errors.

## The Solution

You have **two options**:

### Option 1: Update Railway Port (Recommended)

1. Go to your service → **Settings** → **Networking**
2. Find **"Custom port"** or **"Target port"**
3. Change it from `8080` to `3001`
4. Save

This tells Railway to route traffic to port 3001 where your backend is listening.

### Option 2: Update PORT Variable

1. Go to your service → **Variables**
2. Find `PORT`
3. Change it from `3001` to `8080`
4. Save

This makes your backend listen on port 8080, matching Railway's configuration.

## Which One to Choose?

- **Option 1** is easier (just change Railway config)
- **Option 2** is better if you want to use Railway's default port (8080)

## After Fixing

1. Railway will auto-redeploy
2. Check logs - should see: `🚀 TaskMaster Pro backend running on 0.0.0.0:3001` (or 8080)
3. Visit your live link - should work!

---

**I've also updated the code to listen on `0.0.0.0` (all interfaces) which is required for Docker/Railway.** ✅
