import { create } from 'zustand';
import { Routine, RoutineExercise } from '@/features/routines/model/types';

interface RoutinePlayerState {
  routine: Routine | null;
  currentExerciseIndex: number;
  timeRemaining: number;
  totalDuration: number;
  isPlaying: boolean;
  nextExercise: RoutineExercise | null;
  followingExercise: RoutineExercise | null;
  
  // Actions
  initialize: (routine: Routine) => void;
  startWorkout: () => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  goToNextExercise: () => void;
  goToPreviousExercise: () => void;
  setTimeRemaining: (time: number) => void;
  resetWorkout: () => void;
}

/**
 * Routine Player Store
 * 
 * Manages the state for the workout player, including:
 * - Current exercise and timer
 * - Playback controls (play, pause, next, previous)
 * - Upcoming exercises
 */
export const useRoutinePlayerStore = create<RoutinePlayerState>((set, get) => {
  // Timer interval reference
  let timerInterval: NodeJS.Timeout | null = null;
  
  // Haptic feedback patterns
  const hapticPatterns = {
    start: [200], // Long vibration to indicate start
    pause: [100], // Medium vibration to indicate pause
    resume: [100], // Medium vibration to indicate resume
    nextExercise: [150, 50, 150], // Pattern to indicate exercise change
    prevExercise: [100, 50, 100], // Pattern to indicate going back
    halfway: [100], // Medium vibration at halfway point
    countdown: [50], // Short vibration for countdown
    complete: [200, 100, 200], // Pattern to indicate workout complete
    digitalCrownRotate: [20] // Very short vibration for Digital Crown feedback
  };
  
  // Enhanced vibration function for haptic feedback
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };
  
  // Helper to get all exercises from the routine
  const getAllExercises = (routine: Routine | null): RoutineExercise[] => {
    if (!routine) return [];
    return routine.blocks.flatMap(block => block.exercises);
  };
  
  // Helper to update the next exercises
  const updateUpcomingExercises = () => {
    const { routine, currentExerciseIndex } = get();
    const allExercises = getAllExercises(routine);
    
    set({
      nextExercise: allExercises[currentExerciseIndex + 1] || null,
      followingExercise: allExercises[currentExerciseIndex + 2] || null
    });
  };
  
  // Start the timer
  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
      const { timeRemaining, currentExerciseIndex, routine } = get();
      
      // Handle halfway point haptic feedback
      const currentExercise = getAllExercises(routine)[currentExerciseIndex];
      if (currentExercise && timeRemaining === Math.floor(currentExercise.duration / 2)) {
        vibrate(hapticPatterns.halfway);
      }
      
      // Handle 3-2-1 countdown haptic feedback
      if (timeRemaining <= 3 && timeRemaining > 0) {
        vibrate(hapticPatterns.countdown);
      }
      
      if (timeRemaining <= 1) {
        // Move to next exercise
        const nextAction = get().goToNextExercise;
        nextAction();
      } else {
        // Decrement time
        set({ timeRemaining: timeRemaining - 1 });
      }
    }, 1000);
  };
  
  // Stop the timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };
  
  return {
    routine: null,
    currentExerciseIndex: 0,
    timeRemaining: 0,
    totalDuration: 0,
    isPlaying: false,
    nextExercise: null,
    followingExercise: null,
    
    initialize: (routine) => {
      // Stop any existing timer
      stopTimer();
      
      // Get the first exercise
      const allExercises = getAllExercises(routine);
      const firstExercise = allExercises[0] || null;
      
      set({
        routine,
        currentExerciseIndex: 0,
        timeRemaining: firstExercise?.duration || 0,
        totalDuration: firstExercise?.duration || 0,
        isPlaying: false,
        nextExercise: allExercises[1] || null,
        followingExercise: allExercises[2] || null
      });
    },
    
    startWorkout: () => {
      const { routine } = get();
      if (!routine) return;
      
      set({ isPlaying: true });
      startTimer();
      vibrate(hapticPatterns.start);
    },
    
    pauseWorkout: () => {
      stopTimer();
      set({ isPlaying: false });
      vibrate(hapticPatterns.pause);
    },
    
    resumeWorkout: () => {
      set({ isPlaying: true });
      startTimer();
      vibrate(hapticPatterns.resume);
    },
    
    goToNextExercise: () => {
      const { routine, currentExerciseIndex, isPlaying } = get();
      if (!routine) return;
      
      const allExercises = getAllExercises(routine);
      const nextIndex = currentExerciseIndex + 1;
      
      // Check if we've reached the end of the workout
      if (nextIndex >= allExercises.length) {
        // End of workout
        stopTimer();
        set({ 
          isPlaying: false,
          timeRemaining: 0
        });
        vibrate(hapticPatterns.complete);
        return;
      }
      
      // Move to next exercise
      const nextExercise = allExercises[nextIndex];
      
      set({
        currentExerciseIndex: nextIndex,
        timeRemaining: nextExercise.duration,
        totalDuration: nextExercise.duration
      });
      
      // Update upcoming exercises
      updateUpcomingExercises();
      
      // Vibrate to indicate exercise change
      vibrate(hapticPatterns.nextExercise);
      
      // If we were playing, continue playing
      if (isPlaying) {
        stopTimer();
        startTimer();
      }
    },
    
    goToPreviousExercise: () => {
      const { routine, currentExerciseIndex, isPlaying } = get();
      if (!routine || currentExerciseIndex === 0) return;
      
      const allExercises = getAllExercises(routine);
      const prevIndex = currentExerciseIndex - 1;
      const prevExercise = allExercises[prevIndex];
      
      set({
        currentExerciseIndex: prevIndex,
        timeRemaining: prevExercise.duration,
        totalDuration: prevExercise.duration
      });
      
      // Update upcoming exercises
      updateUpcomingExercises();
      
      // Vibrate to indicate exercise change
      vibrate(hapticPatterns.prevExercise);
      
      // If we were playing, continue playing
      if (isPlaying) {
        stopTimer();
        startTimer();
      }
    },
    
    setTimeRemaining: (time) => {
      set({ timeRemaining: time });
    },
    
    resetWorkout: () => {
      const { routine } = get();
      if (!routine) return;
      
      stopTimer();
      
      // Reset to first exercise
      const allExercises = getAllExercises(routine);
      const firstExercise = allExercises[0] || null;
      
      set({
        currentExerciseIndex: 0,
        timeRemaining: firstExercise?.duration || 0,
        totalDuration: firstExercise?.duration || 0,
        isPlaying: false,
        nextExercise: allExercises[1] || null,
        followingExercise: allExercises[2] || null
      });
    }
  };
});
