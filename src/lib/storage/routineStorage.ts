import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { v4 as uuidv4 } from 'uuid'
import { useNetworkStore } from '@/lib/network/networkService'
import type { Template } from '@/features/routines/model/types'
import { from, supabase } from '@/shared/api/supabase/client'

// Define the schema for routines database
interface RoutineDB extends DBSchema {
  routines: {
    key: string
    value: {
      id: string
      name: string
      description?: string
      exercises: RoutineExercise[]
      lastModified: number
      synced: boolean
      localOnly?: boolean
      version: number
    }
    indexes: { 'by-name': string, 'by-modified': number, 'by-sync-status': boolean }
  }
  media_cache: {
    key: string
    value: {
      id: string
      url: string
      type: 'image' | 'video'
      blob: Blob
      timestamp: number
      size: number
    }
    indexes: { 'by-type': string, 'by-timestamp': number }
  }
  sync_queue: {
    key: string
    value: {
      id: string
      operation: 'create' | 'update' | 'delete'
      entity: 'routine'
      entityId: string
      data: any
      timestamp: number
      attempts: number
      lastAttempt?: number
    }
    indexes: { 'by-timestamp': number, 'by-entity': string }
  }
}

// Define the routine exercise type
export interface RoutineExercise {
  id: string
  exerciseId: string
  order: number
  sets: number
  reps?: number
  duration?: number
  notes?: string
  weight?: number
  resistance?: 'light' | 'medium' | 'heavy'
  springSetup?: Record<string, any>
}

// Database connection
let db: IDBPDatabase<RoutineDB>

// Initialize the database
export const initRoutineDB = async (): Promise<IDBPDatabase<RoutineDB>> => {
  if (db) return db
  
  db = await openDB<RoutineDB>('mosaic-routines', 1, {
    upgrade(db) {
      // Routines store
      const routineStore = db.createObjectStore('routines', { keyPath: 'id' })
      routineStore.createIndex('by-name', 'name')
      routineStore.createIndex('by-modified', 'lastModified')
      routineStore.createIndex('by-sync-status', 'synced')
      
      // Media cache store
      const mediaStore = db.createObjectStore('media_cache', { keyPath: 'id' })
      mediaStore.createIndex('by-type', 'type')
      mediaStore.createIndex('by-timestamp', 'timestamp')
      
      // Sync queue store
      const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
      syncStore.createIndex('by-timestamp', 'timestamp')
      syncStore.createIndex('by-entity', 'entity')
    }
  })
  
  return db
}

// Get all routines
export const getAllRoutines = async () => {
  await initRoutineDB()
  return db.getAll('routines')
}

// Get a specific routine
export const getRoutine = async (id: string) => {
  await initRoutineDB()
  return db.get('routines', id)
}

// Save a routine
export const saveRoutine = async (routine: Omit<RoutineDB['routines']['value'], 'lastModified' | 'synced' | 'version'>) => {
  await initRoutineDB()
  
  const timestamp = Date.now()
  const isOnline = useNetworkStore.getState().isOnline
  
  // Prepare routine with metadata
  const routineToSave = {
    ...routine,
    lastModified: timestamp,
    synced: false,
    version: 1
  }
  
  // Save to IndexedDB
  await db.put('routines', routineToSave)
  
  // Add to sync queue if we're online
  if (isOnline) {
    await addToSyncQueue('create', 'routine', routine.id, routineToSave)
    await syncRoutines()
  } else {
    // Increment pending changes counter
    useNetworkStore.getState().incrementPendingChanges()
  }
  
  return routineToSave
}

// Update a routine
export const updateRoutine = async (id: string, updates: Partial<Omit<RoutineDB['routines']['value'], 'id' | 'lastModified' | 'synced' | 'version'>>) => {
  await initRoutineDB()
  
  // Get the current routine
  const current = await db.get('routines', id)
  if (!current) throw new Error(`Routine with id ${id} not found`)
  
  const timestamp = Date.now()
  const isOnline = useNetworkStore.getState().isOnline
  
  // Prepare updated routine
  const updatedRoutine = {
    ...current,
    ...updates,
    lastModified: timestamp,
    synced: false,
    version: current.version + 1
  }
  
  // Save to IndexedDB
  await db.put('routines', updatedRoutine)
  
  // Add to sync queue if we're online
  if (isOnline) {
    await addToSyncQueue('update', 'routine', id, updatedRoutine)
    await syncRoutines()
  } else {
    // Increment pending changes counter
    useNetworkStore.getState().incrementPendingChanges()
  }
  
  return updatedRoutine
}

