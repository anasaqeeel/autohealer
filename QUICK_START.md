# ⚡ Quick Start - TaskMaster Pro

## 🔐 All Credentials (Copy-Paste Ready)

**Database:**
- Database: `taskmaster_pro`
- User: `taskmaster_user`
- Password: `taskmaster_password`

**Backend:** `http://localhost:3001`  
**Frontend:** `http://localhost:3000`

---

## 🚀 3-Step Setup

### Step 1: Set Up Database

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run setup-db
```

**If it asks for password:** The script will try `sudo mysql` first (no password). If that fails, it will ask for MySQL root password.

**If script fails, do this manually:**
```bash
sudo mysql
```
Then paste:
```sql
CREATE DATABASE taskmaster_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'taskmaster_user'@'localhost' IDENTIFIED BY 'taskmaster_password';
GRANT ALL PRIVILEGES ON taskmaster_pro.* TO 'taskmaster_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 2: Start Backend

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run dev
```

**Keep this terminal open!** You should see:
```
✅ Database connection established successfully.
🚀 TaskMaster Pro backend running on port 3001
```

### Step 3: Start Frontend

**Open a NEW terminal:**

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/frontend
pnpm install  # or: npm install
pnpm dev      # or: npm run dev
```

**Open browser:** `http://localhost:3000`

---

## ✅ Test It Works

**Backend health check:**
```bash
curl http://localhost:3001/health
```

**Or open in browser:** `http://localhost:3001/health`

---

## 📚 Full Guides

- **Complete Run Guide:** `COMPLETE_RUN_GUIDE.md`
- **All Credentials:** `CREDENTIALS.md`
- **Troubleshooting:** See `COMPLETE_RUN_GUIDE.md`

---

**That's it! 🎉**
