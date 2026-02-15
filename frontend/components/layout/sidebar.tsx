'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FolderOpen,
  CheckSquare,
  Activity,
  Settings,
  ChevronDown,
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

const NAVIGATION_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderOpen,
  },
  {
    label: 'Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
  {
    label: 'Activity',
    href: '/activity',
    icon: Activity,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { organizations, currentOrganization, switchOrganization } = useAuth()

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-primary-foreground font-bold text-sm">
              TM
            </span>
          </div>
          <div>
            <p className="font-bold text-sidebar-foreground text-sm">TaskMaster</p>
            <p className="text-xs text-sidebar-accent-foreground">Pro</p>
          </div>
        </Link>
      </div>

      {/* Organization Switcher */}
      <div className="px-6 py-4 border-b border-sidebar-border">
        <label className="text-xs font-semibold text-sidebar-accent-foreground block mb-2">
          Organization
        </label>
        <Select
          value={currentOrganization?.id || ''}
          onValueChange={switchOrganization}
        >
          <SelectTrigger className="w-full h-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
            <SelectValue placeholder="Select organization" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-primary opacity-50" />
                  {org.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-accent-foreground space-y-1">
          <p className="font-semibold">{currentOrganization?.name}</p>
          {currentOrganization?.environment && (
            <p className="capitalize">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />
              {currentOrganization.environment}
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}
