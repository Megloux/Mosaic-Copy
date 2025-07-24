import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { RoutineBlock as RoutineBlockType, RoutineExercise } from '@/types/templates';
import { ExerciseItem } from '@/components/routines/builder/components/ExerciseItem';
import { cn } from '@/lib/utils';

interface RoutineBlockProps {
  block: RoutineBlockType;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddExercise: () => void;
  onRemoveExercise: (exerciseId: string) => void;
  onReorderExercises: (newOrder: RoutineExercise[]) => void;
  isEditMode: boolean;
}

/**
 * Routine block component for displaying a group of exercises
 * Supports expanding/collapsing and exercise management
 */
export const RoutineBlock: React.FC<RoutineBlockProps> = ({
  block,
  isExpanded,
  onToggleExpand,
  onAddExercise,
  onRemoveExercise,
  onReorderExercises,
  isEditMode
}) => {
  // Local state for drag and drop
  const [exercises, setExercises] = useState<RoutineExercise[]>(block.exercises);

  // Handle reordering and update parent component
  const handleReorder = (newOrder: RoutineExercise[]) => {
    setExercises(newOrder);
    onReorderExercises(newOrder);
  };

  return (
    <motion.div 
      className="mb-4 bg-slate-800 rounded-lg overflow-hidden"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {/* Block Header */}
      <div 
        className={cn(
          "p-4 flex items-center justify-between cursor-pointer",
          isExpanded ? "border-b border-slate-700" : ""
        )}
        onClick={onToggleExpand}
      >
        <div>
          <h3 className="font-semibold">{block.name}</h3>
          <p className="text-sm text-white/50">
            {block.exercises.length} {block.exercises.length === 1 ? 'exercise' : 'exercises'}
          </p>
        </div>
        
        <div className="flex items-center">
          {isEditMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddExercise();
              }}
              className="p-2 mr-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Add exercise"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
          
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white/70" />
          )}
        </div>
      </div>
      
      {/* Exercises List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 pt-2"
          >
            {block.exercises.length === 0 ? (
              <div className="text-center py-4 text-white/50">
                <p>No exercises added yet</p>
                <button
                  onClick={onAddExercise}
                  className="mt-2 px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
                >
                  Add Exercise
                </button>
              </div>
            ) : isEditMode ? (
              <Reorder.Group
                axis="y"
                values={exercises}
                onReorder={handleReorder}
                className="space-y-2"
              >
                {exercises.map((exercise) => (
                  <Reorder.Item 
                    key={exercise.id} 
                    value={exercise}
                    className="touch-manipulation"
                  >
                    <ExerciseItem 
                      exercise={exercise}
                      onRemove={() => onRemoveExercise(exercise.id)}
                      isDraggable={true}
                      isEditMode={true}
                    />
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-2">
                {block.exercises.map((exercise) => (
                  <ExerciseItem 
                    key={exercise.id}
                    exercise={exercise}
                    onRemove={() => onRemoveExercise(exercise.id)}
                    isEditMode={false}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
