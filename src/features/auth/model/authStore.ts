/**
 * Auth Store - Zustand State Management for Authentication
 * 
 * Manages user authentication state, session persistence, and profile data.
 * Follows the same pattern as exerciseLibraryStore.ts
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import * as authApi from '../api/authApi'
import type { Profile, SignupData } from '../api/authApi'

export interface AuthState {
  // State
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  initialized: boolean
  error: string | null

  // Actions
  signUp: (data: SignupData) => Promise<{ success: boolean; error: string | null }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ success: boolean; error: string | null }>
  deleteAccount: () => Promise<{ success: boolean; error: string | null }>
  updateUsername: (username: string) => Promise<{ success: boolean; error: string | null }>
  checkUsernameAvailable: (username: string) => Promise<boolean>
  initialize: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      profile: null,
      loading: false,
      initialized: false,
      error: null,

      /**
       * Sign up a new user
       */
      signUp: async (data: SignupData) => {
        set({ loading: true, error: null })

        const result = await authApi.signUp(data)

        if (result.error) {
          set({ loading: false, error: result.error })
          return { success: false, error: result.error }
        }

        // Fetch the profile after signup (may fail if trigger hasn't completed yet - that's okay)
        let profile: Profile | null = null
        if (result.user) {
          try {
            const profileResult = await authApi.getProfile(result.user.id)
            profile = profileResult.profile
          } catch (e) {
            // Profile fetch failed - user can fetch later, don't block signup success
            console.warn('Could not fetch profile after signup:', e)
          }
        }

        set({
          user: result.user,
          session: result.session,
          profile,
          loading: false,
          error: null,
        })

        return { success: true, error: null }
      },

      /**
       * Sign in an existing user
       */
      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null })

        const result = await authApi.signIn(email, password)

        if (result.error) {
          set({ loading: false, error: result.error })
          return { success: false, error: result.error }
        }

        // Fetch the profile after sign in
        let profile: Profile | null = null
        if (result.user) {
          const profileResult = await authApi.getProfile(result.user.id)
          profile = profileResult.profile
        }

        set({
          user: result.user,
          session: result.session,
          profile,
          loading: false,
          error: null,
        })

        return { success: true, error: null }
      },

      /**
       * Sign out the current user
       */
      signOut: async () => {
        set({ loading: true })

        await authApi.signOut()

        set({
          user: null,
          session: null,
          profile: null,
          loading: false,
          error: null,
        })
      },

      /**
       * Send password reset email
       */
      resetPassword: async (email: string) => {
        set({ loading: true, error: null })

        const result = await authApi.resetPassword(email)

        set({ loading: false })

        if (result.error) {
          set({ error: result.error })
          return { success: false, error: result.error }
        }

        return { success: true, error: null }
      },

      /**
       * Delete account (iOS App Store requirement)
       */
      deleteAccount: async () => {
        set({ loading: true, error: null })

        const result = await authApi.deleteAccount()

        if (result.error) {
          set({ loading: false, error: result.error })
          return { success: false, error: result.error }
        }

        set({
          user: null,
          session: null,
          profile: null,
          loading: false,
          error: null,
        })

        return { success: true, error: null }
      },

      /**
       * Update the user's username (handle)
       */
      updateUsername: async (username: string) => {
        const { user } = get()
        
        if (!user) {
          return { success: false, error: 'Not logged in' }
        }

        set({ loading: true, error: null })

        const result = await authApi.updateProfile(user.id, { username })

        if (result.error) {
          set({ loading: false, error: result.error })
          return { success: false, error: result.error }
        }

        set({
          profile: result.profile,
          loading: false,
          error: null,
        })

        return { success: true, error: null }
      },

      /**
       * Check if a username is available
       */
      checkUsernameAvailable: async (username: string) => {
        const result = await authApi.checkUsernameAvailable(username)
        return result.available
      },

      /**
       * Initialize auth state on app load
       * Restores session from storage and sets up auth listener
       */
      initialize: async () => {
        if (get().initialized) return

        set({ loading: true })

        // Get existing session
        const result = await authApi.getSession()

        let profile: Profile | null = null
        if (result.user) {
          const profileResult = await authApi.getProfile(result.user.id)
          profile = profileResult.profile
        }

        set({
          user: result.user,
          session: result.session,
          profile,
          loading: false,
          initialized: true,
          error: null,
        })

        // Subscribe to auth changes
        authApi.onAuthStateChange(async (user, session) => {
          let newProfile: Profile | null = null
          if (user) {
            const profileResult = await authApi.getProfile(user.id)
            newProfile = profileResult.profile
          }

          set({
            user,
            session,
            profile: newProfile,
          })
        })
      },

      /**
       * Clear any error message
       */
      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      // Only persist minimal data - session will be restored from Supabase
      partialize: (state) => ({
        // We don't persist sensitive data - Supabase handles session persistence
        // This is just for UI state like "remember me" preferences in the future
      }),
    }
  )
)

// Selector hooks for common access patterns
export const useUser = () => useAuthStore((state) => state.user)
export const useProfile = () => useAuthStore((state) => state.profile)
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user)
export const useAuthLoading = () => useAuthStore((state) => state.loading)
export const useAuthError = () => useAuthStore((state) => state.error)
