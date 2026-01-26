import { useState, useEffect } from 'react'
import { getAllRoutines, type RoutineExercise } from '../lib/storage/routineStorage'

// Define the saved routine type based on the storage schema
type SavedRoutine = {
  id: string
  name: string
  description?: string
  exercises: RoutineExercise[]
  lastModified: number
  synced: boolean
  localOnly?: boolean
  version: number
}

const categories = ['All', 'Flow', 'Strength', 'Flexibility', 'Full Body', 'Recovery']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export const Routines = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [routines, setRoutines] = useState<SavedRoutine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load routines from storage
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        setLoading(true)
        const savedRoutines = await getAllRoutines()
        setRoutines(savedRoutines || [])
        setError(null)
      } catch (err) {
        console.error('Failed to load routines:', err)
        setError('Failed to load routines')
        setRoutines([])
      } finally {
        setLoading(false)
      }
    }

    loadRoutines()
  }, [])

  // Filter routines based on search, category, and difficulty
  const filteredRoutines = routines.filter((routine: SavedRoutine) => {
    const matchesSearch = routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (routine.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    // For now, we'll skip category and difficulty filtering since the real data structure might be different
    // const matchesCategory = selectedCategory === 'All' || routine.category === selectedCategory
    // const matchesDifficulty = selectedDifficulty === 'All' || routine.difficulty === selectedDifficulty
    return matchesSearch // && matchesCategory && matchesDifficulty
  })

  const startRoutine = (routineId: string) => {
    console.log(`Starting routine ${routineId}`)
    // This would navigate to the routine player
  }

  const editRoutine = (routineId: string) => {
    console.log(`Editing routine ${routineId}`)
    // This would navigate to the routine builder with the routine loaded
  }

  // Helper function to format last modified date
  const formatLastModified = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div 
      className="min-h-screen p-6" 
      style={{ 
        backgroundColor: 'rgb(var(--core-black))', 
        color: 'rgb(var(--core-white))',
        fontFamily: 'var(--font-primary)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 
          className="mb-8" 
          style={{ 
            fontSize: 'var(--text-4xl)',
            fontWeight: 'var(--font-brand)',
            letterSpacing: 'var(--tracking-default)',
            color: 'rgb(var(--core-teal))'
          }}
        >
          My Routines
        </h1>
        
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search routines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 rounded-lg border-0 outline-none"
            style={{
              backgroundColor: 'var(--surface-base)',
              color: 'rgb(var(--core-white))',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-thin)',
              fontFamily: 'var(--font-primary)'
            }}
          />
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div>
              <label 
                className="block mb-2" 
                style={{ 
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-timer)',
                  color: 'rgb(var(--core-teal-light))'
                }}
              >
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 rounded border-0 outline-none"
                style={{
                  backgroundColor: 'var(--surface-base)',
                  color: 'rgb(var(--core-white))',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <div>
              <label 
                className="block mb-2" 
                style={{ 
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-timer)',
                  color: 'rgb(var(--core-teal-light))'
                }}
              >
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-2 rounded border-0 outline-none"
                style={{
                  backgroundColor: 'var(--surface-base)',
                  color: 'rgb(var(--core-white))',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-primary)'
                }}
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: 'rgb(var(--core-teal))' }}>
              Loading your routines...
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: 'rgb(var(--feedback-error))' }}>
              {error}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredRoutines.length === 0 && (
          <div className="text-center py-12">
            <div className="text-lg mb-4" style={{ color: 'rgb(var(--core-white))' }}>
              {routines.length === 0 ? 'No saved routines yet' : 'No routines match your search'}
            </div>
            <div style={{ color: 'rgb(var(--text-secondary))' }}>
              {routines.length === 0 ? 'Create your first routine in the Routine Builder' : 'Try adjusting your search or filters'}
            </div>
          </div>
        )}
        
        {/* Routines Grid */}
        {!loading && !error && filteredRoutines.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutines.map((routine: SavedRoutine) => (
            <div
              key={routine.id}
              className="p-6 rounded-lg transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: 'var(--surface-raised)' }}
            >
              {/* Routine Header */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 
                    style={{ 
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--font-timer)',
                      color: 'rgb(var(--core-white))'
                    }}
                  >
                    {routine.name}
                  </h3>
                  <span 
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: 'var(--surface-accent)',
                      color: 'rgb(var(--core-black))',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--font-thin)'
                    }}
                  >
                    {routine.synced ? 'Synced' : 'Local'}
                  </span>
                </div>
                <p 
                  className="mb-4" 
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-thin)',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {routine.description}
                </p>
              </div>

              {/* Routine Stats */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Exercises
                  </span>
                  <span 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'rgb(var(--core-teal))',
                      fontWeight: 'var(--font-timer)'
                    }}
                  >
                    {routine.exercises.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Last Modified
                  </span>
                  <span 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'rgb(var(--core-teal))',
                      fontWeight: 'var(--font-timer)'
                    }}
                  >
                    {formatLastModified(routine.lastModified)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    Version
                  </span>
                  <span 
                    style={{ 
                      fontSize: 'var(--text-xs)',
                      color: 'rgb(var(--core-teal))',
                      fontWeight: 'var(--font-timer)'
                    }}
                  >
                    v{routine.version}
                  </span>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => startRoutine(routine.id)}
                  className="flex-1 py-2 px-4 rounded transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface-accent)',
                    color: 'rgb(var(--core-black))',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-timer)'
                  }}
                >
                  Start
                </button>
                <button
                  onClick={() => editRoutine(routine.id)}
                  className="flex-1 py-2 px-4 rounded transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    color: 'rgb(var(--core-white))',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-timer)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}
