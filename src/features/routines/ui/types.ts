/**
 * Routine Builder UI Types
 * 
 * Self-contained types for the standalone Routine Builder.
 * These are intentionally decoupled from the rest of the app.
 * When we connect the builder to the main app later, we'll
 * map between these types and the app-wide types.
 */

// ---------- Exercise (read-only, sourced from exercise library) ----------

export interface BuilderExercise {
  id: string;
  exerciseName: string;
  categoryId: string;
  templateTags: string[];
  standardTime: string;          // e.g. "1:00", "1:30"
  springSetup: {
    lightSprings: number;
    heavySprings: number;
  };
}

// ---------- Routine being built ----------

export interface RoutineExerciseEntry {
  instanceId: string;            // unique per slot (so same exercise can appear twice)
  exercise: BuilderExercise;
  durationSeconds: number;
  notes: string;
}

export interface BuilderBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | string;
  exercises: RoutineExerciseEntry[];
  // Template-mode fields (populated when built from a template)
  templateTags?: string[];       // high-level tags for exercise filtering
  slotCount?: { min: number; max: number }; // how many exercises the template wants
  instructions?: string;         // guidance text from the template
  hasCardioBurst?: boolean;
}

export type BuilderMode = 'template' | 'scratch';

export interface BuilderRoutine {
  id: string;
  name: string;
  blocks: BuilderBlock[];
  createdAt: string;
  mode: BuilderMode;
  templateId?: string;           // which template was used (if any)
}

// ---------- Category lookup ----------

export interface Category {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Abs' },
  { id: 'c2', name: 'Obliques' },
  { id: 'c3', name: 'Lower Body Heavy Pressing' },
  { id: 'c4', name: 'Lower Body Lunges/Squats/Deadlifts' },
  { id: 'c5', name: 'Lower Body Straps' },
  { id: 'c6', name: 'Upper Body' },
  { id: 'c7', name: 'Cardio Bursts' },
];

// ---------- Helpers ----------

/** Parse "1:00" → 60, "1:30" → 90 */
export function parseStandardTime(time: string): number {
  const parts = time.split(':');
  if (parts.length !== 2) return 60; // default
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return minutes * 60 + seconds;
}

/** 90 → "1:30", 60 → "1:00" */
export function formatSeconds(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Total duration of a routine in seconds */
export function calcRoutineDuration(routine: BuilderRoutine): number {
  return routine.blocks.reduce((total, block) => {
    return total + block.exercises.reduce((bt, entry) => bt + entry.durationSeconds, 0);
  }, 0);
}

/** Create default empty routine (used by template path — 3 starter blocks) */
export function createDefaultRoutine(): BuilderRoutine {
  const now = Date.now();
  return {
    id: `r-${now}`,
    name: 'New Routine',
    mode: 'template',
    blocks: [
      { id: `b-${now}-1`, name: 'Warmup',       type: 'warmup',   exercises: [] },
      { id: `b-${now}-2`, name: 'Main Workout',  type: 'main',     exercises: [] },
      { id: `b-${now}-3`, name: 'Cooldown',      type: 'cooldown', exercises: [] },
    ],
    createdAt: new Date().toISOString(),
  };
}

/** Create a blank-slate routine (scratch path — no blocks at all) */
export function createBlankRoutine(): BuilderRoutine {
  return {
    id: `r-${Date.now()}`,
    name: 'My Routine',
    mode: 'scratch',
    blocks: [],
    createdAt: new Date().toISOString(),
  };
}
