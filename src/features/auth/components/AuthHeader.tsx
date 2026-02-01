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
import { useUIStore } from '@/store/uiStore'

export interface AuthHeaderProps {
  className?: string
  onNavigate?: () => void
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ className, onNavigate }) => {
  const navigate = useNavigate()
  const { user, profile, signOut, loading, initialize, initialized } = useAuthStore()
  const addToast = useUIStore(state => state.addToast)
  
  // Hooks must be at top level - not inside conditionals
  const [showMenu, setShowMenu] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Initialize auth on mount
  React.useEffect(() => {
    initialize()
  }, [initialize])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleSignOut = async () => {
    await signOut()
    addToast({
      type: 'info',
      title: 'Signed out',
      message: 'You have been successfully signed out.',
      duration: 3000,
    })
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
      <div className={cn('relative flex items-center gap-4', className)} ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg',
            'text-foreground/70 hover:text-foreground',
            'hover:bg-muted transition-colors',
            'min-h-[var(--ios-min-touch-target)]'
          )}
        >
          <span>{profile?.username || user.email}</span>
          <span className="text-xs">{showMenu ? '▲' : '▼'}</span>
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            className={cn(
              'absolute top-full right-0 mt-2 w-48',
              'bg-background border border-border rounded-lg shadow-lg',
              'py-2 z-50'
            )}
          >
            <Link
              to="/profile"
              onClick={() => {
                setShowMenu(false)
                onNavigate?.()
              }}
              className={cn(
                'block px-4 py-2 text-sm',
                'text-foreground hover:bg-muted',
                'transition-colors'
              )}
            >
              Profile & Settings
            </Link>
            <button
              onClick={() => {
                setShowMenu(false)
                handleSignOut()
              }}
              className={cn(
                'w-full text-left px-4 py-2 text-sm',
                'text-foreground hover:bg-muted',
                'transition-colors'
              )}
            >
              Sign out
            </button>
          </div>
        )}
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
