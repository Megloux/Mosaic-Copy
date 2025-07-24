import { useEffect, useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/cards/Card'
import { useExerciseStore, useFilteredExercises } from '@/store/exerciseStore'
import type { Exercise } from '@/lib/supabase/types'

/**
 * Demo component to showcase Zustand store functionality
 * Demonstrates exercise fetching, filtering, and selection
 */
export const ExerciseStoreDemo = () => {
  const { 
    exercises,
    categories, 
    loading, 
    error,
    selectedExercises,
    fetchExercises,
    fetchCategories,
    setSearchQuery,
    setSelectedCategory,
    toggleExerciseSelection,
    clearSelectedExercises
  } = useExerciseStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const filteredExercises = useFilteredExercises()

  // Load data on component mount
  useEffect(() => {
    fetchCategories()
    fetchExercises()
  }, [fetchCategories, fetchExercises])

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchTerm, setSearchQuery])

  // Get selected exercises
  const selectedExercisesList = exercises.filter(
    exercise => selectedExercises[exercise.id]
  )

  return (
    <Section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Exercise Store Demo</h1>
        <p className="text-muted-foreground">
          This demo showcases the Zustand store for exercise management.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:w-64">
          <label htmlFor="exercise-search" className="sr-only">Search exercises</label>
          <input
            id="exercise-search"
            type="search"
            placeholder="Search exercises..."
            className="rounded-md border px-3 py-2 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search exercises"
          />
        </div>
        
        <div>
          <label htmlFor="category-select" className="sr-only">Filter by category</label>
          <select
            id="category-select"
            className="rounded-md border px-3 py-2"
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={clearSelectedExercises}
          aria-label="Clear selection"
        >
          Clear Selection
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md" role="alert">
          <h2 className="font-semibold">Error loading exercises</h2>
          <p>{error.message}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
            onClick={() => {
              fetchExercises()
              fetchCategories()
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-8 text-center" aria-live="polite">
          <div 
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" 
            aria-hidden="true"
          />
          <p className="mt-2">Loading exercises...</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-4" id="exercise-list-heading">
              Exercise Library ({filteredExercises.length})
            </h2>
            <div 
              className="space-y-2"
              role="list"
              aria-labelledby="exercise-list-heading"
            >
              {filteredExercises.length === 0 ? (
                <p className="text-muted-foreground">No exercises found</p>
              ) : (
                filteredExercises.map((exercise) => (
                  <ExerciseItem 
                    key={exercise.id} 
                    exercise={exercise} 
                    isSelected={!!selectedExercises[exercise.id]}
                    onToggle={() => toggleExerciseSelection(exercise.id)}
                  />
                ))
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4" id="selected-exercises-heading">
              Selected Exercises ({selectedExercisesList.length})
            </h2>
            <div 
              className="space-y-2"
              role="list"
              aria-labelledby="selected-exercises-heading"
            >
              {selectedExercisesList.length === 0 ? (
                <p className="text-muted-foreground">No exercises selected</p>
              ) : (
                selectedExercisesList.map((exercise) => (
                  <ExerciseItem 
                    key={exercise.id} 
                    exercise={exercise} 
                    isSelected={true}
                    onToggle={() => toggleExerciseSelection(exercise.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}

interface ExerciseItemProps {
  exercise: Exercise
  isSelected: boolean
  onToggle: () => void
}

// Helper component to display an exercise
const ExerciseItem = ({ 
  exercise, 
  isSelected, 
  onToggle 
}: ExerciseItemProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer ${isSelected ? 'border-blue-500 border-2' : ''}`} 
      onClick={onToggle}
      role="listitem"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onToggle()
          e.preventDefault()
        }
      }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{exercise.exercise_name}</h3>
          {exercise.setup_instructions && (
            <p className="text-sm text-muted-foreground line-clamp-2">{exercise.setup_instructions}</p>
          )}
        </div>
        <div 
          className="flex items-center justify-center h-6 w-6 rounded-full border border-current"
          aria-hidden="true"
        >
          {isSelected && <div className="h-3 w-3 rounded-full bg-blue-500" />}
        </div>
      </div>
    </Card>
  )
}
