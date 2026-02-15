'use client'

import type { Task } from '@/lib/types'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TaskDetailDialog } from '@/components/tasks/task-detail-dialog'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface ProjectBoardProps {
  tasks: Task[]
  projectId: string
}

const STATUSES = [
  { key: 'todo', label: 'To Do', color: 'bg-slate-100 dark:bg-slate-800' },
  {
    key: 'in_progress',
    label: 'In Progress',
    color: 'bg-blue-100 dark:bg-blue-900',
  },
  { key: 'done', label: 'Done', color: 'bg-green-100 dark:bg-green-900' },
]

export function ProjectBoard({ tasks, projectId }: ProjectBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
      case 'low':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const tasksByStatus = (status: string) =>
    tasks.filter((t) => t.status === (status === 'in_progress' ? 'in_progress' : status))

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STATUSES.map((status) => (
          <div key={status.key}>
            {/* Column Header */}
            <div className="mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {status.label}
                <Badge variant="secondary">{tasksByStatus(status.key).length}</Badge>
              </h3>
            </div>

            {/* Column Cards */}
            <div className="space-y-3">
              {tasksByStatus(status.key).length === 0 ? (
                <div
                  className={`rounded-lg p-8 text-center border-2 border-dashed ${status.color}`}
                >
                  <p className="text-sm text-muted-foreground">No tasks yet</p>
                </div>
              ) : (
                tasksByStatus(status.key).map((task) => (
                  <Card
                    key={task.id}
                    className="p-4 border-border cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="space-y-3">
                      {/* Title */}
                      <h4 className="font-medium text-foreground text-sm line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2">
                        {/* Priority & Due Date */}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Assignee */}
                        {task.assignee && (
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                              {getInitials(task.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => {
            if (!open) setSelectedTask(null)
          }}
        />
      )}
    </>
  )
}
