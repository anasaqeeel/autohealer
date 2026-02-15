# Quick Start - TaskMaster Pro Testing

## Get Started in 3 Steps

### Step 1: Create Environment File
Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Make sure it contains:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Step 2: Start the Mock API Server
In one terminal, run the mock API server:

```bash
node scripts/mock-server.js
```

You'll see:
```
✓ Mock API server running at http://localhost:3001

Test Credentials:
  Email: admin@taskmaster.dev
  Password: admin123

  Email: user@taskmaster.dev
  Password: user123

  Email: devops@taskmaster.dev
  Password: devops123
```

### Step 3: Start the Frontend
In another terminal, run the Next.js dev server:

```bash
npm run dev
```

Open http://localhost:3000 and you'll be redirected to login.

## Login Credentials

**Use any of these to test:**

| Email | Password | Role | Org |
|-------|----------|------|-----|
| `admin@taskmaster.dev` | `admin123` | Admin | ACME Corp |
| `user@taskmaster.dev` | `user123` | Member | ACME Corp |
| `devops@taskmaster.dev` | `devops123` | Admin | TechCorp |

## What to Test

After logging in, explore:

1. **Dashboard** - Overview of your work
2. **Projects** - View and create projects
3. **Tasks** - See all tasks, create new ones
4. **Activity Feed** - Track all changes
5. **Settings** - Manage profile and organization
6. **Organization Switcher** - Switch between orgs (if admin user)

## Mock Data

The mock server includes:
- 3 test users with different organizations
- 3 sample projects with tasks in various states
- 7 sample tasks with comments
- Complete project and organization structure

## When Ready to Use Real Backend

1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to your backend URL
2. Stop the mock server
3. Ensure your backend implements the API contract in `API_INTEGRATION.md`
4. Restart the dev server

## Troubleshooting

**Login fails:**
- Check email matches exactly (admin@taskmaster.dev)
- Make sure mock server is running on port 3001
- Check browser console for error details

**Can't see projects:**
- Make sure you're logged in
- Mock server returns different projects per organization
- Try switching organizations in the sidebar

**Port already in use:**
- Mock server: `PORT=3002 node scripts/mock-server.js`
- Frontend: `PORT=3001 npm run dev`

## Next Steps

Once you're comfortable with the frontend:
1. Review `API_INTEGRATION.md` for all endpoint specs
2. Build your backend API matching the contract
3. Test with real data
4. Deploy to production
