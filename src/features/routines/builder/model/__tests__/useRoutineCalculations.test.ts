import { renderHook } from '@testing-library/react';
import { useRoutineCalculations } from '@/components/routines/builder/hooks/useRoutineCalculations';
import { RoutineBlock, RoutineExercise } from '@/features/routines/model/types';

describe('useRoutineCalculations', () => {
  // Mock routine data
  const createMockExercise = (id: string, duration: number): RoutineExercise => ({
    id,
    name: `Exercise ${id}`,
    sets: 1,
    reps: 10,
    duration,
    tags: [],
    thumbnailUrl: '',
    isResistance: false
  });

  const createMockBlock = (id: string, exercises: RoutineExercise[]): RoutineBlock => ({
    id,
    name: `Block ${id}`,
    type: 'main',
    position: 1,
    exercises
  });

  describe('totalDuration', () => {
    it('should return 0 for null routine', () => {
      const { result } = renderHook(() => useRoutineCalculations(null));
      expect(result.current.totalDuration).toBe(0);
    });

    it('should return 0 for routine with no blocks', () => {
      const { result } = renderHook(() => useRoutineCalculations({ blocks: [] }));
      expect(result.current.totalDuration).toBe(0);
    });

    it('should calculate total duration for routine with one block and one exercise', () => {
      const exercise = createMockExercise('ex1', 60);
      const block = createMockBlock('block1', [exercise]);
      const routine = { blocks: [block] };

      const { result } = renderHook(() => useRoutineCalculations(routine));
      expect(result.current.totalDuration).toBe(60);
    });

    it('should calculate total duration for routine with multiple blocks and exercises', () => {
      const exercises1 = [
        createMockExercise('ex1', 60),
        createMockExercise('ex2', 45),
        createMockExercise('ex3', 30)
      ];
      const exercises2 = [
        createMockExercise('ex4', 90),
        createMockExercise('ex5', 120)
      ];

      const block1 = createMockBlock('block1', exercises1);
      const block2 = createMockBlock('block2', exercises2);
      const routine = { blocks: [block1, block2] };

      const { result } = renderHook(() => useRoutineCalculations(routine));
      // Total should be 60 + 45 + 30 + 90 + 120 = 345
      expect(result.current.totalDuration).toBe(345);
    });

    it('should use default duration (45s) for exercises with no duration', () => {
      const exercise1 = createMockExercise('ex1', 60);
      // For TypeScript compatibility, we need to set duration to 0 instead of undefined
      const exercise2 = createMockExercise('ex2', 0);
      const block = createMockBlock('block1', [exercise1, exercise2]);
      const routine = { blocks: [block] };

      const { result } = renderHook(() => useRoutineCalculations(routine));
      // Total should be 60 + 45 (default) = 105
      expect(result.current.totalDuration).toBe(105);
    });
  });

  describe('formattedDuration', () => {
    it('should format duration correctly', () => {
      const exercises = [
        createMockExercise('ex1', 60),
        createMockExercise('ex2', 120)
      ];
      const block = createMockBlock('block1', exercises);
      const routine = { blocks: [block] };

      const { result } = renderHook(() => useRoutineCalculations(routine));
      // Total is 180 seconds = 3 minutes
      expect(result.current.formattedDuration).toBe('3min');
    });

    it('should format duration with hours correctly', () => {
      const exercises = [
        createMockExercise('ex1', 3600), // 1 hour
        createMockExercise('ex2', 1800)  // 30 minutes
      ];
      const block = createMockBlock('block1', exercises);
      const routine = { blocks: [block] };

      const { result } = renderHook(() => useRoutineCalculations(routine));
      // Total is 5400 seconds = 1h 30min
      expect(result.current.formattedDuration).toBe('1h 30min');
    });
  });

  describe('estimatedCalories', () => {
    it('should calculate estimated calories based on duration', () => {
      const exercises = [
        createMockExercise('ex1', 60),
        createMockExercise('ex2', 120)
      ];
      const block = createMockBlock('block1', exercises);
      const routine = { blocks: [block] };

      const { result } = renderHook(() => useRoutineCalculations(routine));
      // Total is 180 seconds = 3 minutes
      // Calories are calculated as minutes * 7, so 3 * 7 = 21
      expect(result.current.estimatedCalories).toBe(21);
    });
  });
});
