'use client'

import { useState } from 'react'
import { useTasks } from '@/lib/hooks'
import type { TaskFilters } from '@/lib/types'
import { TasksTable } from '@/components/tasks/tasks-table'
import { TasksFilters } from '@/components/tasks/tasks-filters'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckSquare } from 'lucide-react'

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({
    assignedTo: 'me',
  })

  const { data: tasks = [], isLoading } = useTasks(filters)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Tasks</h1>
          <p className="text-muted-foreground">
            Tasks assigned to you across all projects
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <TasksFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Tasks Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/20 rounded-lg border border-dashed border-border">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <CheckSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No tasks found
            </h2>
            <p className="text-muted-foreground mb-4">
              {filters.assignedTo === 'me' 
                ? "You don't have any tasks assigned yet. Create a task in a project and assign it to yourself."
                : "All tasks are complete or filters are too restrictive"}
            </p>
            {filters.assignedTo === 'me' && (
              <Button variant="outline" onClick={() => window.location.href = '/projects'}>
                Go to Projects
              </Button>
            )}
          </div>
        ) : (
          <TasksTable tasks={tasks} />
        )}
      </div>
    </div>
  )
}
