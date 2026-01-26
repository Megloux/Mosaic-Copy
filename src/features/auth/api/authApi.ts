/**
 * Auth API - Supabase Auth Wrapper
 * 
 * This module wraps Supabase Auth calls so components don't talk directly to Supabase.
 * If we ever switch auth providers, we only change this file.
 */

import { supabase } from '@/config/supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  username: string | null
  studio_name: string | null
  is_pro: boolean
  studio_id: string | null
  created_at: string
  updated_at: string
}

export interface SignupData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  username?: string
  studioName?: string
}

export interface AuthResult {
  user: User | null
  session: Session | null
  error: string | null
}

export interface ProfileResult {
  profile: Profile | null
  error: string | null
}

/**
 * Sign up a new user with email and password
 * Also creates a profile row in the profiles table
 */
export async function signUp(data: SignupData): Promise<AuthResult> {
  try {
    const { email, password, firstName, lastName, phone, username, studioName } = data

    // Check if username is taken (if provided)
    if (username) {
      const { available, error: usernameError } = await checkUsernameAvailable(username)
      if (usernameError) {
        return { user: null, session: null, error: usernameError }
      }
      if (!available) {
        return { user: null, session: null, error: 'Username is already taken' }
      }
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      // Provide user-friendly error messages
      if (error.message.includes('already registered')) {
        return { user: null, session: null, error: 'An account with this email already exists. Try signing in instead.' }
      }
      return { user: null, session: null, error: error.message }
    }

    // Update profile row with additional fields (row created by database trigger)
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          username: username || null,
          studio_name: studioName || null,
        })
        .eq('id', authData.user.id)

      if (profileError) {
        console.error('Failed to update profile:', profileError)
        // Don't fail signup if profile update fails - user can update later
      }
    }

    return { user: authData.user, session: authData.session, error: null }
  } catch (err) {
    return { 
      user: null, 
      session: null, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, session: null, error: error.message }
    }

    return { user: data.user, session: data.session, error: null }
  } catch (err) {
    return { 
      user: null, 
      session: null, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Get the current session (for restoring auth state on app load)
 */
export async function getSession(): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      return { user: null, session: null, error: error.message }
    }

    // Also get the user if session exists
    if (data.session) {
      const { data: userData } = await supabase.auth.getUser()
      return { user: userData.user, session: data.session, error: null }
    }

    return { user: null, session: null, error: null }
  } catch (err) {
    return { 
      user: null, 
      session: null, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Get the current user's profile from the profiles table
 */
export async function getProfile(userId: string): Promise<ProfileResult> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: data as Profile, error: null }
  } catch (err) {
    return { 
      profile: null, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Update the current user's profile (e.g., set username)
 */
export async function updateProfile(
  userId: string, 
  updates: Partial<Pick<Profile, 'username'>>
): Promise<ProfileResult> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      return { profile: null, error: error.message }
    }

    return { profile: data as Profile, error: null }
  } catch (err) {
    return { 
      profile: null, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (err) {
    return { 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Delete user account and all associated data
 * Required for iOS App Store compliance (Guideline 5.1.1(v))
 */
export async function deleteAccount(): Promise<{ error: string | null }> {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser()
    
    if (!userData.user) {
      return { error: 'No user logged in' }
    }

    const userId = userData.user.id

    // Delete profile (this will cascade to delete routines, etc. via RLS)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Failed to delete profile:', profileError)
      return { error: 'Failed to delete account data' }
    }

    // Sign out the user (the auth.users row deletion requires admin API or Edge Function)
    // For now, we delete the profile data and sign out
    // Full auth.users deletion should be handled by a Supabase Edge Function with service role
    await supabase.auth.signOut()

    return { error: null }
  } catch (err) {
    return { 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Check if a username is available
 */
export async function checkUsernameAvailable(username: string): Promise<{ available: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (error) {
      return { available: false, error: error.message }
    }

    return { available: data === null, error: null }
  } catch (err) {
    return { 
      available: false, 
      error: err instanceof Error ? err.message : 'An unexpected error occurred' 
    }
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null, session)
  })
}
