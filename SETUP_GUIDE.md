# 🚀 TaskMaster Pro - Complete Setup Guide

## What We've Built So Far

### ✅ Project Structure
```
taskmaster-pro/
├── frontend/          # Next.js 14 + React + TypeScript UI (from v0.dev)
├── backend/           # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── models/    # Sequelize models (User, Organization, Project, Task, etc.)
│   │   └── server.ts  # Main server file
│   └── scripts/       # Database setup script
└── .git/             # Git repository initialized
```

### ✅ What's Ready
1. **Frontend**: Complete Next.js UI (from v0.dev) - ready to connect to backend
2. **Backend**: Express server with TypeScript, database models, health endpoint
3. **Database Models**: All Sequelize models created (User, Organization, Project, Task, Comment, Activity)
4. **Configuration**: Environment variables, TypeScript config, package.json scripts

### ⏳ What's Next
1. **Set up MySQL database** (you need to do this step)
2. **Test backend connection**
3. **Implement authentication endpoints**
4. **Connect frontend to backend**

---

## Step-by-Step Setup Instructions

### Step 1: Set Up MySQL Database

**You have two options:**

#### Option A: Use the Automated Script (Easiest)

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run setup-db
```

When prompted, enter your MySQL root password.

**What this does:**
- Creates database `taskmaster_pro`
- Creates user `taskmaster_user` with password `taskmaster_password`
- Grants all necessary permissions

#### Option B: Manual Setup (If script doesn't work)

1. **Log into MySQL as root:**
   ```bash
   mysql -u root -p
   ```

2. **Run these SQL commands:**
   ```sql
   CREATE DATABASE taskmaster_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'taskmaster_user'@'localhost' IDENTIFIED BY 'taskmaster_password';
   GRANT ALL PRIVILEGES ON taskmaster_pro.* TO 'taskmaster_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Verify it worked:**
   ```bash
   mysql -u taskmaster_user -p taskmaster_pro
   # Enter password: taskmaster_password
   # You should see: mysql> prompt
   # Type: EXIT;
   ```

---

### Step 2: Test Backend Server

1. **Navigate to backend directory:**
   ```bash
   cd /home/anas/anas/dev-ops/taskmaster-pro/backend
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **What should happen:**
   - Server connects to MySQL ✅
   - Creates all database tables automatically ✅
   - Starts listening on `http://localhost:3001` ✅
   - You'll see: `🚀 TaskMaster Pro backend running on port 3001`

4. **Test the health endpoint:**
   Open a new terminal and run:
   ```bash
   curl http://localhost:3001/health
   ```
   
   Or open in browser: `http://localhost:3001/health`
   
   You should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-02-15T...",
     "uptime": 1.234,
     "environment": "development"
   }
   ```

---

### Step 3: Test Frontend (Optional - Can Do Later)

1. **Navigate to frontend directory:**
   ```bash
   cd /home/anas/anas/dev-ops/taskmaster-pro/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # OR if you're using pnpm (which the project seems to use):
   pnpm install
   ```

3. **Create `.env.local` file:**
   ```bash
   echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api" > .env.local
   ```

4. **Start frontend:**
   ```bash
   npm run dev
   # OR
   pnpm dev
   ```

5. **Open browser:**
   - Frontend: `http://localhost:3000`
   - It will try to connect to backend at `http://localhost:3001/api`
   - **Note**: Backend API endpoints aren't implemented yet, so you'll see errors - that's expected!

---

## Troubleshooting

### ❌ "Unable to connect to the database"

**Possible causes:**
1. MySQL is not running
   ```bash
   sudo systemctl status mysql
   sudo systemctl start mysql  # If not running
   ```

2. Database/user doesn't exist
   - Run the setup script again: `npm run setup-db`
   - Or manually create them (see Step 1, Option B)

3. Wrong credentials in `.env`
   - Check `backend/.env` file
   - Make sure `DB_USER`, `DB_PASSWORD`, `DB_NAME` match what you created

4. MySQL root password issue
   - If the script asks for password and fails, try manual setup (Option B)

### ❌ "Port 3001 already in use"

**Solution:**
```bash
# Find what's using port 3001
lsof -ti:3001

# Kill it
lsof -ti:3001 | xargs kill

# Or change PORT in backend/.env
```

### ❌ "Module not found" errors

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### ❌ TypeScript compilation errors

**Solution:**
```bash
cd backend
npm run build  # This will show you the errors
```

---

## What Each File Does (DevOps Learning)

### `backend/src/config/database.ts`
- **Purpose**: Configures Sequelize ORM to connect to MySQL
- **Why it matters**: This is your database connection pool - critical for production performance
- **DevOps note**: Connection pooling prevents database overload by reusing connections

### `backend/src/models/*.ts`
- **Purpose**: Define database tables and relationships
- **Why it matters**: These models represent your data structure
- **DevOps note**: Indexes on foreign keys (like `projectId`, `organizationId`) make queries fast

### `backend/src/server.ts`
- **Purpose**: Main Express server - handles HTTP requests
- **Why it matters**: This is your API entry point
- **DevOps note**: The `/health` endpoint is used by Kubernetes, load balancers, and monitoring tools

### `backend/scripts/setup-database.sh`
- **Purpose**: Automates database creation
- **Why it matters**: Automation = DevOps best practice
- **DevOps note**: This script can be run in CI/CD pipelines to set up test databases

---

## Next Steps (After Database is Working)

Once your backend is running and you can hit `/health` successfully:

1. **Implement Authentication** (`/api/auth/login`, `/api/auth/register`)
2. **Implement Organization endpoints** (`/api/organizations`)
3. **Implement Project endpoints** (`/api/projects`)
4. **Implement Task endpoints** (`/api/tasks`)
5. **Connect frontend to backend** (test the full flow)
6. **Dockerize everything** (Dockerfile + docker-compose)
7. **Add monitoring** (Prometheus + Grafana)
8. **Set up CI/CD** (GitHub Actions)

---

## Quick Reference

### Backend Commands
```bash
cd backend
npm run dev          # Start dev server
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run setup-db      # Set up MySQL database
```

### Frontend Commands
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
```

### Database Commands
```bash
# Connect to database
mysql -u taskmaster_user -p taskmaster_pro
# Password: taskmaster_password

# Show tables
SHOW TABLES;

# Check a table structure
DESCRIBE users;
```

---

## 🎯 Your Goal: DevOps Portfolio

Remember: This project is about **demonstrating DevOps skills**, not building the perfect app.

**What interviewers want to see:**
- ✅ Can you set up infrastructure? (Database, servers, containers)
- ✅ Can you monitor systems? (Logs, metrics, dashboards)
- ✅ Can you handle incidents? (Health checks, error handling, recovery)
- ✅ Can you automate? (Scripts, CI/CD, deployments)

**The app is just the "patient" - the real value is in the infrastructure!** 🚀

---

## Questions?

If you get stuck:
1. Check the error message carefully
2. Check if MySQL is running
3. Verify database credentials in `.env`
4. Check the `backend/README.md` for more details

Good luck! 🎉
