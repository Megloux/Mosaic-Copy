import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Template, Routine, RoutineBlock, RoutineExercise } from '@/features/routines/model/types';
import { Exercise } from '@/features/exercises/model/types';
import { Command, CommandHistory } from '@/types/commands';
import { templateService } from '@/features/routines/api/templateService';
// import { exerciseService } from '@/features/exercises/api/exerciseService';

/**
 * Routine Store State
 * Contains all state related to the Routine Builder
 */
export interface RoutineState {
  // Template data
  templates: Template[];
  selectedTemplate: Template | null;
  
  // Current routine being built
  currentRoutine: Routine;
  
  // Command history for undo/redo
  history: CommandHistory;
  
  // UI state
  isLoading: boolean;
  error: string | null;
}

/**
 * Routine Store Actions
 * All the actions that can be performed on the routine state
 */
export interface RoutineActions {
  // Template actions
  fetchTemplates: () => Promise<void>;
  selectTemplate: (templateId: string) => Promise<void>;
  
  // Command pattern actions
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
  
  // Exercise actions
  addExerciseToBlock: (blockId: string, exercise: Exercise) => void;
  removeExerciseFromBlock: (blockId: string, exerciseId: string) => void;
  updateExercise: (blockId: string, exerciseId: string, updates: Partial<RoutineExercise>) => void;
  reorderExercise: (blockId: string, fromIndex: number, toIndex: number) => void;
  
  // Block actions
  addBlock: (block: RoutineBlock) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<RoutineBlock>) => void;
  reorderBlock: (fromIndex: number, toIndex: number) => void;
  
  // Routine management
  saveRoutine: () => Promise<Routine>;
  resetRoutine: () => void;
}

// Define the combined slice type
type RoutineSlice = RoutineState & RoutineActions;

// Middleware types
// We're not using this currently, but keeping it for future reference
// type RoutineMiddlewares = [
//   ["zustand/devtools", never]
// ];

/**
 * Helper function to create a routine from a template
 */
function createRoutineFromTemplate(template: Template): Routine {
  return {
    id: `r-${Date.now()}`,
    name: `${template.name} Routine`,
    description: template.description,
    templateId: template.id,
    blocks: template.structure.blocks.map(block => ({
      id: `rb-${block.block_id}`,
      name: block.name,
      type: block.is_warmup ? 'warmup' : 'main',
      position: block.position || 0,
      exercises: [],
      notes: block.instructions,
      restBetweenExercises: 30 // Default rest time
    })),
    totalDuration: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficulty: template.structure.difficulty === 'beginner' ? 1 : 
               template.structure.difficulty === 'intermediate' ? 3 : 5,
    userId: '',  // Will be set by the backend
    isPublic: false,
    tags: template.structure.focus || []
  };
}

/**
 * Create a default empty routine
 * Used when creating a custom routine from scratch
 */
function createEmptyRoutine(): Routine {
  return {
    id: `r-${Date.now()}`,
    name: 'New Routine',
    description: 'Custom routine',
    templateId: '',
    blocks: [
      {
        id: `rb-${Date.now()}-1`,
        name: 'Warmup',
        type: 'warmup',
        position: 0,
        exercises: [],
        restBetweenExercises: 30
      },
      {
        id: `rb-${Date.now()}-2`,
        name: 'Main Workout',
        type: 'main',
        position: 1,
        exercises: [],
        restBetweenExercises: 60
      },
      {
        id: `rb-${Date.now()}-3`,
        name: 'Cooldown',
        type: 'cooldown',
        position: 2,
        exercises: [],
        restBetweenExercises: 30
      }
    ],
    totalDuration: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    difficulty: 3,  // Default to intermediate
    userId: '',
    isPublic: false,
    tags: ['Custom']
  };
}

/**
 * Helper function to find a block by ID
 */
function findBlockById(routine: Routine, blockId: string): { block: RoutineBlock | undefined, index: number } {
  const index = routine.blocks.findIndex(block => block.id === blockId);
  return {
    block: routine.blocks[index],
    index
  };
}

/**
 * Helper function to find an exercise by ID within a block
 */
