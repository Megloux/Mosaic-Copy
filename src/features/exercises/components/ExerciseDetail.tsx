import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Card } from '@/components/ui/cards/Card'
import { StandardButton } from '@/components/ui/buttons/StandardButton'
import { Exercise } from '@/types/exercises'

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
      {/* Modal Header with Close and Add Buttons */}
      <div className="flex items-center justify-between p-[var(--container-padding-md)] border-b border-border">
        <h2 className="text-xl font-semibold">Exercise Details</h2>
        <div className="flex items-center gap-2">
          <StandardButton
            variant="default"
            size="default"
            onClick={handleAddExercise}
            leftIcon={<span className="text-lg">+</span>}
            enableHaptics={true}
          >
            Add to Routine
          </StandardButton>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-full transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
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
            <div className="flex gap-4 text-sm">
              <span>Springs: {exercise.spring_setup?.light_springs ?? 0}L/{exercise.spring_setup?.heavy_springs ?? 0}H</span>
              <span>Time: {exercise.standard_time}</span>
            </div>
            
            {exercise.muscle_tags && exercise.muscle_tags.length > 0 && (
              <div>
                <p className="text-sm text-foreground/80 mb-1">Muscle Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscle_tags.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-surface-hover rounded-full text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            
            {exercise.setup_cues && exercise.setup_cues.length > 0 && (
              <div>
                <p className="text-sm text-foreground/80 mb-1">Setup Cues:</p>
                <ul className="text-sm space-y-1">
                  {exercise.setup_cues.map((cue: string, i: number) => (
                    <li key={i} className="flex gap-2"><span>•</span><span>{cue}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>

        {/* Card 3: Movement & Cueing */}
        <Card variant="outline" padding="medium">
          <h4 className="text-base font-semibold mb-3">Movement & Cueing</h4>
          <div className="space-y-3">
            {exercise.visual_cue && (
              <p className="text-sm italic text-foreground/80">"{exercise.visual_cue}"</p>
            )}
            
            {exercise.movement_cues && exercise.movement_cues.length > 0 && (
              <div>
                <p className="text-sm text-foreground/80 mb-1">Movement Cues:</p>
                <ul className="text-sm space-y-1">
                  {exercise.movement_cues.map((cue: string, i: number) => (
                    <li key={i} className="flex gap-2"><span>•</span><span>{cue}</span></li>
                  ))}
                </ul>
              </div>
            )}
            
            {exercise.breathing_cues && (exercise.breathing_cues.exhale || exercise.breathing_cues.inhale) && (
              <div>
                <p className="text-sm text-foreground/80 mb-1">Breathing:</p>
                <div className="text-sm space-y-1">
                  {exercise.breathing_cues.exhale && <p><strong>Exhale:</strong> {exercise.breathing_cues.exhale}</p>}
                  {exercise.breathing_cues.inhale && <p><strong>Inhale:</strong> {exercise.breathing_cues.inhale}</p>}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Card 4: Mistakes & Modifications */}
        <Card variant="outline" padding="medium">
          <h4 className="text-base font-semibold mb-3">Common Mistakes & Modifications</h4>
          <div className="space-y-3">
            {exercise.common_mistakes && exercise.common_mistakes.length > 0 && (
              <div>
                <p className="text-sm text-foreground/80 mb-1">Common Mistakes:</p>
                <ul className="text-sm space-y-1">
                  {exercise.common_mistakes.map((mistake: string, i: number) => (
                    <li key={i} className="flex gap-2 text-red-400"><span>✗</span><span>{mistake}</span></li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {exercise.easier_modification && (
                <div className="p-2 bg-green-500/10 rounded">
                  <p className="text-xs text-foreground/80 mb-1">Easier:</p>
                  <p className="text-sm">{exercise.easier_modification}</p>
                </div>
              )}
              {exercise.harder_progression && (
                <div className="p-2 bg-orange-500/10 rounded">
                  <p className="text-xs text-foreground/80 mb-1">Harder:</p>
                  <p className="text-sm">{exercise.harder_progression}</p>
                </div>
              )}
            </div>
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
