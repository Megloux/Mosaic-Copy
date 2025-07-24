import { useEffect, useState } from 'react'
import { ExerciseSection } from '@/components/exercises/ExerciseSection'
import { Section } from '@/components/ui/Section'
import { StandardButton } from '@/components/ui/buttons/StandardButton'
import { startPeriodicSync, stopPeriodicSync, syncAll } from '@/lib/storage/sync'
import { useExerciseStore } from '@/store/exerciseStore'

export const ExerciseDemo = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState<string | null>(
    localStorage.getItem('lastSync')
  )

  // Get categories and actions from Zustand store
  const { 
    categories, 
    selectedCategory,
    loading, 
    fetchCategories, 
    setSelectedCategory 
  } = useExerciseStore()

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Start periodic sync
    startPeriodicSync()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      stopPeriodicSync()
    }
  }, [])

  // Update last sync time
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSync(localStorage.getItem('lastSync'))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleManualSync = async () => {
    try {
      await syncAll()
      setLastSync(Date.now().toString())
    } catch (error) {
      console.error('Manual sync failed:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      {/* Network Status Section */}
      <Section
        heading="Network Status"
        description={`Currently ${isOnline ? 'Online' : 'Offline'}`}
        action={
          <StandardButton
            onClick={handleManualSync}
            disabled={!isOnline}
          >
            Sync Now
          </StandardButton>
        }
        variant="raised"
        padding="small"
      >
        <div className="text-sm space-y-2">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span>
              {isOnline ? 'Connected to network' : 'Working offline'}
            </span>
          </div>
          {lastSync && (
            <p className="text-foreground/60">
              Last synced: {new Date(parseInt(lastSync)).toLocaleString()}
            </p>
          )}
        </div>
      </Section>

      {/* Exercise Categories */}
      <Section
        heading="Categories"
        variant="raised"
        padding="small"
      >
        <div className="flex flex-wrap gap-2">
          <StandardButton 
            variant={selectedCategory === null ? "default" : "secondary"}
            onClick={() => setSelectedCategory(null)}
          >
            All Exercises
          </StandardButton>
          
          {loading ? (
            <div className="py-2 px-4">Loading categories...</div>
          ) : (
            categories.map((category) => (
              <StandardButton
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </StandardButton>
            ))
          )}
        </div>
      </Section>

      {/* Exercise Library */}
      <ExerciseSection categoryId={selectedCategory || undefined} />
    </div>
  )
}
