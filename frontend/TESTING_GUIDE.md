# Testing Guide - TaskMaster Pro Frontend

This guide provides test credentials and instructions for testing the TaskMaster Pro frontend without a full backend implementation.

## Quick Start - Test Credentials

Use these credentials to test the login flow:

### Test User Accounts

**Admin User**
- Email: `admin@taskmaster.dev`
- Password: `admin123`
- Role: org_admin
- Organization: ACME Corp (production)

**Team Member**
- Email: `user@taskmaster.dev`
- Password: `user123`
- Role: member
- Organization: ACME Corp (production)

**DevOps Team Lead**
- Email: `devops@taskmaster.dev`
- Password: `devops123`
- Role: org_admin
- Organization: TechCorp (staging)

## Option 1: Using Mock Backend (Easiest)

Create a mock API server for testing. This allows you to test the entire frontend without building the backend.

### Step 1: Create Mock Server File

Create `/vercel/share/v0-project/scripts/mock-server.js`:

```javascript
const http = require('http');
const url = require('url');

// Mock data
const users = {
  'admin@taskmaster.dev': {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@taskmaster.dev',
    role: 'org_admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  'user@taskmaster.dev': {
    id: 'user-2',
    name: 'John Developer',
    email: 'user@taskmaster.dev',
    role: 'member',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
  },
  'devops@taskmaster.dev': {
    id: 'user-3',
    name: 'Sarah DevOps',
    email: 'devops@taskmaster.dev',
    role: 'org_admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devops'
  }
};

const organizations = {
  'user-1': [
    {
      id: 'org-1',
      name: 'ACME Corp',
      slug: 'acme-corp',
      environment: 'production'
    },
    {
      id: 'org-2',
      name: 'Startup Inc',
      slug: 'startup-inc',
      environment: 'staging'
    }
  ],
  'user-2': [
    {
      id: 'org-1',
      name: 'ACME Corp',
      slug: 'acme-corp',
      environment: 'production'
    }
  ],
  'user-3': [
    {
      id: 'org-3',
      name: 'TechCorp',
      slug: 'techcorp',
      environment: 'staging'
    }
  ]
};

const projects = {
  'org-1': [
    {
      id: 'proj-1',
      organizationId: 'org-1',
      name: 'Website Redesign',
      description: 'Complete website redesign project',
      ownerId: 'user-1',
      owner: users['admin@taskmaster.dev'],
      status: 'in_progress',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      taskCount: 12,
      completedTaskCount: 5
    },
    {
      id: 'proj-2',
      organizationId: 'org-1',
      name: 'API Migration',
      description: 'Migrate to new API infrastructure',
      ownerId: 'user-2',
      owner: users['user@taskmaster.dev'],
      status: 'todo',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      taskCount: 8,
      completedTaskCount: 0
    },
    {
      id: 'proj-3',
      organizationId: 'org-1',
      name: 'Performance Optimization',
      description: 'Optimize application performance',
      ownerId: 'user-1',
      owner: users['admin@taskmaster.dev'],
      status: 'done',
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      taskCount: 15,
      completedTaskCount: 15
    }
  ],
  'org-3': [
    {
      id: 'proj-4',
      organizationId: 'org-3',
      name: 'Infrastructure as Code',
      description: 'Implement IaC with Terraform',
      ownerId: 'user-3',
      owner: users['devops@taskmaster.dev'],
      status: 'in_progress',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      taskCount: 10,
      completedTaskCount: 6
    }
  ]
};

const tasks = {
  'proj-1': [
    {
      id: 'task-1',
      projectId: 'proj-1',
      title: 'Design new homepage mockup',
      description: 'Create mockup for new homepage design',
      status: 'done',
      priority: 'high',
      assigneeId: 'user-2',
      assignee: users['user@taskmaster.dev'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: users['admin@taskmaster.dev'],
      comments: []
    },
    {
      id: 'task-2',
      projectId: 'proj-1',
      title: 'Implement responsive layout',
      description: 'Ensure homepage is fully responsive',
      status: 'in_progress',
      priority: 'high',
      assigneeId: 'user-2',
      assignee: users['user@taskmaster.dev'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: users['admin@taskmaster.dev'],
      comments: [
        {
          id: 'comment-1',
          userId: 'user-2',
          user: users['user@taskmaster.dev'],
          text: 'Started work on mobile version',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'task-3',
      projectId: 'proj-1',
      title: 'SEO optimization',
      description: 'Improve SEO for better search rankings',
      status: 'todo',
      priority: 'medium',
      assigneeId: null,
      assignee: null,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: users['admin@taskmaster.dev'],
      comments: []
    }
  ],
  'proj-2': [
    {
      id: 'task-4',
      projectId: 'proj-2',
      title: 'Plan migration strategy',
      description: 'Document complete migration plan',
      status: 'todo',
      priority: 'high',
      assigneeId: 'user-2',
      assignee: users['user@taskmaster.dev'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: users['user@taskmaster.dev'],
      comments: []
    }
  ]
};

// Tokens (simple JWT-like format for testing)
const tokens = {
  'admin@taskmaster.dev': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin@taskmaster.dev.mock',
  'user@taskmaster.dev': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user@taskmaster.dev.mock',
  'devops@taskmaster.dev': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.devops@taskmaster.dev.mock'
};

// Helper function to parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

// Create server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`[Mock API] ${req.method} ${pathname}`);

  try {
    // POST /api/auth/login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const user = users[body.email];

      if (!user) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: { message: 'Invalid credentials' } }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
          token: tokens[body.email],
          user,
          organizations: organizations[user.id]
        }
      }));
      return;
    }

    // GET /api/auth/me
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const auth = req.headers.authorization;
      const token = auth?.replace('Bearer ', '');
      
      const emailMatch = token?.split('.')[1];
      const user = emailMatch ? users[emailMatch] : null;

      if (!user) {
        res.writeHead(401);
        res.end(JSON.stringify({ success: false, error: { message: 'Unauthorized' } }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: {
          user,
          organizations: organizations[user.id],
          currentOrganizationId: organizations[user.id][0].id
        }
      }));
      return;
    }

    // GET /api/projects
    if (pathname === '/api/projects' && req.method === 'GET') {
      const org = parsedUrl.query.organizationId || 'org-1';
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: projects[org] || []
      }));
      return;
    }

    // GET /api/projects/:projectId
    if (pathname.match(/^\/api\/projects\/[^\/]+$/) && req.method === 'GET') {
      const projectId = pathname.split('/').pop();
      const project = Object.values(projects).flat().find(p => p.id === projectId);

      if (!project) {
        res.writeHead(404);
        res.end(JSON.stringify({ success: false, error: { message: 'Project not found' } }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: project
      }));
      return;
    }

    // GET /api/tasks
    if (pathname === '/api/tasks' && req.method === 'GET') {
      const projectId = parsedUrl.query.projectId;
      const allTasks = projectId ? tasks[projectId] || [] : Object.values(tasks).flat();

      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: allTasks
      }));
      return;
    }

    // Default 404
    res.writeHead(404);
    res.end(JSON.stringify({ success: false, error: { message: 'Endpoint not found' } }));
  } catch (error) {
    console.error('[Mock API] Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ success: false, error: { message: 'Server error' } }));
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
  console.log('\nTest Credentials:');
  console.log('  Email: admin@taskmaster.dev, Password: admin123');
  console.log('  Email: user@taskmaster.dev, Password: user123');
  console.log('  Email: devops@taskmaster.dev, Password: devops123');
});
```

