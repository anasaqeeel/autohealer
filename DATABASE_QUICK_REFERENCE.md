# 🗄️ Database Quick Reference

## 🔐 Database Credentials

```
Database: taskmaster_pro
User:     taskmaster_user
Password: taskmaster_password
Host:     localhost
Port:     3306
```

---

## 📋 Quick Commands

### View Database Tables
```bash
cd backend
npm run view-db
```

### Create Test Users & Data
```bash
cd backend
npm run seed
```

### Connect to MySQL Directly
```bash
mysql -u taskmaster_user -p taskmaster_pro
# Password: taskmaster_password
```

### View Tables (One-Liner)
```bash
mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro -e "SHOW TABLES;"
```

### View Users Table
```bash
mysql -u taskmaster_user -ptaskmaster_password taskmaster_pro -e "SELECT * FROM users;"
```

---

## 📊 All Tables

1. `users` - System users
2. `organizations` - Multi-tenant organizations  
3. `organization_members` - User-org relationships
4. `projects` - Projects
5. `tasks` - Tasks
6. `comments` - Task comments
7. `activities` - Activity log

---

## 🔑 Test Login Credentials (After Seeding)

**Admin:**
- Email: `admin@taskmaster.com`
- Password: `admin123`

**Member:**
- Email: `member@taskmaster.com`
- Password: `member123`

---

## 💡 Common Queries

```sql
-- Show all tables
SHOW TABLES;

-- View table structure
DESCRIBE users;

-- View all users
SELECT * FROM users;

-- View all tasks
SELECT * FROM tasks;

-- Count records
SELECT COUNT(*) FROM users;
```

---

**See `LOGIN_CREDENTIALS.md` for full details!**
