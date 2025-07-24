import { createClient } from '@supabase/supabase-js'

// Vite exposes env variables on import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Environment variables:', {
        url: !!supabaseUrl,
        key: !!supabaseAnonKey
    })
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
