/**
 * ForgotPasswordForm Component
 * 
 * Password reset request form.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../model/authStore'
import { Input } from '@/shared/ui/form/Input'
import { cn } from '@/shared/lib/utils'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'

export interface ForgotPasswordFormProps {
  className?: string
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ className }) => {
  const { resetPassword, loading, error, clearError } = useAuthStore()
  
  const [email, setEmail] = React.useState('')
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [submitted, setSubmitted] = React.useState(false)

  // Clear errors when user starts typing
  React.useEffect(() => {
    if (error) clearError()
    if (localError) setLocalError(null)
  }, [email])

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setLocalError('Email is required')
      return false
    }
    
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const result = await resetPassword(email.trim().toLowerCase())
    
    if (result.success) {
      setSubmitted(true)
    }
  }

  const displayError = localError || error

  if (submitted) {
    return (
      <div className={cn('w-full max-w-md mx-auto', className)}>
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="w-8 h-8 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>
            <p className="text-gray-600 mt-2 mb-8">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-medium',
                'bg-muted text-foreground',
                'hover:bg-muted/80 transition-colors',
                'min-h-[var(--ios-min-touch-target)]'
              )}
            >
              Try another email
            </button>
            <Link
              to="/login"
              className={cn(
                'block w-full py-3 px-4 rounded-lg font-medium text-center',
                'bg-primary text-primary-foreground',
                'hover:bg-primary/90 transition-colors',
                'min-h-[var(--ios-min-touch-target)]'
              )}
            >
              Back to sign in
            </Link>
          </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email and we'll send you a reset link
          </p>
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

        <StandardButton
          type="submit"
          variant="default"
          isLoading={loading}
          loadingText="Sending..."
          className="w-full"
        >
          Send reset link
        </StandardButton>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link 
            to="/login" 
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

ForgotPasswordForm.displayName = 'ForgotPasswordForm'