### Step 2: Start the Mock Server

In a separate terminal:

```bash
# Install Node.js if needed, then run:
node scripts/mock-server.js

# Or with npm scripts, update your package.json:
# "scripts": {
#   "dev": "next dev",
#   "mock-api": "node scripts/mock-server.js",
#   "dev:full": "concurrently 'npm run dev' 'npm run mock-api'"
# }

# Then run:
npm run dev:full
```

### Step 3: Configure Frontend

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Step 4: Login and Test

1. Open http://localhost:3000 in your browser
2. You'll be redirected to login
3. Enter credentials:
   - Email: `admin@taskmaster.dev`
   - Password: `admin123`
4. Explore the dashboard, projects, and tasks

## Option 2: Connect to Real Backend

When you're ready to connect to your real backend:

1. Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to your backend URL
2. Ensure your backend implements all endpoints from `API_INTEGRATION.md`
3. Create test user accounts matching the schema

## Testing Checklist

- [ ] Login with test credentials
- [ ] View dashboard with stats and activity
- [ ] List projects and create a new project
- [ ] View project detail with kanban board
- [ ] Create and edit tasks
- [ ] Filter tasks by status/priority
- [ ] View global task list
- [ ] Check activity feed
- [ ] Switch organizations
- [ ] Access settings pages
- [ ] Logout and session persistence

## Troubleshooting

**"Cannot POST /api/auth/login" error:**
- Make sure mock server is running on port 3001
- Check that `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001` is set

**CORS errors:**
- Mock server includes CORS headers
- Real backend needs proper CORS configuration

**Login doesn't work:**
- Check email matches exactly: `admin@taskmaster.dev`
- Password is: `admin123`
- Check browser console for exact error message
