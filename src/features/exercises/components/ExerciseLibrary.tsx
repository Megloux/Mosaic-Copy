import React, { useState, useEffect, useCallback } from 'react'
import { useExerciseLibraryStore } from '@/features/exercises/model/exerciseLibraryStore'
import { SearchInput } from '@/shared/ui/form/SearchInput'
import { ExerciseCard } from '@/features/exercises/components/ExerciseCard'
import { ExerciseDetail } from '@/features/exercises/components/ExerciseDetail'
import { Exercise } from '@/data/core/exercises'
import { motion } from 'framer-motion'
import { LayoutGrid, List } from 'lucide-react'
import { Grid } from '@/shared/ui/Grid'

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
    <div
      className={`exercise-library min-h-screen ${className}`}
      style={{
        backgroundColor: 'rgb(var(--core-black))',
        fontFamily: 'var(--font-primary)',
      }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1
          className="text-2xl mb-1"
          style={{ color: 'rgb(var(--core-white))', fontWeight: 700, letterSpacing: '-0.03em' }}
        >
          Exercise Library
        </h1>
        <p className="text-sm mb-5" style={{ color: 'var(--text-secondary-color)', fontWeight: 'var(--text-secondary-weight)' }}>
          {exercises.length} exercises across {categories.length} categories
        </p>
        <SearchInput
          placeholder="Search exercises..."
          value={searchQuery}
          onSearch={handleSearch}
          enableHaptics={true}
          className="w-full"
        />
      </div>

      {/* View toggle + Category filter pills */}
      <div className="flex items-center gap-3 px-5 pb-4">
        <div
          className="flex items-center rounded-lg overflow-hidden flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            className="p-2 transition-colors"
            style={{
              backgroundColor: viewType === 'list' ? 'rgba(0,183,120,0.2)' : 'transparent',
              color: viewType === 'list' ? 'rgb(var(--core-teal))' : 'rgba(255,255,255,0.35)',
            }}
            onClick={() => setViewType('list')}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            className="p-2 transition-colors"
            style={{
              backgroundColor: viewType === 'grid' ? 'rgba(0,183,120,0.2)' : 'transparent',
              color: viewType === 'grid' ? 'rgb(var(--core-teal))' : 'rgba(255,255,255,0.35)',
            }}
            onClick={() => setViewType('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-2 px-5 pb-4 scrollbar-none">
        <button
          className="px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-colors"
          style={{
            backgroundColor: selectedCategory === null ? 'rgba(0,183,120,0.2)' : 'rgba(255,255,255,0.06)',
            color: selectedCategory === null ? 'rgb(var(--core-teal))' : 'rgba(255,255,255,0.5)',
            transitionDuration: 'var(--motion-natural)',
          }}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category: Category) => (
          <button
            key={category.id}
            className="px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold transition-colors"
            style={{
              backgroundColor: selectedCategory === category.id ? 'rgba(0,183,120,0.2)' : 'rgba(255,255,255,0.06)',
              color: selectedCategory === category.id ? 'rgb(var(--core-teal))' : 'rgba(255,255,255,0.5)',
              transitionDuration: 'var(--motion-natural)',
            }}
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {exercisesByCategory.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--text-tertiary-color)' }}>No exercises found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="px-5 pb-8">
            {exercisesByCategory.map((category: CategoryWithExercises) => (
              <div key={category.id} className="mb-4">
                {/* Category header */}
                <button
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors"
                  style={{ transitionDuration: 'var(--motion-natural)' }}
                  onClick={() => toggleCategoryExpansion(category.id)}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(0,183,120,0.12)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgb(var(--core-teal))' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-sm font-semibold" style={{ color: 'rgb(var(--core-white))', letterSpacing: '-0.01em' }}>
                      {category.name}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-secondary-color)', fontWeight: 'var(--text-secondary-weight)' }}>
                      {category.exercises.length} exercise{category.exercises.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${expandedCategories[category.id] ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded exercises */}
                {expandedCategories[category.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-1 ml-3 pl-3 space-y-1"
                    style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {viewType === 'grid' ? (
                      <Grid layout="fixed" gap="sm" cols={2} className="w-full">
                        {category.exercises.map((exercise: Exercise) => (
                          <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onClick={() => handleExerciseClick(exercise)}
                            enableHaptics={true}
                            layout="grid"
                          />
                        ))}
                      </Grid>
                    ) : (
                      category.exercises.map((exercise: Exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          onClick={() => handleExerciseClick(exercise)}
                          enableHaptics={true}
                          layout="list"
                        />
                      ))
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