function findExerciseById(block: RoutineBlock, exerciseId: string): { exercise: RoutineExercise | undefined, index: number } {
  const index = block.exercises.findIndex(exercise => exercise.id === exerciseId);
  return {
    exercise: block.exercises[index],
    index
  };
}

/**
 * Helper function to calculate the total duration of a routine
 */
function calculateRoutineDuration(routine: Routine): number {
  return routine.blocks.reduce((total, block) => {
    const blockDuration = block.exercises.reduce((blockTotal, exercise) => {
      return blockTotal + exercise.duration;
    }, 0);
    
    // Add rest time between exercises
    const restTime = (block.exercises.length - 1) * (block.restBetweenExercises || 0);
    
    return total + blockDuration + restTime;
  }, 0);
}

/**
 * Create the Zustand store with devtools middleware
 * This is the main state management for the Routine Builder
 */
export const useRoutineStore = create<RoutineSlice>()(
  devtools(
    ((set, get) => ({
      // Initial state
      templates: [],
      selectedTemplate: null,
      currentRoutine: createEmptyRoutine(),
      history: { undoStack: [], redoStack: [] },
      isLoading: false,
      error: null,
      
      // Template actions
      fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
          const templates = await templateService.getAllTemplates();
          set({ templates, isLoading: false });
        } catch (error) {
          console.error('Error fetching templates:', error);
          set({ error: 'Failed to load templates. Please try again.', isLoading: false });
        }
      },
      
      selectTemplate: async (templateId: string) => {
        set({ isLoading: true, error: null });
        try {
          // Handle "custom" template specially
          if (templateId === 'custom') {
            set({ 
              selectedTemplate: null, 
              currentRoutine: createEmptyRoutine(),
              isLoading: false,
              history: { undoStack: [], redoStack: [] }
            });
            return;
          }
          
          const template = await templateService.getTemplateById(templateId);
          
          // Create initial routine from template
          const routine = createRoutineFromTemplate(template);
          
          set({ 
            selectedTemplate: template, 
            currentRoutine: routine,
            isLoading: false,
            // Clear history when selecting a new template
            history: { undoStack: [], redoStack: [] }
          });
        } catch (error) {
          console.error('Error selecting template:', error);
          set({ 
            error: 'Failed to load template. Please try another one.', 
            isLoading: false 
          });
        }
      },
      
      // Command pattern implementation
      executeCommand: (command: Command) => {
        set((state: RoutineSlice) => {
          const newHistory = {
            undoStack: [...state.history.undoStack, command],
            redoStack: []
          };
          
          command.execute(state);
          
          return {
            history: newHistory
          };
        });
      },
      
      undo: () => {
        set((state: RoutineSlice) => {
          if (state.history.undoStack.length === 0) {
            return state; // Nothing to undo
          }
          
          const lastCommand = state.history.undoStack[state.history.undoStack.length - 1];
          const newUndoStack = state.history.undoStack.slice(0, -1);
          
          lastCommand.undo(state);
          
          return {
            history: {
              undoStack: newUndoStack,
              redoStack: [...state.history.redoStack, lastCommand]
            }
          };
        });
      },
      
      redo: () => {
        set((state: RoutineSlice) => {
          if (state.history.redoStack.length === 0) {
            return state; // Nothing to redo
          }
          
          const nextCommand = state.history.redoStack[state.history.redoStack.length - 1];
          const newRedoStack = state.history.redoStack.slice(0, -1);
          
          nextCommand.execute(state);
          
          return {
            history: {
              undoStack: [...state.history.undoStack, nextCommand],
              redoStack: newRedoStack
            }
          };
        });
      },
      
      // Exercise actions
      addExerciseToBlock: (blockId: string, exercise: Exercise) => {
        set((state: RoutineSlice) => {
          const { block } = findBlockById(state.currentRoutine, blockId);
          
          if (!block) {
            console.error(`Block with ID ${blockId} not found`);
            return state;
          }
          
          // Create a command for undo/redo
          const command: Command = {
            type: 'ADD_EXERCISE',
            payload: {
              blockId,
              exercise: {
                id: `re-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: exercise.name, // Use name from FSA type
                duration: exercise.duration?.default || 60, // Default duration in seconds
                sets: 1,
                reps: 10,
                weight: 0,
                notes: '',
                tags: exercise.tags || [], // Use tags from FSA type
                isResistance: exercise.isResistance || false // Only if needed by UI, otherwise can be omitted
              }
            },
            execute: (state: RoutineSlice) => {
              // Find the block again in the current state
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              // Add the exercise to the block
              state.currentRoutine.blocks[blockIndex].exercises.push(command.payload.exercise);
            },
            undo: (state: RoutineSlice) => {
              // Find the block again in the current state
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              // Remove the exercise from the block
              state.currentRoutine.blocks[blockIndex].exercises = 
                state.currentRoutine.blocks[blockIndex].exercises.filter(e => e.id !== command.payload.exercise.id);
            }
          };
          
          // Execute the command
          command.execute(state);
          
          // Add to history
          const newHistory = {
            undoStack: [...state.history.undoStack, command],
            redoStack: []
          };
          
          // Create updated routine with the new exercise added
          const updatedBlock = {
            ...block,
            exercises: [...block.exercises, command.payload.exercise]
          };
          
          const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
          const updatedBlocks = [...state.currentRoutine.blocks];
          updatedBlocks[blockIndex] = updatedBlock;
          
          const updatedRoutine = {
            ...state.currentRoutine,
            blocks: updatedBlocks
          };
          
          return {
            currentRoutine: updatedRoutine,
            history: newHistory
          };
        });
      },
      
      removeExerciseFromBlock: (blockId: string, exerciseId: string) => {
        set((state: RoutineSlice) => {
          const { block, index: blockIndex } = findBlockById(state.currentRoutine, blockId);
          
          if (!block) {
            console.error(`Block with ID ${blockId} not found`);
            return state;
          }
          
          const { exercise, index } = findExerciseById(block, exerciseId);
          
          if (!exercise) {
            console.error(`Exercise with ID ${exerciseId} not found in block ${blockId}`);
            return state;
          }
          
          // Create a command for undo/redo
          const command: Command = {
            type: 'REMOVE_EXERCISE',
            payload: {
              blockId,
              exerciseId,
              originalExercise: exercise,
              originalIndex: index
            },
            execute: (state: RoutineSlice) => {
              const { block } = findBlockById(state.currentRoutine, blockId);
              if (!block) return;
              
              // Remove the exercise from the block
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              const updatedExercises = block.exercises.filter(e => e.id !== exerciseId);
              
              // Update the block in the routine
              state.currentRoutine.blocks[blockIndex] = {
                ...block,
                exercises: updatedExercises
              };
            },
            undo: (state: RoutineSlice) => {
              const { block } = findBlockById(state.currentRoutine, blockId);
              if (!block) return;
              
              // Add the exercise back to the block at the original index
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              const updatedExercises = [...block.exercises];
              updatedExercises.splice(index, 0, exercise);
              
              // Update the block in the routine
              state.currentRoutine.blocks[blockIndex] = {
                ...block,
                exercises: updatedExercises
              };
            }
          };
          
          // Execute the command
          command.execute(state);
          
          // Add to history
          const newHistory = {
            undoStack: [...state.history.undoStack, command],
            redoStack: []
          };
          
          // Create updated routine with the exercise removed
          const updatedExercises = block.exercises.filter(e => e.id !== exerciseId);
          
          const updatedBlock = {
            ...block,
            exercises: updatedExercises
          };
          
          const updatedBlocks = [...state.currentRoutine.blocks];
          updatedBlocks[blockIndex] = updatedBlock;
          
          const updatedRoutine = {
            ...state.currentRoutine,
            blocks: updatedBlocks
          };
          
          return {
            currentRoutine: updatedRoutine,
            history: newHistory
          };
        });
      },
      
      updateExercise: (blockId: string, exerciseId: string, updates: Partial<RoutineExercise>) => {
        set((state: RoutineSlice) => {
          const { block, index: blockIndex } = findBlockById(state.currentRoutine, blockId);
          
          if (!block) {
            console.error(`Block with ID ${blockId} not found`);
            return state;
          }
          
          const { exercise, index } = findExerciseById(block, exerciseId);
          
          if (!exercise) {
            console.error(`Exercise with ID ${exerciseId} not found in block ${blockId}`);
            return state;
          }
          
          // Create a command for undo/redo
          const originalValues = {} as Record<keyof RoutineExercise, any>;
          
          // Store original values for fields being updated
          Object.keys(updates).forEach(key => {
            const typedKey = key as keyof RoutineExercise;
            originalValues[typedKey] = exercise[typedKey];
          });
          
          // Create updated exercise
          const updatedExercise = {
            ...exercise,
            ...updates
          };
          
          // Create updated block with the exercise replaced
          const updatedExercises = [...block.exercises];
          updatedExercises[index] = updatedExercise;
          
          const updatedBlock = {
            ...block,
            exercises: updatedExercises
          };
          
          // Create updated routine with the block replaced
          const updatedBlocks = [...state.currentRoutine.blocks];
          updatedBlocks[blockIndex] = updatedBlock;
          
          const updatedRoutine = {
            ...state.currentRoutine,
            blocks: updatedBlocks
          };
          
          // Create command for history
          const command: Command = {
            type: 'UPDATE_EXERCISE',
            payload: {
              blockId,
              exerciseId,
              updates,
              originalValues
            },
            execute: (state: RoutineSlice) => {
              const { block } = findBlockById(state.currentRoutine, blockId);
              if (!block) return;
              
              const { exercise, index } = findExerciseById(block, exerciseId);
              if (!exercise) return;
              
              // Apply updates
              const updatedExercise = {
                ...exercise,
                ...updates
              };
              
              // Update the exercise in the block
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              const updatedBlock = {
                ...block,
                exercises: block.exercises.map((e, i) => i === index ? updatedExercise : e)
              };
              
              // Update the block in the routine
              state.currentRoutine.blocks[blockIndex] = updatedBlock;
            },
            undo: (state: RoutineSlice) => {
              const { block } = findBlockById(state.currentRoutine, blockId);
              if (!block) return;
              
              const { exercise, index } = findExerciseById(block, exerciseId);
              if (!exercise) return;
              
              // Apply original values
              const restoredExercise = {
                ...exercise
              };
              
              // Restore original values
              Object.keys(originalValues).forEach(key => {
                const typedKey = key as keyof RoutineExercise;
                (restoredExercise as any)[typedKey] = originalValues[typedKey];
              });
              
              // Update the exercise in the block
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              const updatedBlock = {
                ...block,
                exercises: block.exercises.map((e, i) => i === index ? restoredExercise : e)
              };
              
              // Update the block in the routine
              state.currentRoutine.blocks[blockIndex] = updatedBlock;
            }
          };
          
          // Execute the command
          command.execute(state);
          
          // Add to history
          const newHistory = {
            undoStack: [...state.history.undoStack, command],
            redoStack: []
          };
          
          return {
            currentRoutine: updatedRoutine,
            history: newHistory
          };
        });
      },
      
      reorderExercise: (blockId: string, fromIndex: number, toIndex: number) => {
        set((state: RoutineSlice) => {
          const { block, index: blockIndex } = findBlockById(state.currentRoutine, blockId);
          
          if (!block) {
            console.error(`Block with ID ${blockId} not found`);
            return state;
          }
          
          // Create a command for undo/redo
          const command: Command = {
            type: 'REORDER_EXERCISE',
            payload: {
              blockId,
              fromIndex,
              toIndex
            },
            execute: (state: RoutineSlice) => {
              const { block } = findBlockById(state.currentRoutine, blockId);
              if (!block) return;
              
              // Reorder exercises
              const exercises = [...block.exercises];
              const [movedExercise] = exercises.splice(fromIndex, 1);
              exercises.splice(toIndex, 0, movedExercise);
              
              // Find the block index
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              // Update the block in the routine
              state.currentRoutine.blocks[blockIndex] = {
                ...block,
                exercises
              };
            },
            undo: (state: RoutineSlice) => {
              const { block } = findBlockById(state.currentRoutine, blockId);
              if (!block) return;
              
              // Reorder exercises back
              const exercises = [...block.exercises];
              const [movedExercise] = exercises.splice(toIndex, 1);
              exercises.splice(fromIndex, 0, movedExercise);
              
              // Find the block index
              const blockIndex = state.currentRoutine.blocks.findIndex(b => b.id === blockId);
              if (blockIndex === -1) return;
              
              // Update the block in the routine
              state.currentRoutine.blocks[blockIndex] = {
                ...block,
                exercises
              };
            }
          };
          
          // Execute the command
          command.execute(state);
          
          // Add to history
          const newHistory = {
            undoStack: [...state.history.undoStack, command],
            redoStack: []
          };
          
          // Create updated routine with the reordered exercises
          const updatedExercises = [...block.exercises];
          const [movedExercise] = updatedExercises.splice(fromIndex, 1);
          updatedExercises.splice(toIndex, 0, movedExercise);
          
          const updatedBlock = {
            ...block,
            exercises: updatedExercises
          };
          
          const updatedBlocks = [...state.currentRoutine.blocks];
          updatedBlocks[blockIndex] = updatedBlock;
          
          const updatedRoutine = {
            ...state.currentRoutine,
            blocks: updatedBlocks
          };
          
          return {
            currentRoutine: updatedRoutine,
            history: newHistory
          };
        });
      },
      
      // Block actions
      addBlock: (block: RoutineBlock) => {
        const state = get();
        
        // Create a command for adding a block
        const command: Command = {
          type: 'ADD_BLOCK',
          payload: {
            block
          },
          execute: () => {
            set(state => {
              const newRoutine = { ...state.currentRoutine };
              
              // Add block to routine
              newRoutine.blocks.push(block);
              
              // Sort blocks by position
              newRoutine.blocks.sort((a, b) => a.position - b.position);
              
              return { currentRoutine: newRoutine };
            });
          },
          undo: () => {
            set(state => {
              const newRoutine = { ...state.currentRoutine };
              
              // Remove block from routine
              newRoutine.blocks = newRoutine.blocks.filter(b => b.id !== block.id);
              
              return { currentRoutine: newRoutine };
            });
          }
        };
        
        // Execute the command
        state.executeCommand(command);
      },
      
      removeBlock: (blockId: string) => {
        const state = get();
        const { block, index } = findBlockById(state.currentRoutine, blockId);
        
        if (!block) {
          console.error(`Block with ID ${blockId} not found`);
          return;
        }
        
        // Create a command for removing a block
        const command: Command = {
          type: 'REMOVE_BLOCK',
          payload: {
            blockId,
            originalBlock: block,
            originalIndex: index
          },
          execute: () => {
            set(state => {
              const newRoutine = { ...state.currentRoutine };
              
              // Remove block from routine
              newRoutine.blocks = newRoutine.blocks.filter(b => b.id !== blockId);
              
              // Recalculate duration
              newRoutine.totalDuration = calculateRoutineDuration(newRoutine);
              
              return { currentRoutine: newRoutine };
            });
          },
          undo: () => {
            set(state => {
              const newRoutine = { ...state.currentRoutine };
              
              // Insert block back at its original position
              const blocks = [...newRoutine.blocks];
              blocks.splice(index, 0, block);
              newRoutine.blocks = blocks;
              
              // Recalculate duration
              newRoutine.totalDuration = calculateRoutineDuration(newRoutine);
              
              return { currentRoutine: newRoutine };
            });
          }
        };
        
        // Execute the command
        state.executeCommand(command);
      },
      
      updateBlock: (blockId: string, updates: Partial<RoutineBlock>) => {
        set((state: RoutineSlice) => {
          const { block, index } = findBlockById(state.currentRoutine, blockId);
          
          if (!block) {
            console.error(`Block with ID ${blockId} not found`);
            return state;
          }
          
          // Create a command for undo/redo
          const originalValues = {} as Record<keyof RoutineBlock, any>;
          
          // Store original values for fields being updated
          Object.keys(updates).forEach(key => {
            const typedKey = key as keyof RoutineBlock;
            originalValues[typedKey] = block[typedKey];
          });
          
          // Create updated block
          const updatedBlock = {
            ...block,
            ...updates
          };
          
          // Create updated routine with the block replaced
          const updatedBlocks = [...state.currentRoutine.blocks];
          updatedBlocks[index] = updatedBlock;
          
          const updatedRoutine = {
            ...state.currentRoutine,
            blocks: updatedBlocks
          };
          
          // Create command for history
          const command: Command = {
            type: 'UPDATE_BLOCK',
            payload: {
              blockId,
              updates,
              originalValues
            },
            execute: (state: RoutineSlice) => {
              const { block, index } = findBlockById(state.currentRoutine, blockId);
              if (!block || index === -1) return;
              
              // Apply updates
              const updatedBlock = {
                ...block,
                ...updates
              };
              
              // Update the block in the routine
              state.currentRoutine.blocks[index] = updatedBlock;
            },
            undo: (state: RoutineSlice) => {
              const { block, index } = findBlockById(state.currentRoutine, blockId);
              if (!block || index === -1) return;
              
              // Apply original values
              const restoredBlock = {
                ...block
              };
              
              // Restore original values
              Object.keys(originalValues).forEach(key => {
                const typedKey = key as keyof RoutineBlock;
                (restoredBlock as any)[typedKey] = originalValues[typedKey];
              });
              
              // Update the block in the routine
              state.currentRoutine.blocks[index] = restoredBlock;
            }
          };
          
          // Execute the command
          command.execute(state);
          
          // Add to history
          const newHistory = {
            undoStack: [...state.history.undoStack, command],
            redoStack: []
          };
          
          return {
            currentRoutine: updatedRoutine,
            history: newHistory
          };
        });
      },
      
      reorderBlock: (fromIndex: number, toIndex: number) => {
        const state = get();
        const { blocks } = state.currentRoutine;
        
        if (fromIndex === toIndex) return;
        
        if (fromIndex < 0 || fromIndex >= blocks.length ||
            toIndex < 0 || toIndex >= blocks.length) {
          console.error('Invalid block indices for reordering');
          return;
        }
        
        // Create a command for reordering blocks
        const command: Command = {
          type: 'REORDER_BLOCK',
          payload: {
            fromIndex,
            toIndex
          },
          execute: () => {
            set(state => {
              const newRoutine = { ...state.currentRoutine };
              
              // Reorder blocks
              const blocks = [...newRoutine.blocks];
              const [movedBlock] = blocks.splice(fromIndex, 1);
              blocks.splice(toIndex, 0, movedBlock);
              
              // Update positions
              blocks.forEach((block, index) => {
                block.position = index;
              });
              
              newRoutine.blocks = blocks;
              
              return { currentRoutine: newRoutine };
            });
          },
          undo: () => {
            set(state => {
              const newRoutine = { ...state.currentRoutine };
              
              // Reorder blocks back
              const blocks = [...newRoutine.blocks];
              const [movedBlock] = blocks.splice(toIndex, 1);
              blocks.splice(fromIndex, 0, movedBlock);
              
              // Update positions
              blocks.forEach((block, index) => {
                block.position = index;
              });
              
              newRoutine.blocks = blocks;
              
              return { currentRoutine: newRoutine };
            });
          }
        };
        
        // Execute the command
        state.executeCommand(command);
      },
      
      // Routine management
      saveRoutine: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const routine = get().currentRoutine;
          
          // Here you would typically call an API to save the routine
          // For now, we'll just simulate a successful save
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false });
          
          return routine;
        } catch (error) {
          set({
            isLoading: false,
            error: `Failed to save routine: ${error instanceof Error ? error.message : String(error)}`,
          });
        }
      },
      
      resetRoutine: () => {
        set((state: RoutineSlice) => {
          if (state.selectedTemplate) {
            return {
              currentRoutine: createRoutineFromTemplate(state.selectedTemplate),
              history: { undoStack: [], redoStack: [] }
            };
          } else {
            return {
              currentRoutine: createEmptyRoutine(),
              history: { undoStack: [], redoStack: [] }
            };
          }
        });
      },
    })),
    { name: 'routine-store' }
  )
);
