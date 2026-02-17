# 🔧 Fix Manually Created User in Database

## The Problem

You created a user manually in the Railway database UI, but **passwords need to be hashed with bcrypt** for login to work. Manual creation doesn't hash passwords, so login fails.

## The Solution

### Option 1: Use Signup API (Recommended)

**Don't create users manually!** Use the signup form or API:

1. **Via Frontend UI:**
   - Go to `/signup` page
   - Fill in the form
   - Submit - password will be automatically hashed

2. **Via API:**
```bash
curl -X POST https://autohealer-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Option 2: Delete Manual User and Recreate

1. **Delete the manual user** from Railway database UI
2. **Create via signup** (password will be hashed correctly)

### Option 3: Hash Password Manually (Advanced)

If you want to keep the manual user, you need to hash the password:

**Using Node.js:**
```bash
# Connect to Railway backend
railway run --service backend node

# Then in Node.js REPL:
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
# Copy the hash and update the user in database
```

**Or use this script:**
```bash
railway run --service backend node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('your-password', 10).then(hash => {
  console.log('Hashed password:', hash);
});
"
```

Then update the user's password field in Railway database UI with the hash.

---

## Why Manual Creation Doesn't Work

1. **Password Hashing:** Passwords must be hashed with bcrypt (10 rounds)
2. **Organization:** Users need to be linked to an organization via `organization_members` table
3. **Role:** Should be `member` or `org_admin`, not `me`

---

## Quick Fix Steps

1. **Delete the manual user** from Railway database
2. **Use signup form** at: `https://autohealer-production-b5d6.up.railway.app/signup`
3. **Fill in:**
   - Name: Test User
   - Email: a@gmail.com (or different email)
   - Password: your-password
4. **Submit** - User will be created correctly with:
   - ✅ Hashed password
   - ✅ Organization created automatically
   - ✅ User linked to organization
   - ✅ Correct role

---

## Verify User Creation

After signup, check database:

```sql
-- View users
SELECT id, email, name, role FROM users;

-- View user organizations
SELECT u.email, o.name as org_name, om.role 
FROM users u
JOIN organization_members om ON u.id = om.userId
JOIN organizations o ON om.organizationId = o.id;
```

---

**TL;DR: Delete manual user, use signup form instead!** 🔧
