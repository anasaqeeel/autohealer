# 🧪 Complete Testing Guide

## 🎯 Quick Start

### 1. Test Your Live Application

**Frontend URL:** `https://autohealer-production-b5d6.up.railway.app`  
**Backend API URL:** `https://autohealer-production.up.railway.app`

---

## 📝 User Signup & Authentication

### Option 1: Signup via Frontend UI (Easiest)

1. **Visit your frontend:** `https://autohealer-production-b5d6.up.railway.app`
2. **Click "Sign Up"** or navigate to signup page
3. **Fill in:**
   - Name: Your name
   - Email: your-email@example.com
   - Password: (at least 6 characters)
4. **Submit** - User will be created and saved to database!

### Option 2: Signup via API (Using curl/Postman)

**Signup Endpoint:**
```bash
curl -X POST https://autohealer-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "member"
    },
    "organizations": [...],
    "currentOrganizationId": "uuid-here"
  }
}
```

**Login Endpoint:**
```bash
curl -X POST https://autohealer-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 🗄️ View Users in Database

### Method 1: Using Railway CLI (Recommended for Production)

**Install Railway CLI:**
```bash
npm i -g @railway/cli
railway login
```

**Connect to your project:**
```bash
railway link
```

**Run MySQL commands:**
```bash
# Connect to MySQL
railway run mysql -u root -p

# Or run queries directly
railway run mysql -u root -p -e "SELECT * FROM users;"
railway run mysql -u root -p -e "SELECT id, email, name, role, createdAt FROM users;"
```

### Method 2: Using Railway Dashboard

1. Go to your **MySQL service** in Railway
2. Click **"Connect"** or **"Query"** tab
3. Run SQL queries:
```sql
-- View all users
SELECT id, email, name, role, createdAt FROM users;

-- View all organizations
SELECT * FROM organizations;

-- View user-organization relationships
SELECT u.email, u.name, o.name as org_name, om.role 
FROM users u
JOIN organization_members om ON u.id = om.userId
JOIN organizations o ON om.organizationId = o.id;

-- Count users
SELECT COUNT(*) as total_users FROM users;
```

### Method 3: Seed Database on Railway

**Seed the database with test users:**

```bash
# Connect to Railway
railway link

# Run seed script
railway run --service backend npm run seed
```

This creates:
- ✅ Admin user: `admin@taskmaster.com` / `admin123`
- ✅ Member user: `member@taskmaster.com` / `member123`
- ✅ Test organization: ACME Corp
- ✅ Sample projects and tasks

---

## 🧪 API Testing Examples

### Test Health Endpoint

```bash
curl https://autohealer-production.up.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-17T14:30:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### Test Metrics Endpoint

```bash
curl https://autohealer-production.up.railway.app/metrics
```

### Test API Root

```bash
curl https://autohealer-production.up.railway.app/
```

---

## 🔐 Test Authentication Flow

### 1. Register a New User

```bash
curl -X POST https://autohealer-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'
```

**Save the token from response!**

### 2. Login

```bash
curl -X POST https://autohealer-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

### 3. Get Current User (Protected Route)

```bash
# Replace YOUR_TOKEN with token from login response
curl -X GET https://autohealer-production.up.railway.app/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Database Queries (Useful Commands)

### View All Users

```sql
SELECT id, email, name, role, createdAt, updatedAt FROM users;
```

### View Users with Their Organizations

```sql
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  o.name as organization_name,
  om.role as org_role
FROM users u
LEFT JOIN organization_members om ON u.id = om.userId
LEFT JOIN organizations o ON om.organizationId = o.id;
```

### View All Organizations

```sql
SELECT * FROM organizations;
```

### View Projects

```sql
SELECT 
  p.id,
  p.name,
  p.status,
  o.name as organization_name,
  u.name as owner_name
FROM projects p
JOIN organizations o ON p.organizationId = o.id
LEFT JOIN users u ON p.ownerId = u.id;
```

### View Tasks

```sql
SELECT 
  t.id,
  t.title,
  t.status,
  t.priority,
  p.name as project_name,
  u.name as assignee_name
FROM tasks t
JOIN projects p ON t.projectId = p.id
LEFT JOIN users u ON t.assigneeId = u.id;
```

### Count Records

```sql
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'organizations', COUNT(*) FROM organizations
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'organization_members', COUNT(*) FROM organization_members;
```

---

## 🌐 Frontend Testing

### Test Frontend Locally

```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

### Test Frontend on Railway

Visit: `https://autohealer-production-b5d6.up.railway.app`

**What to test:**
1. ✅ Signup page - Create new user
2. ✅ Login page - Login with existing user
3. ✅ Dashboard - View projects/tasks
4. ✅ Create project
5. ✅ Create task
6. ✅ Update task status

---

## 🔍 Debugging Tips

### Check Backend Logs

**On Railway:**
1. Go to backend service → **Logs** tab
2. Filter by error: Look for red errors
3. Check HTTP logs: See API requests/responses

### Check Frontend Logs

**On Railway:**
1. Go to frontend service → **Logs** tab
2. Check for build errors
3. Check runtime errors

### Check Database Connection

```bash
# Test database connection
railway run --service backend node -e "
const { connectDatabase } = require('./dist/config/database');
connectDatabase().then(() => {
  console.log('✅ Database connected!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Database error:', err);
  process.exit(1);
});
"
```

---

## 📝 Quick Test Checklist

- [ ] Backend health endpoint works (`/health`)
- [ ] Backend metrics endpoint works (`/metrics`)
- [ ] Can register new user via API
- [ ] Can login with registered user
- [ ] Can access protected route with token
- [ ] Frontend loads without errors
- [ ] Can signup via frontend UI
- [ ] Can login via frontend UI
- [ ] Users are saved in database
- [ ] Can view users in database

---

## 🚀 Next Steps

1. **Test all API endpoints** - Try creating projects, tasks, etc.
2. **Test frontend features** - Use the UI to create/manage data
3. **Monitor logs** - Check Railway logs for any errors
4. **Check database** - Verify data is being saved correctly

---

**Happy Testing! 🎉**
