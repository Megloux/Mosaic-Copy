import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Template } from '@/features/routines/model/types'
import type { Exercise } from '@/features/exercises/model/types'
import type { Category, Block } from '@/shared/api/supabase/types'

interface MosaicDB extends DBSchema {
  offline_queue: {
    key: string
    value: {
      id: string
      table: 'categories' | 'exercises' | 'blocks' | 'templates'
      action: 'create' | 'update' | 'delete'
      data: any
      timestamp: number
    }
  }
  categories: {
    key: string
    value: Category
    indexes: { 'by-name': string }
  }
  exercises: {
    key: string
    value: Exercise
    indexes: { 'by-category': string, 'by-name': string }
  }
  blocks: {
    key: string
    value: Block
    indexes: { 'by-name': string }
  }
  templates: {
    key: string
    value: Template
    indexes: { 'by-name': string }
  }
}

let db: IDBPDatabase<MosaicDB>

export const initDB = async () => {
  db = await openDB<MosaicDB>('mosaic', 1, {
    upgrade(db) {
      // Offline queue store
      const queueStore = db.createObjectStore('offline_queue', { keyPath: 'id' })
      queueStore.createIndex('timestamp', 'timestamp')

      // Data stores
      const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' })
      categoriesStore.createIndex('by-name', 'name')

      const exercisesStore = db.createObjectStore('exercises', { keyPath: 'id' })
      exercisesStore.createIndex('by-category', 'category_id')
      exercisesStore.createIndex('by-name', 'name')

      const blocksStore = db.createObjectStore('blocks', { keyPath: 'id' })
      blocksStore.createIndex('by-name', 'name')

      const templatesStore = db.createObjectStore('templates', { keyPath: 'id' })
      templatesStore.createIndex('by-name', 'name')
    }
  })
}

// Queue operations
export const addToQueue = async (
  table: 'categories' | 'exercises' | 'blocks' | 'templates',
  action: 'create' | 'update' | 'delete',
  data: any
) => {
  await db.add('offline_queue', {
    id: crypto.randomUUID(),
    table,
    action,
    data,
    timestamp: Date.now()
  })
}

export const processQueue = async () => {
  const tx = db.transaction('offline_queue', 'readwrite')
  const queue = await tx.store.getAll()

  for (const item of queue) {
    try {
      // Process each queued item
      // This will be implemented in the sync service
      await tx.store.delete(item.id)
    } catch (error) {
      console.error('Failed to process queue item:', error)
    }
  }
}

// CRUD operations
export const saveToStore = async <T extends keyof MosaicDB>(
  store: T,
  data: MosaicDB[T]['value']
) => {
  return db.put(store, data)
}

export const getFromStore = async <T extends keyof MosaicDB>(
  store: T,
  id: string
): Promise<MosaicDB[T]['value'] | undefined> => {
  return db.get(store, id)
}

export const getAllFromStore = async <T extends keyof MosaicDB>(
  store: T
): Promise<MosaicDB[T]['value'][]> => {
  return db.getAll(store)
}

export const deleteFromStore = async <T extends keyof MosaicDB>(
  store: T,
  id: string
) => {
  return db.delete(store, id)
}

// Specialized queries
export const getExercisesByCategoryOffline = async (categoryId: string): Promise<Exercise[]> => {
  const tx = db.transaction('exercises', 'readonly')
  const index = tx.store.index('by-category')
  return index.getAll(categoryId)
}

// Initialize DB on module load
initDB().catch(console.error)
