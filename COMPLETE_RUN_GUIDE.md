# 🚀 Complete Run Guide - TaskMaster Pro

This guide will help you get **everything** running from scratch.

---

## 📋 Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js installed (`node --version` should show v18+)
- ✅ npm installed (`npm --version`)
- ✅ MySQL installed and running
- ✅ Git installed

---

## 🔐 Step 1: Set Up Database

### Option A: Automated Script (Try This First)

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run setup-db
```

**If you see "Enter password:" prompt:**
- On Linux, MySQL root usually uses `sudo` authentication
- The script will try `sudo mysql` first (no password needed)
- If that fails, it will try `mysql -u root -p` (you'll enter your MySQL root password)

### Option B: Manual Setup (If Script Fails)

**Open a terminal and run:**

```bash
sudo mysql
```

**Then paste these SQL commands:**

```sql
CREATE DATABASE taskmaster_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskmaster_user'@'localhost' IDENTIFIED BY 'taskmaster_password';
GRANT ALL PRIVILEGES ON taskmaster_pro.* TO 'taskmaster_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Verify it worked:**

```bash
mysql -u taskmaster_user -p taskmaster_pro
# Enter password: taskmaster_password
# You should see: mysql> prompt
# Type: EXIT;
```

---

## 🔧 Step 2: Configure Backend

### 2.1 Check Environment File

The `.env` file should already exist. Verify it:

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
cat .env
```

**You should see:**
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskmaster_pro
DB_USER=taskmaster_user
DB_PASSWORD=taskmaster_password
JWT_SECRET=dev-secret-key-change-in-production-...
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

**If `.env` doesn't exist or is wrong, create it:**

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
cat > .env << 'EOF'
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskmaster_pro
DB_USER=taskmaster_user
DB_PASSWORD=taskmaster_password

JWT_SECRET=dev-secret-key-change-in-production-12345
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000

REDIS_HOST=localhost
REDIS_PORT=6379
EOF
```

### 2.2 Install Backend Dependencies

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm install
```

---

## 🚀 Step 3: Start Backend Server

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run dev
```

**What you should see:**
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 TaskMaster Pro backend running on port 3001
📊 Health check: http://localhost:3001/health
🌍 Environment: development
```

**✅ Success!** Your backend is running.

**Keep this terminal open!** The server needs to keep running.

---

## 🧪 Step 4: Test Backend

**Open a NEW terminal** (keep the backend running in the first one) and test:

```bash
curl http://localhost:3001/health
```

**You should see:**
```json
{
  "status": "ok",
  "timestamp": "2024-02-15T...",
  "uptime": 1.234,
  "environment": "development"
}
```

**Or open in browser:** `http://localhost:3001/health`

---

## 🎨 Step 5: Configure Frontend

### 5.1 Create Frontend Environment File

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/frontend
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api" > .env.local
```

### 5.2 Install Frontend Dependencies

**Check if you have pnpm or npm:**

```bash
which pnpm
```

**If pnpm exists, use it (project uses pnpm):**
```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/frontend
pnpm install
```

**If pnpm doesn't exist, use npm:**
```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/frontend
npm install
```

---

## 🚀 Step 6: Start Frontend

**Open a NEW terminal** (keep backend running) and run:

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/frontend

# If you used pnpm:
pnpm dev

# OR if you used npm:
npm run dev
```

**What you should see:**
```
  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - ready started server on 0.0.0.0:3000
```

**✅ Success!** Your frontend is running.

---

## 🌐 Step 7: Open the Application

**Open your browser and go to:**

```
http://localhost:3000
```

**You should see:**
- The TaskMaster Pro login page
- Beautiful UI (from v0.dev)

**Note:** The login won't work yet because we haven't implemented authentication endpoints. But the UI should load!

---

## 📊 Quick Status Check

You should now have **3 terminals running**:

1. **Terminal 1:** Backend server (`npm run dev` in `backend/`)
   - Should show: `🚀 TaskMaster Pro backend running on port 3001`

2. **Terminal 2:** Frontend server (`pnpm dev` or `npm run dev` in `frontend/`)
   - Should show: `ready started server on 0.0.0.0:3000`

3. **Terminal 3:** (Optional) For running commands

**Test both:**
- Backend: `http://localhost:3001/health` ✅
- Frontend: `http://localhost:3000` ✅

---

## 🛑 How to Stop Everything

**To stop the servers:**

1. Go to each terminal running a server
2. Press `Ctrl + C`
3. Repeat for each server

---

## 🔄 Quick Restart Commands

**Backend:**
```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run dev
```

**Frontend:**
```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/frontend
pnpm dev  # or npm run dev
```

---

## ❌ Troubleshooting

### Backend won't start

**Error: "Unable to connect to the database"**
- Check if MySQL is running: `sudo systemctl status mysql`
- Start MySQL: `sudo systemctl start mysql`
- Verify database exists: `mysql -u taskmaster_user -p taskmaster_pro`
- Check `.env` file has correct credentials

**Error: "Port 3001 already in use"**
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill
# Or change PORT in backend/.env
```

### Frontend won't start

**Error: "Port 3000 already in use"**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill
```

**Error: "Module not found"**
```bash
cd frontend
rm -rf node_modules
pnpm install  # or npm install
```

### Database connection issues

**Test database connection manually:**
```bash
mysql -u taskmaster_user -p taskmaster_pro
# Password: taskmaster_password
# If this works, database is fine
```

**Check if tables were created:**
```bash
mysql -u taskmaster_user -p taskmaster_pro -e "SHOW TABLES;"
# Should show: users, organizations, projects, tasks, etc.
```

---

## 📝 All Credentials Summary

**Database:**
- Name: `taskmaster_pro`
- User: `taskmaster_user`
- Password: `taskmaster_password`
- Host: `localhost`
- Port: `3306`

**Backend:**
- URL: `http://localhost:3001`
- Health: `http://localhost:3001/health`
- API: `http://localhost:3001/api`

**Frontend:**
- URL: `http://localhost:3000`

---

## ✅ What's Working Now

- ✅ Database created and connected
- ✅ Backend server running
- ✅ Frontend UI loading
- ✅ Health check endpoint working

## ⏭️ What's Next

1. **Implement authentication** (`/api/auth/login`, `/api/auth/register`)
2. **Implement CRUD endpoints** (organizations, projects, tasks)
3. **Connect frontend to backend** (test full flow)
4. **Dockerize everything**
5. **Add monitoring** (Prometheus, Grafana)

---

## 🎯 Quick Reference

**Start Backend:**
```bash
cd backend && npm run dev
```

**Start Frontend:**
```bash
cd frontend && pnpm dev
```

**Test Backend:**
```bash
curl http://localhost:3001/health
```

**Test Frontend:**
Open `http://localhost:3000` in browser

---

**You're all set! 🚀**

If you encounter any issues, check the error messages carefully and refer to the troubleshooting section above.
