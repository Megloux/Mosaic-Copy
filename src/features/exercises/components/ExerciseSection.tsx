import React, { useEffect } from 'react'
import { Section } from '@/components/ui/Section'
import { StandardButton } from '@/components/ui/buttons/StandardButton'
import { useExerciseStore, useFilteredExercises } from '@/features/exercises/model/exerciseStore'

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
        description={typeof error === 'string' ? error : (error?.message || 'Unknown error occurred')}
        action={
          <StandardButton 
            onClick={() => fetchExercises()}
            variant="outline"
          >
            Retry
          </StandardButton>
        }
        className={className}
      />
    )
  }

  // Main content: List exercises
  return (
    <Section heading="Exercises" className={className}>
      <div className="space-y-4">
        {filteredExercises.map((exercise: any) => (
          <div key={exercise.id} className="p-4 bg-white/5 rounded-lg">
            <h3 className="text-lg font-semibold mb-1">{exercise.exercise_name}</h3>
            <p className="text-sm text-foreground/60 mb-2">{exercise.setup_instructions}</p>
            <div className="flex gap-2 text-xs mb-2">
              <span>Springs: {exercise.spring_setup?.light_springs ?? 0}L/{exercise.spring_setup?.heavy_springs ?? 0}H</span>
              <span>Time: {exercise.standard_time}</span>
            </div>
            <div className="text-xs text-foreground/50 mb-2">{exercise.movement_notes}</div>
            <div className="text-xs text-foreground/50 mb-2">Cueing: {exercise.cueing}</div>
            <div className="text-xs text-foreground/50 mb-2">This/That: {exercise.this_that}</div>
            {exercise.vimeo_id && (
              <a href={`https://vimeo.com/${exercise.vimeo_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">Watch Video</a>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
}
