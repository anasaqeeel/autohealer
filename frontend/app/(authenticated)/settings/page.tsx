'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SettingsProfile } from '@/components/settings/profile'
import { SettingsOrganization } from '@/components/settings/organization'
import { SettingsApiKeys } from '@/components/settings/api-keys'
import { User, Building2, Key } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your profile and organization settings
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="w-4 h-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="gap-2">
              <Key className="w-4 h-4" />
              API Keys
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <SettingsProfile />
          </TabsContent>

          {/* Organization Tab */}
          <TabsContent value="organization">
            <SettingsOrganization />
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <SettingsApiKeys />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
