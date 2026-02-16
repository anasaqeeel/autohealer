# 🔐 Railway Environment Variables - CORRECTED

Based on your Railway setup, here are the **CORRECT** variables to add:

## Variables You Need to Add (Service-Specific)

Go to your **service** (not shared variables) → **Variables** tab:

```
NODE_ENV=production
```

```
PORT=3001
```

```
DB_HOST=${{MYSQLHOST}}
```

```
DB_PORT=${{MYSQLPORT}}
```

```
DB_NAME=${{MYSQL_DATABASE}}
```

```
DB_USER=${{MYSQLUSER}}
```

```
DB_PASSWORD=${{MYSQLPASSWORD}}
```

```
JWT_SECRET=taskmaster-prod-secret-change-this-12345
```

```
JWT_EXPIRES_IN=7d
```

```
CORS_ORIGIN=*
```

---

## Quick Copy-Paste (All at Once)

```
NODE_ENV=production
PORT=3001
DB_HOST=${{MYSQLHOST}}
DB_PORT=${{MYSQLPORT}}
DB_NAME=${{MYSQL_DATABASE}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
JWT_SECRET=taskmaster-prod-secret-change-this-12345
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

---

## Important Notes

1. **Shared Variables vs Service Variables:**
   - The MySQL variables (MYSQLHOST, MYSQLPORT, etc.) are in **Shared Variables** (you already have them)
   - Add the other variables (NODE_ENV, PORT, etc.) to your **SERVICE variables** (not shared)

2. **Reference Format:**
   - Use `${{MYSQLHOST}}` to reference shared variables
   - Railway will automatically inject the values

3. **After Adding:**
   - Railway should auto-redeploy
   - Check build logs to verify it works
   - Then seed the database

---

**The TypeScript errors are now fixed! Redeploy should work.** 🚀
