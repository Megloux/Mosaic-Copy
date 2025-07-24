import { supabase } from '@/api/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export type RelationshipType = 'owner' | 'shared' | 'favorited';

export interface RoutineRelationship {
  id: string;
  user_id: string;
  routine_id: string;
  relationship_type: RelationshipType;
  shared_by?: string;
  created_at: string;
  updated_at: string;
}

interface RelationshipResult<T> {
  data: T | null;
  error: PostgrestError | null;
}

/**
 * Creates an owner relationship between a user and their routine
 */
export async function create_owner_relationship(
  user_id: string,
  routine_id: string
): Promise<RelationshipResult<RoutineRelationship>> {
  return await supabase
    .from('routine_relationships')
    .insert({
      user_id,
      routine_id,
      relationship_type: 'owner'
    })
    .select()
    .single();
}

/**
 * Shares a routine with another user
 */
export async function share_routine_with_user(
  routine_id: string,
  target_user_id: string,
  shared_by_user_id: string
): Promise<RelationshipResult<RoutineRelationship>> {
  return await supabase
    .from('routine_relationships')
    .insert({
      user_id: target_user_id,
      routine_id,
      relationship_type: 'shared',
      shared_by: shared_by_user_id
    })
    .select()
    .single();
}

/**
 * Toggles favorite status for a routine
 */
export async function toggle_favorite_routine(
  user_id: string,
  routine_id: string
): Promise<RelationshipResult<RoutineRelationship | null>> {
  // Check if relationship exists
  const { data: existing } = await supabase
    .from('routine_relationships')
    .select()
    .eq('user_id', user_id)
    .eq('routine_id', routine_id)
    .eq('relationship_type', 'favorited')
    .single();

  if (existing) {
    // Remove favorite
    return await supabase
      .from('routine_relationships')
      .delete()
      .eq('id', existing.id)
      .select()
      .single();
  } else {
    // Add favorite
    return await supabase
      .from('routine_relationships')
      .insert({
        user_id,
        routine_id,
        relationship_type: 'favorited'
      })
      .select()
      .single();
  }
}

/**
 * Removes a routine from user's library
 */
export async function remove_routine_from_library(
  user_id: string,
  routine_id: string
): Promise<RelationshipResult<RoutineRelationship>> {
  return await supabase
    .from('routine_relationships')
    .delete()
    .eq('user_id', user_id)
    .eq('routine_id', routine_id)
    .select()
    .single();
}

/**
 * Gets all routines for a user based on relationship type
 */
export async function get_user_routines(
  user_id: string,
  relationship_type?: RelationshipType
): Promise<RelationshipResult<RoutineRelationship[]>> {
  let query = supabase
    .from('routine_relationships')
    .select()
    .eq('user_id', user_id);

  if (relationship_type) {
    query = query.eq('relationship_type', relationship_type);
  }

  return await query;
}

/**
 * Gets all public routines
 */
export async function get_public_routines(): Promise<RelationshipResult<RoutineRelationship[]>> {
  return await supabase
    .from('routine_relationships')
    .select(`
      *,
      routines!inner(*)
    `)
    .eq('routines.is_public', true);
}

/**
 * Checks if a relationship exists between a user and routine
 */
export async function check_routine_relationship(
  user_id: string,
  routine_id: string,
  relationship_type: RelationshipType
): Promise<RelationshipResult<RoutineRelationship | null>> {
  return await supabase
    .from('routine_relationships')
    .select()
    .eq('user_id', user_id)
    .eq('routine_id', routine_id)
    .eq('relationship_type', relationship_type)
    .single();
}
