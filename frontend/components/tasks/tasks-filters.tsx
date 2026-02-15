'use client'

import type { TaskFilters } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface TasksFiltersProps {
  filters: TaskFilters
  onFiltersChange: (filters: TaskFilters) => void
}

export function TasksFilters({ filters, onFiltersChange }: TasksFiltersProps) {
  const handleStatusChange = (status: string | undefined) => {
    onFiltersChange({
      ...filters,
      status: status as any,
    })
  }

  const handlePriorityChange = (priority: string | undefined) => {
    onFiltersChange({
      ...filters,
      priority: priority as any,
    })
  }

  const handleDueDateChange = (dueDate: string | undefined) => {
    onFiltersChange({
      ...filters,
      dueDate: dueDate as any,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      assignedTo: 'me',
    })
  }

  const hasActiveFilters = !!(
    filters.status ||
    filters.priority ||
    filters.dueDate
  )

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
      <span className="text-sm font-semibold text-muted-foreground">Filter by:</span>

      <Select
        value={filters.status || 'all'}
        onValueChange={(val) => handleStatusChange(val || undefined)}
      >
        <SelectTrigger className="w-40 h-9">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority || 'all'}
        onValueChange={(val) => handlePriorityChange(val || undefined)}
      >
        <SelectTrigger className="w-40 h-9">
          <SelectValue placeholder="All priorities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.dueDate || 'any'}
        onValueChange={(val) => handleDueDateChange(val || undefined)}
      >
        <SelectTrigger className="w-40 h-9">
          <SelectValue placeholder="Any due date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any due date</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="next_7_days">Next 7 days</SelectItem>
          <SelectItem value="next_30_days">Next 30 days</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          className="gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}
    </div>
  )
}
