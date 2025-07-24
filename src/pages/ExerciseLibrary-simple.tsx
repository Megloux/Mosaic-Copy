import { useState } from 'react'

// Simple mock data for demonstration
const mockExercises = [
  { id: 1, name: 'Push-ups', category: 'Chest', description: 'Classic bodyweight chest exercise' },
  { id: 2, name: 'Squats', category: 'Legs', description: 'Fundamental lower body movement' },
  { id: 3, name: 'Pull-ups', category: 'Back', description: 'Upper body pulling exercise' },
  { id: 4, name: 'Plank', category: 'Core', description: 'Isometric core strengthening' },
  { id: 5, name: 'Lunges', category: 'Legs', description: 'Single-leg strength exercise' },
  { id: 6, name: 'Burpees', category: 'Full Body', description: 'High-intensity full body movement' }
]

const categories = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Full Body']

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Filter exercises based on search and category
  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Exercise Library</h1>
        
        {/* Search and Filter Controls */}
        <div className="mb-6 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map(exercise => (
            <div key={exercise.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{exercise.name}</h3>
              <p className="text-sm text-blue-600 mb-3">{exercise.category}</p>
              <p className="text-gray-600">{exercise.description}</p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                Add to Routine
              </button>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exercises found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
