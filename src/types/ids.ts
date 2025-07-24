/**
 * Mosaic ID Type Definitions
 * 
 * This file defines the type system for Mosaic's consistent ID patterns.
 * We use template literal types to enforce specific ID formats at compile time.
 * 
 * ID Patterns:
 * - Exercises: e1, e2, ... (e.g., "e1" for Modified Plank)
 * - Categories: c1, c2, ... (e.g., "c1" for Abs)
 * - Blocks: b1, b2, ... (e.g., "b1" for CenterCore)
 * - Routines: r1, r2, ... (e.g., "r1" for user-created routine)
 * - Templates: t1, t2, ... (e.g., "t1" for Power to Precision)
 * - Studios: s1, s2, ... (e.g., "s1" for Studio 1)
 */

/** Exercise ID format: e{number} */
export type ExerciseId = `e${number}`;

/** Category ID format: c{number} */
export type CategoryId = `c${number}`;

/** Block ID format: b{number} */
export type BlockId = `b${number}`;

/** Routine ID format: r{number} */
export type RoutineId = `r${number}`;

/** Template ID format: t{number} */
export type TemplateId = `t${number}`;

/** Studio ID format: s{number} */
export type StudioId = `s${number}`;

/** Union type of all content IDs */
export type ContentId = ExerciseId | CategoryId | BlockId | RoutineId | TemplateId | StudioId;

/**
 * Type guards for runtime validation of ID formats
 * Use these to validate IDs at runtime when TypeScript's compile-time
 * checks are not sufficient (e.g., data from API calls)
 */

export const isExerciseId = (id: string): id is ExerciseId => /^e\d+$/.test(id);
export const isCategoryId = (id: string): id is CategoryId => /^c\d+$/.test(id);
export const isBlockId = (id: string): id is BlockId => /^b\d+$/.test(id);
export const isRoutineId = (id: string): id is RoutineId => /^r\d+$/.test(id);
export const isTemplateId = (id: string): id is TemplateId => /^t\d+$/.test(id);
export const isStudioId = (id: string): id is StudioId => /^s\d+$/.test(id);

/**
 * Helper function to extract number from ID
 * @example getIdNumber("e1") returns 1
 */
export const getIdNumber = (id: ContentId): number => {
    return parseInt(id.slice(1));
};

/**
 * Helper function to create ID from prefix and number
 * @example createId("e", 1) returns "e1"
 */
export const createId = (prefix: 'e' | 'c' | 'b' | 'r' | 't' | 's', num: number): ContentId => {
    return `${prefix}${num}` as ContentId;
};
