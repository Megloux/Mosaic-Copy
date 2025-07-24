/**
 * Shared API Public API
 */

// Supabase
export { supabase } from './supabase/client';
export { 
  useRecord, 
  useCreateRecord, 
  useUpdateRecord, 
  useDeleteRecord,
  useExercisesByCategory,
  useTemplateWithBlocks
} from './supabase/hooks';
export * from './supabase/api';
export type * from './supabase/types';
