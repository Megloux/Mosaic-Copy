import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Card } from '@/components/ui/cards/Card'
import { StandardButton } from '@/components/ui/buttons/StandardButton'
import { Exercise } from '@/data/core/exercises'

// Define the props interface with clear boundaries
export interface ExerciseDetailProps {
  exercise: Exercise;           // The exercise to display
  isOpen: boolean;              // Whether the modal is open
  onClose: () => void;          // Handler for closing the modal
  onAddToRoutineBuilder: (exercise: Exercise) => void;  // Handler for adding to routine builder
}

/**
 * ExerciseDetail component - Modal with four-card structure for exercise details
 * 
 * Features:
 * - Four distinct cards for different types of information
 * - Video thumbnail with exercise name
 * - Setup & basics information
 * - Movement details with cueing
 * - This/That comparison points
 * - Add to routine functionality
 */
const ExerciseDetail: React.FC<ExerciseDetailProps> = ({
  exercise,
  isOpen,
  onClose,
  onAddToRoutineBuilder
}) => {
  // Local state for image error handling
  const [imageError, setImageError] = useState(false)
  
  // Determine the thumbnail URL based on the Vimeo ID
  const thumbnailUrl = exercise.vimeo_id 
    ? `https://vumbnail.com/${exercise.vimeo_id}.jpg`
    : '/images/exercise-placeholder.jpg'
  
  // Handle adding exercise to routine builder
  const handleAddExercise = () => {
    onAddToRoutineBuilder(exercise)
    // Don't close the modal automatically - let the caller decide
  }

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose}
      size="default"
      enableHaptics={true}
    >
      {/* Modal Header with Add Button */}
      <div className="flex items-center justify-between p-[var(--container-padding-md)] border-b border-border">
        <h2 className="text-xl font-semibold">Exercise Details</h2>
        <StandardButton
          variant="default"
          size="default"
          onClick={handleAddExercise}
          leftIcon={<span className="text-lg">+</span>}
          enableHaptics={true}
        >
          Add to Routine
        </StandardButton>
      </div>

      {/* Modal Content - Four Card Structure */}
      <div className="p-[var(--container-padding-md)] space-y-4 overflow-y-auto max-h-[70vh]">
        {/* Card 1: Video Thumbnail */}
        <Card variant="outline" padding="medium" className="overflow-hidden">
          <div className="text-center mb-2">
            <h3 className="text-lg font-medium">{exercise.exercise_name}</h3>
          </div>
          <div className="aspect-video relative overflow-hidden rounded-md">
            {!imageError ? (
              <img
                src={thumbnailUrl}
                alt={exercise.exercise_name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-surface-hover">
                <span className="text-foreground/60">No Video Available</span>
              </div>
            )}
          </div>
        </Card>

        {/* Card 2: Setup & Basics */}
        <Card variant="outline" padding="medium">
          <h4 className="text-base font-semibold mb-3">Setup & Basics</h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground/80 mb-1">Setup Instructions:</p>
              <p className="text-sm">{exercise.setup_instructions}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/80 mb-1">Category:</p>
                <div className="inline-block px-2 py-0.5 bg-surface-hover rounded-full text-xs">
                  {exercise.category_id}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-foreground/80 mb-1">Standard Time:</p>
                <p className="text-sm">{exercise.standard_time}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-foreground/80 mb-1">Spring Load:</p>
              <p className="text-sm">
                {exercise.spring_setup.light_springs} Light, {exercise.spring_setup.heavy_springs} Heavy
              </p>
            </div>
          </div>
        </Card>

        {/* Card 3: Movement Details */}
        <Card variant="outline" padding="medium">
          <h4 className="text-base font-semibold mb-3">Movement Details</h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-foreground/80 mb-1">Movement Notes:</p>
              <p className="text-sm">{exercise.movement_notes}</p>
            </div>
            
            <div>
              <p className="text-sm text-foreground/80 mb-1">Cueing:</p>
              <p className="text-sm">{exercise.cueing}</p>
            </div>
          </div>
        </Card>

        {/* Card 4: This/That Comparison */}
        <Card variant="outline" padding="medium">
          <h4 className="text-base font-semibold mb-3">This/That Comparison</h4>
          
          <div>
            <p className="text-sm whitespace-pre-line">{exercise.this_that}</p>
          </div>
        </Card>
      </div>
      
      {/* Modal Footer */}
      <div className="p-[var(--container-padding-md)] border-t border-border">
        <StandardButton
          variant="outline"
          size="default"
          onClick={onClose}
          className="w-full"
        >
          Close
        </StandardButton>
      </div>
    </Modal>
  )
}

export { ExerciseDetail }
