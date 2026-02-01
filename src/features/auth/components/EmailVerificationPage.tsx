/**
 * EmailVerificationPage Component
 * 
 * Handles email verification callback from Supabase.
 * Shows success/error states and provides resend option.
 * iOS-compliant with proper touch targets.
 */

import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useUIStore } from '@/store/uiStore'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'
import { cn } from '@/shared/lib/utils'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'already-verified'

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addToast = useUIStore(state => state.addToast)
  
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendEmail, setResendEmail] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      // Check for token_hash in URL (Supabase email verification)
      const tokenHash = searchParams.get('token_hash')
      const type = searchParams.get('type')

      if (!tokenHash || type !== 'email') {
        setStatus('error')
        setErrorMessage('Invalid verification link. Please check your email and try again.')
        return
      }

      try {
        // Verify the email with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email',
        })

        if (error) {
          if (error.message.includes('already been verified')) {
            setStatus('already-verified')
          } else {
            setStatus('error')
            setErrorMessage(error.message)
          }
        } else {
          setStatus('success')
          addToast({
            type: 'success',
            title: 'Email verified!',
            message: 'Your email has been successfully verified.',
            duration: 5000,
          })
        }
      } catch (error) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Verification failed')
      }
    }

    verifyEmail()
  }, [searchParams, addToast])

  const handleResendVerification = async () => {
    if (!resendEmail || !resendEmail.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid email',
        message: 'Please enter a valid email address.',
        duration: 3000,
      })
      return
    }

    setResendLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: resendEmail,
      })

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Verification email sent',
        message: 'Check your inbox for a new verification link.',
        duration: 5000,
      })
      setResendEmail('')
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to resend',
        message: error instanceof Error ? error.message : 'Could not resend verification email',
        duration: 5000,
      })
    } finally {
      setResendLoading(false)
    }
  }

  // Verifying state
  if (status === 'verifying') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{ backgroundColor: 'rgb(var(--core-black))' }}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <div 
                className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email</h1>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (status === 'success') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{ backgroundColor: 'rgb(var(--core-black))' }}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email verified!</h1>
            <p className="text-gray-600 mb-8">
              Your email has been successfully verified. You can now access all features.
            </p>
            <StandardButton
              onClick={() => navigate('/')}
              variant="default"
              className="w-full"
            >
              Go to Dashboard
            </StandardButton>
          </div>
        </div>
      </div>
    )
  }

  // Already verified state
  if (status === 'already-verified') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{ backgroundColor: 'rgb(var(--core-black))' }}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="w-8 h-8 text-blue-600"
              >
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Already verified</h1>
            <p className="text-gray-600 mb-8">
              Your email has already been verified. You're all set!
            </p>
            <StandardButton
              onClick={() => navigate('/')}
              variant="default"
              className="w-full"
            >
              Go to Dashboard
            </StandardButton>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgb(var(--core-black))' }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="w-8 h-8 text-red-600"
            >
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification failed</h1>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
        </div>

        {/* Resend verification */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resend verification email
            </label>
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(
                'w-full px-4 py-3 rounded-lg border border-gray-300',
                'text-gray-900 placeholder:text-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent',
                'disabled:opacity-50'
              )}
              disabled={resendLoading}
            />
          </div>

          <StandardButton
            onClick={handleResendVerification}
            variant="default"
            isLoading={resendLoading}
            loadingText="Sending..."
            className="w-full"
          >
            Resend Verification Email
          </StandardButton>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium"
              style={{ color: 'rgb(var(--core-teal))' }}
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

EmailVerificationPage.displayName = 'EmailVerificationPage'
