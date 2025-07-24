export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          exercise_name: string
          category_id: string | null
          setup_instructions: string | null
          movement_notes: string | null
          cueing: string | null
          this_that: string | null
          spring_setup: Json
          template_tags: string[]
          vimeo_id: string | null
          standard_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          exercise_name: string
          category_id?: string | null
          setup_instructions?: string | null
          movement_notes?: string | null
          cueing?: string | null
          this_that?: string | null
          spring_setup?: Json
          template_tags?: string[]
          vimeo_id?: string | null
          standard_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          exercise_name?: string
          category_id?: string | null
          setup_instructions?: string | null
          movement_notes?: string | null
          cueing?: string | null
          this_that?: string | null
          spring_setup?: Json
          template_tags?: string[]
          vimeo_id?: string | null
          standard_time?: string | null
          updated_at?: string
        }
      }
      blocks: {
        Row: {
          id: string
          name: string
          description: string | null
          exercises: Json
          total_duration: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          exercises: Json
          total_duration?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          exercises?: Json
          total_duration?: string | null
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          blocks: Json
          estimated_duration: string | null
          difficulty_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          blocks: Json
          estimated_duration?: string | null
          difficulty_level: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          blocks?: Json
          estimated_duration?: string | null
          difficulty_level?: number
          updated_at?: string
        }
      }
    }
  }
}

// Derived types for better DX
export type Tables = Database['public']['Tables']
export type TableName = keyof Tables

// Type-safe row types
export type Category = Tables['categories']['Row']
export type Exercise = Tables['exercises']['Row']
export type Block = Tables['blocks']['Row']
export type Template = Tables['templates']['Row']

// Type-safe insert types
export type CategoryInsert = Tables['categories']['Insert']
export type ExerciseInsert = Tables['exercises']['Insert']
export type BlockInsert = Tables['blocks']['Insert']
export type TemplateInsert = Tables['templates']['Insert']

// Type-safe update types
export type CategoryUpdate = Tables['categories']['Update']
export type ExerciseUpdate = Tables['exercises']['Update']
export type BlockUpdate = Tables['blocks']['Update']
export type TemplateUpdate = Tables['templates']['Update']
