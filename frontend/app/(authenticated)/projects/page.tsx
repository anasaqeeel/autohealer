'use client'

import { useState } from 'react'
import { useProjects, useCreateProject } from '@/lib/hooks'
import { ProjectsList } from '@/components/projects/projects-list'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, FolderOpen } from 'lucide-react'

export default function ProjectsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const { data: projects = [], isLoading } = useProjects()
  const { mutate: createProject, isPending: isCreating } = useCreateProject()

  const handleCreateProject = async (data: { name: string; description?: string }) => {
    await createProject(data)
    setShowCreateDialog(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your projects
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 rounded-lg" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No projects yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your first project to get started
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              Create Project
            </Button>
          </div>
        ) : (
          <ProjectsList projects={projects} />
        )}
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateProject}
        isLoading={isCreating}
      />
    </div>
  )
}
