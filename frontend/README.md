# TaskMaster Pro

A production-quality frontend SaaS application for project management and task tracking, designed for DevOps and SRE teams.

## Overview

TaskMaster Pro is a modern, professional B2B SaaS application built with Next.js 14, React 18, and TypeScript. It provides a comprehensive project management experience with multi-tenant support, role-based access control, and real-time collaboration features.

**Key Features:**
- Multi-tenant organization support with role-based access control
- Project management with customizable kanban boards
- Comprehensive task management with status tracking and priorities
- Real-time activity feed and notifications
- User-friendly dashboard with key metrics
- Organization and team management
- API key management for backend integrations
- Dark mode support
- Responsive design for desktop, tablet, and mobile

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component Library:** shadcn/ui
- **State Management:** React Query (TanStack Query) for server state
- **HTTP Client:** Native Fetch API with custom wrapper
- **Authentication:** React Context for token management
- **Theme:** next-themes for dark mode support
- **UI Enhancements:** Sonner for toasts, date-fns for date formatting

### Architecture
- **Authentication:** JWT token-based with localStorage persistence
- **API Layer:** REST API with configurable base URL via environment variables
- **Data Fetching:** React Query hooks for server state management
- **Routing:** Next.js App Router with protected routes
- **State:** React Context for auth and UI state

## Project Structure

```
app/
├── page.tsx                          # Home page redirects to dashboard
├── layout.tsx                        # Root layout with providers
├── globals.css                       # Global styles with design tokens
├── providers.tsx                     # Provider setup (Query, Theme, Auth)
├── (auth)/
│   └── login/
│       └── page.tsx                 # Login page
└── (authenticated)/
    ├── layout.tsx                   # Protected routes layout with app shell
    ├── dashboard/
    │   └── page.tsx                 # Dashboard overview
    ├── projects/
    │   ├── page.tsx                 # Projects list
    │   └── [projectId]/
    │       └── page.tsx             # Project detail with kanban board
    ├── tasks/
    │   └── page.tsx                 # Global tasks with filters
    ├── activity/
    │   └── page.tsx                 # Activity feed
    └── settings/
        └── page.tsx                 # Settings with tabs

components/
├── layout/
│   ├── sidebar.tsx                  # Left navigation sidebar
│   └── topbar.tsx                   # Top navigation bar
├── dashboard/
│   ├── stats.tsx                    # Dashboard stats cards
│   ├── activity-feed.tsx            # Recent activity on dashboard
│   └── quick-start.tsx              # Quick start widget
├── projects/
│   ├── projects-list.tsx            # Projects grid view
│   ├── project-board.tsx            # Kanban board for tasks
│   └── create-project-dialog.tsx    # Create project modal
├── tasks/
│   ├── tasks-table.tsx              # Tasks data table
│   ├── tasks-filters.tsx            # Filter controls
│   ├── create-task-dialog.tsx       # Create task modal
│   └── task-detail-dialog.tsx       # Task detail panel
├── activity/
│   └── activity-feed.tsx            # Activity feed component
├── settings/
│   ├── profile.tsx                  # Profile settings
│   ├── organization.tsx             # Organization management
│   └── api-keys.tsx                 # API keys management
└── ui/                              # shadcn/ui components

lib/
├── api-client.ts                    # API client wrapper
├── auth-context.tsx                 # Authentication context
├── hooks.ts                         # React Query hooks
└── types.ts                         # TypeScript type definitions
```

## Environment Configuration

### Required Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

The frontend assumes the backend API is available at the configured base URL. All API requests will automatically include the Bearer token from the auth context.

## Authentication Flow

1. **Login:** User enters credentials on `/login` page
2. **Token Storage:** JWT token stored in localStorage and React Context
3. **Auto-login:** On page load, app checks localStorage for existing token
4. **Route Protection:** Authenticated routes redirect to `/login` if not authenticated
5. **Logout:** Clears token and user data from both localStorage and context

## API Contract

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user info

### Organizations
- `GET /api/organizations` - List user's organizations
- `POST /api/organizations/switch` - Switch current organization

