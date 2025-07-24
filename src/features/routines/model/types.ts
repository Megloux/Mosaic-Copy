/**
 * Core template interfaces for the Routine Builder
 * These match the structure from the database and ensure type safety
 */

/**
 * Template structure from database
 * Represents a complete workout template that users can select
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  isProOnly: boolean;
  structure: TemplateStructure;
  createdAt: string;
  updatedAt: string;
}

/**
 * Structure of a template, containing blocks and metadata
 */
export interface TemplateStructure {
  blocks: TemplateBlock[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string[];
}

/**
 * Individual block within a template
 * Each block requires specific types of exercises based on tags
 */
export interface TemplateBlock {
  block_id: string;
  name: string;
  template_tags: string[];  // These match to exercise tags
  exercise_count: {
    min: number;
    max: number;
  };
  instructions: string;
  is_warmup: boolean;
  has_cardio_burst: boolean;
  position?: number; // For ordering blocks
}

/**
 * Represents a routine created from a template or from scratch
 */
export interface Routine {
  id: string;
  name: string;
  description?: string;
  templateId?: string;  // If derived from a template
  createdAt: string;
  updatedAt: string;
  blocks: RoutineBlock[];
  totalDuration: number;
  difficulty: number;
  userId: string;
  isPublic: boolean;
  tags: string[];
}

/**
 * Block within a routine, containing exercises
 */
export interface RoutineBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | 'circuit' | string;
  position: number;
  exercises: RoutineExercise[];
  notes?: string;
  restBetweenExercises?: number;
}

/**
 * Exercise within a routine block
 * Extends the base Exercise with routine-specific parameters
 */
export interface RoutineExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration: number; // in seconds
  weight?: number;
  notes?: string;
  restTime?: number;
  // Other exercise properties are also included
  tags: string[];
  thumbnailUrl: string;
  videoUrl?: string;
  isResistance: boolean;
  orientationCode?: string;
}
