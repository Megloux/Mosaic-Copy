import React from 'react';
import { useRoutinePlayer } from '@/store/uiStore';
import { RoutinePlayer } from '@/components/routines/player/RoutinePlayer';

/**
 * RoutinePlayerWrapper Component
 * 
 * This component acts as a container for the RoutinePlayer, handling its visibility
 * based on the UI store state. It's designed to be included in the app's main layout
 * so the RoutinePlayer can be shown from anywhere in the app.
 */
export const RoutinePlayerWrapper: React.FC = () => {
  // Get routine player state and actions from the UI store
  const { visible, routine, hideRoutinePlayer } = useRoutinePlayer();
  
  // Don't render anything if the player isn't visible or there's no routine
  if (!visible || !routine) {
    return null;
  }
  
  // Render the RoutinePlayer with the current routine
  return (
    <RoutinePlayer
      routine={routine}
      onClose={hideRoutinePlayer}
    />
  );
};
