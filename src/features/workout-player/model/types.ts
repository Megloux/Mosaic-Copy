/**
 * Workout Player Types
 *
 * 100% self-contained. Zero imports from outside this feature.
 * The caller (e.g. RoutineBuilderEntry) converts its data
 * into these types at the boundary.
 */

// ---------- Player Input Types (what the player accepts) ----------

export interface PlayerExercise {
  id: string;
  name: string;
  durationSeconds: number;
}

export interface PlayerBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | string;
  exercises: PlayerExercise[];
}

export interface PlayerRoutine {
  id: string;
  name: string;
  blocks: PlayerBlock[];
}

// ---------- Playback Queue ----------

export type PlaybackItemType = 'exercise' | 'rest' | 'block-intro';

export interface PlaybackItem {
  id: string;
  type: PlaybackItemType;
  duration: number; // seconds
  label: string;
  // Exercise-specific (only for type === 'exercise')
  exercise?: PlayerExercise;
  // Block context
  blockName: string;
  blockType: string;
  blockIndex: number;
  // For rest items: what's coming next
  nextExercise?: PlayerExercise;
  // Position in the full queue
  queueIndex: number;
}

// ---------- Player State ----------

export type PlayerStatus = 'idle' | 'ready' | 'playing' | 'paused' | 'completed';

export interface PlayerStats {
  totalElapsed: number;
  exercisesCompleted: number;
  blocksCompleted: Set<number>;
  totalExercises: number;
  totalBlocks: number;
  routineName: string;
}
