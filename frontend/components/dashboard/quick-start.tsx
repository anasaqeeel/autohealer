'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderOpen, CheckSquare, Zap } from 'lucide-react'

export function DashboardQuickStart() {
  return (
    <Card className="border-border sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Quick Start
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/projects?new=true">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <FolderOpen className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Link>
        <Link href="/tasks?new=true">
          <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
            <CheckSquare className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </Link>

        <div className="pt-3 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            Getting Started
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 font-bold">1</span>
              <span>Create your first project</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 font-bold">2</span>
              <span>Add tasks to your project</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1 font-bold">3</span>
              <span>Track progress and collaborate</span>
            </li>
          </ul>
        </div>

        <div className="pt-3 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Learn More
          </h4>
          <ul className="space-y-1 text-xs">
            <li>
              <a href="#" className="text-primary hover:underline">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                API Reference
              </a>
            </li>
            <li>
              <a href="#" className="text-primary hover:underline">
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
