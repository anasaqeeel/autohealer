# API Integration Guide

This document provides a detailed reference for integrating the TaskMaster Pro frontend with your backend API.

## Configuration

### Environment Variables

Set the API base URL in your `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

The frontend will automatically prepend this URL to all API requests and inject the Bearer token from the user's authentication context.

## API Response Format

All endpoints should return JSON responses in the following format:

### Success Response
```json
{
  "data": { /* actual data */ },
  "success": true
}
```

Or directly the data object:
```json
{
  "id": "123",
  "name": "Example"
}
```

### Error Response
```json
{
  "message": "Error description",
  "statusCode": 400,
  "errors": {
    "fieldName": "Field-specific error message"
  }
}
```

## Authentication

### Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "org_admin",
    "avatarUrl": "https://example.com/avatar.jpg"
  },
  "organizations": [
    {
      "id": "org-123",
      "name": "ACME Corp",
      "slug": "acme-corp",
      "environment": "production"
    }
  ]
}
```

### Get Current User (Optional)
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200):
{
  "user": { /* user object */ },
  "organizations": [ /* organizations array */ ],
  "currentOrganizationId": "org-123"
}
```

## Organizations

### List Organizations
```
GET /api/organizations
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": "org-123",
      "name": "ACME Corp",
      "slug": "acme-corp",
      "environment": "production"
    }
  ]
}
```

### Switch Organization
```
POST /api/organizations/switch
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "organizationId": "org-456"
}

Response (200):
{
  "data": { /* updated current organization */ }
}
```

## Projects

### List Projects
```
GET /api/projects
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": "proj-123",
      "organizationId": "org-123",
      "name": "Website Redesign",
      "description": "Complete website redesign project",
      "ownerId": "user-123",
      "owner": {
        "id": "user-123",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "status": "active",
      "taskCount": 15,
      "openTaskCount": 8,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-02-11T14:30:00Z"
    }
  ]
}
```

### Get Project Details
```
GET /api/projects/{projectId}
Authorization: Bearer {token}

Response (200):
{
  "data": { /* project object */ }
}
```

### Create Project
```
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "New Project",
  "description": "Optional description"
}

Response (201):
{
  "data": { /* created project object */ }
}
```

### Update Project
```
PATCH /api/projects/{projectId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "archived"
}

Response (200):
{
  "data": { /* updated project object */ }
}
```

## Tasks

### List Tasks in Project
```
GET /api/projects/{projectId}/tasks
Authorization: Bearer {token}

Response (200):
{
  "data": [
    {
      "id": "task-123",
      "projectId": "proj-123",
      "title": "Fix login bug",
      "description": "Users unable to login on mobile",
      "status": "in_progress",
      "priority": "high",
      "assigneeId": "user-456",
      "assignee": {
        "id": "user-456",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "dueDate": "2024-02-20T00:00:00Z",
      "commentCount": 3,
      "createdAt": "2024-02-01T10:00:00Z",
      "updatedAt": "2024-02-11T14:30:00Z"
    }
  ]
}
```

### Get All Tasks with Filters
```
GET /api/tasks?assignedTo=me&status=in_progress&priority=high&dueDate=next_7_days
Authorization: Bearer {token}

Query Parameters:
- assignedTo: "me" | userId
- status: "todo" | "in_progress" | "done"
- priority: "low" | "medium" | "high"
- projectId: project ID
- dueDate: "overdue" | "today" | "next_7_days" | "next_30_days"

Response (200):
{
  "data": [ /* array of task objects */ ]
}
```

### Get Task Details with Comments
```
GET /api/tasks/{taskId}
Authorization: Bearer {token}

Response (200):
{
  "data": {
    "id": "task-123",
    "projectId": "proj-123",
    "title": "Fix login bug",
    "description": "Users unable to login on mobile",
    "status": "in_progress",
    "priority": "high",
    "assigneeId": "user-456",
    "assignee": { /* user object */ },
    "dueDate": "2024-02-20T00:00:00Z",
    "commentCount": 3,
    "comments": [
      {
        "id": "comment-1",
        "taskId": "task-123",
        "authorId": "user-123",
        "author": { /* user object */ },
        "content": "This is critical for mobile users",
        "createdAt": "2024-02-10T15:00:00Z",
        "updatedAt": "2024-02-10T15:00:00Z"
      }
    ],
    "createdAt": "2024-02-01T10:00:00Z",
    "updatedAt": "2024-02-11T14:30:00Z"
  }
}
```

### Create Task in Project
```
POST /api/projects/{projectId}/tasks
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "New task title",
  "description": "Task description",
  "priority": "medium",
  "assigneeId": "user-456",
  "dueDate": "2024-02-20T00:00:00Z"
}

