import { create } from 'zustand'
import { from } from '@/lib/supabase/client'
import { getAllFromStore, saveToStore } from '@/lib/storage/db'
import { isOffline } from '@/lib/supabase/client'
import type { Exercise, Category } from '@/lib/supabase/types'

interface ExerciseState {
  // Data
  exercises: Exercise[]
  selectedExercises: Record<string, boolean>
  categories: Category[]
  
  // Filters
  searchQuery: string
  selectedCategory: string | null
  
  // Status
  loading: boolean
  error: Error | null
  
  // Actions
  fetchExercises: () => Promise<void>
  fetchCategories: () => Promise<void>
  setSearchQuery: (query: string) => void
  setSelectedCategory: (categoryId: string | null) => void
  toggleExerciseSelection: (exerciseId: string) => void
  selectExercise: (exerciseId: string) => void
  deselectExercise: (exerciseId: string) => void
  clearSelectedExercises: () => void
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  // Initial state
  exercises: [],
  selectedExercises: {},
  categories: [],
  searchQuery: '',
  selectedCategory: null,
  loading: false,
  error: null,
  
  // Actions
  fetchExercises: async () => {
    set({ loading: true, error: null })
    
    try {
      if (isOffline()) {
        // Get from IndexedDB when offline
        const exercises = await getAllFromStore('exercises')
        set({ exercises, loading: false })
        return
      }
      
      // Build query
      let query = from.exercises().select('*').order('exercise_name')
      
      if (get().selectedCategory) {
        query = query.eq('category_id', get().selectedCategory)
      }
      
      const { data, error } = await query
      
      if (error) {
        throw error
      }
      
      // Save each exercise to IndexedDB
      if (data) {
        for (const exercise of data) {
          await saveToStore('exercises', exercise)
        }
      }
      
      set({ exercises: data as Exercise[] || [], loading: false })
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
      set({ error: error as Error, loading: false })
    }
  },
  
  fetchCategories: async () => {
    try {
      if (isOffline()) {
        // Get from IndexedDB when offline
        const categories = await getAllFromStore('categories')
        set({ categories })
        return
      }
      
      const { data, error } = await from
        .categories()
        .select('*')
        .order('name')
      
      if (error) {
        throw error
      }
      
      // Save each category to IndexedDB
      if (data) {
        for (const category of data) {
          await saveToStore('categories', category)
        }
      }
      
      set({ categories: data as Category[] || [] })
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedCategory: (categoryId) => {
    set({ selectedCategory: categoryId })
    // Reload exercises when category changes
    get().fetchExercises()
  },
  
  toggleExerciseSelection: (exerciseId) => {
    set((state) => ({
      selectedExercises: {
        ...state.selectedExercises,
        [exerciseId]: !state.selectedExercises[exerciseId]
      }
    }))
  },
  
  selectExercise: (exerciseId) => {
    set((state) => ({
      selectedExercises: {
        ...state.selectedExercises,
        [exerciseId]: true
      }
    }))
  },
  
  deselectExercise: (exerciseId) => {
    set((state) => ({
      selectedExercises: {
        ...state.selectedExercises,
        [exerciseId]: false
      }
    }))
  },
  
  clearSelectedExercises: () => set({ selectedExercises: {} })
}))

// Selector for filtered exercises
export const useFilteredExercises = () => {
  const { exercises, searchQuery } = useExerciseStore()
  
  return exercises.filter((exercise) => {
    // Filter by search query if provided
    if (searchQuery && !exercise.exercise_name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })
}
