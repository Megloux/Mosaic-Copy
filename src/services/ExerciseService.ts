import { Exercise, ExerciseFilters, ScoredExercise, ExerciseResponse } from '@/features/exercises/model/types';
import { TemplateBlock } from '@/features/routines/model/types';

/**
 * Service responsible for fetching exercises and implementing the tag-matching algorithm
 * This service connects to the Exercise Library and provides recommendations based on template tags
 */
export class ExerciseService {
  // In-memory cache for exercises
  private exerciseCache: Map<string, Exercise> = new Map();
  // Cache for tag-based queries to reduce API calls
  private tagQueryCache: Map<string, Exercise[]> = new Map();
  
  /**
   * Fetch all exercises from the API
   * @returns Promise resolving to array of exercises
   */
  async getAllExercises(): Promise<Exercise[]> {
    try {
      const response = await fetch('/api/exercises');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exercises: ${response.status}`);
      }
      
      const data: ExerciseResponse = await response.json();
      const exercises = data.exercises;
      
      // Cache exercises for future use
      exercises.forEach(exercise => {
        this.exerciseCache.set(exercise.id, exercise);
      });
      
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }
  
  /**
   * Fetch exercises that match specific tags
   * @param tags Array of tags to match
   * @returns Promise resolving to array of matching exercises
   */
  async getExercisesByTags(tags: string[]): Promise<Exercise[]> {
    // Create a cache key from the sorted tags
    const cacheKey = tags.sort().join(',');
    
    // Check cache first
    if (this.tagQueryCache.has(cacheKey)) {
      console.log('Exercise tag cache hit for:', cacheKey);
      return this.tagQueryCache.get(cacheKey)!;
    }
    
    try {
      // In a real implementation, this would be an API call with tag parameters
      const tagsParam = tags.join(',');
      const response = await fetch(`/api/exercises?tags=${tagsParam}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exercises by tags: ${response.status}`);
      }
      
      const data: ExerciseResponse = await response.json();
      const exercises = data.exercises;
      
      // Cache the results
      this.tagQueryCache.set(cacheKey, exercises);
      
      // Also cache individual exercises
      exercises.forEach(exercise => {
        this.exerciseCache.set(exercise.id, exercise);
      });
      
      return exercises;
    } catch (error) {
      console.error('Error fetching exercises by tags:', error);
      return [];
    }
  }
  
  /**
   * Get recommended exercises for a template block
   * This is the core function that implements our tag-matching algorithm
   * @param block Template block to get recommendations for
   * @returns Promise resolving to array of recommended exercises
   */
  async getRecommendedExercises(block: TemplateBlock): Promise<Exercise[]> {
    try {
      // Fetch exercises that match the template tags
      const exercises = await this.getExercisesByTags(block.template_tags);
      
      // Apply tag-matching algorithm
      const matchedExercises = this.findMatchingExercises(block.template_tags, exercises);
      
      // If not enough matches, fetch more exercises
      if (matchedExercises.length < block.exercise_count.min) {
        console.log('Not enough matches, fetching all exercises');
        const allExercises = await this.getAllExercises();
        
        // Find additional matches
        const additionalMatches = this.findMatchingExercises(block.template_tags, allExercises)
          .filter(ex => !matchedExercises.some(match => match.id === ex.id));
        
        return [...matchedExercises, ...additionalMatches].slice(0, 20);
      }
      
      return matchedExercises.slice(0, 20); // Limit to 20 recommendations
    } catch (error) {
      console.error('Error getting recommended exercises:', error);
      return [];
    }
  }
  
  /**
   * Find exercises that match template tags using our scoring algorithm
   * This is where the business logic for matching exercises to templates lives
   * @param templateTags Tags from the template block
   * @param exercises Array of exercises to match against
   * @returns Array of matching exercises, sorted by relevance
   */
  findMatchingExercises(templateTags: string[], exercises: Exercise[]): Exercise[] {
    // If no template tags, return all exercises
    if (!templateTags.length) {
      return exercises;
    }
    
    // Score each exercise based on tag matches
    const scoredExercises: ScoredExercise[] = exercises.map(exercise => {
      let score = 0;
      
      // Calculate match score
      for (const tag of exercise.tags) {
        if (templateTags.includes(tag)) {
          score += 1;
        }
      }
      
      // Bonus for exact matches
      if (score === templateTags.length && score === exercise.tags.length) {
        score += 3;
      }
      
      // Bonus for containing all template tags
      if (templateTags.every(tag => exercise.tags.includes(tag))) {
        score += 2;
      }
      
      return { exercise, score };
    });
    
    // Filter out exercises with no matches
    const matchedExercises = scoredExercises.filter(item => item.score > 0);
    
    // Sort by score (highest first)
    matchedExercises.sort((a, b) => b.score - a.score);
    
    // Return exercises only (without scores)
    return matchedExercises.map(item => item.exercise);
  }
  
  /**
   * Get an exercise by ID
   * @param id Exercise ID
   * @returns Promise resolving to exercise
   */
  async getExerciseById(id: string): Promise<Exercise | null> {
    // Check cache first
    if (this.exerciseCache.has(id)) {
      return this.exerciseCache.get(id)!;
    }
    
    try {
      const response = await fetch(`/api/exercises/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch exercise: ${response.status}`);
      }
      
      const exercise = await response.json();
      
      // Cache for future use
      this.exerciseCache.set(exercise.id, exercise);
      
      return exercise;
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      return null;
    }
  }
}

// Export a singleton instance for use throughout the app
export const exerciseService = new ExerciseService();
