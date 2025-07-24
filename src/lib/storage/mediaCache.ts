import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { useNetworkStore } from '@/lib/network/networkService'

interface MediaCacheDB extends DBSchema {
  media_items: {
    key: string
    value: {
      id: string
      url: string
      type: 'image' | 'video'
      blob: Blob
      timestamp: number
      size: number
      exerciseId?: string
      lastAccessed: number
      priority: 'high' | 'medium' | 'low'
    }
    indexes: { 
      'by-type': string, 
      'by-timestamp': number,
      'by-exercise': string,
      'by-accessed': number,
      'by-priority': string
    }
  }
}

// Database connection
let db: IDBPDatabase<MediaCacheDB>

// Initialize the database
export const initMediaCache = async (): Promise<IDBPDatabase<MediaCacheDB>> => {
  if (db) return db
  
  db = await openDB<MediaCacheDB>('mosaic-media-cache', 1, {
    upgrade(db) {
      // Media cache store
      const mediaStore = db.createObjectStore('media_items', { keyPath: 'id' })
      mediaStore.createIndex('by-type', 'type')
      mediaStore.createIndex('by-timestamp', 'timestamp')
      mediaStore.createIndex('by-exercise', 'exerciseId')
      mediaStore.createIndex('by-accessed', 'lastAccessed')
      mediaStore.createIndex('by-priority', 'priority')
    }
  })
  
  return db
}

// Cache a media item
export const cacheMedia = async (
  url: string, 
  type: 'image' | 'video', 
  options?: { 
    exerciseId?: string,
    priority?: 'high' | 'medium' | 'low'
  }
) => {
  await initMediaCache()
  
  try {
    // Check if already cached
    const existingCache = await db.get('media_items', url)
    if (existingCache) {
      // Update last accessed time
      existingCache.lastAccessed = Date.now()
      await db.put('media_items', existingCache)
      return existingCache
    }
    
    // If offline, don't try to fetch
    if (!useNetworkStore.getState().isOnline) {
      throw new Error('Cannot cache media while offline')
    }
    
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
      lastAccessed: Date.now(),
      size: blob.size,
      exerciseId: options?.exerciseId,
      priority: options?.priority || 'medium'
    }
    
    await db.put('media_items', cacheEntry)
    return cacheEntry
  } catch (error) {
    console.error(`Failed to cache media ${url}:`, error)
    throw error
  }
}

// Get a cached media item
export const getCachedMedia = async (url: string) => {
  await initMediaCache()
  
  try {
    const cachedItem = await db.get('media_items', url)
    
    if (cachedItem) {
      // Update last accessed time
      cachedItem.lastAccessed = Date.now()
      await db.put('media_items', cachedItem)
    }
    
    return cachedItem
  } catch (error) {
    console.error(`Failed to get cached media ${url}:`, error)
    return null
  }
}

// Get or fetch media - tries cache first, then fetches if not available
export const getOrFetchMedia = async (
  url: string, 
  type: 'image' | 'video',
  options?: { 
    exerciseId?: string,
    priority?: 'high' | 'medium' | 'low'
  }
) => {
  try {
    // Try to get from cache first
    const cachedItem = await getCachedMedia(url)
    if (cachedItem) return URL.createObjectURL(cachedItem.blob)
    
    // If offline, return null - can't fetch
    if (!useNetworkStore.getState().isOnline) {
      return null
    }
    
    // Not in cache and online, so fetch and cache
    const cacheEntry = await cacheMedia(url, type, options)
    return URL.createObjectURL(cacheEntry.blob)
  } catch (error) {
    console.error(`Failed to get or fetch media ${url}:`, error)
    return null
  }
}

// Pre-cache media for specific exercises
export const preCacheExerciseMedia = async (exerciseIds: string[], exercises: any[]) => {
  if (!useNetworkStore.getState().isOnline) {
    throw new Error('Cannot pre-cache media while offline')
  }
  
  const exercisesMap = exercises.reduce((map, exercise) => {
    map[exercise.id] = exercise
    return map
  }, {} as Record<string, any>)
  
  const cachePromises = exerciseIds.flatMap(id => {
    const exercise = exercisesMap[id]
    if (!exercise) return []
    
    const promises = []
    
    if (exercise.thumbnail_url) {
      promises.push(
        cacheMedia(exercise.thumbnail_url, 'image', { 
          exerciseId: id,
          priority: 'high'
        })
      )
    }
    
    if (exercise.video_url) {
      promises.push(
        cacheMedia(exercise.video_url, 'video', { 
          exerciseId: id,
          priority: 'medium'
        })
      )
    }
    
    return promises
  })
  
  return Promise.all(cachePromises)
}

