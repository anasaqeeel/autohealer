# 🔧 Railway Database Connection Fix

## The Problem

Your app is trying to connect to `mysql.railway.internal` which doesn't exist.

**Error:** `getaddrinfo ENOTFOUND mysql.railway.internal`

## The Solution

Your `DB_HOST` variable is set incorrectly. Railway provides MySQL connection via `MYSQLHOST` variable.

## Fix Your DB_HOST Variable

Go to your service → **Variables** → Find `DB_HOST` → **Edit it**:

### Change FROM:
```
DB_HOST=mysql.railway.internal
```
or
```
DB_HOST=mysql
```

### Change TO:
```
DB_HOST=${{MYSQLHOST}}
```

**OR** if `${{MYSQLHOST}}` doesn't work, check what value `MYSQLHOST` actually has and use that directly.

## Alternative: Use MYSQL_URL

Railway also provides `MYSQL_URL` which is a complete connection string. You could use that instead, but it requires code changes.

## Quick Fix Steps

1. Go to **Variables** tab
2. Find `DB_HOST`
3. Click **Edit**
4. Change value to: `${{MYSQLHOST}}`
5. **Save**
6. Railway will auto-redeploy

## Verify MySQL Variables

Make sure you have these in your **Shared Variables**:
- ✅ `MYSQLHOST` - The MySQL hostname
- ✅ `MYSQLPORT` - The MySQL port
- ✅ `MYSQL_DATABASE` - Database name
- ✅ `MYSQLUSER` - Username
- ✅ `MYSQLPASSWORD` - Password

## After Fixing

1. Wait for redeploy
2. Check logs - should see: `✅ Database connection established successfully.`
3. Then seed database: `railway run npm run seed`

---

**The issue is just the DB_HOST value - fix that and it should work!** 🚀
