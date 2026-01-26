/**
 * AuthHeader Component
 * 
 * Shows sign in/sign up buttons when logged out, user info + logout when logged in.
 * Add this to any page that needs auth access from the UI.
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../model/authStore'
import { cn } from '@/shared/lib/utils'

export interface AuthHeaderProps {
  className?: string
  onNavigate?: () => void
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ className, onNavigate }) => {
  const navigate = useNavigate()
  const { user, profile, signOut, loading, initialize, initialized } = useAuthStore()

  // Initialize auth on mount
  React.useEffect(() => {
    initialize()
  }, [initialize])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  // Still loading
  if (!initialized || loading) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </div>
    )
  }

  // Logged in
  if (user) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <span className="text-sm text-foreground/70">
          {profile?.username || user.email}
        </span>
        <button
          onClick={handleSignOut}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg',
            'text-foreground/70 hover:text-foreground',
            'hover:bg-muted transition-colors'
          )}
        >
          Sign out
        </button>
      </div>
    )
  }

  // Logged out
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Link
        to="/login"
        onClick={onNavigate}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg',
          'text-foreground/70 hover:text-foreground',
          'hover:bg-muted transition-colors'
        )}
      >
        Sign in
      </Link>
      <Link
        to="/signup"
        onClick={onNavigate}
        className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg',
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90 transition-colors'
        )}
      >
        Create account
      </Link>
    </div>
  )
}

AuthHeader.displayName = 'AuthHeader'
