/**
 * Workout Player Feature — Public API
 *
 * Standalone routine player (Seconds Pro meets Spotify).
 * Consumes a BuilderRoutine and manages its own playback state.
 */

// Entry point — drop this into any route or screen
export { PlayerPage } from './ui/PlayerPage';

// Reusable UI components
export { TimerRing } from './ui/TimerRing';
export { PlaybackControls } from './ui/PlaybackControls';

// Store (if needed externally)
export { usePlayerStore } from './model/playerStore';

// Types
export type { PlayerRoutine, PlayerBlock, PlayerExercise } from './model/types';
export type { PlaybackItem, PlayerStatus, PlayerStats } from './model/types';
