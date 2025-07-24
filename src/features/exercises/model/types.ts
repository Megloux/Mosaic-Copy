/**
 * Exercise interfaces for the Routine Builder
 * These define the structure of exercise data from the Exercise Library
 */

/**
 * Base Exercise interface
 * Represents an exercise from the Exercise Library
 */
export interface Exercise {
  id: string;
  name: string;
  description: string;
  tags: string[];
  difficulty: number; // 1-5 scale
  equipment: string[];
  muscleGroups: string[];
  duration: {
    default: number; // in seconds
    min: number;
    max: number;
  };
  thumbnailUrl: string;
  videoUrl: string;
  isResistance: boolean;
  orientationCode?: string; // For specific device orientations
}

/**
 * Exercise with match score
 * Used internally for tag matching algorithm
 */
export interface ScoredExercise {
  exercise: Exercise;
  score: number;
}

/**
 * Exercise filter options
 * Used for filtering exercises in the library
 */
export interface ExerciseFilters {
  tags?: string[];
  difficulty?: number[];
  equipment?: string[];
  muscleGroups?: string[];
  isResistance?: boolean;
  searchTerm?: string;
}

/**
 * Exercise service response
 * Represents the response from the exercise API
 */
export interface ExerciseResponse {
  exercises: Exercise[];
  total: number;
  page: number;
  pageSize: number;
}
