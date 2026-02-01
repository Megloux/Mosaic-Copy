/**
 * ProfilePage Component
 * 
 * Spotify-quality profile and account settings page.
 * Includes profile view/edit, change password, and account deletion.
 * iOS-compliant with proper touch targets and accessibility.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth'
import { DeleteAccountModal } from '@/features/auth/components/DeleteAccountModal'
import { Input } from '@/shared/ui/form/Input'
import { PasswordInput } from '@/components/ui/form/PasswordInput'
import { StandardButton } from '@/shared/ui/buttons/StandardButton'
import { useUIStore } from '@/store/uiStore'
import { supabase } from '@/config/supabase'
import { cn } from '@/shared/lib/utils'

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, profile, updateUsername, signOut } = useAuthStore()
  const addToast = useUIStore(state => state.addToast)

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [username, setUsername] = useState(profile?.username || '')
  const [firstName, setFirstName] = useState(profile?.first_name || '')
  const [lastName, setLastName] = useState(profile?.last_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [studioName, setStudioName] = useState(profile?.studio_name || '')
  const [profileLoading, setProfileLoading] = useState(false)

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || !profile) {
    return null
  }

  const handleSaveProfile = async () => {
    setProfileLoading(true)

    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null,
          phone: phone.trim() || null,
          studio_name: studioName.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      // Update username separately if changed
      if (username !== profile.username) {
        const result = await updateUsername(username.trim())
        if (!result.success) {
          throw new Error(result.error || 'Failed to update username')
        }
      }

      addToast({
        type: 'success',
        title: 'Profile updated',
        message: 'Your profile has been successfully updated.',
        duration: 3000,
      })

      setIsEditingProfile(false)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Update failed',
        message: error instanceof Error ? error.message : 'Failed to update profile',
        duration: 5000,
      })
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      addToast({
        type: 'error',
        title: 'Missing fields',
        message: 'Please fill in all password fields.',
        duration: 3000,
      })
      return
    }

    if (newPassword.length < 8) {
      addToast({
        type: 'error',
        title: 'Password too short',
        message: 'New password must be at least 8 characters.',
        duration: 3000,
      })
      return
    }

    if (newPassword !== confirmNewPassword) {
      addToast({
        type: 'error',
        title: 'Passwords do not match',
        message: 'New password and confirmation must match.',
        duration: 3000,
      })
      return
    }

    setPasswordLoading(true)

    try {
      // Verify current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      })

      if (signInError) {
        throw new Error('Current password is incorrect')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      addToast({
        type: 'success',
        title: 'Password changed',
        message: 'Your password has been successfully updated.',
        duration: 3000,
      })

      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setIsChangingPassword(false)
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Password change failed',
        message: error instanceof Error ? error.message : 'Failed to change password',
        duration: 5000,
      })
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setUsername(profile?.username || '')
    setFirstName(profile?.first_name || '')
    setLastName(profile?.last_name || '')
    setPhone(profile?.phone || '')
    setStudioName(profile?.studio_name || '')
    setIsEditingProfile(false)
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: 'rgb(var(--core-black))' }}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-3xl font-bold"
            style={{
              color: 'rgb(var(--core-white))',
              fontFamily: 'var(--font-primary)',
              fontWeight: 'var(--font-brand)',
            }}
          >
            Profile & Settings
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm"
            style={{
              color: 'rgb(var(--core-teal))',
              fontFamily: 'var(--font-primary)',
            }}
          >
            ← Back
          </button>
        </div>

        {/* Profile Information Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-sm font-medium"
                style={{ color: 'rgb(var(--core-teal))' }}
              >
                Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-600 text-sm">
                {user.email}
              </div>
            </div>

            {/* Username */}
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="pilates_pro"
              disabled={!isEditingProfile || profileLoading}
              className="text-gray-900 bg-white border-gray-300"
            />

            {/* Name fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                disabled={!isEditingProfile || profileLoading}
                className="text-gray-900 bg-white border-gray-300"
              />
              <Input
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={!isEditingProfile || profileLoading}
                className="text-gray-900 bg-white border-gray-300"
              />
            </div>

            {/* Phone */}
            <Input
              label="Phone (optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              disabled={!isEditingProfile || profileLoading}
              className="text-gray-900 bg-white border-gray-300"
            />

            {/* Studio Instagram */}
            <Input
              label="Studio Instagram (optional)"
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value.replace(/^@/, '').replace(/[^a-z0-9._]/gi, ''))}
              placeholder="studiofitness"
              disabled={!isEditingProfile || profileLoading}
              className="text-gray-900 bg-white border-gray-300"
            />

            {/* Edit buttons */}
            {isEditingProfile && (
              <div className="flex gap-3 pt-2">
                <StandardButton
                  onClick={handleCancelEdit}
                  variant="secondary"
                  disabled={profileLoading}
                  className="flex-1"
                >
                  Cancel
                </StandardButton>
                <StandardButton
                  onClick={handleSaveProfile}
                  variant="default"
                  isLoading={profileLoading}
                  loadingText="Saving..."
                  className="flex-1"
                >
                  Save Changes
                </StandardButton>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="text-sm font-medium"
                style={{ color: 'rgb(var(--core-teal))' }}
              >
                Change
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
                placeholder="Enter current password"
                autoComplete="current-password"
                showStrength={false}
                disabled={passwordLoading}
                className="text-gray-900 bg-white border-gray-300"
              />

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                showStrength={true}
                disabled={passwordLoading}
                className="text-gray-900 bg-white border-gray-300"
              />

              <PasswordInput
                label="Confirm New Password"
                value={confirmNewPassword}
                onChange={setConfirmNewPassword}
                placeholder="Confirm new password"
                autoComplete="new-password"
                showStrength={false}
                disabled={passwordLoading}
                className="text-gray-900 bg-white border-gray-300"
              />

              <div className="flex gap-3 pt-2">
                <StandardButton
                  onClick={() => {
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                    setIsChangingPassword(false)
                  }}
                  variant="secondary"
                  disabled={passwordLoading}
                  className="flex-1"
                >
                  Cancel
                </StandardButton>
                <StandardButton
                  onClick={handleChangePassword}
                  variant="default"
                  isLoading={passwordLoading}
                  loadingText="Changing..."
                  className="flex-1"
                >
                  Change Password
                </StandardButton>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Keep your account secure by regularly updating your password.
            </p>
          )}
        </div>

        {/* Account Actions Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h2>

          <div className="space-y-3">
            {/* Sign Out */}
            <button
              onClick={async () => {
                await signOut()
                addToast({
                  type: 'info',
                  title: 'Signed out',
                  message: 'You have been successfully signed out.',
                  duration: 3000,
                })
                navigate('/login')
              }}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-medium text-left',
                'bg-gray-100 text-gray-900',
                'hover:bg-gray-200 transition-colors',
                'min-h-[var(--ios-min-touch-target)]'
              )}
            >
              Sign Out
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className={cn(
                'w-full py-3 px-4 rounded-lg font-medium text-left',
                'bg-red-50 text-red-700',
                'hover:bg-red-100 transition-colors',
                'min-h-[var(--ios-min-touch-target)]'
              )}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="text-center text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          <p>Account created: {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  )
}

ProfilePage.displayName = 'ProfilePage'
