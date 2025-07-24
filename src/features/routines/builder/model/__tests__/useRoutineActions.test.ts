/** @jest-environment jsdom */
import { renderHook, act } from '@testing-library/react';
import { useRoutineActions } from '@/components/routines/builder/hooks/useRoutineActions';

// Enable fake timers
jest.useFakeTimers();

// Create mock functions
const mockAddExerciseToBlock = jest.fn();
const mockRemoveExerciseFromBlock = jest.fn();
const mockReorderExercise = jest.fn();
const mockSaveRoutine = jest.fn();

// Mock the useRoutineStore
jest.mock('@/store/routineStore', () => ({
  useRoutineStore: () => ({
    currentRoutine: {
      id: 'routine1',
      name: 'Test Routine',
      blocks: [
        {
          id: 'block1',
          name: 'Block 1',
          type: 'main',
          position: 1,
          exercises: [
            {
              id: 'ex1',
              name: 'Exercise 1',
              sets: 1,
              reps: 10,
              duration: 60,
              tags: [],
              thumbnailUrl: '',
              isResistance: false
            }
          ]
        }
      ]
    },
    addExerciseToBlock: mockAddExerciseToBlock,
    removeExerciseFromBlock: mockRemoveExerciseFromBlock,
    reorderExercise: mockReorderExercise,
    saveRoutine: mockSaveRoutine
  })
}));

// Mock navigator.vibrate
Object.defineProperty(window.navigator, 'vibrate', {
  value: jest.fn(),
  writable: true
});

// Mock navigator.share
Object.defineProperty(window.navigator, 'share', {
  value: jest.fn().mockResolvedValue(true),
  writable: true
});

// Mock console.log and console.error
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
beforeEach(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});
afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  jest.clearAllTimers();
});

describe('useRoutineActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handlePlay', () => {
    it('should trigger haptic feedback and log the routine name', () => {
      const { result } = renderHook(() => useRoutineActions());
      
      act(() => {
        result.current.handlePlay();
      });
      
      expect(window.navigator.vibrate).toHaveBeenCalledWith([15, 30, 15]);
      expect(console.log).toHaveBeenCalledWith('Starting routine:', 'Test Routine');
    });
  });

  describe('handleFavorite', () => {
    it('should toggle favorite state and trigger haptic feedback', () => {
      const { result } = renderHook(() => useRoutineActions());
      
      expect(result.current.isFavorite).toBe(false);
      
      act(() => {
        result.current.handleFavorite();
      });
      
      expect(result.current.isFavorite).toBe(true);
      expect(window.navigator.vibrate).toHaveBeenCalledWith(10);
      
      act(() => {
        result.current.handleFavorite();
      });
      
      expect(result.current.isFavorite).toBe(false);
    });
  });

  describe('handleShare', () => {
    it('should trigger haptic feedback and call navigator.share if available', () => {
      const { result } = renderHook(() => useRoutineActions());
      
      act(() => {
        result.current.handleShare();
      });
      
      expect(window.navigator.vibrate).toHaveBeenCalledWith(8);
      expect(window.navigator.share).toHaveBeenCalledWith({
        title: 'Mosaic Routine: Test Routine',
        text: 'Check out this workout routine I created with Mosaic!'
      });
    });
  });

  describe('handleSave', () => {
    it('should trigger haptic feedback and call saveRoutine', () => {
      const { result } = renderHook(() => useRoutineActions());
      
      act(() => {
        result.current.handleSave();
      });
      
      expect(window.navigator.vibrate).toHaveBeenCalledWith([10, 20, 10]);
      expect(mockSaveRoutine).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Routine saved successfully');
    });
  });

  describe('handleAddExercise', () => {
    it('should trigger haptic feedback and call addExerciseToBlock', () => {
      const { result } = renderHook(() => useRoutineActions());
      const exercise = {
        id: 'ex2',
        name: 'Exercise 2',
        sets: 1,
        reps: 10,
        duration: 60,
        tags: [],
        thumbnailUrl: '',
        isResistance: false
      };
      
      act(() => {
        result.current.handleAddExercise('block1', exercise);
      });
      
      expect(window.navigator.vibrate).toHaveBeenCalledWith(8);
      expect(mockAddExerciseToBlock).toHaveBeenCalledWith('block1', exercise);
    });
  });

  describe('handleRemoveExercise', () => {
    it('should trigger haptic feedback and call removeExerciseFromBlock', () => {
      const { result } = renderHook(() => useRoutineActions());
      
      act(() => {
        result.current.handleRemoveExercise('block1', 'ex1');
      });
      
      expect(window.navigator.vibrate).toHaveBeenCalledWith([5, 10, 15]);
      expect(mockRemoveExerciseFromBlock).toHaveBeenCalledWith('block1', 'ex1');
    });
  });

  describe('handleReorderExercises', () => {
    it('should trigger haptic feedback and call reorderExercise', () => {
      const { result } = renderHook(() => useRoutineActions());
      const newOrder = [
        {
          id: 'ex1',
          name: 'Exercise 1',
          sets: 1,
          reps: 10,
          duration: 60,
          tags: [],
          thumbnailUrl: '',
          isResistance: false
        },
        {
          id: 'ex2',
          name: 'Exercise 2',
          sets: 1,
          reps: 10,
          duration: 45,
          tags: [],
          thumbnailUrl: '',
          isResistance: false
        }
      ];
      
      act(() => {
        result.current.handleReorderExercises('block1', newOrder);
      });
      
      expect(window.navigator.vibrate).toHaveBeenCalledWith([10, 20, 10]);
      expect(mockReorderExercise).toHaveBeenCalledWith('block1', newOrder);
    });
  });

  describe('error handling', () => {
    it('should set error message when an action fails', () => {
      // Setup the mock to throw an error
      mockAddExerciseToBlock.mockImplementationOnce(() => {
        throw new Error('Failed to add exercise');
      });
      
      const { result } = renderHook(() => useRoutineActions());
      const exercise = {
        id: 'ex2',
        name: 'Exercise 2',
        sets: 1,
        reps: 10,
        duration: 60,
        tags: [],
        thumbnailUrl: '',
        isResistance: false
      };
      
      act(() => {
        result.current.handleAddExercise('block1', exercise);
      });
      
      expect(result.current.errorMessage).toBe('Failed to add exercise');
      expect(result.current.isRecovering).toBe(true);
      expect(console.error).toHaveBeenCalled();
      
      // Fast-forward timers to test recovery
      act(() => {
        jest.advanceTimersByTime(3000);
      });
      
      expect(result.current.isRecovering).toBe(false);
      expect(result.current.errorMessage).toBe(null);
    });
  });
});
