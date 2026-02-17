import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  apiGet,
  apiPost,
  apiPatch,
  apiDelete,
} from './api-client'
import type {
  DashboardSummary,
  Project,
  Task,
  Comment,
  ActivityEvent,
  TaskFilters,
  TaskWithComments,
} from './types'

const QUERY_KEYS = {
  dashboard: () => ['dashboard'],
  projects: () => ['projects'],
  project: (id: string) => ['projects', id],
  projectTasks: (projectId: string) => ['projects', projectId, 'tasks'],
  tasks: (filters?: TaskFilters) => ['tasks', filters],
  task: (id: string) => ['tasks', id],
  taskComments: (taskId: string) => ['tasks', taskId, 'comments'],
  activity: () => ['activity'],
  activityRecent: (limit?: number) => ['activity', 'recent', limit],
}

// Dashboard hooks
export function useDashboardSummary(organizationId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard(),
    queryFn: async () => {
      const response = await apiGet<DashboardSummary>(
        '/dashboard/summary'
      )
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Projects hooks
export function useProjects(organizationId?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projects(),
    queryFn: async () => {
      const response = await apiGet<Project[]>('/projects')
      if (!response.success) throw new Error(response.error?.message)
      return response.data || []
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.project(projectId),
    queryFn: async () => {
      const response = await apiGet<Project>(`/projects/${projectId}`)
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!projectId,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Project>) => {
      const response = await apiPost<Project>('/projects', data)
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects() })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Project> & { id: string }) => {
      const response = await apiPatch<Project>(`/projects/${id}`, data)
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.project(data.id),
        })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects() })
      }
    },
  })
}

// Tasks hooks
export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.projectTasks(projectId),
    queryFn: async () => {
      const response = await apiGet<Task[]>(`/projects/${projectId}/tasks`)
      if (!response.success) throw new Error(response.error?.message)
      return response.data || []
    },
    staleTime: 1000 * 60 * 2,
    enabled: !!projectId,
  })
}

export function useTasks(filters?: TaskFilters) {
  const params = new URLSearchParams()
  if (filters?.status) params.append('status', filters.status)
  if (filters?.priority) params.append('priority', filters.priority)
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo)
  if (filters?.projectId) params.append('projectId', filters.projectId)
  if (filters?.dueDate) params.append('dueDate', filters.dueDate)

  return useQuery({
    queryKey: QUERY_KEYS.tasks(filters),
    queryFn: async () => {
      const queryString = params.toString()
      const endpoint = `/tasks${queryString ? '?' + queryString : ''}`
      const response = await apiGet<Task[]>(endpoint)
      if (!response.success) throw new Error(response.error?.message)
      return response.data || []
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.task(taskId),
    queryFn: async () => {
      const response = await apiGet<TaskWithComments>(`/tasks/${taskId}`)
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    staleTime: 1000 * 60 * 2,
    enabled: !!taskId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Task> & { projectId: string }) => {
      const { projectId, ...taskData } = data
      const response = await apiPost<Task>(
        `/projects/${projectId}/tasks`,
        taskData
      )
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.projectId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.projectTasks(data.projectId),
        })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks() })
      }
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<Task> & { id: string }) => {
      const response = await apiPatch<Task>(`/tasks/${id}`, data)
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(data.id) })
        if (data.projectId) {
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.projectTasks(data.projectId),
          })
        }
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks() })
      }
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await apiDelete(`/tasks/${taskId}`)
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(taskId) })
      // Also invalidate project tasks if we know the project
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

// Comments hooks
export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.taskComments(taskId),
    queryFn: async () => {
      const response = await apiGet<Comment[]>(`/tasks/${taskId}/comments`)
      if (!response.success) throw new Error(response.error?.message)
      return response.data || []
    },
    staleTime: 1000 * 60,
    enabled: !!taskId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { taskId: string; content: string }) => {
      const { taskId, ...commentData } = data
      const response = await apiPost<Comment>(
        `/tasks/${taskId}/comments`,
        commentData
      )
      if (!response.success) throw new Error(response.error?.message)
      return response.data
    },
    onSuccess: (data) => {
      if (data?.taskId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.taskComments(data.taskId),
        })
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.task(data.taskId) })
      }
    },
  })
}

// Activity hooks
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: QUERY_KEYS.activityRecent(limit),
    queryFn: async () => {
      const response = await apiGet<ActivityEvent[]>(
        `/activity/recent?limit=${limit}`
      )
      if (!response.success) throw new Error(response.error?.message)
      return response.data || []
    },
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function useActivity(page?: number, limit?: number) {
  const params = new URLSearchParams()
  if (page) params.append('page', page.toString())
  if (limit) params.append('limit', limit.toString())

  return useQuery({
    queryKey: QUERY_KEYS.activity(),
    queryFn: async () => {
      const queryString = params.toString()
      const endpoint = `/activity${queryString ? '?' + queryString : ''}`
      const response = await apiGet<ActivityEvent[]>(endpoint)
      if (!response.success) throw new Error(response.error?.message)
      return response.data || []
    },
    staleTime: 1000 * 30,
  })
}