// Get cache statistics
export const getMediaCacheStats = async () => {
  await initMediaCache()
  
  try {
    const allMedia = await db.getAll('media_items')
    
    const totalSize = allMedia.reduce((sum, item) => sum + item.size, 0)
    const imageCount = allMedia.filter(item => item.type === 'image').length
    const videoCount = allMedia.filter(item => item.type === 'video').length
    
    return {
      totalItems: allMedia.length,
      totalSizeBytes: totalSize,
      totalSizeMB: totalSize / (1024 * 1024),
      imageCount,
      videoCount,
      oldestItem: allMedia.length > 0 ? 
        Math.min(...allMedia.map(item => item.timestamp)) : 
        null,
      newestItem: allMedia.length > 0 ? 
        Math.max(...allMedia.map(item => item.timestamp)) : 
        null
    }
  } catch (error) {
    console.error('Failed to get media cache stats:', error)
    throw error
  }
}

// Clean up cache based on various strategies
export const cleanupMediaCache = async (options: {
  maxSizeMB?: number,
  maxAgeDays?: number,
  preserveHighPriority?: boolean,
  preserveRecentlyAccessed?: boolean
} = {}) => {
  await initMediaCache()
  
  const {
    maxSizeMB = 100,
    maxAgeDays = 7,
    preserveHighPriority = true,
    preserveRecentlyAccessed = true
  } = options
  
  try {
    // Get all cached media
    const allMedia = await db.getAll('media_items')
    
    // Calculate current size
    const totalSizeBytes = allMedia.reduce((sum, item) => sum + item.size, 0)
    const totalSizeMB = totalSizeBytes / (1024 * 1024)
    
    // Items to delete
    const toDelete = []
    
    // First, mark old items for deletion
    const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000)
    for (const item of allMedia) {
      // Skip high priority items if preserveHighPriority is true
      if (preserveHighPriority && item.priority === 'high') continue
      
      // Skip recently accessed items if preserveRecentlyAccessed is true
      const recentAccessCutoff = Date.now() - (2 * 24 * 60 * 60 * 1000) // 2 days
      if (preserveRecentlyAccessed && item.lastAccessed > recentAccessCutoff) continue
      
      if (item.timestamp < cutoffTime) {
        toDelete.push(item)
      }
    }
    
    // If we're still over size limit, sort remaining by priority and last accessed
    if ((totalSizeBytes - toDelete.reduce((sum, item) => sum + item.size, 0)) / (1024 * 1024) > maxSizeMB) {
      // Filter out items already marked for deletion
      const remainingItems = allMedia.filter(item => !toDelete.some(d => d.id === item.id))
      
      // Sort by priority (low first) and then by last accessed (oldest first)
      remainingItems.sort((a, b) => {
        // Priority comparison
        const priorityOrder = { low: 0, medium: 1, high: 2 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        
        if (priorityDiff !== 0) return priorityDiff
        
        // If same priority, sort by last accessed
        return a.lastAccessed - b.lastAccessed
      })
      
      // Add items until we're under the size limit
      let currentSize = totalSizeBytes - toDelete.reduce((sum, item) => sum + item.size, 0)
      
      for (const item of remainingItems) {
        if (currentSize / (1024 * 1024) <= maxSizeMB) break
        
        toDelete.push(item)
        currentSize -= item.size
      }
    }
    
    // Delete the marked items
    for (const item of toDelete) {
      await db.delete('media_items', item.id)
    }
    
    return {
      deletedCount: toDelete.length,
      deletedSizeBytes: toDelete.reduce((sum, item) => sum + item.size, 0),
      deletedSizeMB: toDelete.reduce((sum, item) => sum + item.size, 0) / (1024 * 1024)
    }
  } catch (error) {
    console.error('Failed to clean up media cache:', error)
    throw error
  }
}

// Schedule periodic cache cleanup
export const scheduleMediaCacheCleanup = (intervalHours = 24) => {
  const intervalMs = intervalHours * 60 * 60 * 1000
  
  const cleanup = async () => {
    try {
      await cleanupMediaCache()
    } catch (error) {
      console.error('Scheduled media cache cleanup failed:', error)
    }
  }
  
  // Run initial cleanup
  cleanup()
  
  // Schedule periodic cleanup
  const intervalId = setInterval(cleanup, intervalMs)
  
  // Return function to cancel the scheduled cleanup
  return () => clearInterval(intervalId)
}

// Initialize the cache on module load
if (typeof window !== 'undefined') {
  initMediaCache().catch(console.error)
  
  // Schedule cleanup to run once a day
  scheduleMediaCacheCleanup(24)
}
