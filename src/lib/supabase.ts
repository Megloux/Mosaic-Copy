import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type-safe database interface
export type Database = {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string
          exercise_name: string
          category_id: string
          setup_instructions?: string
          movement_notes?: string
          cueing?: string
          this_that?: string
          spring_setup: {
            light_springs: number
            heavy_springs: number
          }
          template_tags: string[]
          vimeo_id?: string
          standard_time?: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['exercises']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['exercises']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      blocks: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['blocks']['Insert']>
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string
          structure: {
            blocks: Array<{
              id: string
              exercises: Array<{
                id: string
                time?: string
              }>
            }>
          }
          is_pro_only: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['templates']['Insert']>
      }
    }
  }
}
