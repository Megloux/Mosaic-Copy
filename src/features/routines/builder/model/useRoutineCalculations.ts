import { useCallback } from 'react';
import { RoutineBlock, RoutineExercise } from '@/features/routines/model/types';
import { formatDuration } from '@/components/routines/builder/utils/formatters';

/**
 * Hook for routine-related calculations
 * Handles duration calculations and other metrics
 */
export const useRoutineCalculations = (routine: { blocks: RoutineBlock[] } | null) => {
  /**
   * Calculate total routine duration in seconds
   */
  const calculateTotalDuration = useCallback(() => {
    if (!routine?.blocks) return 0;
    
    return routine.blocks.reduce((total: number, block: RoutineBlock) => {
      // Handle exercises in each block
      const blockDuration = block.exercises.reduce((blockTotal: number, exercise: RoutineExercise) => {
        // Get duration from exercise (RoutineExercise has duration as a number)
        return blockTotal + (exercise.duration || 45);
      }, 0);
      
      return total + blockDuration;
    }, 0);
  }, [routine]);
  
  /**
   * Calculate estimated calories (example)
   * Simple estimation based on duration
   */
  const calculateEstimatedCalories = useCallback(() => {
    const duration = calculateTotalDuration();
    // Simple estimation based on duration
    return Math.round(duration / 60 * 7); // ~7 calories per minute as example
  }, [calculateTotalDuration]);
  
  // Calculate values once per render
  const totalDuration = calculateTotalDuration();
  
  return {
    totalDuration,
    formattedDuration: formatDuration(totalDuration),
    estimatedCalories: calculateEstimatedCalories(),
    calculateTotalDuration
  };
};
