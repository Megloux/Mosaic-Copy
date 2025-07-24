/**
 * Command pattern interfaces for undo/redo functionality
 * This implements the Command design pattern for state management
 */

import { RoutineState, RoutineActions } from '@/store/routineStore';

/**
 * Base Command interface
 * All commands must implement execute and undo methods
 */
export interface Command {
  execute(state: RoutineState & RoutineActions): void;
  undo(state: RoutineState & RoutineActions): void;
  type: string;
  payload: any;
}

/**
 * Command history for undo/redo stacks
 */
export interface CommandHistory {
  undoStack: Command[];
  redoStack: Command[];
}

/**
 * Add Exercise Command
 * Adds an exercise to a specific block
 */
export interface AddExerciseCommand extends Command {
  type: 'ADD_EXERCISE';
  payload: {
    blockId: string;
    exercise: any; // Will be RoutineExercise
    index?: number; // Optional position to insert at
  };
}

/**
 * Remove Exercise Command
 * Removes an exercise from a block
 */
export interface RemoveExerciseCommand extends Command {
  type: 'REMOVE_EXERCISE';
  payload: {
    blockId: string;
    exerciseId: string;
    originalExercise: any; // The removed exercise
    originalIndex: number; // Position it was removed from
  };
}

/**
 * Update Exercise Command
 * Updates exercise parameters
 */
export interface UpdateExerciseCommand extends Command {
  type: 'UPDATE_EXERCISE';
  payload: {
    blockId: string;
    exerciseId: string;
    updates: Partial<any>; // Partial<RoutineExercise>
    originalValues: Partial<any>; // Original values before update
  };
}

/**
 * Reorder Exercise Command
 * Changes the order of exercises within a block
 */
export interface ReorderExerciseCommand extends Command {
  type: 'REORDER_EXERCISE';
  payload: {
    blockId: string;
    fromIndex: number;
    toIndex: number;
  };
}

/**
 * Add Block Command
 * Adds a new block to the routine
 */
export interface AddBlockCommand extends Command {
  type: 'ADD_BLOCK';
  payload: {
    block: any; // Will be RoutineBlock
    index?: number; // Optional position to insert at
  };
}

/**
 * Remove Block Command
 * Removes a block from the routine
 */
export interface RemoveBlockCommand extends Command {
  type: 'REMOVE_BLOCK';
  payload: {
    blockId: string;
    originalBlock: any; // The removed block
    originalIndex: number; // Position it was removed from
  };
}

/**
 * Update Block Command
 * Updates block parameters
 */
export interface UpdateBlockCommand extends Command {
  type: 'UPDATE_BLOCK';
  payload: {
    blockId: string;
    updates: Partial<any>; // Partial<RoutineBlock>
    originalValues: Partial<any>; // Original values before update
  };
}

/**
 * Reorder Block Command
 * Changes the order of blocks in the routine
 */
export interface ReorderBlockCommand extends Command {
  type: 'REORDER_BLOCK';
  payload: {
    fromIndex: number;
    toIndex: number;
  };
}
