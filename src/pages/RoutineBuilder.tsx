import { useState } from 'react'

// Mock data for demonstration
const mockTemplates = [
  { id: 1, name: 'Power to Precision', description: 'High-intensity strength training', duration: '45 min', difficulty: 'Advanced' },
  { id: 2, name: 'The OG', description: 'Classic Pilates fundamentals', duration: '30 min', difficulty: 'Beginner' },
  { id: 3, name: 'Stacked Series', description: 'Progressive strength building', duration: '60 min', difficulty: 'Intermediate' },
  { id: 4, name: 'Flow State', description: 'Mindful movement practice', duration: '40 min', difficulty: 'Intermediate' }
]

const mockExercises = [
  { id: 1, name: 'Hundred', category: 'Warm-up', duration: '2 min' },
  { id: 2, name: 'Roll Up', category: 'Core', duration: '3 min' },
  { id: 3, name: 'Single Leg Circle', category: 'Legs', duration: '4 min' },
  { id: 4, name: 'Rolling Like a Ball', category: 'Core', duration: '2 min' },
  { id: 5, name: 'Teaser', category: 'Full Body', duration: '5 min' }
]

export const RoutineBuilder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [customExercises, setCustomExercises] = useState<any[]>([])
  const [routineName, setRoutineName] = useState('')

  const addExercise = (exercise: any) => {
    setCustomExercises([...customExercises, { ...exercise, id: Date.now() }])
  }

  const removeExercise = (id: number) => {
    setCustomExercises(customExercises.filter(ex => ex.id !== id))
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
          Routine Builder
        </h1>
        
        {/* Routine Name Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Enter routine name..."
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="w-full p-4 rounded-lg border-0 outline-none"
            style={{
              backgroundColor: 'var(--surface-base)',
              color: 'rgb(var(--core-white))',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-thin)',
              fontFamily: 'var(--font-primary)'
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Template Selection */}
          <div>
            <h2 
              className="mb-6" 
              style={{ 
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-timer)',
                color: 'rgb(var(--core-teal-light))'
              }}
            >
              Choose a Template
            </h2>
            <div className="space-y-4">
              {mockTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: selectedTemplate === template.id ? 'var(--surface-accent)' : 'var(--surface-base)',
                    color: selectedTemplate === template.id ? 'rgb(var(--core-black))' : 'rgb(var(--core-white))'
                  }}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h3 
                    className="mb-2" 
                    style={{ 
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-timer)'
                    }}
                  >
                    {template.name}
                  </h3>
                  <p 
                    className="mb-2" 
                    style={{ 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-thin)',
                      opacity: 0.8
                    }}
                  >
                    {template.description}
                  </p>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 'var(--text-xs)' }}>{template.duration}</span>
                    <span style={{ fontSize: 'var(--text-xs)' }}>{template.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Library */}
          <div>
            <h2 
              className="mb-6" 
              style={{ 
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-timer)',
                color: 'rgb(var(--core-teal-light))'
              }}
            >
              Add Exercises
            </h2>
            <div className="space-y-3">
              {mockExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="p-3 rounded-lg flex justify-between items-center"
                  style={{ backgroundColor: 'var(--surface-base)' }}
                >
                  <div>
                    <h4 
                      style={{ 
                        fontSize: 'var(--text-base)',
                        fontWeight: 'var(--font-timer)',
                        color: 'rgb(var(--core-white))'
                      }}
                    >
                      {exercise.name}
                    </h4>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-xs)',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {exercise.category} • {exercise.duration}
                    </p>
                  </div>
                  <button
                    onClick={() => addExercise(exercise)}
                    className="px-3 py-1 rounded transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--surface-accent)',
                      color: 'rgb(var(--core-black))',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-thin)'
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Routine Preview */}
        {customExercises.length > 0 && (
          <div className="mt-8">
            <h2 
              className="mb-6" 
              style={{ 
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-timer)',
                color: 'rgb(var(--core-teal-light))'
              }}
            >
              Your Routine ({customExercises.length} exercises)
            </h2>
            <div 
              className="p-6 rounded-lg"
              style={{ backgroundColor: 'var(--surface-raised)' }}
            >
              <div className="space-y-3">
                {customExercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className="flex justify-between items-center p-3 rounded"
                    style={{ backgroundColor: 'var(--surface-base)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <span 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          color: 'rgb(var(--core-teal))',
                          fontWeight: 'var(--font-timer)'
                        }}
                      >
                        {index + 1}.
                      </span>
                      <div>
                        <h4 
                          style={{ 
                            fontSize: 'var(--text-base)',
                            fontWeight: 'var(--font-timer)',
                            color: 'rgb(var(--core-white))'
                          }}
                        >
                          {exercise.name}
                        </h4>
                        <p 
                          style={{ 
                            fontSize: 'var(--text-xs)',
                            color: 'rgba(255, 255, 255, 0.7)'
                          }}
                        >
                          {exercise.category} • {exercise.duration}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeExercise(exercise.id)}
                      className="px-3 py-1 rounded transition-all duration-200"
                      style={{
                        backgroundColor: 'var(--feedback-error)',
                        color: 'rgb(var(--core-white))',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-thin)'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  className="px-6 py-3 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--surface-accent)',
                    color: 'rgb(var(--core-black))',
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-timer)'
                  }}
                >
                  Save Routine
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
