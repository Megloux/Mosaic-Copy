import { supabase } from '@/api/supabase';
import { Variation, VariationCategory } from '@/types/variations';

/**
 * Fetch all variations from Supabase
 * @returns Promise with variations data and categories
 */
export async function getAllVariations() {
  const { data: variations, error: variationsError } = await supabase
    .from('variations')
    .select('*');

  const { data: categories, error: categoriesError } = await supabase
    .from('variation_categories')
    .select('*');

  if (variationsError) {
    console.error('Error fetching variations:', variationsError);
    return { variations: [], categories: [], error: variationsError };
  }

  if (categoriesError) {
    console.error('Error fetching variation categories:', categoriesError);
    return { variations: variations || [], categories: [], error: categoriesError };
  }

  return { 
    variations: variations || [], 
    categories: categories || [],
    error: null 
  };
}

/**
 * Fetch a specific variation by ID
 * @param id Variation ID
 * @returns Promise with variation data
 */
export async function getVariationById(id: string) {
  const { data, error } = await supabase
    .from('variations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching variation with ID ${id}:`, error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Fetch all variation categories
 * @returns Promise with categories data
 */
export async function getAllCategories() {
  const { data, error } = await supabase
    .from('variation_categories')
    .select('*');

  if (error) {
    console.error('Error fetching variation categories:', error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}

/**
 * Fetch variations by category ID
 * @param categoryId Category ID
 * @returns Promise with variations data
 */
export async function getVariationsByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('variations')
    .select('*')
    .eq('category_id', categoryId);

  if (error) {
    console.error(`Error fetching variations for category ${categoryId}:`, error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}

/**
 * Search variations by tags
 * @param tags Array of tags to match
 * @returns Promise with matching variations
 */
export async function getVariationsByTags(tags: string[]) {
  // Supabase doesn't have a direct way to query arrays with overlap
  // So we need to use the containedBy operator to find variations where
  // the template_tags array contains ANY of the provided tags
  const { data, error } = await supabase
    .from('variations')
    .select('*')
    .overlaps('template_tags', tags);

  if (error) {
    console.error('Error fetching variations by tags:', error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}

/**
 * Search variations with filters
 * @param filters Object containing search parameters
 * @returns Promise with filtered variations
 */
export async function searchVariations({ 
  categoryIds, 
  tags, 
  search 
}: { 
  categoryIds?: string[]; 
  tags?: string[]; 
  search?: string;
}) {
  let query = supabase.from('variations').select('*');

  // Apply category filter if provided
  if (categoryIds && categoryIds.length > 0) {
    query = query.in('category_id', categoryIds);
  }

  // Apply tag filter if provided
  if (tags && tags.length > 0) {
    query = query.overlaps('template_tags', tags);
  }

  // Apply text search if provided
  if (search) {
    query = query.or(`variation_name.ilike.%${search}%,setup_instructions.ilike.%${search}%,movement_notes.ilike.%${search}%,cueing.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching variations:', error);
    return { data: [], error };
  }

  return { data: data || [], error: null };
}

/**
 * Save a variation to Supabase
 * @param variation The variation to save
 * @returns Promise with saved variation or error
 */
export async function saveVariation(variation: Variation) {
  // If the variation has an ID, update it; otherwise insert a new one
  const { data, error } = variation.id
    ? await supabase
        .from('variations')
        .update(variation)
        .eq('id', variation.id)
        .select()
        .single()
    : await supabase
        .from('variations')
        .insert(variation)
        .select()
        .single();

  if (error) {
    console.error('Error saving variation:', error);
    return { data: null, error };
  }

  return { data, error: null };
}

/**
 * Delete a variation from Supabase
 * @param id Variation ID to delete
 * @returns Promise with success status or error
 */
export async function deleteVariation(id: string) {
  const { error } = await supabase
    .from('variations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting variation with ID ${id}:`, error);
    return { success: false, error };
  }

  return { success: true, error: null };
}
