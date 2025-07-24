import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Initialize Supabase client
// Use process.env for Jest compatibility and fallback to hardcoded values for development
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-for-development'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key-for-development'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
})

// Admin client for migrations and backend operations only
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public',
  },
})

// Helper to check if we're offline
export const isOffline = () => !window.navigator.onLine

// Type-safe query builder helpers
export const from = {
  categories: () => supabase.from('categories'),
  exercises: () => supabase.from('exercises'),
  blocks: () => supabase.from('blocks'),
  templates: () => supabase.from('templates'),
}

// Realtime subscription helpers
export const subscribe = {
  categories: (callback: (payload: any) => void) => 
    supabase
      .channel('categories')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, callback)
      .subscribe(),
  
  exercises: (callback: (payload: any) => void) =>
    supabase
      .channel('exercises')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'exercises' }, callback)
      .subscribe(),
  
  blocks: (callback: (payload: any) => void) =>
    supabase
      .channel('blocks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blocks' }, callback)
      .subscribe(),
  
  templates: (callback: (payload: any) => void) =>
    supabase
      .channel('templates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, callback)
      .subscribe(),
}
