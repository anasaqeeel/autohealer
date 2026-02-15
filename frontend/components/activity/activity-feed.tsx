'use client'

import type { ActivityEvent } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, MessageCircle, Folder, Edit2 } from 'lucide-react'

interface ActivityFeedProps {
  activities: ActivityEvent[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'task_updated':
      case 'task_status_changed':
        return <Edit2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'comment_added':
        return <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case 'project_created':
        return <Folder className="w-5 h-5 text-orange-600 dark:text-orange-400" />
      default:
        return <Edit2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getActivityType = (type: string) => {
    switch (type) {
      case 'task_created':
        return 'Task Created'
      case 'task_updated':
        return 'Task Updated'
      case 'task_status_changed':
        return 'Status Changed'
      case 'comment_added':
        return 'Comment Added'
      case 'project_created':
        return 'Project Created'
      default:
        return 'Activity'
    }
  }

  const getActivityDescription = (event: ActivityEvent) => {
    switch (event.type) {
      case 'task_created':
        return `created task "${event.entityName}"`
      case 'task_status_changed':
        return `changed status of "${event.entityName}"`
      case 'comment_added':
        return `commented on "${event.entityName}"`
      case 'project_created':
        return `created project "${event.entityName}"`
      case 'task_updated':
        return `updated "${event.entityName}"`
      default:
        return event.description
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
    <div className="space-y-4">
      {activities.map((event, index) => (
        <Card
          key={event.id}
          className="p-6 border-border hover:border-primary/50 transition-colors"
        >
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(event.user?.name)}
                </AvatarFallback>
              </Avatar>
              {index < activities.length - 1 && (
                <div className="h-8 w-0.5 bg-border" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      {event.user?.name}
                    </span>
                    {' '}
                    <span className="text-muted-foreground">
                      {getActivityDescription(event)}
                    </span>
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {getActivityType(event.type)}
                </Badge>
              </div>

              {/* Entity info and timestamp */}
              <div className="flex items-center gap-2">
                {getActivityIcon(event.type)}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.createdAt), {
                    addSuffix: true,
                  })}
                </p>
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    • {JSON.stringify(event.metadata).substring(0, 50)}...
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
