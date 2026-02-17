# 🔍 Debug Login Issue

## The Problem

You created a user via signup (it's in the database), but login is failing with "Invalid email or password".

## Quick Checks

### 1. Check Browser Console

Open your browser's Developer Tools (F12) → Console tab, then try to login. You should see logs like:

```
[API] Making request to: https://autohealer-production.up.railway.app/api/auth/login
[API] Response status: 401
[Auth] Login failed: Invalid email or password
```

**What to look for:**
- ❌ **"Failed to fetch"** = API URL is wrong or CORS issue
- ❌ **"Network error"** = Backend is down or unreachable
- ✅ **401 status** = Password is wrong (password comparison issue)
- ✅ **200 status** = Login should work!

### 2. Verify Environment Variables

**Frontend Service:**
- Go to frontend service → **Variables**
- Check `NEXT_PUBLIC_API_BASE_URL` = `https://autohealer-production.up.railway.app/api`

**Backend Service:**
- Go to backend service → **Variables**
- Check `CORS_ORIGIN` = `https://autohealer-production-b5d6.up.railway.app`

### 3. Test API Directly

Try logging in via curl to see if backend works:

```bash
curl -X POST https://autohealer-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "a@gmail.com",
    "password": "YOUR_PASSWORD_HERE"
  }'
```

**If this works:** Frontend issue  
**If this fails:** Backend issue

### 4. Check Backend Logs

Go to backend service → **Logs** → Look for:
- Login attempts
- Password comparison errors
- Database connection issues

---

## Common Issues & Fixes

### Issue 1: "Failed to fetch" Error

**Cause:** API URL not configured or CORS blocking

**Fix:**
1. Set `NEXT_PUBLIC_API_BASE_URL` in frontend variables
2. Set `CORS_ORIGIN` in backend variables
3. Redeploy both services

### Issue 2: Password Doesn't Match

**Cause:** Password was hashed incorrectly during signup

**Fix:** Try creating a new user with a different password, or reset the password

### Issue 3: User Has No Organization

**Cause:** User was created but not added to an organization

**Fix:** The signup endpoint should create an organization automatically. Check backend logs.

---

## Debug Steps

1. **Open browser console** (F12)
2. **Try to login**
3. **Check console logs** - Look for `[API]` and `[Auth]` logs
4. **Share the logs** - This will help identify the exact issue

---

## Quick Test

After Railway redeploys with the new logging:

1. Open browser console (F12)
2. Go to signup page
3. Create a new test user
4. Try to login with that user
5. Check console for detailed logs
6. Share the console output

---

**The new logging will help us see exactly what's happening!** 🔍
