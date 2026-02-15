'use client'

import { useState } from 'react'
import { useActivity } from '@/lib/hooks'
import { ActivityFeed } from '@/components/activity/activity-feed'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity } from 'lucide-react'

export default function ActivityPage() {
  const [page, setPage] = useState(1)
  const limit = 20

  const { data: activities = [], isLoading } = useActivity(page, limit)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8" />
            Activity Feed
          </h1>
          <p className="text-muted-foreground mt-2">
            Track all changes and updates across your organization
          </p>
        </div>

        {/* Activity Feed */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          <ActivityFeed activities={activities} />
        )}
      </div>
    </div>
  )
}
