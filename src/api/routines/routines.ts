import { supabase } from '@/api/supabase';

// Types for our JSONB structure
interface Exercise {
  id: string;
  duration: number;
  category_id: string;
  equipment_position?: string;
  light_springs?: number;
  heavy_springs?: number;
}

interface Block {
  id: string;
  exercises: Exercise[];
}

interface RoutineStructure {
  exercises: Exercise[];
  totalDuration: number;
  metadata?: Record<string, unknown>;
}

interface BlockBasedRoutine {
  blocks: Block[];
  totalDuration?: number;
}

// Type for our routine data - matches database schema
export interface Routine {
  id?: string;
  user_id?: string;  // Optional in interface since it's added by saveRoutine
  template_id?: string;
  name: string;
  description?: string;
  structure: RoutineStructure | BlockBasedRoutine;
  is_public?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Flattens a block-based routine structure into a linear list of exercises
 */
function flattenRoutineStructure(routine: Routine): RoutineStructure {
  // If already flattened, just return
  if ('exercises' in routine.structure) {
    return routine.structure as RoutineStructure;
  }

  // Extract exercises from blocks
  const blockBased = routine.structure as BlockBasedRoutine;
  const exercises = blockBased.blocks.flatMap(block => block.exercises);
  
  // Calculate total duration
  const totalDuration = exercises.reduce((total, ex) => total + (ex.duration || 0), 0);

  return {
    exercises,
    totalDuration,
    metadata: { originalBlockStructure: blockBased.blocks.map(b => b.id) }
  };
}

/**
 * Save a routine to Supabase
 * 
 * @param routine The routine to save
 * @returns Promise with saved routine or error
 */
export async function saveRoutine(routine: Routine): Promise<{ data: Routine | null; error: Error | null }> {
  try {
    // Get current user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!user) throw new Error('No authenticated user');

    // Flatten structure if needed and format routine data for save
    const routineData = {
      ...routine,
      structure: flattenRoutineStructure(routine),
      user_id: user.id,
      is_public: routine.is_public ?? false,  // Default to private
      updated_at: new Date().toISOString(),
    };

    // Save to Supabase
    const { data, error } = await supabase
      .from('routines')
      .upsert(routineData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };

  } catch (error) {
    console.error('Error saving routine:', error);
    return { data: null, error: error as Error };
  }
}
