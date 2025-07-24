/**
 * Exercise interfaces for the Routine Builder
 * These define the structure of exercise data from the Exercise Library
 * 
 * @deprecated Use types from @/features/exercises/model/types instead
 */

import { Exercise as FSAExercise } from '@/features/exercises/model/types';

/**
 * Base Exercise interface
 * Represents an exercise from the Exercise Library
 */
export interface Exercise {
    id: string;
    exercise_name: string;
    category_id: string;
    setup_instructions: string;
    movement_notes: string;
    cueing: string;
    this_that: string;
    spring_setup: {
        light_springs: number;
        heavy_springs: number;
    };
    template_tags: string[];
    vimeo_id: string;
    standard_time: string;
    category?: string; 
    tags?: string[]; 
    name?: string; 
    isResistance?: boolean; 
}

// Type mapping helper to convert between original Exercise and FSA Exercise
export const mapToFSAExercise = (exercise: Exercise): FSAExercise => ({
    id: exercise.id,
    name: exercise.name || exercise.exercise_name || '',
    description: exercise.movement_notes || '',
    duration: {
        default: parseInt(exercise.standard_time || '60', 10),
        min: 30,
        max: 300
    },
    difficulty: 1,
    equipment: [],
    muscleGroups: [],
    tags: exercise.tags || exercise.template_tags || [],
    thumbnailUrl: '',
    videoUrl: exercise.vimeo_id ? `https://vimeo.com/${exercise.vimeo_id}` : undefined,
    isResistance: exercise.isResistance || false
});

/**
 * Exercise with duration
 * Used for routine exercises
 */
export interface ExerciseWithDuration extends Exercise {
    duration: number;
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