// Delete a routine
export const deleteRoutine = async (id: string) => {
  await initRoutineDB()
  
  const isOnline = useNetworkStore.getState().isOnline
  
  // Delete from IndexedDB
  await db.delete('routines', id)
  
  // Add to sync queue if we're online
  if (isOnline) {
    await addToSyncQueue('delete', 'routine', id, { id })
    await syncRoutines()
  } else {
    // Increment pending changes counter
    useNetworkStore.getState().incrementPendingChanges()
  }
  
  return true
}

// Add an operation to the sync queue
export const addToSyncQueue = async (
  operation: 'create' | 'update' | 'delete',
  entity: 'routine',
  entityId: string,
  data: any
) => {
  await initRoutineDB()
  
  const syncItem = {
    id: uuidv4(),
    operation,
    entity,
    entityId,
    data,
    timestamp: Date.now(),
    attempts: 0
  }
  
  await db.add('sync_queue', syncItem)
  return syncItem
}

// Process the sync queue
export const syncRoutines = async () => {
  await initRoutineDB()
  
  const networkStore = useNetworkStore.getState()
  
  // If offline or already syncing, don't proceed
  if (!networkStore.isOnline || networkStore.isSyncing) {
    return false
  }
  
  try {
    // Set syncing state
    networkStore.setSyncing(true)
    
    // Get all items in the sync queue
    const syncItems = await db.getAllFromIndex('sync_queue', 'by-entity', 'routine')
    
    if (syncItems.length === 0) {
      networkStore.setSyncing(false)
      networkStore.setLastSyncTime(Date.now())
      return true
    }
    
    // Process each item
    for (const item of syncItems) {
      try {
        // Update attempts
        item.attempts += 1
        item.lastAttempt = Date.now()
        
        // Process based on operation type
        if (item.operation === 'create') {
          await from.templates().insert(mapRoutineToTemplate(item.data))
        } else if (item.operation === 'update') {
          await from.templates().update(mapRoutineToTemplate(item.data)).eq('id', item.entityId)
        } else if (item.operation === 'delete') {
          await from.templates().delete().eq('id', item.entityId)
        }
        
        // If successful, remove from queue
        await db.delete('sync_queue', item.id)
        
        // Update routine sync status
        if (item.operation !== 'delete') {
          const routine = await db.get('routines', item.entityId)
          if (routine) {
            routine.synced = true
            await db.put('routines', routine)
          }
        }
        
        // Decrement pending changes
        networkStore.decrementPendingChanges()
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error)
        
        // Update the sync item with the new attempt count
        await db.put('sync_queue', item)
        
        // If we've tried too many times, remove it
        if (item.attempts >= 5) {
          await db.delete('sync_queue', item.id)
          networkStore.decrementPendingChanges()
        }
      }
    }
    
    // Update sync status
    networkStore.setLastSyncTime(Date.now())
    return true
  } catch (error) {
    console.error('Sync failed:', error)
    return false
  } finally {
    networkStore.setSyncing(false)
  }
}

// Convert a routine to a template for Supabase
const mapRoutineToTemplate = (routine: RoutineDB['routines']['value']): Partial<Template> => {
  return {
    id: routine.id,
    name: routine.name,
    description: routine.description || '',
    isProOnly: false, // Default value
    structure: {
      blocks: routine.exercises.map((exercise, index) => ({
        block_id: `block-${Date.now()}-${index}`,
        name: 'Exercise Block',
        template_tags: exercise.notes?.split(',') || [],
        exercise_count: { min: 1, max: 1 },
        instructions: '',
        is_warmup: false,
        has_cardio_burst: false
      })),
      estimatedDuration: 0, // Calculate based on exercises
      difficulty: 'intermediate', // Default value
      focus: []
    },
    createdAt: new Date(routine.lastModified).toISOString(),
    updatedAt: new Date(routine.lastModified).toISOString(),
  }
}

