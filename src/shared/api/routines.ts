import { supabase } from './supabase/client';

/**
 * Toggle favorite status for a routine
 * @param routine_id ID of the routine to toggle favorite status
 * @param user_id ID of the user (optional, will use current user if not provided)
 * @returns Object with success status and message
 */
export async function toggle_favorite_routine(routine_id: string, user_id?: string) {
  try {
    // Get current user if not provided
    if (!user_id) {
      const { data: userData } = await supabase.auth.getUser();
      user_id = userData.user?.id;
      
      if (!user_id) {
        return { success: false, message: 'User not authenticated' };
      }
    }
    
    // Check if relationship exists
    const { data: existingRelation } = await supabase
      .from('routine_user_relations')
      .select('*')
      .eq('routine_id', routine_id)
      .eq('user_id', user_id)
      .eq('relation_type', 'favorite')
      .single();
    
    // If relationship exists, delete it (unfavorite)
    if (existingRelation) {
      const { error } = await supabase
        .from('routine_user_relations')
        .delete()
        .eq('id', existingRelation.id);
      
      if (error) throw error;
      return { success: true, message: 'Routine unfavorited', favorited: false };
    }
    
    // Otherwise create new relationship (favorite)
    const { error } = await supabase
      .from('routine_user_relations')
      .insert({
        routine_id,
        user_id,
        relation_type: 'favorite',
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    return { success: true, message: 'Routine favorited', favorited: true };
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, message: 'Failed to update favorite status', error };
  }
}

/**
 * Check if a routine is favorited by the user
 * @param routine_id ID of the routine to check
 * @param user_id ID of the user (optional, will use current user if not provided)
 * @returns Object with favorited status
 */
export async function check_routine_relationship(routine_id: string, user_id?: string) {
  try {
    // Get current user if not provided
    if (!user_id) {
      const { data: userData } = await supabase.auth.getUser();
      user_id = userData.user?.id;
      
      if (!user_id) {
        return { success: false, message: 'User not authenticated' };
      }
    }
    
    // Check if relationship exists
    const { data, error } = await supabase
      .from('routine_user_relations')
      .select('*')
      .eq('routine_id', routine_id)
      .eq('user_id', user_id)
      .eq('relation_type', 'favorite')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return { 
      success: true, 
      favorited: !!data,
      data
    };
  } catch (error) {
    console.error('Error checking routine relationship:', error);
    return { success: false, message: 'Failed to check relationship status', error };
  }
}

/**
 * Share a routine with another user
 * @param routine_id ID of the routine to share
 * @param target_user_id ID of the user to share with
 * @returns Object with success status and message
 */
export async function share_routine_with_user(routine_id: string, target_user_id: string) {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const current_user_id = userData.user?.id;
    
    if (!current_user_id) {
      return { success: false, message: 'User not authenticated' };
    }
    
    // Check if the relationship already exists
    const { data: existingRelation } = await supabase
      .from('routine_user_relations')
      .select('*')
      .eq('routine_id', routine_id)
      .eq('user_id', target_user_id)
      .eq('relation_type', 'shared')
      .eq('shared_by', current_user_id)
      .single();
    
    if (existingRelation) {
      return { success: true, message: 'Routine already shared with this user' };
    }
    
    // Create the sharing relationship
    const { error } = await supabase
      .from('routine_user_relations')
      .insert({
        routine_id,
        user_id: target_user_id,
        relation_type: 'shared',
        shared_by: current_user_id,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return { success: true, message: 'Routine shared successfully' };
  } catch (error) {
    console.error('Error sharing routine:', error);
    return { success: false, message: 'Failed to share routine', error };
  }
}

/**
 * Remove a routine from the user's library
 * @param routine_id ID of the routine to remove
 * @returns Object with success status and message
 */
export async function remove_routine_from_library(routine_id: string) {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData.user?.id;
    
    if (!user_id) {
      return { success: false, message: 'User not authenticated' };
    }
    
    // Delete all relationships for this routine and user
    const { error } = await supabase
      .from('routine_user_relations')
      .delete()
      .eq('routine_id', routine_id)
      .eq('user_id', user_id);
    
    if (error) throw error;
    
    return { success: true, message: 'Routine removed successfully' };
  } catch (error) {
    console.error('Error removing routine:', error);
    return { success: false, message: 'Failed to remove routine', error };
  }
}

/**
 * Save a routine to the database
 * @param routine Routine data to save
 * @returns Object with success status and routine data or error
 */
export async function saveRoutine(routine: any) {
  try {
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;
    
    if (userError || !user_id) {
      return { success: false, error: userError || new Error('User not authenticated') };
    }

    // Prepare routine data
    const routineData = {
      ...routine,
      user_id,
      updated_at: new Date().toISOString(),
    };

    // Add created_at for new routines
    if (!routine.id) {
      routineData.created_at = new Date().toISOString();
    }

    let result;
    if (routine.id) {
      // Update existing routine
      result = await supabase
        .from('routines')
        .update(routineData)
        .eq('id', routine.id)
        .single();
    } else {
      // Create new routine
      result = await supabase
        .from('routines')
        .insert(routineData)
        .single();
    }

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, routine: result.data };
  } catch (error) {
    console.error('Error saving routine:', error);
    return { success: false, error };
  }
}
