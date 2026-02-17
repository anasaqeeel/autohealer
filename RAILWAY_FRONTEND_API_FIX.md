# 🔧 Fix "Failed to fetch" Error on Signup

## The Problem

The frontend is getting "Failed to fetch" when trying to signup. This means the frontend can't reach the backend API.

## The Solution

The frontend needs to know where the backend API is. You need to set the `NEXT_PUBLIC_API_BASE_URL` environment variable.

### Step 1: Get Your Backend URL

Your backend is at: `https://autohealer-production.up.railway.app`

### Step 2: Set Frontend Environment Variable

1. Go to your **frontend service** in Railway
2. Click **"Variables"** tab
3. Add or update this variable:

```
NEXT_PUBLIC_API_BASE_URL=https://autohealer-production.up.railway.app/api
```

**Important:** Make sure it includes `/api` at the end!

### Step 3: Update Backend CORS

1. Go to your **backend service** in Railway
2. Click **"Variables"** tab
3. Find `CORS_ORIGIN` variable
4. Update it to:

```
CORS_ORIGIN=https://autohealer-production-b5d6.up.railway.app
```

This allows your frontend to make requests to the backend.

### Step 4: Redeploy

After setting the variables:
1. Railway will auto-redeploy both services
2. Wait for deployment to complete
3. Try signup again

---

## Verify It's Working

After redeploying, check:

1. **Frontend logs** - Should show successful API calls
2. **Backend logs** - Should show incoming requests from frontend
3. **Browser console** - Should not show CORS errors

---

## Quick Checklist

- [ ] `NEXT_PUBLIC_API_BASE_URL` is set in frontend service
- [ ] Value is: `https://autohealer-production.up.railway.app/api`
- [ ] `CORS_ORIGIN` is set in backend service  
- [ ] Value is: `https://autohealer-production-b5d6.up.railway.app`
- [ ] Both services redeployed
- [ ] Try signup again

---

**The issue is missing API URL configuration!** 🔧
