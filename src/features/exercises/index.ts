/**
 * Exercises Feature Public API
 */

// Components
export { ExerciseCard } from './components/ExerciseCard';
export { ExerciseDetail } from './components/ExerciseDetail';
export { ExerciseLibrary } from './components/ExerciseLibrary';
export { ExerciseSection } from './components/ExerciseSection';

// Model
export { useExerciseStore } from './model/exerciseStore';
export { useExerciseLibraryStore } from './model/exerciseLibraryStore';
export type { Exercise } from './model/types';

// API
export const ExerciseService = {
  getAllExercises: async () => {
    // Implementation would be imported from the actual service
    return [];
  },
  getExercisesByTags: async (tags: string[]) => {
    // Implementation would be imported from the actual service
    return [];
  }
};
