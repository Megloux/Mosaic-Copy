import React, { useState, useEffect, useCallback } from 'react'
import { useExerciseLibraryStore } from '@/features/exercises/model/exerciseLibraryStore'
import { Grid } from '@/shared/ui/Grid'
import { SearchInput } from '@/shared/ui/form/SearchInput'
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard'
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail'
import { Exercise } from '@/data/core/exercises'
import { motion } from 'framer-motion'

// Define view type options
type ViewType = 'grid' | 'list'

// Define category and exercise types for better type safety
interface Category {
  id: string;
  name: string;
}

// Define category with exercises for the grouped display
interface CategoryWithExercises extends Category {
  exercises: Exercise[];
}

// Define props interface with clear boundaries
export interface ExerciseLibraryProps {
  onAddToRoutineBuilder: (exercise: Exercise) => void
  className?: string
}

/**
 * ExerciseLibrary component - Main container for the Exercise Library
 * 
 * Features:
 * - Displays exercises organized by category in Spotify-inspired layout
 * - Provides search functionality
 * - Expandable/collapsible categories
 * - Handles exercise selection and detail view
 * - Connects to Zustand store for state management
 */
export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  onAddToRoutineBuilder,
  className = ''
}) => {
  // Get data and actions from the Zustand store
  const { 
    exercises,
    categories,
    viewType,
    searchQuery,
    selectedCategory,
    loading,
    error,
    fetchExercises,
    fetchCategories,
    setViewType,
    setSearchQuery,
    setSelectedCategory,
    setSelectedExercise
  } = useExerciseLibraryStore()
  
  // Local state for modal visibility and expanded categories
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedExercise, setLocalSelectedExercise] = useState<Exercise | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  
  // Fetch exercises and categories when component mounts
  useEffect(() => {
    fetchExercises()
    fetchCategories()
  }, [fetchExercises, fetchCategories])
  
  // Handle search input
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value)
  }, [setSearchQuery])
  
  // Handle exercise click
  const handleExerciseClick = useCallback((exercise: Exercise) => {
    setLocalSelectedExercise(exercise)
    setSelectedExercise(exercise)
    setIsDetailOpen(true)
  }, [setSelectedExercise])
  
  // Handle modal close
  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false)
  }, [])
  
  // Handle view type toggle
  const handleViewTypeChange = useCallback((type: ViewType) => {
    setViewType(type)
  }, [setViewType])
  
  // Handle category selection
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
  }, [setSelectedCategory])
  
  // Toggle category expansion
  const toggleCategoryExpansion = useCallback((categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }, [])
  
  // Group exercises by category
  const exercisesByCategory = categories.map((category: Category) => {
    const categoryExercises = exercises.filter((exercise: Exercise) => {
      const matchesCategory = exercise.category_id === category.id
      const matchesSearch = searchQuery 
        ? exercise.exercise_name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      
      return matchesCategory && matchesSearch
    })
    
    return {
      ...category,
      exercises: categoryExercises
    }
  }).filter((category: CategoryWithExercises) => category.exercises.length > 0)
  
  // Render loading state
  if (loading) {
    return (
      <div className={`p-[var(--container-padding-md)] ${className}`}>
        <p>Loading exercises...</p>
      </div>
    )
  }
  
  // Render error state
  if (error) {
    return (
      <div className={`p-[var(--container-padding-md)] ${className}`}>
        <p>Error loading exercises. Please try again.</p>
      </div>
    )
  }
  
  return (
    <div className={`exercise-library bg-[rgba(var(--color-background),1)] ${className}`}>
      {/* Header with title, search and view toggle */}
      <div className="flex items-center justify-between p-[var(--container-padding-md)]">
        <h1 className="text-xl font-bold">Exercise Categories</h1>
        <div className="flex items-center gap-4">
          <SearchInput
            placeholder="Search exercises..."
            value={searchQuery}
            onSearch={handleSearch}
            enableHaptics={true}
            className="w-full max-w-[200px]"
          />
          <button 
            className="p-2 rounded-full bg-[rgba(var(--color-primary),1)] text-white"
            aria-label="Add exercise"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Category filter pills */}
      <div className="flex overflow-x-auto gap-2 px-[var(--container-padding-md)] pb-[var(--container-padding-sm)]">
        <button
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
            selectedCategory === null 
              ? 'bg-[rgba(var(--color-primary),1)] text-white' 
              : 'bg-[rgba(var(--color-surface),1)] hover:bg-[rgba(var(--color-surface-hover),1)]'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category: Category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
              selectedCategory === category.id 
                ? 'bg-[rgba(var(--color-primary),1)] text-white' 
                : 'bg-[rgba(var(--color-surface),1)] hover:bg-[rgba(var(--color-surface-hover),1)]'
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* Sort and view toggle */}
      <div className="flex items-center justify-between px-[var(--container-padding-md)] py-[var(--container-padding-sm)] border-b border-[rgba(var(--color-border),1)]">
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-sm">Recently added</span>
        </div>
        <button 
          onClick={() => handleViewTypeChange(viewType === 'grid' ? 'list' : 'grid')}
          className="p-1"
        >
          {viewType === 'grid' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Main content - Categories and exercises */}
      <div className="flex-1 overflow-y-auto">
        {exercisesByCategory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[rgba(var(--color-foreground),0.6)]">No exercises found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="p-[var(--container-padding-md)]">
            {exercisesByCategory.map((category: CategoryWithExercises) => (
              <div key={category.id} className="mb-6">
                {/* Category header */}
                <div 
                  className="flex items-center p-2 hover:bg-[rgba(var(--color-surface-hover),1)] rounded cursor-pointer"
                  onClick={() => toggleCategoryExpansion(category.id)}
                >
                  <div className="w-12 h-12 bg-[rgb(var(--core-teal))] rounded mr-3 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{category.name}</h3>
                    <p className="text-sm text-[rgba(var(--color-foreground),0.6)]">
                      Category • {category.exercises.length} exercises
                    </p>
                  </div>
                  <div className="ml-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandedCategories[category.id] ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                {/* Expanded exercises */}
                {expandedCategories[category.id] && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 ml-6 pl-9 border-l border-[rgba(var(--color-border),1)]"
                  >
                    {viewType === 'grid' ? (
                      <Grid 
                        layout="responsive" 
                        gap="md" 
                        cols={2}
                        className="w-full"
                      >
                        {category.exercises.map((exercise: Exercise) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onClick={() => handleExerciseClick(exercise)}
                            enableHaptics={true}
                          />
                        ))}
                      </Grid>
                    ) : (
                      <div className="space-y-2">
                        {category.exercises.map((exercise: Exercise) => (
                          <div 
                            key={exercise.id} 
                            className="py-2 px-3 hover:bg-[rgba(var(--color-surface-hover),1)] rounded cursor-pointer flex items-center"
                            onClick={() => handleExerciseClick(exercise)}
                          >
                            <div className="w-10 h-10 rounded bg-[rgba(var(--color-surface-accent),1)] mr-3 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="font-medium uppercase">{exercise.exercise_name}</div>
                              <div className="text-xs text-[rgba(var(--color-foreground),0.6)] flex items-center">
                                <span>{exercise.standard_time}</span>
                                <span className="mx-1">•</span>
                                <span>Springs: {exercise.spring_setup.light_springs} light, {exercise.spring_setup.heavy_springs} heavy</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Exercise detail modal */}
      {selectedExercise && (
        <ExerciseDetail
          exercise={selectedExercise}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          onAddToRoutineBuilder={onAddToRoutineBuilder}
        />
      )}
    </div>
  )
}
