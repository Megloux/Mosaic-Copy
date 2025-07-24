/**
 * Mosaic Data Models
 * 
 * This file defines the core data structures used throughout the Mosaic application.
 * These types match our database schema exactly and include proper ID typing.
 */

import { z } from 'zod';
import { BlockId, CategoryId, ExerciseId, RoutineId, TemplateId, StudioId } from './ids';

/**
 * Exercise Model
 * Represents a single exercise in the Pilates repertoire
 */
export interface Exercise {
    id: ExerciseId;
    exercise_name: string;
    category_id: CategoryId;
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
}

/**
 * Block Model
 * Represents a segment of a workout (e.g., "CenterCore", "RightLeg")
 */
export interface Block {
    id: BlockId;
    name: 'CenterCore' | 'RightLeg' | 'LeftLeg' | 'RightOblique' | 'LeftOblique' | 'UpperBody' | 'Bilateral';
}

/**
 * Category Model
 * Groups exercises by type (e.g., "Abs", "Obliques")
 */
export interface Category {
    id: CategoryId;
    name: 'Abs' | 'Obliques' | 'LowerBodyHeavyPressing' | 'LowerBodyLungesSquatsDeadlifts' | 
          'LowerBodyStraps' | 'UpperBody' | 'Variations';
}

/**
 * Template Model
 * Pre-defined workout structures created by experts
 */
export interface Template {
    id: TemplateId;
    name: string;
    description: string;
    structure: {
        blocks: Array<{
            name: Block['name'];
            exercises: ExerciseId[];
        }>;
    };
}

/**
 * Routine Model
 * User-created workouts, optionally based on templates
 */
export interface Routine {
    id: RoutineId;
    user_id: string;  // UUID from auth
    template_id?: TemplateId;
    name: string;
    description?: string;
    structure: Template['structure'];
    is_public: boolean;
}

/**
 * Studio Model
 * Represents a pilates studio in the system
 */
export interface Studio {
    id: StudioId;
    name: string;
    settings?: Record<string, unknown>;
}

/**
 * Zod Schemas for Runtime Validation
 * Use these when validating data from external sources
 */
export const exerciseSchema = z.object({
    id: z.string().regex(/^e\d+$/),
    exercise_name: z.string(),
    category_id: z.string().regex(/^c\d+$/),
    setup_instructions: z.string(),
    movement_notes: z.string(),
    cueing: z.string(),
    this_that: z.string(),
    spring_setup: z.object({
        light_springs: z.number(),
        heavy_springs: z.number()
    }),
    template_tags: z.array(z.string()),
    vimeo_id: z.string(),
    standard_time: z.string()
});

// Type assertion helper
export const assertExercise = (data: unknown): Exercise => {
    return exerciseSchema.parse(data);
};
