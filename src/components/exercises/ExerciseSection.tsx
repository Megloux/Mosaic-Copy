import React, { useEffect } from 'react'
import { Section } from '@/components/ui/Section'
import { StandardButton } from '@/components/ui/buttons/StandardButton'
import { useExerciseStore, useFilteredExercises } from '@/store/exerciseStore'
import type { Exercise } from '@/lib/supabase/types'

export interface ExerciseSectionProps {
  categoryId?: string
  className?: string
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({
  categoryId,
  className
}) => {
  // Use Zustand store instead of React Query
  const { 
    loading, 
    error, 
    fetchExercises,
    setSelectedCategory
  } = useExerciseStore()
  
  // Set category filter and fetch exercises on mount
  useEffect(() => {
    setSelectedCategory(categoryId || null)
    fetchExercises()
  }, [categoryId, fetchExercises, setSelectedCategory])
  
  // Get filtered exercises (already filtered by category in the store)
  const filteredExercises = useFilteredExercises()

  // Loading state
  if (loading) {
    return (
      <Section
        heading="Loading Exercises..."
        className={className}
      />
    )
  }

  // Error state
  if (error) {
    return (
      <Section
        heading="Error Loading Exercises"
        description={error.message || 'Unknown error occurred'}
        action={
          <StandardButton 
            variant="secondary"
            onClick={() => fetchExercises()}
          >
            Retry
          </StandardButton>
        }
        className={className}
      />
    )
  }

  // Empty state
  if (!filteredExercises.length) {
    return (
      <Section
        heading="No Exercises Found"
        description="Start by adding your first exercise"
        action={
          <StandardButton>
            Add Exercise
          </StandardButton>
        }
        className={className}
      />
    )
  }

  // Render exercises
  return (
    <Section
      heading="Exercise Library"
      description={`${filteredExercises.length} exercises available`}
      action={
        <StandardButton>
          Add Exercise
        </StandardButton>
      }
      className={className}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise: Exercise) => (
          <div
            key={exercise.id}
            className="p-4 rounded-lg bg-surface-raised hover:bg-surface-overlay transition-colors"
          >
            <h3 className="font-medium text-lg mb-2">{exercise.exercise_name}</h3>
            {exercise.setup_instructions && (
              <p className="text-sm text-foreground/60 mb-4">{exercise.setup_instructions}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {exercise.standard_time || 'Duration not set'}
              </span>
              {exercise.vimeo_id && (
                <StandardButton variant="secondary">
                  Watch Video
                </StandardButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
