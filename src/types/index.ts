/**
 * Mosaic Type System
 * 
 * This is the entry point for all Mosaic types. It re-exports everything from
 * our type definition files for convenient access throughout the application.
 * 
 * Usage:
 * import { Exercise, ExerciseId, isExerciseId } from '@/types';
 */

export * from './ids';
export * from './models';

// Add type documentation
export type {
    Exercise,
    Block,
    Category,
    Template,
    Routine
} from './models';
