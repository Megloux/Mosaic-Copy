import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  createRecord, getRecord, updateRecord, deleteRecord,
  getExercisesByCategory, getTemplateWithBlocks
} from '@/shared/api/supabase/api'
import type {
  Category, CategoryInsert, CategoryUpdate,
  Exercise, ExerciseInsert, ExerciseUpdate,
  Block, BlockInsert, BlockUpdate,
  Template, TemplateInsert, TemplateUpdate,
} from '@/shared/api/supabase/types'

// Generic CRUD hooks
export const useRecord = <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  id: string
) => {
  return useQuery({
    queryKey: [table, id],
    queryFn: () => getRecord(table, id),
  })
}

export const useCreateRecord = <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  options?: {
    onSuccess?: (data: any) => void
    onError?: (error: Error) => void
  }
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: T extends 'categories' ? CategoryInsert
      : T extends 'exercises' ? ExerciseInsert
      : T extends 'blocks' ? BlockInsert
      : TemplateInsert) => createRecord(table, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export const useUpdateRecord = <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  id: string,
  options?: {
    onSuccess?: (data: any) => void
    onError?: (error: Error) => void
  }
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: T extends 'categories' ? CategoryUpdate
      : T extends 'exercises' ? ExerciseUpdate
      : T extends 'blocks' ? BlockUpdate
      : TemplateUpdate) => updateRecord(table, id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table, id] })
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

export const useDeleteRecord = <T extends 'categories' | 'exercises' | 'blocks' | 'templates'>(
  table: T,
  id: string,
  options?: {
    onSuccess?: () => void
    onError?: (error: Error) => void
  }
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: () => deleteRecord(table, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] })
      options?.onSuccess?.()
    },
    onError: options?.onError,
  })
}

// Exercise-specific hooks
export const useExercisesByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['exercises', 'category', categoryId],
    queryFn: () => getExercisesByCategory(categoryId),
  })
}

// Template-specific hooks
export const useTemplateWithBlocks = (templateId: string) => {
  return useQuery({
    queryKey: ['templates', templateId, 'with-blocks'],
    queryFn: () => getTemplateWithBlocks(templateId),
  })
}
