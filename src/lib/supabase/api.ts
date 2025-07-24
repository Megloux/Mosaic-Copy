import { from, isOffline, supabase } from '@/shared/api/supabase/client'
import type { 
  Category, CategoryInsert, CategoryUpdate,
  Exercise, ExerciseInsert, ExerciseUpdate,
  Block, BlockInsert, BlockUpdate,
  Template, TemplateInsert, TemplateUpdate,
} from './types'

// Error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic CRUD operations with offline support
export const createRecord = async <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  data: T extends 'categories' ? CategoryInsert
    : T extends 'exercises' ? ExerciseInsert
    : T extends 'blocks' ? BlockInsert
    : TemplateInsert
): Promise<T extends 'categories' ? Category
  : T extends 'exercises' ? Exercise
  : T extends 'blocks' ? Block
  : Template> => {
  if (isOffline()) {
    // Store in IndexedDB for offline support
    // Will be synced when back online
    const offlineData = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    // TODO: Add to offline queue
    return offlineData as any
  }

  const { data: result, error } = await from[table]().insert(data).select().single()
  
  if (error) {
    throw new ApiError(error.message, error.code === '23505' ? 409 : 500, error)
  }

  return result as any
}

export const getRecord = async <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  id: string
): Promise<T extends 'categories' ? Category
  : T extends 'exercises' ? Exercise
  : T extends 'blocks' ? Block
  : Template> => {
  if (isOffline()) {
    // Check IndexedDB first
    // TODO: Implement offline storage lookup
    throw new ApiError('Cannot fetch record while offline', 503)
  }

  const { data: result, error } = await from[table]()
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new ApiError(error.message, error.code === 'PGRST116' ? 404 : 500, error)
  }

  return result as any
}

export const updateRecord = async <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  id: string,
  data: T extends 'categories' ? CategoryUpdate
    : T extends 'exercises' ? ExerciseUpdate
    : T extends 'blocks' ? BlockUpdate
    : TemplateUpdate
): Promise<T extends 'categories' ? Category
  : T extends 'exercises' ? Exercise
  : T extends 'blocks' ? Block
  : Template> => {
  if (isOffline()) {
    // Queue update for when back online
    // TODO: Add to offline queue
    throw new ApiError('Cannot update record while offline', 503)
  }

  const { data: result, error } = await from[table]()
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new ApiError(error.message, 500, error)
  }

  return result as any
}

export const deleteRecord = async <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  id: string
): Promise<void> => {
  if (isOffline()) {
    // Queue deletion for when back online
    // TODO: Add to offline queue
    throw new ApiError('Cannot delete record while offline', 503)
  }

  const { error } = await from[table]()
    .delete()
    .eq('id', id)

  if (error) {
    throw new ApiError(error.message, 500, error)
  }
}

// Exercise-specific queries
export const getExercisesByCategory = async (categoryId: string): Promise<Exercise[]> => {
  if (isOffline()) {
    // Check IndexedDB first
    // TODO: Implement offline storage lookup
    throw new ApiError('Cannot fetch exercises while offline', 503)
  }

  const { data: exercises, error } = await from.exercises()
    .select('*')
    .eq('category_id', categoryId)
    .order('name')

  if (error) {
    throw new ApiError(error.message, 500, error)
  }

  return exercises
}

// Template-specific queries
export const getTemplateWithBlocks = async (templateId: string): Promise<Template & { blockDetails: Block[] }> => {
  if (isOffline()) {
    // Check IndexedDB first
    // TODO: Implement offline storage lookup
    throw new ApiError('Cannot fetch template while offline', 503)
  }

  const { data: template, error: templateError } = await from.templates()
    .select('*')
    .eq('id', templateId)
    .single()

  if (templateError) {
    throw new ApiError(templateError.message, templateError.code === 'PGRST116' ? 404 : 500, templateError)
  }

  // Fetch all blocks referenced in the template
  const blockIds = (template.blocks as any[]).map((block: any) => block.id)
  const { data: blocks, error: blocksError } = await from.blocks()
    .select('*')
    .in('id', blockIds)

  if (blocksError) {
    throw new ApiError(blocksError.message, 500, blocksError)
  }

  return {
    ...template,
    blockDetails: blocks || []
  }
}
