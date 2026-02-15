# 🔐 TaskMaster Pro - All Credentials & Configuration

## 📋 Database Credentials

**Database Name:** `taskmaster_pro`  
**Database User:** `taskmaster_user`  
**Database Password:** `taskmaster_password`  
**Database Host:** `localhost`  
**Database Port:** `3306`

**MySQL Root Access:**
- On Linux, MySQL root might use `sudo` authentication (no password)
- Or you might need to use: `sudo mysql` instead of `mysql -u root -p`

---

## 🔑 Backend API Credentials

**Server Port:** `3001`  
**API Base URL:** `http://localhost:3001/api`  
**Health Check:** `http://localhost:3001/health`

**JWT Secret:** (Randomly generated in `.env` file)  
**JWT Expires In:** `7d` (7 days)

---

## 🌐 Frontend Credentials

**Frontend Port:** `3000`  
**Frontend URL:** `http://localhost:3000`  
**API Endpoint:** `http://localhost:3001/api` (configured in `.env.local`)

---

## 📝 Environment Variables Summary

### Backend (`.env` file)
```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=taskmaster_pro
DB_USER=taskmaster_user
DB_PASSWORD=taskmaster_password

JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:3000

REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (`.env.local` file)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

## 🚨 Important Security Notes

⚠️ **These are DEVELOPMENT credentials only!**

For production:
- Change all passwords
- Use strong, random JWT_SECRET
- Use environment-specific database credentials
- Never commit `.env` files to git

---

## 📍 File Locations

- Backend `.env`: `/home/anas/anas/dev-ops/taskmaster-pro/backend/.env`
- Frontend `.env.local`: `/home/anas/anas/dev-ops/taskmaster-pro/frontend/.env.local`
