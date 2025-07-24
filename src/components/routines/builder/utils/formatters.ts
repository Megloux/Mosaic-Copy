/**
 * Utility functions for formatting values in the Routine Builder
 */

/**
 * Format seconds to mm:ss or hh:mm format
 * @param seconds Total seconds to format
 * @returns Formatted duration string (e.g., "30min" or "1h 15min")
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}min`;
  } else {
    return `${minutes}min`;
  }
};

/**
 * Format seconds to mm:ss format for display in exercise items
 * @param seconds Total seconds to format
 * @returns Formatted time string (e.g., "01:30")
 */
export const formatExerciseDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
