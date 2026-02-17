# 🗄️ Access Railway MySQL Database

## Quick Access Methods

### Method 1: Railway CLI (Easiest)

**Install Railway CLI:**
```bash
npm i -g @railway/cli
railway login
```

**Link to your project:**
```bash
railway link
# Select your project
```

**Access MySQL:**
```bash
# Get MySQL connection details
railway variables

# Connect to MySQL
railway run mysql -u ${{MYSQLUSER}} -p${{MYSQLPASSWORD}} -h ${{MYSQLHOST}} -P ${{MYSQLPORT}} ${{MYSQL_DATABASE}}

# Or run queries directly
railway run mysql -u ${{MYSQLUSER}} -p${{MYSQLPASSWORD}} -h ${{MYSQLHOST}} -P ${{MYSQLPORT}} ${{MYSQL_DATABASE}} -e "SELECT * FROM users;"
```

### Method 2: Railway Dashboard MySQL Query Tool

1. Go to your **MySQL service** in Railway
2. Click **"Query"** or **"Connect"** tab
3. Run SQL queries directly in the web interface

### Method 3: External MySQL Client

**Get connection details from Railway:**

1. Go to MySQL service → **Variables**
2. Note these values:
   - `MYSQLHOST` - Database host
   - `MYSQLPORT` - Database port (usually 3306)
   - `MYSQL_DATABASE` - Database name
   - `MYSQLUSER` - Username
   - `MYSQLPASSWORD` - Password
   - `MYSQL_PUBLIC_URL` - Full connection string

**Connect using MySQL client:**

```bash
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQL_DATABASE>
```

**Or use the public URL:**
```bash
mysql <MYSQL_PUBLIC_URL>
```

---

## Useful Database Queries

### View All Users

```sql
SELECT id, email, name, role, createdAt FROM users;
```

### View Users with Organizations

```sql
SELECT 
  u.email,
  u.name,
  u.role,
  o.name as organization_name
FROM users u
LEFT JOIN organization_members om ON u.id = om.userId
LEFT JOIN organizations o ON om.organizationId = o.id;
```

### View All Tables

```sql
SHOW TABLES;
```

### View Table Structure

```sql
DESCRIBE users;
DESCRIBE organizations;
DESCRIBE projects;
DESCRIBE tasks;
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
SELECT 'tasks', COUNT(*) FROM tasks;
```

---

## Seed Database on Railway

**Run seed script to create test users:**

```bash
railway run --service backend npm run seed
```

This creates:
- Admin: `admin@taskmaster.com` / `admin123`
- Member: `member@taskmaster.com` / `member123`

---

## Export Database

**Export all data:**

```bash
railway run mysqldump -u ${{MYSQLUSER}} -p${{MYSQLPASSWORD}} -h ${{MYSQLHOST}} -P ${{MYSQLPORT}} ${{MYSQL_DATABASE}} > backup.sql
```

---

**That's it! You can now access and query your Railway database!** 🎉
