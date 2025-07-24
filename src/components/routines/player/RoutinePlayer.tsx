import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { Routine, RoutineBlock } from '@/types/templates';
import { useRoutinePlayerStore } from '@/store/routinePlayerStore';
import { CountdownTimer } from '@/components/routines/player/components/CountdownTimer';

interface RoutinePlayerProps {
  routine: Routine;
  onClose: () => void;
  themeColor?: string;
  isAppleWatch?: boolean;
}

/**
 * RoutinePlayer Component
 * 
 * Full-screen interface for playing through a workout routine.
 * Features:
 * - Split-screen display showing current and next exercise
 * - Centered timer with countdown animation
 * - Controls for play/pause, next/previous
 * - Visual feedback for progress
 * - Optimized for both mobile and Apple Watch
 */
const RoutinePlayer: React.FC<RoutinePlayerProps> = ({
  routine,
  onClose,
  themeColor = '#22D3EE',
  isAppleWatch = false
}) => {
  // Local state for UI controls
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get state and actions from store
  const {
    routine: storeRoutine,
    currentExerciseIndex,
    timeRemaining,
    totalDuration,
    isPlaying,
    nextExercise,
    initialize,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    goToNextExercise,
    goToPreviousExercise
  } = useRoutinePlayerStore();
  
  // Initialize the store with the routine on mount
  useEffect(() => {
    initialize(routine);
    
    // Auto-hide controls after 5 seconds if playing
    if (isPlaying && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [initialize, routine, isPlaying, showControls]);

  // Get current exercise
  const currentExercise = useMemo(() => {
    if (!storeRoutine) return null;
    
    const allExercises = storeRoutine.blocks.flatMap((block: RoutineBlock) => block.exercises);
    return allExercises[currentExerciseIndex] || null;
  }, [storeRoutine, currentExerciseIndex]);

  // Format time for display (e.g., "01:30")
  const formatTimeDisplay = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle user interaction to show controls
  const handleUserInteraction = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    }
  };
  
  // Handle play/pause button click
  const handlePlayPauseClick = () => {
    if (isPlaying) {
      pauseWorkout();
    } else {
      if (timeRemaining === totalDuration) {
        startWorkout();
      } else {
        resumeWorkout();
      }
    }
  };

  // Check if we're in the final countdown (last 3 seconds)
  const isInFinalCountdown = timeRemaining <= 3 && timeRemaining > 0;
  
  // Generate adaptive background colors based on theme color
  const getAdaptiveColors = () => {
    // Convert hex to RGB for manipulation
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };
    
    const rgb = hexToRgb(themeColor);
    
    // Create darker background for current exercise
    const currentExerciseBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
    
    // Create lighter background for next exercise
    const nextExerciseBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
    
    // Create text color with higher contrast
    const textColor = themeColor;
    
    return { currentExerciseBg, nextExerciseBg, textColor };
  };
  
  const { currentExerciseBg, nextExerciseBg, textColor } = getAdaptiveColors();

  if (!storeRoutine || !currentExercise) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white">
        <div className="text-2xl font-bold">Loading workout...</div>
      </div>
    );
  }
  
  // Apple Watch specific layout
  if (isAppleWatch) {
    return (
      <div 
        className="fixed inset-0 bg-gray-900 text-white flex flex-col"
        onClick={handleUserInteraction}
      >
        {/* Compact layout for Apple Watch */}
        <div className="flex-1 flex flex-col relative">
          {/* Current exercise (top half) */}
          <div 
            className="flex-1 flex flex-col items-center justify-center"
            style={{ backgroundColor: currentExerciseBg }}
          >
            <h2 
              className="text-lg font-semibold"
              style={{ color: textColor }}
            >
              {currentExercise.name}
            </h2>
          </div>
          
          {/* Next exercise (bottom half) - includes integrated controls */}
          <div 
            className="flex-1 flex flex-col items-center justify-between"
            style={{ backgroundColor: nextExerciseBg }}
          >
            {/* Next exercise name */}
            <div className="flex-1 flex items-center justify-center w-full">
              {nextExercise ? (
                <h2 
                  className="text-sm font-semibold"
                  style={{ color: textColor }}
                >
                  {nextExercise.name}
                </h2>
              ) : (
                <div className="text-xs text-gray-500">Workout Complete</div>
              )}
            </div>
            
            {/* Integrated controls - semi-transparent and muted */}
            <div 
              className={`flex justify-center items-center space-x-2 w-full py-2 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Play/Pause button (primary control) */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayPauseClick}
                className="rounded-full p-2 bg-opacity-30 bg-gray-800 hover:bg-opacity-50"
                aria-label={isPlaying ? "Pause workout" : "Play workout"}
                style={{ backgroundColor: `${themeColor}50` }}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-gray-300 hover:text-white" />
                ) : (
                  <Play className="w-4 h-4 text-gray-300 hover:text-white" />
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Centered timer that overlaps both sections */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <CountdownTimer
              timeRemaining={timeRemaining}
              totalDuration={totalDuration}
              isInFinalCountdown={isInFinalCountdown}
              themeColor={themeColor}
              isAppleWatch={true}
            >
              <div className="font-bold text-white text-3xl">
                {formatTimeDisplay(timeRemaining)}
              </div>
            </CountdownTimer>
          </div>
        </div>
      </div>
    );
  }
  
  // Standard mobile layout
  return (
    <div 
      className="fixed inset-0 bg-gray-900 text-white flex flex-col"
      onClick={handleUserInteraction}
    >
      {/* Split-screen layout with current and next exercise */}
      <div className="flex-1 flex flex-col relative">
        {/* Current exercise (top half) */}
        <div 
          className="flex-1 flex flex-col items-center justify-center"
          style={{ backgroundColor: currentExerciseBg }}
        >
          <h2 
            className="text-2xl font-semibold mb-2"
            style={{ color: textColor }}
          >
            {currentExercise.name}
          </h2>
          {currentExercise.sets > 1 && (
            <div className="text-sm opacity-80">
              {currentExercise.sets} sets • {currentExercise.reps} reps
            </div>
          )}
        </div>
        
        {/* Next exercise (bottom half) with integrated controls */}
        <div 
          className="flex-1 flex flex-col"
          style={{ backgroundColor: nextExerciseBg }}
        >
          {/* Next exercise info */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {nextExercise ? (
              <>
                <h2 
                  className="text-xl font-semibold mb-2"
                  style={{ color: textColor }}
                >
                  {nextExercise.name}
                </h2>
                {nextExercise.sets > 1 && (
                  <div className="text-sm opacity-70">
                    {nextExercise.sets} sets • {nextExercise.reps} reps
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">Workout Complete</div>
            )}
          </div>
          
          {/* Integrated controls with semi-transparent background */}
          <div 
            className={`flex justify-center items-center space-x-6 py-4 px-6 transition-opacity duration-300 bg-black bg-opacity-30 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Exit button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="rounded-full p-2 bg-gray-800 bg-opacity-30 hover:bg-opacity-50"
              aria-label="Close workout"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </motion.button>
            
            {/* Previous button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousExercise}
              className="rounded-full p-2 bg-gray-800 bg-opacity-30 hover:bg-opacity-50"
              aria-label="Previous exercise"
              disabled={currentExerciseIndex === 0}
            >
              <SkipBack className="w-5 h-5 text-gray-400 hover:text-white" />
            </motion.button>
            
            {/* Play/Pause button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handlePlayPauseClick}
              className="rounded-full p-4"
              aria-label={isPlaying ? "Pause workout" : "Play workout"}
              style={{ backgroundColor: `${themeColor}80` }} // Semi-transparent
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </motion.button>
            
            {/* Next button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={goToNextExercise}
              className="rounded-full p-2 bg-gray-800 bg-opacity-30 hover:bg-opacity-50"
              aria-label="Next exercise"
            >
              <SkipForward className="w-5 h-5 text-gray-400 hover:text-white" />
            </motion.button>
          </div>
        </div>
        
        {/* Centered timer that overlaps both sections */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <CountdownTimer
            timeRemaining={timeRemaining}
            totalDuration={totalDuration}
            isInFinalCountdown={isInFinalCountdown}
            themeColor={themeColor}
          >
            <div className="font-bold text-white text-6xl">
              {formatTimeDisplay(timeRemaining)}
            </div>
          </CountdownTimer>
        </div>
      </div>
    </div>
  );
};

export { RoutinePlayer };
