import { renderHook, act } from '@testing-library/react'
import { useExerciseLibraryStore } from '@/store/exerciseLibraryStore'

// Mock the exercise data modules
jest.mock('@/data/core/exercises', () => ({
  Exercise: {},
  abs_exercises: {
    e1: {
      id: 'e1',
      exercise_name: 'Modified Plank',
      category_id: 'c1',
      spring_setup: { light_springs: 2, heavy_springs: 0 },
      template_tags: ['test'],
      vimeo_id: '12345',
      standard_time: '30s',
      muscle_tags: ['Core'],
      visual_cue: 'Test cue',
      setup_cues: ['Test setup'],
      movement_cues: ['Test movement'],
      breathing_cues: { exhale: 'Test', inhale: 'Test' },
      common_mistakes: ['Test mistake'],
      easier_modification: 'Test easier',
      harder_progression: 'Test harder'
    }
  },
  obliques_exercises: {
    e2: {
      id: 'e2',
      exercise_name: 'Side Plank',
      category_id: 'c2',
      spring_setup: { light_springs: 1, heavy_springs: 1 },
      template_tags: ['test'],
      vimeo_id: '23456',
      standard_time: '45s',
      muscle_tags: ['Obliques'],
      visual_cue: 'Test cue',
      setup_cues: ['Test setup'],
      movement_cues: ['Test movement'],
      breathing_cues: { exhale: 'Test', inhale: 'Test' },
      common_mistakes: ['Test mistake'],
      easier_modification: 'Test easier',
      harder_progression: 'Test harder'
    }
  },
  lower_body_lsd_exercises: {},
  lower_body_heavy_exercises: {},
  upper_body_exercises: {}
}))

describe('useExerciseLibraryStore', () => {
  // Clear the store state between tests
  beforeEach(() => {
    act(() => {
      const store = useExerciseLibraryStore.getState()
      store.exercises = []
      store.selectedExercise = null
      store.searchQuery = ''
      store.selectedCategory = null
      store.viewType = 'grid'
      store.loading = false
      store.error = null
    })
  })

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    expect(result.current.exercises).toEqual([])
    expect(result.current.categories).toHaveLength(5)
    expect(result.current.selectedExercise).toBeNull()
    expect(result.current.viewType).toBe('grid')
    expect(result.current.searchQuery).toBe('')
    expect(result.current.selectedCategory).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('fetchExercises should load exercises from data sources', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    act(() => {
      result.current.fetchExercises()
    })
    
    expect(result.current.exercises).toHaveLength(2)
    expect(result.current.exercises[0].id).toBe('e1')
    expect(result.current.exercises[1].id).toBe('e2')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test('fetchCategories should set the categories', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    // Clear categories first to test the method
    act(() => {
      const store = useExerciseLibraryStore.getState()
      store.categories = []
    })
    
    act(() => {
      result.current.fetchCategories()
    })
    
    expect(result.current.categories).toHaveLength(5)
    expect(result.current.categories[0].id).toBe('c1')
    expect(result.current.categories[0].name).toBe('Abs')
  })

  test('setSelectedExercise should update the selected exercise', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    const testExercise = {
      id: 'test',
      exercise_name: 'Test Exercise',
      category_id: 'c1',
      spring_setup: { light_springs: 1, heavy_springs: 1 },
      template_tags: [],
      vimeo_id: '12345',
      standard_time: '30s',
      muscle_tags: [],
      visual_cue: '',
      setup_cues: [],
      movement_cues: [],
      breathing_cues: { exhale: '', inhale: '' },
      common_mistakes: [],
      easier_modification: '',
      harder_progression: ''
    }
    
    act(() => {
      result.current.setSelectedExercise(testExercise)
    })
    
    expect(result.current.selectedExercise).toEqual(testExercise)
  })

  test('setViewType should update the view type', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    // Default is 'grid'
    expect(result.current.viewType).toBe('grid')
    
    act(() => {
      result.current.setViewType('list')
    })
    
    expect(result.current.viewType).toBe('list')
  })

  test('setSearchQuery should update the search query', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    act(() => {
      result.current.setSearchQuery('plank')
    })
    
    expect(result.current.searchQuery).toBe('plank')
  })

  test('setSelectedCategory should update the selected category', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    act(() => {
      result.current.setSelectedCategory('c1')
    })
    
    expect(result.current.selectedCategory).toBe('c1')
    
    // Test setting to null (all categories)
    act(() => {
      result.current.setSelectedCategory(null)
    })
    
    expect(result.current.selectedCategory).toBeNull()
  })

  test('should handle errors in fetchExercises', () => {
    const { result } = renderHook(() => useExerciseLibraryStore())
    
    // Mock implementation to throw an error
    const originalFetch = result.current.fetchExercises
    result.current.fetchExercises = jest.fn().mockImplementation(() => {
      throw new Error('Test error')
    })
    
    act(() => {
      result.current.fetchExercises()
    })
    
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Test error')
    
    // Restore original implementation
    result.current.fetchExercises = originalFetch
  })
})