### Projects
- `GET /api/projects` - List projects in current org
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PATCH /api/projects/:id` - Update project

### Tasks
- `GET /api/projects/:id/tasks` - List tasks in project
- `POST /api/projects/:id/tasks` - Create task in project
- `GET /api/tasks` - List all tasks with filters (assignedTo, status, priority, dueDate)
- `GET /api/tasks/:id` - Get task details with comments
- `PATCH /api/tasks/:id` - Update task
- `POST /api/tasks/:id/comments` - Add comment to task

### Activity
- `GET /api/activity/recent` - Get recent activity
- `GET /api/activity` - Get activity with pagination

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard metrics

## Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
# Create .env.local with NEXT_PUBLIC_API_BASE_URL
```

### Development

```bash
# Start development server
pnpm dev

# Open browser to http://localhost:3000
# Use demo credentials to login:
# Email: demo@example.com
# Password: demo123
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# The app will be optimized and ready for deployment
```

## Design System

### Colors
The app uses a modern blue-based color palette optimized for both light and dark modes:
- **Primary:** Blue (#3B82F6) for main actions and highlights
- **Accent:** Light gray for secondary elements
- **Neutral:** Dark gray to white for backgrounds and text
- **Status Colors:** Green (done), Blue (in progress), Slate (todo), Red (high priority)

### Typography
- **Sans-serif:** Geist font for all text
- **Headings:** Bold weights for visual hierarchy
- **Body:** Regular weight with proper line heights for readability

### Spacing & Layout
- Uses Tailwind's spacing scale for consistent spacing
- Flexbox-based layouts for flexibility and responsiveness
- CSS Grid for complex 2D layouts

### Components
- Uses shadcn/ui for consistent, accessible components
- Custom styling via Tailwind CSS
- Semantic HTML for accessibility

## Key Features

### Dashboard
- Real-time metrics (projects, tasks, assignments)
- Recent activity feed with user actions
- Quick start guide with common actions

### Project Management
- Create and organize projects
- Kanban board view with drag-and-drop (prepared for future enhancement)
- Project details and task overview

### Task Management
- Create tasks with title, description, and priority
- Change task status (To Do, In Progress, Done)
- Assign tasks to team members
- Filter tasks by status, priority, due date
- Add comments and collaborate

### Organization
- Multi-tenant support with organization switching
- Team member management
- Role-based access (org_admin, member)
- Invite team members

### Settings
- Profile management (name, email, password)
- Organization settings
- API key management for integrations

## State Management

### Server State (React Query)
- Manages data fetched from the backend API
- Automatic caching and revalidation
- Mutation functions for create/update/delete operations

### Client State (React Context)
- Authentication context for user and token
- Theme context for dark mode
- UI state for modals and dialogs

## Error Handling

- API errors are caught and displayed to users via toasts
- Loading states for async operations
- Fallback UI for error states
- Proper error messages for user guidance

## Performance Optimizations

- Image optimization through Next.js
- Code splitting via React Suspense and lazy loading
- Efficient React Query caching strategies
- Debounced API calls for filters and search
- Skeleton loaders for better perceived performance

## Security

- JWT token-based authentication
- Secure token storage in localStorage
- HTTPS-ready deployment
- CORS-compatible API client
- Input validation on forms

## Deployment

The application is optimized for deployment to Vercel or any Node.js-compatible hosting:

```bash
# Build for production
pnpm build

# The build output is in .next/
# Deploy to Vercel, Docker, or any Node.js host

# Docker deployment example:
# FROM node:18-alpine
# WORKDIR /app
# COPY . .
# RUN pnpm install && pnpm build
# EXPOSE 3000
# CMD ["pnpm", "start"]
```

## Configuration for DevOps/Kubernetes

The application is designed to work seamlessly in containerized environments:

- **No local filesystem access:** All data comes from the backend API
- **Environment-based configuration:** API base URL via NEXT_PUBLIC_API_BASE_URL
- **Health checks:** Returns proper HTTP status codes
- **Standard Node.js app:** Works with standard Node.js hosting

Example Kubernetes deployment:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taskmaster-pro-frontend
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: app
        image: taskmaster-pro:latest
        env:
        - name: NEXT_PUBLIC_API_BASE_URL
          value: "https://api.taskmaster.example.com"
        ports:
        - containerPort: 3000
        livenessProbe:
          httpGet:
            path: /
            port: 3000
```

## Contributing

This is a frontend-only client for the TaskMaster Pro backend. Contributions should follow:

1. Use TypeScript for all new code
2. Follow the existing component structure
3. Use React Query hooks for API data
4. Maintain Tailwind CSS for styling
5. Test on multiple screen sizes

## License

Proprietary - TaskMaster Pro
