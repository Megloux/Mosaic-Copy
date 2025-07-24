import { useState } from 'react'
import { Section } from '@/shared/ui/Section'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { SearchInput } from '@/shared/ui/form/SearchInput'
import { cn } from '@/shared/lib/utils'

// Mock Pilates exercises data following your domain
const mockExercises = [
  { 
    id: 1, 
    name: 'Hundred', 
    category: 'Core', 
    description: 'Classic Pilates breathing exercise to warm up the core',
    duration: '60s',
    difficulty: 'Beginner'
  },
  { 
    id: 2, 
    name: 'Roll Up', 
    category: 'Core', 
    description: 'Spinal articulation exercise for core strength and flexibility',
    duration: '45s',
    difficulty: 'Intermediate'
  },
  { 
    id: 3, 
    name: 'Single Leg Circle', 
    category: 'Legs', 
    description: 'Hip mobility and core stability exercise',
    duration: '30s each leg',
    difficulty: 'Beginner'
  },
  { 
    id: 4, 
    name: 'Teaser', 
    category: 'Core', 
    description: 'Advanced core exercise requiring balance and control',
    duration: '30s',
    difficulty: 'Advanced'
  },
  { 
    id: 5, 
    name: 'Swan Dive', 
    category: 'Back', 
    description: 'Back extension exercise for spinal mobility',
    duration: '45s',
    difficulty: 'Intermediate'
  },
  { 
    id: 6, 
    name: 'Side Kick Series', 
    category: 'Legs', 
    description: 'Lateral leg strengthening and hip stability',
    duration: '60s each side',
    difficulty: 'Beginner'
  }
]

const categories = ['All', 'Core', 'Legs', 'Back', 'Arms', 'Full Body']
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export const ExerciseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  
  // Filter exercises based on search, category, and difficulty
  const filteredExercises = mockExercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || exercise.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <Section 
      variant="default" 
      padding="large"
      className="min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-[var(--spacing-8)]">
        {/* Header */}
        <div className="space-y-[var(--spacing-2)]">
          <h1 
            className="text-[var(--text-2xl)] font-[var(--brand-text-weight)] tracking-[var(--brand-text-tracking)] text-[rgb(var(--core-white))]"
          >
            Exercise Library
          </h1>
          <p className="text-[var(--text-base)] font-[var(--font-thin)] text-[rgba(var(--core-white),0.7)]">
            Discover and explore Pilates exercises for your routines
          </p>
        </div>
        
        {/* Search and Filter Controls */}
        <Section variant="raised" padding="default" radius="large">
          <div className="space-y-[var(--spacing-6)]">
            {/* Search Input */}
            <SearchInput
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              className="w-full"
            />
            
            {/* Category Filter */}
            <div className="space-y-[var(--spacing-3)]">
              <h3 className="text-[var(--text-sm)] font-[var(--font-thin)] text-[rgba(var(--core-white),0.8)] uppercase tracking-wider">
                Category
              </h3>
              <div className="flex flex-wrap gap-[var(--spacing-2)]">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "transition-all duration-[var(--motion-natural)]",
                      selectedCategory === category
                        ? "bg-[rgb(var(--core-teal))] text-[rgb(var(--core-black))] hover:bg-[rgb(var(--core-teal-light))]"
                        : "bg-[var(--surface-base)] text-[rgb(var(--core-white))] hover:bg-[var(--state-hover)] border-[rgba(var(--core-white),var(--border-opacity-medium))]"
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-[var(--spacing-3)]">
              <h3 className="text-[var(--text-sm)] font-[var(--font-thin)] text-[rgba(var(--core-white),0.8)] uppercase tracking-wider">
                Difficulty
              </h3>
              <div className="flex flex-wrap gap-[var(--spacing-2)]">
                {difficulties.map(difficulty => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={cn(
                      "transition-all duration-[var(--motion-natural)]",
                      selectedDifficulty === difficulty
                        ? "bg-[rgb(var(--core-teal))] text-[rgb(var(--core-black))] hover:bg-[rgb(var(--core-teal-light))]"
                        : "bg-[var(--surface-base)] text-[rgb(var(--core-white))] hover:bg-[var(--state-hover)] border-[rgba(var(--core-white),var(--border-opacity-medium))]"
                    )}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-6)]">
          {filteredExercises.map(exercise => (
            <Card 
              key={exercise.id} 
              variant="default"
              size="default"
              className="bg-[var(--exercise-card-bg)] border-[rgba(var(--core-white),var(--border-opacity-subtle))] hover:bg-[var(--exercise-card-active)] transition-all duration-[var(--motion-natural)] group"
            >
              <div className="space-y-[var(--spacing-4)]">
                {/* Exercise Header */}
                <div className="space-y-[var(--spacing-2)]">
                  <h3 className="text-[var(--exercise-text-size)] font-[var(--exercise-text-weight)] tracking-[var(--exercise-text-tracking)] text-[rgb(var(--core-white))] group-hover:text-[rgb(var(--core-teal-light))] transition-colors">
                    {exercise.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-sm)] text-[rgb(var(--core-teal))] font-[var(--font-thin)]">
                      {exercise.category}
                    </span>
                    <span className={cn(
                      "text-[var(--text-xs)] px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-full font-[var(--font-thin)]",
                      exercise.difficulty === 'Beginner' && "bg-[rgba(var(--feedback-success),0.2)] text-[rgb(var(--feedback-success))]",
                      exercise.difficulty === 'Intermediate' && "bg-[rgba(var(--feedback-warning),0.2)] text-[rgb(var(--feedback-warning))]",
                      exercise.difficulty === 'Advanced' && "bg-[rgba(var(--feedback-error),0.2)] text-[rgb(var(--feedback-error))]"
                    )}>
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>

                {/* Exercise Details */}
                <div className="space-y-[var(--spacing-3)]">
                  <p className="text-[var(--text-sm)] text-[rgba(var(--core-white),0.7)] font-[var(--font-thin)] leading-relaxed">
                    {exercise.description}
                  </p>
                  <div className="text-[var(--text-xs)] text-[rgba(var(--core-white),0.6)] font-[var(--font-thin)]">
                    Duration: {exercise.duration}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="default"
                  size="default"
                  className="w-full bg-[rgb(var(--core-teal))] text-[rgb(var(--core-black))] hover:bg-[rgb(var(--core-teal-light))] font-[var(--font-thin)] min-h-[var(--touch-target-min)] transition-all duration-[var(--motion-natural)]"
                >
                  Add to Routine
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredExercises.length === 0 && (
          <Section variant="raised" padding="large" className="text-center">
            <div className="space-y-[var(--spacing-4)]">
              <p className="text-[var(--text-lg)] text-[rgba(var(--core-white),0.6)] font-[var(--font-thin)]">
                No exercises found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSelectedDifficulty('All')
                }}
                className="bg-[var(--surface-base)] text-[rgb(var(--core-white))] hover:bg-[var(--state-hover)] border-[rgba(var(--core-white),var(--border-opacity-medium))]"
              >
                Clear Filters
              </Button>
            </div>
          </Section>
        )}
      </div>
    </Section>
  )
}
