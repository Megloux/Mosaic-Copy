/**
 * ResetPasswordPage Component
 * 
 * Handles password reset completion from email link.
 * Allows users to set a new password after clicking reset link.
 * iOS-compliant with proper touch targets and validation.
 */

import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/config/supabase'
import { useUIStore } from '@/store/uiStore'
import { PasswordInput } from '@/components/ui/form/PasswordInput'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'
import { cn } from '@/shared/lib/utils'

type ResetStatus = 'ready' | 'updating' | 'success' | 'error'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const addToast = useUIStore(state => state.addToast)
  
  const [status, setStatus] = useState<ResetStatus>('ready')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isValidToken, setIsValidToken] = useState(false)

  useEffect(() => {
    // Check if we have a valid reset token
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (!tokenHash || type !== 'recovery') {
      setStatus('error')
      setErrorMessage('Invalid or expired reset link. Please request a new password reset.')
      return
    }

    setIsValidToken(true)
  }, [searchParams])

  const validateForm = (): boolean => {
    if (!newPassword) {
      setErrorMessage('Please enter a new password')
      return false
    }

    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters')
      return false
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match')
      return false
    }

    return true
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!validateForm()) return

    setStatus('updating')

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setStatus('success')
      addToast({
        type: 'success',
        title: 'Password reset successful',
        message: 'Your password has been updated. You can now sign in.',
        duration: 5000,
      })

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      setStatus('ready')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to reset password')
      addToast({
        type: 'error',
        title: 'Reset failed',
        message: 'Could not update your password. Please try again.',
        duration: 5000,
      })
    }
  }

  // Error state - invalid token
  if (status === 'error' || !isValidToken) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4" 
        style={{ backgroundColor: 'rgb(var(--core-black))' }}
      >
        <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
          <div className="text-center">
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid reset link</h1>
            <p className="text-gray-600 mb-8">
              {errorMessage || 'This password reset link is invalid or has expired.'}
            </p>
            <div className="space-y-3">
              <Link to="/forgot-password">
                <StandardButton variant="default" className="w-full">
                  Request New Reset Link
                </StandardButton>
              </Link>
              <Link to="/login">
                <StandardButton variant="secondary" className="w-full">
                  Back to Sign In
                </StandardButton>
              </Link>
            </div>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password reset!</h1>
            <p className="text-gray-600 mb-4">
              Your password has been successfully updated.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to sign in...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Ready/Updating state - show form
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ backgroundColor: 'rgb(var(--core-black))' }}
    >
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
          <p className="text-gray-600 mt-2">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            showStrength={true}
            disabled={status === 'updating'}
            className="text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            showStrength={false}
            disabled={status === 'updating'}
            className="text-gray-900 bg-white border-gray-300 placeholder:text-gray-400"
          />

          <StandardButton
            type="submit"
            variant="default"
            isLoading={status === 'updating'}
            loadingText="Updating password..."
            className="w-full"
          >
            Reset Password
          </StandardButton>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <Link 
            to="/login" 
            className="font-medium"
            style={{ color: 'rgb(var(--core-teal))' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

ResetPasswordPage.displayName = 'ResetPasswordPage'
