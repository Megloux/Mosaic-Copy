import { useEffect, useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/cards/Card'
import { useExerciseStore, useFilteredExercises } from '@/store/exerciseStore'
import { NetworkStatus } from '@/components/ui/NetworkStatus'
import { useNetworkStatus } from '@/lib/network/networkService'
import { getOrFetchMedia } from '@/lib/storage/mediaCache'
import type { Exercise } from '@/lib/supabase/types'

/**
 * Enhanced demo component showcasing offline-first functionality
 * Demonstrates exercise fetching, filtering, and selection with offline support
 */
export const OfflineExerciseDemo = () => {
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
  
  const { isOnline } = useNetworkStatus()
  const [searchTerm, setSearchTerm] = useState('')
  const filteredExercises = useFilteredExercises()
  const [mediaCache, setMediaCache] = useState<Record<string, string | null>>({})

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

  // Pre-load media for visible exercises
  useEffect(() => {
    const loadMedia = async () => {
      const exercisesToLoad = [...filteredExercises, ...selectedExercisesList]
      
      for (const exercise of exercisesToLoad) {
        if (exercise.thumbnail_url && !mediaCache[exercise.thumbnail_url]) {
          try {
            const url = await getOrFetchMedia(
              exercise.thumbnail_url, 
              'image', 
              { exerciseId: exercise.id, priority: 'high' }
            )
            
            setMediaCache(prev => ({
              ...prev,
              [exercise.thumbnail_url]: url
            }))
          } catch (error) {
            console.error(`Failed to load media for ${exercise.id}:`, error)
            setMediaCache(prev => ({
              ...prev,
              [exercise.thumbnail_url]: null
            }))
          }
        }
      }
    }
    
    loadMedia()
  }, [filteredExercises, selectedExercisesList])

  return (
    <Section className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Offline-First Exercise Demo</h1>
        <p className="text-muted-foreground">
          This demo showcases the offline-first approach with IndexedDB storage and media caching.
        </p>
      </div>
      
      {/* Network Status */}
      <NetworkStatus />
      
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

      {/* Offline indicator */}
      {!isOnline && (
        <div className="p-4 border border-amber-300 bg-amber-50 text-amber-700 rounded-md" role="alert">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">You're currently offline</span>
          </div>
          <p className="mt-1 ml-7">
            Showing data from local storage. Changes will be synchronized when you're back online.
          </p>
        </div>
      )}
      
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
                    thumbnailUrl={mediaCache[exercise.thumbnail_url || '']}
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
                    thumbnailUrl={mediaCache[exercise.thumbnail_url || '']}
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
  thumbnailUrl?: string | null
}

// Enhanced exercise item with thumbnail support
const ExerciseItem = ({ 
  exercise, 
  isSelected, 
  onToggle,
  thumbnailUrl
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
      <div className="flex gap-3">
        {/* Thumbnail with placeholder fallback */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
          {thumbnailUrl ? (
            <img 
              src={thumbnailUrl} 
              alt={`Thumbnail for ${exercise.exercise_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{exercise.exercise_name}</h3>
              {exercise.setup_instructions && (
                <p className="text-sm text-muted-foreground line-clamp-2">{exercise.setup_instructions}</p>
              )}
              {/* Category tag */}
              {exercise.category_name && (
                <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {exercise.category_name}
                </span>
              )}
            </div>
            <div 
              className="flex items-center justify-center h-6 w-6 rounded-full border border-current ml-2"
              aria-hidden="true"
            >
              {isSelected && <div className="h-3 w-3 rounded-full bg-blue-500" />}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
