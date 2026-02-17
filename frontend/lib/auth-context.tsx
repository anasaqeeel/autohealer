'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import type { AuthLoginRequest, Organization, User } from './types'
import { apiPost, clearAuthToken, setAuthToken } from './api-client'

export interface AuthContextType {
  user: User | null
  organizations: Organization[]
  currentOrganization: Organization | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: AuthLoginRequest) => Promise<void>
  logout: () => void
  switchOrganization: (organizationId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] =
    useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      // Check for demo mode
      if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
        try {
          // Auto-login with demo credentials
          await login({ email: 'demo@example.com', password: 'demo123' })
          return
        } catch (error) {
          console.error('[Auth] Demo mode login failed:', error)
        }
      }

      const token = localStorage.getItem('auth_token')
      const cachedUser = localStorage.getItem('auth_user')
      const cachedOrganizations = localStorage.getItem('auth_organizations')
      const cachedCurrentOrg = localStorage.getItem('auth_current_organization')

      if (token && cachedUser) {
        try {
          setUser(JSON.parse(cachedUser))
          if (cachedOrganizations) {
            setOrganizations(JSON.parse(cachedOrganizations))
          }
          if (cachedCurrentOrg) {
            setCurrentOrganization(JSON.parse(cachedCurrentOrg))
          }
        } catch (error) {
          console.error('[Auth] Failed to restore session:', error)
          clearAuthToken()
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: AuthLoginRequest) => {
    setIsLoading(true)
    try {
      console.log('[Auth] Attempting login for:', credentials.email)
      const response = await apiPost('/auth/login', credentials)
      console.log('[Auth] Login response:', response)

      if (!response.success || !response.data) {
        const errorMessage = response.error?.message || 'Login failed'
        console.error('[Auth] Login failed:', errorMessage, response.error)
        throw new Error(errorMessage)
      }

      const { token, user: userData, organizations: orgs } = response.data as any

      if (!token) {
        throw new Error('No token received from server')
      }

      // Store token
      setAuthToken(token)

      // Store user and organizations in both state and localStorage
      setUser(userData)
      setOrganizations(orgs)

      // Set current organization (default to first)
      const currentOrg = orgs[0]
      setCurrentOrganization(currentOrg)

      // Cache in localStorage
      localStorage.setItem('auth_user', JSON.stringify(userData))
      localStorage.setItem('auth_organizations', JSON.stringify(orgs))
      localStorage.setItem('auth_current_organization', JSON.stringify(currentOrg))
      
      console.log('[Auth] Login successful for:', userData.email)
    } catch (error) {
      console.error('[Auth] Login error:', error)
      // Re-throw with better error message
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to login. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setOrganizations([])
    setCurrentOrganization(null)
    clearAuthToken()

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_organizations')
      localStorage.removeItem('auth_current_organization')
    }
  }

  const switchOrganization = async (organizationId: string) => {
    const org = organizations.find((o) => o.id === organizationId)
    if (org) {
      setCurrentOrganization(org)
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_current_organization', JSON.stringify(org))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        organizations,
        currentOrganization,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        switchOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
