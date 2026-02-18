// Auth Types
export interface User {
  id: string
  name: string
  email: string
  role: 'org_admin' | 'member'
  avatarUrl?: string
}

export interface AuthResponse {
  token: string
  user: User
  organizations: Organization[]
}

export interface AuthLoginRequest {
  email: string
  password: string
}

// Organization Types
export interface Organization {
  id: string
  name: string
  slug: string
  avatarUrl?: string
  environment?: 'production' | 'staging' | 'development'
}

// Project Types
export interface Project {
  id: string
  organizationId: string
  name: string
  description?: string
  ownerId: string
  owner?: User
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
  taskCount?: number
  openTaskCount?: number
}

export interface ProjectSummary {
  id: string
  name: string
  taskCount: number
  openTaskCount: number
}

// Task Types
export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assigneeId?: string
  assignee?: User
  project?: { id: string; name: string }
  dueDate?: string
  createdAt: string
  updatedAt: string
  commentCount?: number
}

export interface TaskWithComments extends Task {
  comments: Comment[]
}

// Comment Types
export interface Comment {
  id: string
  taskId: string
  authorId: string
  author: User
  content: string
  createdAt: string
  updatedAt: string
}

// Activity Types
export interface ActivityEvent {
  id: string
  organizationId: string
  userId: string
  user: User
  type:
    | 'task_created'
    | 'task_updated'
    | 'task_status_changed'
    | 'comment_added'
    | 'project_created'
  entityType: 'task' | 'project' | 'comment'
  entityId: string
  entityName: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// Dashboard Types
export interface DashboardSummary {
  totalProjects: number
  activeProjects: number
  totalTasks: number
  openTasks: number
  openTasksAssignedToMe: number
  recentActivity: ActivityEvent[]
}

// Filter Types
export interface TaskFilters {
  status?: 'todo' | 'in_progress' | 'done'
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: 'me' | string
  projectId?: string
  dueDate?: 'overdue' | 'today' | 'next_7_days' | 'next_30_days'
}
