'use client'

import { useState } from 'react'
import type { Task } from '@/lib/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { TaskDetailDialog } from './task-detail-dialog'
import { formatDistanceToNow } from 'date-fns'

interface TasksTableProps {
  tasks: Task[]
}

export function TasksTable({ tasks }: TasksTableProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-400'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
      case 'done':
        return 'bg-green-500/10 text-green-700 dark:text-green-400'
      default:
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
    }
  }

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

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="font-semibold">Task</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Priority</TableHead>
              <TableHead className="font-semibold">Assignee</TableHead>
              <TableHead className="font-semibold">Due Date</TableHead>
              <TableHead className="font-semibold">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedTask(task)}
              >
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(task.status)}`}
                  >
                    {task.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getPriorityColor(task.priority)}`}
                  >
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(task.assignee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Unassigned</span>
                  )}
                </TableCell>
                <TableCell>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(task.updatedAt), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
