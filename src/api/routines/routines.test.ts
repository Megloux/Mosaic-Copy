import { describe, it, expect, vi } from 'vitest';
import { saveRoutine } from '@/api/routines/routines';
import { supabase } from '@/api/supabase';

// Mock Supabase
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}));

describe('saveRoutine', () => {
  // Test data
  const mockUser = { id: 'user123' };
  const mockExercise = {
    id: 'e1',
    duration: 120,
    category_id: 'c1'
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup default auth response
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
  });

  it('saves a flat routine structure correctly', async () => {
    // Setup
    const flatRoutine = {
      name: 'My Routine',
      structure: {
        exercises: [mockExercise],
        totalDuration: 120
      }
    };

    // Mock successful save
    (supabase.from as any).mockImplementation(() => ({
      upsert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { ...flatRoutine, user_id: mockUser.id },
        error: null
      })
    }));

    // Execute
    const result = await saveRoutine(flatRoutine);

    // Verify
    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      name: 'My Routine',
      user_id: mockUser.id,
      structure: {
        exercises: [mockExercise],
        totalDuration: 120
      }
    });
  });

  it('flattens and saves a block-based routine correctly', async () => {
    // Setup
    const blockRoutine = {
      name: 'Block Routine',
      structure: {
        blocks: [
          {
            id: 'b1',
            exercises: [mockExercise]
          }
        ]
      }
    };

    // Mock successful save
    (supabase.from as any).mockImplementation(() => ({
      upsert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          name: 'Block Routine',
          user_id: mockUser.id,
          structure: {
            exercises: [mockExercise],
            totalDuration: 120,
            metadata: {
              originalBlockStructure: ['b1']
            }
          }
        },
        error: null
      })
    }));

    // Execute
    const result = await saveRoutine(blockRoutine);

    // Verify
    expect(result.error).toBeNull();
    expect(result.data).toMatchObject({
      name: 'Block Routine',
      user_id: mockUser.id,
      structure: {
        exercises: [mockExercise],
        totalDuration: 120,
        metadata: {
          originalBlockStructure: ['b1']
        }
      }
    });
  });

  it('handles authentication errors', async () => {
    // Setup auth error
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: null },
      error: new Error('Auth error')
    });

    // Execute
    const result = await saveRoutine({
      name: 'Test',
      structure: { exercises: [], totalDuration: 0 }
    });

    // Verify
    expect(result.error).toBeTruthy();
    expect(result.data).toBeNull();
  });

  it('handles database errors', async () => {
    // Setup DB error
    (supabase.from as any).mockImplementation(() => ({
      upsert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: null,
        error: new Error('DB error')
      })
    }));

    // Execute
    const result = await saveRoutine({
      name: 'Test',
      structure: { exercises: [], totalDuration: 0 }
    });

    // Verify
    expect(result.error).toBeTruthy();
    expect(result.data).toBeNull();
  });
});
