# 🔐 Railway Environment Variables - Copy & Paste Ready

## Step 1: Add MySQL Database First

In Railway dashboard:
1. Click **+ New** → **Database** → **Add MySQL**
2. Railway will automatically create these variables (you don't need to add them manually):
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_DATABASE`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`

## Step 2: Add These Environment Variables

Go to your service → **Variables** tab → Click **+ New Variable**

Copy and paste these **ONE BY ONE**:

```
NODE_ENV=production
```

```
PORT=3001
```

```
DB_HOST=${{MYSQL.HOSTNAME}}
```

```
DB_PORT=${{MYSQL.PORT}}
```

```
DB_NAME=${{MYSQL.DATABASE}}
```

```
DB_USER=${{MYSQL.USER}}
```

```
DB_PASSWORD=${{MYSQL.PASSWORD}}
```

```
JWT_SECRET=taskmaster-prod-secret-change-this-to-random-string-12345
```

```
JWT_EXPIRES_IN=7d
```

```
CORS_ORIGIN=https://your-frontend-url.railway.app
```

**Note:** Replace `your-frontend-url.railway.app` with your actual frontend URL after you deploy it.

---

## Generate Secure JWT Secret (Optional but Recommended)

Run this command to generate a secure random secret:

```bash
openssl rand -base64 32
```

Then use that as your `JWT_SECRET` value.

---

## Quick Copy-Paste (All at Once)

If Railway lets you paste multiple variables, use this format:

```
NODE_ENV=production
PORT=3001
DB_HOST=${{MYSQL.HOSTNAME}}
DB_PORT=${{MYSQL.PORT}}
DB_NAME=${{MYSQL.DATABASE}}
DB_USER=${{MYSQL.USER}}
DB_PASSWORD=${{MYSQL.PASSWORD}}
JWT_SECRET=taskmaster-prod-secret-change-this-to-random-string-12345
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend-url.railway.app
```

---

## After Adding Variables

1. **Redeploy** your service (Railway should auto-redeploy)
2. **Wait for deployment** to complete
3. **Check logs** to make sure it connected to database
4. **Seed database** (see below)

---

## Seed Database After Deployment

Once your backend is deployed and running:

1. Install Railway CLI (optional):
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. Link to your project:
   ```bash
   railway link
   ```

3. Run seed command:
   ```bash
   railway run --service autohealer npm run seed
   ```

   Or use Railway dashboard:
   - Go to your service
   - Click **Deployments** → **Latest deployment**
   - Click **Shell** tab
   - Run: `npm run seed`

---

## Verify It's Working

1. Check your service URL (Railway will give you one like `https://autohealer-production.up.railway.app`)
2. Test health endpoint: `https://your-url.railway.app/health`
3. Should return: `{"status":"ok",...}`

---

**That's it! Your backend should deploy successfully now.** 🚀
