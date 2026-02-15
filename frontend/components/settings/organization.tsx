'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { X } from 'lucide-react'

export function SettingsOrganization() {
  const { currentOrganization, user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [orgName, setOrgName] = useState(currentOrganization?.name || '')
  const [inviteEmail, setInviteEmail] = useState('')
  const [members, setMembers] = useState([
    { id: '1', name: user?.name || 'You', email: user?.email || '', role: 'org_admin' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'member' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'member' },
  ])

  const handleSaveOrg = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('Organization updated successfully')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update organization')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) return
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
    } catch (error) {
      toast.error('Failed to send invitation')
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId))
    toast.success('Member removed')
  }

  return (
    <div className="space-y-6">
      {/* Organization Info Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Organization Details</CardTitle>
          <CardDescription>
            Manage your organization settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              disabled={!isEditing}
              className="h-10"
            />
          </div>

          {currentOrganization?.environment && (
            <div className="space-y-2">
              <Label>Environment</Label>
              <Badge className="capitalize">
                {currentOrganization.environment}
              </Badge>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)} variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={handleSaveOrg} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Organization
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage who has access to your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invite Section */}
          <div className="space-y-3 pb-6 border-b border-border">
            <div>
              <Label htmlFor="invite-email">Invite Team Member</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Enter an email address to send an invitation
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-10"
              />
              <Button onClick={handleInviteMember} disabled={!inviteEmail.trim()}>
                Invite
              </Button>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Members</h4>
            <div className="space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="secondary" className="capitalize text-xs">
                      {member.role.replace('_', ' ')}
                    </Badge>
                    {member.id !== '1' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
