import { useEffect, useState } from 'react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/cards/Card'
import { NetworkStatus } from '@/components/ui/NetworkStatus'
import { useNetworkStatus } from '@/lib/network/networkService'
import { 
  getAllRoutines, 
  preDownloadRoutineMedia, 
  cleanupMediaCache 
} from '@/lib/storage/routineStorage'

export function OfflineSettings() {
  const { isOnline } = useNetworkStatus()
  const [routines, setRoutines] = useState<any[]>([])
  const [selectedRoutines, setSelectedRoutines] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<Record<string, boolean>>({})
  const [cacheSize, setCacheSize] = useState<number | null>(null)
  const [cacheStats, setCacheStats] = useState({ images: 0, videos: 0 })
  
  // Load routines on mount
  useEffect(() => {
    loadRoutines()
    estimateCacheSize()
  }, [])
  
  // Load all routines from IndexedDB
  const loadRoutines = async () => {
    try {
      setLoading(true)
      const allRoutines = await getAllRoutines()
      setRoutines(allRoutines)
      
      // Set initial selected state based on localOnly flag
      const initialSelected = allRoutines.reduce((acc, routine) => {
        acc[routine.id] = !!routine.localOnly
        return acc
      }, {} as Record<string, boolean>)
      
      setSelectedRoutines(initialSelected)
    } catch (error) {
      console.error('Failed to load routines:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Estimate the size of the media cache
  const estimateCacheSize = async () => {
    try {
      // This would be implemented to query IndexedDB for media cache size
      // For now we'll use a placeholder implementation
      const db = await window.indexedDB.open('mosaic-routines', 1)
      db.onsuccess = () => {
        const database = db.result
        const transaction = database.transaction(['media_cache'], 'readonly')
        const store = transaction.objectStore('media_cache')
        
        const countRequest = store.count()
        countRequest.onsuccess = () => {
          // Placeholder statistics
          const totalItems = countRequest.result
          setCacheStats({
            images: Math.floor(totalItems * 0.7), // Assuming 70% are images
            videos: Math.floor(totalItems * 0.3)  // Assuming 30% are videos
          })
        }
        
        // Get total size
        const getAllRequest = store.getAll()
        getAllRequest.onsuccess = () => {
          const items = getAllRequest.result
          const totalBytes = items.reduce((sum, item) => sum + item.size, 0)
          setCacheSize(totalBytes / (1024 * 1024)) // Convert to MB
        }
      }
    } catch (error) {
      console.error('Failed to estimate cache size:', error)
    }
  }
  
  // Toggle a routine for offline access
  const toggleRoutineOffline = async (routineId: string) => {
    try {
      setSelectedRoutines(prev => ({
        ...prev,
        [routineId]: !prev[routineId]
      }))
      
      if (!selectedRoutines[routineId]) {
        // If newly selected, download media
        setDownloading(prev => ({ ...prev, [routineId]: true }))
        await preDownloadRoutineMedia(routineId)
        setDownloading(prev => ({ ...prev, [routineId]: false }))
      } else {
        // If deselected, we could remove the cached media
        // This would require additional implementation
      }
      
      // Refresh cache size estimate
      estimateCacheSize()
    } catch (error) {
      console.error(`Failed to toggle routine ${routineId} for offline access:`, error)
      // Revert the selection state on error
      setSelectedRoutines(prev => ({
        ...prev,
        [routineId]: !prev[routineId]
      }))
    }
  }
  
  // Clear all cached media
  const clearCache = async () => {
    try {
      await cleanupMediaCache(0, 0) // Force cleanup of all items
      estimateCacheSize()
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }
  
  return (
    <Section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Offline Settings</h1>
        <p className="text-muted-foreground">
          Manage which content is available when you're offline.
        </p>
      </div>
      
      <div className="mb-6">
        <NetworkStatus />
      </div>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Media Cache</h2>
        <div className="flex justify-between mb-2">
          <span>Total size:</span>
          <span className="font-medium">{cacheSize ? `${cacheSize.toFixed(1)} MB` : 'Calculating...'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Images:</span>
          <span>{cacheStats.images}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span>Videos:</span>
          <span>{cacheStats.videos}</span>
        </div>
        <button
          className="w-full py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
          onClick={clearCache}
        >
          Clear Cache
        </button>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Offline</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2">Loading routines...</p>
          </div>
        ) : routines.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No routines found. Create some routines first.
          </p>
        ) : (
          <div className="space-y-3">
            {routines.map(routine => (
              <Card key={routine.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{routine.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {routine.exercises.length} exercises
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    {downloading[routine.id] && (
                      <span className="text-sm text-blue-600 mr-3">Downloading...</span>
                    )}
                    
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={!!selectedRoutines[routine.id]}
                        onChange={() => toggleRoutineOffline(routine.id)}
                        disabled={downloading[routine.id] || !isOnline}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
