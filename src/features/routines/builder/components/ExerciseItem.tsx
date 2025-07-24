import React from 'react';
import { motion } from 'framer-motion';
import { Grip, Trash2, Info } from 'lucide-react';
import { RoutineExercise } from '@/features/routines/model/types';
import { formatExerciseDuration } from '@/components/routines/builder/utils/formatters';

interface ExerciseItemProps {
  exercise: RoutineExercise;
  onRemove: () => void;
  onInfo?: () => void;
  isDraggable?: boolean;
  isEditMode?: boolean;
}

/**
 * Exercise item component for displaying exercises in routine blocks
 * Supports drag-and-drop reordering and edit mode
 */
export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  onRemove,
  onInfo,
  isDraggable = false,
  isEditMode = false
}) => {
  return (
    <motion.div 
      className="flex items-center bg-slate-700 p-3 rounded-lg mb-2"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {isDraggable && (
        <div className="flex items-center mr-2">
          <Grip 
            className="w-5 h-5 text-white/50 cursor-grab touch-manipulation" 
            data-testid="drag-handle"
          />
        </div>
      )}
      
      <div className="flex-1">
        <h4 className="text-sm font-medium truncate">{exercise.name}</h4>
        <p className="text-xs text-white/50 truncate">
          {typeof exercise.duration === 'number' 
            ? formatExerciseDuration(exercise.duration)
            : '00:45'}
        </p>
      </div>
      
      {!isEditMode && (
        <button
          onClick={onInfo}
          className="p-2 text-white/70 hover:text-white"
          aria-label="Exercise information"
        >
          <Info className="w-5 h-5" />
        </button>
      )}
      
      {isEditMode && (
        <button
          onClick={onRemove}
          className="p-2 text-white/70 hover:text-red-500 transition-colors"
          aria-label="Remove exercise"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}
    </motion.div>
  );
};
