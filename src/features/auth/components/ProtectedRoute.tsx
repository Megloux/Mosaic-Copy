/**
 * ProtectedRoute Component
 * 
 * Wrapper component that redirects unauthenticated users to login.
 * Shows loading state while checking authentication status.
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../model/authStore'
import { cn } from '@/shared/lib/utils'

export interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallbackPath = '/login' 
}) => {
  const location = useLocation()
  const { user, loading, initialized, initialize } = useAuthStore()

  // Initialize auth on first render
  React.useEffect(() => {
    initialize()
  }, [initialize])

  // Show loading state while checking auth
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div 
            className={cn(
              'h-8 w-8 animate-spin rounded-full',
              'border-2 border-primary border-t-transparent'
            )} 
          />
          <p className="text-sm text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // User is authenticated, render children
  return <>{children}</>
}

ProtectedRoute.displayName = 'ProtectedRoute'
