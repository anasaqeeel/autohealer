# 🔧 Fix Frontend Port Mismatch

## The Problem

Your Next.js app is running on port **8080**, but Railway is routing traffic to port **3000**, causing 502 errors.

**Logs show:**
```
- Local:         http://87632ff5faf9:8080
- Network:       http://87632ff5faf9:8080
✓ Ready in 94ms
```

But Railway settings show:
- **Target port:** `3000` ❌

## The Solution

### Option 1: Change Railway Port (Easiest)

1. Go to your frontend service → **Settings** → **Networking**
2. Find **"Target port"** (currently `3000`)
3. Change it to **`8080`**
4. **Save**

Railway will now route traffic to port 8080 where Next.js is actually running.

### Option 2: Make Next.js Use PORT Environment Variable

If you want to use port 3000, we need to update the Dockerfile to respect Railway's PORT variable. But Option 1 is easier!

## Why This Happens

Railway sets the `PORT` environment variable (usually 8080), and Next.js standalone mode uses it. But your Railway target port was set to 3000, causing a mismatch.

## After Fixing

1. Railway will update routing
2. Visit your URL - should work!
3. Check logs - should see successful requests

---

**Quick fix: Change target port from 3000 to 8080 in Railway settings!** 🔧
