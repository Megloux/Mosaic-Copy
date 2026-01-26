/**
 * LoginForm Component
 * 
 * Email/password login form following iOS design standards.
 * Uses existing Input and PasswordInput components from shared/ui.
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../model/authStore'
import { Input } from '@/shared/ui/form/Input'
import { PasswordInput } from '@/components/ui/form/PasswordInput'
import { cn } from '@/shared/lib/utils'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'

export interface LoginFormProps {
  className?: string
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ className, onSuccess }) => {
  const navigate = useNavigate()
  const { signIn, loading, error, clearError } = useAuthStore()
  
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [localError, setLocalError] = React.useState<string | null>(null)

  // Clear errors when user starts typing
  React.useEffect(() => {
    if (error) clearError()
    if (localError) setLocalError(null)
  }, [email, password])

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setLocalError('Email is required')
      return false
    }
    
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email')
      return false
    }
    
    if (!password) {
      setLocalError('Password is required')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const result = await signIn(email.trim().toLowerCase(), password)
    
    if (result.success) {
      onSuccess?.()
      navigate('/')
    }
  }

  const displayError = localError || error

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Card container with light background for visibility */}
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-2">Sign in to continue to Mosaic</p>
        </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {displayError && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{displayError}</p>
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          autoCapitalize="none"
          disabled={loading}
          className="text-[rgb(var(--core-black))] bg-white border-gray-300 placeholder:text-gray-400"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
          autoComplete="current-password"
          showStrength={false}
          disabled={loading}
          className="text-[rgb(var(--core-black))] bg-white border-gray-300 placeholder:text-gray-400"
        />

        <div className="flex justify-end">
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <StandardButton
          type="submit"
          variant="default"
          isLoading={loading}
          loadingText="Signing in..."
          className="w-full"
        >
          Sign in
        </StandardButton>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

LoginForm.displayName = 'LoginForm'
