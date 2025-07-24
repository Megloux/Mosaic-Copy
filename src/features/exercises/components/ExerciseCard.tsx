import React, { useState, useCallback } from 'react'
import { Card } from '@/components/ui/cards/Card'
import { Exercise } from '@/data/core/exercises'

// Define the props interface with clear boundaries
export interface ExerciseCardProps {
  exercise: Exercise
  onClick?: (exercise: Exercise) => void
  className?: string
  enableHaptics?: boolean
}

/**
 * ExerciseCard component for displaying an exercise in grid view
 * 
 * Features:
 * - Displays exercise thumbnail
 * - Shows exercise name
 * - Handles click events to open detail modal
 * - Provides visual feedback on interaction
 * - Handles image loading errors
 */
export const ExerciseCard = React.memo(({
  exercise,
  onClick,
  className = '',
  enableHaptics = true
}: ExerciseCardProps) => {
  // Local state for image error handling
  const [imageError, setImageError] = useState(false)
  
  // Determine the thumbnail URL based on the Vimeo ID
  const thumbnailUrl = exercise.vimeo_id 
    ? `https://vumbnail.com/${exercise.vimeo_id}.jpg`
    : '/images/exercise-placeholder.jpg'
  
  // Handle click with optional haptic feedback
  const handleClick = useCallback(() => {
    if (enableHaptics && window.navigator.vibrate) {
      window.navigator.vibrate(3) // Light haptic feedback
    }
    onClick?.(exercise)
  }, [exercise, onClick, enableHaptics])

  return (
    <Card
      className={`h-full transition-all ${className}`}
      onClick={handleClick}
      variant="default"
      padding="none"
    >
      <div className="aspect-video relative overflow-hidden">
        {!imageError ? (
          <img
            src={thumbnailUrl}
            alt={exercise.exercise_name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-hover">
            <span className="text-foreground/60">No Image</span>
          </div>
        )}
      </div>
      
      <div className="p-var(--container-padding-sm)">
        <h3 className="text-base font-medium leading-tight line-clamp-2">
          {exercise.exercise_name}
        </h3>
        
        <div className="mt-1 text-sm text-foreground/60">
          {/* Display category as a subtle label */}
          <span className="inline-block px-2 py-0.5 bg-surface-hover rounded-full text-xs">
            {exercise.category_id}
          </span>
        </div>
      </div>
    </Card>
  )
})

// Set display name for debugging
ExerciseCard.displayName = 'ExerciseCard'
