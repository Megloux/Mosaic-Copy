import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY

// Create client with appropriate key based on context
export const supabase = createClient(
  supabaseUrl,
  typeof window === 'undefined' ? supabaseServiceRoleKey : supabaseAnonKey
)

// Admin client for migrations and backend operations only
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