// Convert a template from Supabase to a routine
const mapTemplateToRoutine = (template: Template): RoutineDB['routines']['value'] => {
  // Extract exercises from template structure
  const exercises: RoutineExercise[] = template.structure.blocks.flatMap((block, blockIndex) => {
    // This is a simplified mapping, actual implementation would need more logic
    return [{
      id: `re-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exerciseId: block.block_id,
      order: blockIndex,
      sets: 1,
      reps: 10,
      duration: 60,
      notes: block.template_tags.join(','),
      weight: 0,
      resistance: 'medium'
    }];
  });

  return {
    id: template.id,
    name: template.name,
    description: template.description || undefined,
    exercises: exercises,
    lastModified: new Date(template.updatedAt).getTime(),
    synced: true,
    version: 1
  }
}

// Fetch routines from server and store locally
export const fetchAndStoreRoutines = async () => {
  await initRoutineDB()
  
  try {
    const { data, error } = await from.templates().select('*')
    
    if (error) throw error
    
    if (data) {
      // Convert and store each template
      for (const template of data) {
        const routine = mapTemplateToRoutine(template)
        await db.put('routines', routine)
      }
    }
    
    return data
  } catch (error) {
    console.error('Failed to fetch routines:', error)
    throw error
  }
}

// Cache media (images/videos)
export const cacheMedia = async (url: string, type: 'image' | 'video') => {
  await initRoutineDB()
  
  try {
    // Check if already cached
    const existingCache = await db.get('media_cache', url)
    if (existingCache) return existingCache
    
    // Fetch the media
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch media: ${response.statusText}`)
    
    const blob = await response.blob()
    
    // Store in cache
    const cacheEntry = {
      id: url,
      url,
      type,
      blob,
      timestamp: Date.now(),
      size: blob.size
    }
    
    await db.put('media_cache', cacheEntry)
    return cacheEntry
  } catch (error) {
    console.error(`Failed to cache media ${url}:`, error)
    throw error
  }
}

// Get cached media
export const getCachedMedia = async (url: string) => {
  await initRoutineDB()
  return db.get('media_cache', url)
}

// Pre-download all media for a routine
export const preDownloadRoutineMedia = async (routineId: string) => {
  await initRoutineDB()
  
  try {
    const routine = await getRoutine(routineId)
    if (!routine) throw new Error(`Routine ${routineId} not found`)
    
    // Get all exercise IDs in the routine
    const exerciseIds = routine.exercises.map(ex => ex.exerciseId)
    
    // Fetch exercise details
    const { data: exercises } = await from.exercises()
      .select('*')
      .in('id', exerciseIds)
    
    if (!exercises) return []
    
    // Cache all media
    const cachePromises = exercises.flatMap(exercise => {
      const promises = []
      
      if (exercise.thumbnail_url) {
        promises.push(cacheMedia(exercise.thumbnail_url, 'image'))
      }
      
      if (exercise.video_url) {
        promises.push(cacheMedia(exercise.video_url, 'video'))
      }
      
      return promises
    })
    
    await Promise.all(cachePromises)
    
    // Mark routine as having cached media
    await updateRoutine(routineId, { localOnly: true })
    
    return exercises
  } catch (error) {
    console.error(`Failed to pre-download media for routine ${routineId}:`, error)
    throw error
  }
}

// Clean up old cached media
export const cleanupMediaCache = async (maxAgeDays = 7, maxSizeMB = 100) => {
  await initRoutineDB()
  
  try {
    // Get all cached media
    const allMedia = await db.getAll('media_cache')
    
    // Calculate total size
    const totalSizeBytes = allMedia.reduce((sum, item) => sum + item.size, 0)
    const totalSizeMB = totalSizeBytes / (1024 * 1024)
    
    // If under size limit, only delete old items
    if (totalSizeMB < maxSizeMB) {
      const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000)
      const oldMedia = allMedia.filter(item => item.timestamp < cutoffTime)
      
      for (const item of oldMedia) {
        await db.delete('media_cache', item.id)
      }
      
      return oldMedia.length
    }
    
    // If over size limit, sort by age and delete until under limit
    allMedia.sort((a, b) => a.timestamp - b.timestamp)
    
    let currentSize = totalSizeBytes
    let deletedCount = 0
    
    for (const item of allMedia) {
      if (currentSize / (1024 * 1024) <= maxSizeMB) break
      
      await db.delete('media_cache', item.id)
      currentSize -= item.size
      deletedCount++
    }
    
    return deletedCount
  } catch (error) {
    console.error('Failed to clean up media cache:', error)
    throw error
  }
}

// Initialize the database on module load
if (typeof window !== 'undefined') {
  initRoutineDB().catch(console.error)
}

// Set up sync on network reconnection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncRoutines().catch(console.error)
  })
}
