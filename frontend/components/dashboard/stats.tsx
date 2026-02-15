'use client'

import type { DashboardSummary } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen, CheckSquare, AlertCircle, TrendingUp } from 'lucide-react'

interface DashboardStatsProps {
  summary: DashboardSummary
}

export function DashboardStats({ summary }: DashboardStatsProps) {
  const stats = [
    {
      title: 'Total Projects',
      value: summary.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Active Projects',
      value: summary.activeProjects,
      icon: TrendingUp,
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    {
      title: 'All Tasks',
      value: summary.totalTasks,
      icon: CheckSquare,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Tasks Assigned to Me',
      value: summary.openTasksAssignedToMe,
      icon: AlertCircle,
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
