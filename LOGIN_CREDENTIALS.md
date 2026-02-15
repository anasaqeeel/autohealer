# 🔐 Login Credentials & Database Access

## 📝 Application Login Credentials

**⚠️ IMPORTANT:** Authentication endpoints are not yet implemented, so you can't actually login yet. But we can create test users in the database!

### Test Users (After Running Seed Script)

Once you run the database seed script (`npm run seed`), you'll have these test users:

#### Admin User
- **Email:** `admin@taskmaster.com`
- **Password:** `admin123`
- **Role:** `org_admin`
- **Organization:** ACME Corp

#### Member User
- **Email:** `member@taskmaster.com`
- **Password:** `member123`
- **Role:** `member`
- **Organization:** ACME Corp

---

## 🗄️ Database Access

### Database Credentials
- **Database Name:** `taskmaster_pro`
- **Database User:** `taskmaster_user`
- **Database Password:** `taskmaster_password`
- **Host:** `localhost`
- **Port:** `3306`

---

## 👀 How to View Your Database & Tables

### Method 1: Using the View Script (Easiest)

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run view-db
```

This will show:
- All tables in the database
- Structure of each table (columns, types, etc.)

### Method 2: Direct MySQL Commands

**Connect to MySQL:**
```bash
mysql -u taskmaster_user -p taskmaster_pro
# Enter password: taskmaster_password
```

**Once connected, you can run:**

```sql
-- Show all tables
SHOW TABLES;

-- View structure of a specific table
DESCRIBE users;
DESCRIBE organizations;
DESCRIBE projects;
DESCRIBE tasks;

-- View data in a table
SELECT * FROM users;
SELECT * FROM organizations;
SELECT * FROM projects;
SELECT * FROM tasks;

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM tasks;

-- Exit MySQL
EXIT;
```

### Method 3: Quick One-Liners (Without Entering MySQL)

```bash
# Show all tables
mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro -e "SHOW TABLES;"

# View users table
mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro -e "SELECT * FROM users;"

# View all data in tasks table
mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro -e "SELECT * FROM tasks;"

# Count records in each table
mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro -e "SELECT 'users' as table_name, COUNT(*) as count FROM users UNION SELECT 'organizations', COUNT(*) FROM organizations UNION SELECT 'projects', COUNT(*) FROM projects UNION SELECT 'tasks', COUNT(*) FROM tasks;"
```

---

## 🌱 Create Test Users (Seed Database)

To create test users and sample data:

```bash
cd /home/anas/anas/dev-ops/taskmaster-pro/backend
npm run seed
```

**This will create:**
- ✅ Test organization (ACME Corp)
- ✅ Admin user (admin@taskmaster.com / admin123)
- ✅ Member user (member@taskmaster.com / member123)
- ✅ Sample project (Website Redesign)
- ✅ Sample tasks (3 tasks with different statuses)

---

## 📊 Database Tables Overview

Your database has these tables:

1. **users** - System users
   - id, email, password (hashed), name, role, avatarUrl

2. **organizations** - Multi-tenant organizations
   - id, name, slug, environment

3. **organization_members** - User-Organization relationships
   - id, userId, organizationId, role

4. **projects** - Projects within organizations
   - id, organizationId, name, description, ownerId, status

5. **tasks** - Tasks within projects
   - id, projectId, title, description, status, priority, assigneeId, dueDate

6. **comments** - Comments on tasks
   - id, taskId, authorId, content

7. **activities** - Activity/audit log
   - id, organizationId, userId, type, entityType, entityId, description, metadata

---

## 🔍 Useful Database Queries

### View All Users
```sql
SELECT id, email, name, role, createdAt FROM users;
```

### View All Organizations
```sql
SELECT * FROM organizations;
```

### View Projects with Owner Info
```sql
SELECT p.*, u.name as owner_name, u.email as owner_email 
FROM projects p 
LEFT JOIN users u ON p.ownerId = u.id;
```

### View Tasks with Assignee Info
```sql
SELECT t.*, u.name as assignee_name, u.email as assignee_email
FROM tasks t
LEFT JOIN users u ON t.assigneeId = u.id;
```

### View Tasks by Status
```sql
SELECT status, COUNT(*) as count 
FROM tasks 
GROUP BY status;
```

### View Recent Activities
```sql
SELECT * FROM activities 
ORDER BY createdAt DESC 
LIMIT 10;
```

---

## 🚨 Troubleshooting

### "Access denied" when connecting to MySQL

**Check if database exists:**
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

**If database doesn't exist, run setup:**
```bash
cd backend
npm run setup-db
```

### "Table doesn't exist"

**Tables are created automatically when you start the backend server:**
```bash
cd backend
npm run dev
```

The server will create all tables on first run.

### "Can't see any data"

**Run the seed script to create test data:**
```bash
cd backend
npm run seed
```

---

## 📚 Next Steps

1. ✅ **View database:** `npm run view-db`
2. ✅ **Create test users:** `npm run seed`
3. ⏭️ **Implement authentication endpoints** (so you can actually login)
4. ⏭️ **Test login flow** with the test users

---

**Remember:** The login credentials above are for **after** you run the seed script and **after** we implement the authentication endpoints! 🚀
