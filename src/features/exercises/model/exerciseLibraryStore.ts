import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Exercise } from '@/data/core/exercises'
import { 
  abs_exercises, 
  obliques_exercises, 
  lower_body_lsd_exercises, 
  lower_body_heavy_exercises, 
  upper_body_exercises,
  lower_body_straps_exercises,
  cardio_bursts_exercises
} from '@/data/core/exercises'

// Define the categories
export interface Category {
  id: string;
  name: string;
  icon?: string;
}

// Define the state interface
export interface ExerciseLibraryState {
  exercises: Exercise[];
  categories: Category[];
  selectedExercise: Exercise | null;
  viewType: 'grid' | 'list';
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchExercises: () => void;
  fetchCategories: () => void;
  setSelectedExercise: (exercise: Exercise | null) => void;
  setViewType: (viewType: 'grid' | 'list') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
}

// Create the store
export const useExerciseLibraryStore = create<ExerciseLibraryState>()(
  persist(
    (set, get) => ({
      exercises: [],
      categories: [
        { id: 'c1', name: 'Abs' },
        { id: 'c2', name: 'Obliques' },
        { id: 'c3', name: 'Lower Body (Heavy)' },
        { id: 'c4', name: 'Lower Body (LSD)' },
        { id: 'c5', name: 'Lower Body Straps' },
        { id: 'c6', name: 'Upper Body' },
        { id: 'c7', name: 'Cardio Bursts' }
      ],
      selectedExercise: null,
      viewType: 'grid',
      searchQuery: '',
      selectedCategory: null,
      loading: false,
      error: null,
      
      // Fetch exercises from the data file
      fetchExercises: () => {
        set({ loading: true });
        
        try {
          // Combine all exercise objects into a single array
          const allExercises = [
            ...Object.values(abs_exercises),
            ...Object.values(obliques_exercises),
            ...Object.values(lower_body_lsd_exercises),
            ...Object.values(lower_body_heavy_exercises),
            ...Object.values(upper_body_exercises),
            ...Object.values(lower_body_straps_exercises),
            ...Object.values(cardio_bursts_exercises)
          ];
          
          set({ 
            exercises: allExercises,
            loading: false,
            error: null
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to fetch exercises' 
          });
        }
      },
      
      // Fetch categories (already defined in initial state, but added for completeness)
      fetchCategories: () => {
        // Categories are hardcoded in the initial state, but this method
        // could be expanded to fetch from an API in the future
        set({ 
          categories: [
            { id: 'c1', name: 'Abs' },
            { id: 'c2', name: 'Obliques' },
            { id: 'c3', name: 'Lower Body (Heavy)' },
            { id: 'c4', name: 'Lower Body (LSD)' },
            { id: 'c5', name: 'Lower Body Straps' },
            { id: 'c6', name: 'Upper Body' },
            { id: 'c7', name: 'Cardio Bursts' }
          ]
        });
      },
      
      // Set the selected exercise
      setSelectedExercise: (exercise) => {
        set({ selectedExercise: exercise });
      },
      
      // Set the view type (grid or list)
      setViewType: (viewType) => {
        set({ viewType });
      },
      
      // Set the search query
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      // Set the selected category
      setSelectedCategory: (categoryId) => {
        set({ selectedCategory: categoryId });
      }
    }),
    {
      name: 'exercise-library-storage',
      partialize: (state) => ({ viewType: state.viewType }),
    }
  )
);
