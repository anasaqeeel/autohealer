'use client'

import Link from 'next/link'
import type { Project } from '@/lib/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Folder, CheckCircle2, Circle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ProjectsListProps {
  projects: Project[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500/10 text-green-700 dark:text-green-400' : 'bg-gray-500/10 text-gray-700 dark:text-gray-400'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="border-border hover:border-primary/50 transition-colors group"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Folder className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate text-sm">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </div>
              </div>
              <Badge
                variant="secondary"
                className={`capitalize flex-shrink-0 ${getStatusColor(project.status)}`}
              >
                {project.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Tasks</p>
                  <p className="text-lg font-semibold text-foreground">
                    {project.taskCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Open</p>
                  <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    {project.openTaskCount || 0}
                  </p>
                </div>
              </div>

              {/* Owner and Date */}
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Circle className="w-2 h-2 fill-current text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Updated{' '}
                    {formatDistanceToNow(new Date(project.updatedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {project.owner && (
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">
                      by {project.owner.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Link href={`/projects/${project.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center gap-2 mt-2 group bg-transparent"
                >
                  View Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
