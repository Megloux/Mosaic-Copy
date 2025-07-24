import { describe, it, expect, jest } from '@jest/globals';
import { saveRoutine } from '@/shared/api/routines';

// Define the return type for saveRoutine to help TypeScript
interface SaveRoutineResult {
  success: boolean;
  routine?: any;
  error?: any;
}

// Define mock types
interface MockSupabase {
  from: jest.Mock;
  auth: {
    getUser: jest.Mock;
  };
  insert: jest.Mock;
  update: jest.Mock;
  eq: jest.Mock;
  single: jest.Mock;
}

// Create mock data
const mockUser = { id: 'test-user-id' };

// Mock the supabase client
jest.mock('@/shared/api/supabase/client', () => {
  const mockAuthResponse = {
    data: { user: { id: 'test-user-id' } },
    error: null
  };

  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn().mockReturnValue(Promise.resolve(mockAuthResponse))
    },
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  };
  
  return { supabase: mockSupabase };
});

describe('Routine API', () => {
  let mockSupabase: MockSupabase;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get the mock supabase instance
    mockSupabase = require('@/shared/api/supabase/client').supabase;
  });

  it('saves a routine without exercises', async () => {
    // Setup test data
    const routineData = {
      name: 'Simple Routine',
      description: 'A simple test routine',
      type: 'workout'
    };

    // Mock successful save
    const mockResponse = {
      data: { ...routineData, user_id: mockUser.id },
      error: null
    };
    
    mockSupabase.single.mockReturnValue(Promise.resolve(mockResponse));

    // Execute
    const result = await saveRoutine(routineData) as SaveRoutineResult;

    // Verify
    expect(result).toEqual({
      success: true,
      routine: { ...routineData, user_id: mockUser.id }
    });
  });

  it('saves a routine with exercises', async () => {
    // Setup test data
    const routineData = {
      name: 'Block Routine',
      description: 'A routine with exercises',
      type: 'workout',
      exercises: [
        { id: 'ex1', duration: 30, category_id: 'cat1' },
        { id: 'ex2', duration: 60, category_id: 'cat2' }
      ]
    };

    // Mock successful save
    const mockResponse = {
      data: {
        name: 'Block Routine',
        user_id: mockUser.id,
        structure: {
          exercises: routineData.exercises,
          totalDuration: 90,
          metadata: {
            originalBlockStructure: ['ex1', 'ex2']
          }
        }
      },
      error: null
    };
    
    mockSupabase.single.mockReturnValue(Promise.resolve(mockResponse));

    // Execute
    const result = await saveRoutine(routineData) as SaveRoutineResult;

    // Verify
    expect(result.success).toBe(true);
    if (result.success && result.routine) {
      expect(result.routine.structure.exercises).toHaveLength(2);
    }
  });

  it('handles database errors', async () => {
    // Setup test data
    const routineData = {
      name: 'Error Routine',
      description: 'This will cause an error',
      type: 'workout'
    };

    // Setup DB error
    const mockError = new Error('DB error');
    const mockResponse = {
      data: null,
      error: mockError
    };
    
    mockSupabase.single.mockReturnValue(Promise.resolve(mockResponse));

    // Execute
    const result = await saveRoutine(routineData) as SaveRoutineResult;

    // Verify
    expect(result.success).toBe(false);
    if (!result.success && result.error) {
      expect(result.error instanceof Error).toBe(true);
      expect((result.error as Error).message).toBe('DB error');
    }
  });
});
