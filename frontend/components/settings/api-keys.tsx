'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Copy, Trash2, Plus, Eye, EyeOff } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed?: string
  isVisible?: boolean
}

export function SettingsApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'tm_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      created: '2024-01-15',
      lastUsed: '2024-02-10',
      isVisible: false,
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'tm_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      created: '2024-01-10',
      lastUsed: '2024-02-11',
      isVisible: false,
    },
  ])

  const [newKeyName, setNewKeyName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return
    setIsCreating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const newKey: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: newKeyName,
        key: 'sk_' + Math.random().toString(36).substr(2, 32),
        created: new Date().toISOString().split('T')[0],
        isVisible: false,
      }
      setApiKeys([...apiKeys, newKey])
      setNewKeyName('')
      toast.success('API key created successfully')
    } catch (error) {
      toast.error('Failed to create API key')
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id))
    toast.success('API key deleted')
  }

  const handleToggleVisibility = (id: string) => {
    setApiKeys(
      apiKeys.map((k) =>
        k.id === id ? { ...k, isVisible: !k.isVisible } : k
      )
    )
  }

  const maskKey = (key: string) => {
    return key.substring(0, 7) + '*'.repeat(key.length - 14) + key.substring(key.length - 7)
  }

  return (
    <div className="space-y-6">
      {/* Create API Key Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Create API Key</CardTitle>
          <CardDescription>
            Generate a new API key for your applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Key Name</Label>
            <Input
              id="key-name"
              placeholder="e.g. Mobile App, Production Server"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="h-10"
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Give your key a descriptive name for identification
            </p>
          </div>

          <Button
            onClick={handleCreateKey}
            disabled={!newKeyName.trim() || isCreating}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Creating...' : 'Create API Key'}
          </Button>
        </CardContent>
      </Card>

      {/* API Keys List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage your API keys for backend integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No API keys yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="p-4 rounded-lg bg-muted/50 border border-border space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {apiKey.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Created {apiKey.created}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {apiKey.key.startsWith('tm_prod') ? 'Production' : 'Development'}
                    </Badge>
                  </div>

                  {/* Key Display */}
                  <div className="flex items-center gap-2 bg-background p-3 rounded border border-border">
                    <code className="text-xs font-mono text-muted-foreground flex-1">
                      {apiKey.isVisible ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleVisibility(apiKey.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {apiKey.isVisible ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleCopyKey(apiKey.key)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Last Used */}
                  {apiKey.lastUsed && (
                    <p className="text-xs text-muted-foreground">
                      Last used: {apiKey.lastUsed}
                    </p>
                  )}

                  {/* Delete Button */}
                  <div className="flex justify-end pt-2 border-t border-border">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentation Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use TaskMaster Pro API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Our REST API allows you to programmatically access and manage your projects, tasks, and more.
          </p>
          <div className="flex gap-2">
            <Button variant="outline">View API Docs</Button>
            <Button variant="outline">View Examples</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
