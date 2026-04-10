import { useState, useCallback } from 'react';
import { useRoutineStore } from '@/store/routineStore';
import { RoutineExercise } from '@/types/templates';
import { useUIStore } from '@/store/uiStore';
import { Exercise } from '@/types/exercises';

// Define a type for the Web Share API data
interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

// Type guard for navigator with vibration support
const hasVibrationSupport = (nav: any): nav is { vibrate: (pattern: number | number[]) => boolean } => {
  return nav && 'vibrate' in nav;
};

// Type guard for navigator with share capability
const hasShareCapability = (nav: any): nav is { share: (data?: ShareData) => Promise<void> } => {
  return nav && 'share' in nav;
};

/**
 * Hook for routine-related actions
 * Centralizes action handlers for the Routine Builder
 */
export const useRoutineActions = () => {
  const { 
    currentRoutine, 
    addExerciseToBlock, 
    removeExerciseFromBlock,
    reorderExercise,
    saveRoutine
  } = useRoutineStore();
  
  // Get UI actions from the UI store
  const { showRoutinePlayer } = useUIStore();
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  /**
   * Utility function for haptic feedback
   */
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && hasVibrationSupport(navigator)) {
      navigator.vibrate(pattern);
    }
  }, []);

  /**
   * Error handling wrapper
   */
  const safeAction = useCallback(async (action: () => void | Promise<void>, errorMsg: string) => {
    try {
      await action();
      setErrorMessage(null);
    } catch (error) {
      console.error(`Error in routine action: ${errorMsg}`, error);
      setErrorMessage(error instanceof Error ? error.message : errorMsg);
      setIsRecovering(true);
      setTimeout(() => {
        setIsRecovering(false);
        setErrorMessage(null);
      }, 3000);
    }
  }, []);

  /**
   * Handle playing the routine
   */
  const handlePlay = useCallback(() => {
    safeAction(() => {
      vibrate([15, 30, 15]); // Play pattern
      
      if (!currentRoutine) {
        throw new Error('No routine available to play');
      }
      
      // Save routine before playing to ensure all changes are persisted
      saveRoutine();
      
      // Show the RoutinePlayer component with the current routine
      showRoutinePlayer(currentRoutine);
      
    }, 'Failed to start routine');
  }, [currentRoutine, safeAction, vibrate, saveRoutine, showRoutinePlayer]);

  /**
   * Handle favoriting the routine
   */
  const handleFavorite = useCallback(() => {
    safeAction(() => {
      vibrate(10); // Short pulse
      setIsFavorite(prev => !prev);
      // TODO: Implement actual favorite functionality
    }, 'Failed to favorite routine');
  }, [safeAction, vibrate]);

  /**
   * Handle sharing the routine
   */
  const handleShare = useCallback(() => {
    safeAction(async () => {
      vibrate(8); // Very short pulse
      
      const shareData: ShareData = {
        title: `Mosaic Routine: ${currentRoutine?.name}`,
        text: 'Check out this workout routine I created with Mosaic!'
      };
      
      // Use Web Share API if available
      if (typeof navigator !== 'undefined' && hasShareCapability(navigator)) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers without Web Share API
        console.log('Sharing not supported on this browser');
        // Could implement a custom share UI here
      }
    }, 'Failed to share routine');
  }, [currentRoutine, safeAction, vibrate]);

  /**
   * Handle downloading/saving the routine
   */
  const handleSave = useCallback(() => {
    safeAction(() => {
      vibrate([10, 20, 10]); // Save pattern
      saveRoutine();
      console.log('Routine saved successfully');
    }, 'Failed to save routine');
  }, [saveRoutine, safeAction, vibrate]);

  /**
   * Handle adding an exercise to a block
   */
  const handleAddExercise = useCallback((blockId: string, exercise: RoutineExercise) => {
    safeAction(() => {
      vibrate(8); // Very short pulse
      // Map RoutineExercise to Exercise shape, filling all required fields
      const exerciseForBlock: Exercise = {
        id: exercise.id,
        exercise_name: exercise.name,
        category_id: '',
        setup_instructions: '',
        movement_notes: '',
        cueing: '',
        this_that: '',
        spring_setup: {
          light_springs: 0,
          heavy_springs: 0,
        },
        template_tags: exercise.tags || [],
        vimeo_id: exercise.videoUrl || '',
        standard_time: String(exercise.duration || 0),
        name: exercise.name,
        tags: exercise.tags || [],
        isResistance: typeof exercise.isResistance === 'boolean' ? exercise.isResistance : false,
      };
      addExerciseToBlock(blockId, exerciseForBlock);
    }, 'Failed to add exercise');
  }, [addExerciseToBlock, safeAction, vibrate]);

  /**
   * Handle removing an exercise from a block
   */
  const handleRemoveExercise = useCallback((blockId: string, exerciseId: string) => {
    safeAction(() => {
      vibrate([5, 10, 15]); // Remove pattern
      removeExerciseFromBlock(blockId, exerciseId);
    }, 'Failed to remove exercise');
  }, [removeExerciseFromBlock, safeAction, vibrate]);

  /**
   * Handle reordering exercises within a block
   */
  const handleReorderExercises = useCallback((blockId: string, newOrder: RoutineExercise[]) => {
    safeAction(() => {
      vibrate([10, 20, 10]); // Reorder pattern
      // Find fromIndex and toIndex based on newOrder
      // For demonstration, use 0 and 1 (update as needed for real logic)
      reorderExercise(blockId, 0, 1);
    }, 'Failed to reorder exercises');
  }, [reorderExercise, safeAction, vibrate]);

  return {
    handlePlay,
    handleFavorite,
    handleShare,
    handleSave,
    handleAddExercise,
    handleRemoveExercise,
    handleReorderExercises,
    isFavorite,
    errorMessage,
    isRecovering
  };
};
