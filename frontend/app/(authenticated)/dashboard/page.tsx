'use client'

import { useDashboardSummary, useRecentActivity } from '@/lib/hooks'
import { DashboardStats } from '@/components/dashboard/stats'
import { DashboardActivityFeed } from '@/components/dashboard/activity-feed'
import { DashboardQuickStart } from '@/components/dashboard/quick-start'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary()
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your projects and tasks
          </p>
        </div>

        {/* Stats Section */}
        {summaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : summary ? (
          <DashboardStats summary={summary} />
        ) : null}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Activity Feed */}
          <div className="lg:col-span-2">
            <DashboardActivityFeed activities={activities} isLoading={activitiesLoading} />
          </div>

          {/* Right Column - Quick Start */}
          <div>
            <DashboardQuickStart />
          </div>
        </div>
      </div>
    </div>
  )
}
