'use client'

import { useState } from 'react'
import type { Task } from '@/lib/types'
import { useTask, useUpdateTask, useCreateComment } from '@/lib/hooks'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Calendar, AlertCircle } from 'lucide-react'

interface TaskDetailDialogProps {
  task: Task
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDetailDialog({
  task: initialTask,
  open,
  onOpenChange,
}: TaskDetailDialogProps) {
  const { data: task = initialTask } = useTask(initialTask.id)
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: createComment, isPending: isCommentPending } = useCreateComment()
  const [commentText, setCommentText] = useState('')
  const [newStatus, setNewStatus] = useState(task?.status || 'todo')
  const [newPriority, setNewPriority] = useState(task?.priority || 'medium')

  const handleStatusChange = (status: string) => {
    setNewStatus(status)
    updateTask({
      id: task.id,
      status: status as any,
    })
  }

  const handlePriorityChange = (priority: string) => {
    setNewPriority(priority)
    updateTask({
      id: task.id,
      priority: priority as any,
    })
  }

  const handleAddComment = async () => {
    if (commentText.trim()) {
      createComment({
        taskId: task.id,
        content: commentText,
      })
      setCommentText('')
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

  if (!task) return null

  const comments = (task as any).comments || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="line-clamp-2">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Info */}
          <div className="space-y-4">
            {task.description && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Description
                </p>
                <p className="text-sm text-foreground">{task.description}</p>
              </div>
            )}

            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Status
                </p>
                <Select value={newStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger disabled={isUpdating} className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">
                  Priority
                </p>
                <Select value={newPriority} onValueChange={handlePriorityChange}>
                  <SelectTrigger disabled={isUpdating} className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Assignee & Due Date */}
            <div className="grid grid-cols-2 gap-4">
              {task.assignee && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Assigned to
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(task.assignee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                </div>
              )}
              {task.dueDate && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Due Date
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Comments Section */}
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4" />
              Comments ({comments.length})
            </h3>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4 mb-4 max-h-48 overflow-y-auto">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.author?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {comment.author?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mb-4">
                No comments yet
              </p>
            )}

            {/* Add Comment */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isCommentPending}
                className="h-9"
              />
              <Button
                onClick={handleAddComment}
                disabled={!commentText.trim() || isCommentPending}
                size="sm"
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
