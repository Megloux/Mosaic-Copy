import { Template, TemplateBlock, Routine, RoutineBlock, RoutineExercise } from '@/features/routines/model/types';
import { Exercise } from '@/features/exercises/model/types';
import { exerciseService } from '@/features/exercises/api/exerciseService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service responsible for populating routines from templates
 * Implements the template population logic and exercise recommendations
 */
export class RoutinePopulationService {
  /**
   * Create a new routine from a template
   * @param template Template to create routine from
   * @returns Promise resolving to populated routine
   */
  async createRoutineFromTemplate(template: Template): Promise<Routine> {
    // Create the basic routine structure
    const routine: Routine = {
      id: uuidv4(), // Generate a temporary ID
      name: `${template.name} Routine`,
      description: template.description,
      templateId: template.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blocks: [],
      totalDuration: 0,
      difficulty: this.mapTemplateDifficultyToNumber(template.structure.difficulty),
      userId: '', // Will be set by the backend
      isPublic: false,
      tags: template.structure.focus || []
    };
    
    // Populate blocks
    for (const [index, templateBlock] of template.structure.blocks.entries()) {
      const routineBlock = await this.createBlockFromTemplateBlock(templateBlock, index);
      routine.blocks.push(routineBlock);
    }
    
    // Calculate total duration
    routine.totalDuration = this.calculateRoutineDuration(routine);
    
    return routine;
  }
  
  /**
   * Create a routine block from a template block
   * This is where the tag-matching algorithm is applied
   * @param templateBlock Template block to create routine block from
   * @param position Position of the block in the routine
   * @returns Promise resolving to populated routine block
   */
  private async createBlockFromTemplateBlock(
    templateBlock: TemplateBlock, 
    position: number
  ): Promise<RoutineBlock> {
    // Create the basic block structure
    const routineBlock: RoutineBlock = {
      id: uuidv4(), // Generate a temporary ID
      name: templateBlock.name,
      type: templateBlock.is_warmup ? 'warmup' : 'main',
      position,
      exercises: [],
      notes: templateBlock.instructions,
      restBetweenExercises: templateBlock.is_warmup ? 30 : 60 // Default rest times
    };
    
    // Get recommended exercises for this block
    const recommendedExercises = await exerciseService.getRecommendedExercises(templateBlock);
    
    // Determine how many exercises to include
    const count = this.determineExerciseCount(templateBlock);
    
    // Add the top recommended exercises to the block
    const selectedExercises = recommendedExercises.slice(0, count);
    
    // Convert exercises to routine exercises
    routineBlock.exercises = selectedExercises.map(exercise => 
      this.convertToRoutineExercise(exercise, templateBlock)
    );
    
    return routineBlock;
  }
  
  /**
   * Determine how many exercises to include in a block
   * Uses the min/max range from the template block
   * @param block Template block
   * @returns Number of exercises to include
   */
  private determineExerciseCount(block: TemplateBlock): number {
    const { min, max } = block.exercise_count;
    
    // If min and max are the same, use that number
    if (min === max) return min;
    
    // Otherwise, choose a random number in the range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Convert an Exercise to a RoutineExercise
   * Adds default values based on the template block type
   * @param exercise Exercise to convert
   * @param templateBlock Template block context
   * @returns RoutineExercise with appropriate defaults
   */
  private convertToRoutineExercise(
    exercise: Exercise, 
    templateBlock: TemplateBlock
  ): RoutineExercise {
    // Set default values based on block type
    let sets = 3;
    let reps = 10;
    let duration = exercise.duration.default;
    let restTime = 60;
    
    // Adjust defaults based on block type
    if (templateBlock.is_warmup) {
      // Warm-up exercises typically have fewer sets
      sets = 1;
      reps = 12;
      restTime = 30;
    } else if (templateBlock.has_cardio_burst) {
      // Cardio exercises often use time instead of reps
      sets = 1;
      reps = 0;
      duration = 45; // 45 seconds
      restTime = 15;
    }
    
    return {
      id: uuidv4(), // Generate a temporary ID
      name: exercise.name,
      sets,
      reps,
      duration,
      weight: exercise.isResistance ? 10 : undefined,
      restTime,
      // Copy other properties from the exercise
      tags: exercise.tags,
      thumbnailUrl: exercise.thumbnailUrl,
      videoUrl: exercise.videoUrl,
      isResistance: exercise.isResistance,
      orientationCode: exercise.orientationCode
    };
  }
  
  /**
   * Map template difficulty string to a number
   * @param difficulty Template difficulty string
   * @returns Numeric difficulty (1-5)
   */
  private mapTemplateDifficultyToNumber(
    difficulty: 'beginner' | 'intermediate' | 'advanced'
  ): number {
    switch (difficulty) {
      case 'beginner':
        return 1;
      case 'intermediate':
        return 3;
      case 'advanced':
        return 5;
      default:
        return 3;
    }
  }
  
  /**
   * Calculate the total duration of a routine
   * Based on exercise durations, sets, and rest times
   * @param routine Routine to calculate duration for
   * @returns Total duration in seconds
   */
  private calculateRoutineDuration(routine: Routine): number {
    let totalSeconds = 0;
    
    routine.blocks.forEach(block => {
      block.exercises.forEach(exercise => {
        // Add exercise duration (per set)
        totalSeconds += exercise.duration * exercise.sets;
        
        // Add rest time between sets
        if (exercise.sets > 1 && exercise.restTime) {
          totalSeconds += exercise.restTime * (exercise.sets - 1);
        }
      });
      
      // Add rest between exercises
      if (block.exercises.length > 1 && block.restBetweenExercises) {
        totalSeconds += block.restBetweenExercises * (block.exercises.length - 1);
      }
    });
    
    return totalSeconds;
  }
}

// Export a singleton instance for use throughout the app
export const routinePopulationService = new RoutinePopulationService();
