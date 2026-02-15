'use client'

import type { ActivityEvent } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { Activity } from 'lucide-react'

interface DashboardActivityFeedProps {
  activities?: ActivityEvent[]
  isLoading?: boolean
}

export function DashboardActivityFeed({
  activities = [],
  isLoading = false,
}: DashboardActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task_created':
      case 'task_updated':
      case 'task_status_changed':
        return '✓'
      case 'comment_added':
        return '💬'
      case 'project_created':
        return '📁'
      default:
        return '•'
    }
  }

  const getActivityDescription = (event: ActivityEvent) => {
    switch (event.type) {
      case 'task_created':
        return `created task ${event.entityName}`
      case 'task_status_changed':
        return `changed status of ${event.entityName}`
      case 'comment_added':
        return `commented on ${event.entityName}`
      case 'project_created':
        return `created project ${event.entityName}`
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
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-muted-foreground" />
          <CardTitle>Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Activity className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((event) => (
              <div key={event.id} className="flex gap-3 pb-4 border-b border-border last:border-0">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {getInitials(event.user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">
                      {event.user?.name}
                    </span>
                    {' '}
                    <span className="text-muted-foreground">
                      {getActivityDescription(event)}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(event.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