Response (201):
{
  "data": { /* created task object */ }
}
```

### Update Task
```
PATCH /api/tasks/{taskId}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "Updated title",
  "status": "done",
  "priority": "high",
  "assigneeId": "user-789",
  "dueDate": "2024-02-25T00:00:00Z"
}

Response (200):
{
  "data": { /* updated task object */ }
}
```

### Delete Task
```
DELETE /api/tasks/{taskId}
Authorization: Bearer {token}

Response (204): No content
```

## Comments

### Add Comment to Task
```
POST /api/tasks/{taskId}/comments
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "content": "Comment text"
}

Response (201):
{
  "data": {
    "id": "comment-123",
    "taskId": "task-123",
    "authorId": "user-123",
    "author": { /* user object */ },
    "content": "Comment text",
    "createdAt": "2024-02-11T15:00:00Z",
    "updatedAt": "2024-02-11T15:00:00Z"
  }
}
```

## Activity

### Get Recent Activity
```
GET /api/activity/recent?limit=20
Authorization: Bearer {token}

Query Parameters:
- limit: Number of activities to return (default: 10, max: 100)

Response (200):
{
  "data": [
    {
      "id": "activity-1",
      "organizationId": "org-123",
      "userId": "user-123",
      "user": { /* user object */ },
      "type": "task_status_changed",
      "entityType": "task",
      "entityId": "task-123",
      "entityName": "Fix login bug",
      "description": "changed status of Fix login bug",
      "metadata": {
        "oldStatus": "todo",
        "newStatus": "in_progress"
      },
      "createdAt": "2024-02-11T14:30:00Z"
    }
  ]
}
```

### Get Activity with Pagination
```
GET /api/activity?page=1&limit=20
Authorization: Bearer {token}

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 20)

Response (200):
{
  "data": [ /* array of activity objects */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

## Dashboard

### Get Dashboard Summary
```
GET /api/dashboard/summary
Authorization: Bearer {token}

Response (200):
{
  "data": {
    "totalProjects": 5,
    "activeProjects": 4,
    "totalTasks": 42,
    "openTasks": 18,
    "openTasksAssignedToMe": 6,
    "recentActivity": [
      { /* activity event objects */ }
    ]
  }
}
```

## Error Handling

The frontend expects standard HTTP status codes:

- **200 OK** - Successful GET/POST/PATCH/PUT
- **201 Created** - Successful resource creation
- **204 No Content** - Successful DELETE
- **400 Bad Request** - Validation error
- **401 Unauthorized** - Invalid or missing token
- **403 Forbidden** - User lacks permission
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Error responses should include:
```json
{
  "message": "Human-readable error message",
  "statusCode": 400,
  "errors": {
    "fieldName": "Specific field error"
  }
}
```

## Token Management

- The frontend stores JWT tokens in localStorage
- All authenticated requests include: `Authorization: Bearer {token}`
- Tokens should be validated and renewed as needed on the backend
- Expired tokens should return 401 Unauthorized

## Rate Limiting

Consider implementing rate limiting on the backend:
- General endpoints: 60 requests/minute per user
- Authentication endpoints: 5 requests/minute per IP
- Include rate limit headers in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## CORS Configuration

Configure CORS to allow requests from the frontend domain:
```
Access-Control-Allow-Origin: https://taskmaster.example.com
Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Testing the API

You can test API integration with curl or Postman:

```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"demo123"}'

# Get projects
curl -X GET http://localhost:3001/api/projects \
  -H "Authorization: Bearer {token}"
```

## Notes for Backend Implementation

1. **Multi-tenancy:** All endpoints (except login) should filter data by the user's organization
2. **Authorization:** Implement proper RBAC - only org_admins can manage organizations
3. **Soft deletes:** Consider soft-deleting instead of hard deletes for audit trails
4. **Timestamps:** Use ISO 8601 format for all dates
5. **Pagination:** Implement consistent pagination with page/limit query params
6. **Caching:** Frontend uses React Query for caching - consider Cache-Control headers
7. **Real-time:** Consider WebSocket support for real-time updates (future enhancement)
