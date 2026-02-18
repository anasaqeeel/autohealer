'use client'

import { useState } from 'react'
import { useProject, useProjectTasks, useCreateTask } from '@/lib/hooks'
import { ProjectBoard } from '@/components/projects/project-board'
import { CreateTaskDialog } from '@/components/tasks/create-task-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [showCreateTask, setShowCreateTask] = useState(false)

  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId)
  const { mutate: createTask, isPending: isCreating } = useCreateTask()

  const handleCreateTask = async (data: {
    title: string
    description?: string
    priority?: string
    assigneeId?: string
  }) => {
    // Auto-assign to current user if not specified
    await createTask({ 
      projectId, 
      ...data,
      assigneeId: data.assigneeId || 'me' // Will be resolved to current user ID on backend
    } as any)
    setShowCreateTask(false)
  }

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-12 w-full mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Project not found
          </h1>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-full mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-1">{project.description}</p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          <Button onClick={() => setShowCreateTask(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Kanban Board */}
        {tasksLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <ProjectBoard tasks={tasks} projectId={projectId} />
        )}
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={showCreateTask}
        onOpenChange={setShowCreateTask}
        onSubmit={handleCreateTask}
        isLoading={isCreating}
      />
    </div>
  )
}
