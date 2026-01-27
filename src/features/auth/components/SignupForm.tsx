/**
 * SignupForm Component
 * 
 * Spotify-quality registration form for the Pilates routine builder.
 * Includes all profile fields and iOS App Store compliance requirements.
 */

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../model/authStore'
import { Input } from '@/shared/ui/form/Input'
import { PasswordInput } from '@/components/ui/form/PasswordInput'
import { cn } from '@/shared/lib/utils'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'
import { useUIStore } from '@/store/uiStore'
import { checkUsernameAvailable } from '../api/authApi'

export interface SignupFormProps {
  className?: string
  onSuccess?: () => void
}

export const SignupForm: React.FC<SignupFormProps> = ({ className, onSuccess }) => {
  const navigate = useNavigate()
  const { signUp, loading, error, clearError } = useAuthStore()
  const addToast = useUIStore(state => state.addToast)
  
  // Form fields
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [studioName, setStudioName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  
  // Form state
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)
  const [usernameStatus, setUsernameStatus] = React.useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

  // Clear errors when user starts typing
  React.useEffect(() => {
    if (error) clearError()
    if (localError) setLocalError(null)
  }, [firstName, lastName, email, phone, username, studioName, password, confirmPassword])

  // Check username availability with debounce
  React.useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle')
      return
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking')
      const { available } = await checkUsernameAvailable(username)
      setUsernameStatus(available ? 'available' : 'taken')
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  const validateForm = (): boolean => {
    if (!firstName.trim()) {
      setLocalError('First name is required')
      return false
    }

    if (!lastName.trim()) {
      setLocalError('Last name is required')
      return false
    }

    if (!email.trim()) {
      setLocalError('Email is required')
      return false
    }
    
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email')
      return false
    }

    if (username && username.length < 3) {
      setLocalError('Username must be at least 3 characters')
      return false
    }

    if (usernameStatus === 'taken') {
      setLocalError('Username is already taken')
      return false
    }
    
    if (!password) {
      setLocalError('Password is required')
      return false
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters')
      return false
    }
    
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return false
    }

    if (!agreedToTerms) {
      setLocalError('Please agree to the terms and privacy policy')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const result = await signUp({
      email: email.trim().toLowerCase(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || undefined,
      username: username.trim() || undefined,
      studioName: studioName.trim() || undefined,
    })
    
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Welcome to Mosaic!',
        message: 'Check your email to confirm your account.',
        duration: 5000,
      })
      onSuccess?.()
      navigate('/')
    }
  }

  const displayError = localError || error
  const inputClass = "text-[rgb(var(--core-black))] bg-white border-gray-300 placeholder:text-gray-400"

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Join Mosaic</h1>
          <p className="text-gray-600 mt-1">The Spotify of Pilates routine building</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {displayError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{displayError}</p>
            </div>
          )}

          {/* Name Row - Side by side on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              autoComplete="given-name"
              disabled={loading}
              className={inputClass}
            />
            <Input
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              autoComplete="family-name"
              disabled={loading}
              className={inputClass}
            />
          </div>

          {/* Email */}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            autoCapitalize="none"
            disabled={loading}
            className={inputClass}
          />

          {/* Phone - Optional */}
          <Input
            label="Phone (optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            autoComplete="tel"
            disabled={loading}
            className={inputClass}
          />

          {/* Username with availability check */}
          <div className="relative">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="pilates_pro"
              autoComplete="username"
              autoCapitalize="none"
              disabled={loading}
              className={inputClass}
            />
            {username.length >= 3 && (
              <div className="absolute right-3 top-9 text-sm">
                {usernameStatus === 'checking' && (
                  <span className="text-gray-400">Checking...</span>
                )}
                {usernameStatus === 'available' && (
                  <span className="text-green-600">✓ Available</span>
                )}
                {usernameStatus === 'taken' && (
                  <span className="text-red-600">✗ Taken</span>
                )}
              </div>
            )}
          </div>

          {/* Studio Instagram Handle - Optional */}
          <div>
            <Input
              label="Studio Instagram (optional)"
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value.replace(/^@/, '').replace(/[^a-z0-9._]/gi, ''))}
              placeholder="studiofitness"
              disabled={loading}
              className={inputClass}
            />
            {studioName && (
              <a
                href={`https://instagram.com/${studioName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 text-sm text-teal-600 hover:text-teal-700"
              >
                @{studioName} ↗
              </a>
            )}
          </div>

          {/* Password */}
          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            showStrength={true}
            disabled={loading}
            className={inputClass}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            showStrength={false}
            disabled={loading}
            className={inputClass}
          />

          {/* Opt-ins */}
          <div className="space-y-2 pt-1">
            {/* Terms - Required */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-teal-600 hover:text-teal-700 font-medium">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-teal-600 hover:text-teal-700 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

          </div>

          {/* Submit Button */}
          <StandardButton
            type="submit"
            variant="default"
            isLoading={loading}
            loadingText="Creating account..."
            className="w-full mt-4"
          >
            Create Account
          </StandardButton>
        </form>

        {/* Sign in link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="text-teal-600 hover:text-teal-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

SignupForm.displayName = 'SignupForm'
