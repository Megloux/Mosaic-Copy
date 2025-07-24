import { useEffect } from 'react'
import { Section } from '@/components/ui/Section'
import { Grid } from '@/components/ui/Grid'
import { Card } from '@/components/ui/cards/Card'
import { List } from '@/components/ui/List'
import { useExerciseStore, useFilteredExercises } from '@/store/exerciseStore'
import type { Exercise } from '@/lib/supabase/types'

export const ExerciseLibrary = () => {
  // Use Zustand store instead of local state
  const { 
    categories, 
    loading, 
    searchQuery, 
    selectedCategory,
    fetchExercises,
    fetchCategories,
    setSearchQuery,
    setSelectedCategory
  } = useExerciseStore()
  
  // Get filtered exercises using the selector
  const filteredExercises = useFilteredExercises()

  useEffect(() => {
    // Fetch data on component mount
    fetchCategories()
    fetchExercises()
  }, [fetchCategories, fetchExercises])

  const renderExerciseCard = (exercise: Exercise) => (
    <Card
      key={exercise.id}
      title={exercise.exercise_name}
      className="h-full"
    >
      <div className="space-y-2 text-sm">
        {exercise.setup_instructions && (
          <p className="text-foreground/80">{exercise.setup_instructions}</p>
        )}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-medium">Springs:</span>
          {exercise.spring_setup && typeof exercise.spring_setup === 'object' && (
            <>
              <span>{(exercise.spring_setup as any).light_springs || 0} Light</span>
              <span>{(exercise.spring_setup as any).heavy_springs || 0} Heavy</span>
            </>
          )}
        </div>
        {exercise.vimeo_id && (
          <div className="aspect-video rounded-md bg-muted">
            {/* Video player will be implemented here */}
          </div>
        )}
      </div>
    </Card>
  )

  return (
    <Section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Exercise Library</h1>
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search exercises..."
            className="rounded-md border px-3 py-1.5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value || null)}
            className="rounded-md border px-3 py-1.5"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Grid className="grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full">
            <List 
              items={[]} 
              loading={true} 
              renderItem={() => null}
              keyExtractor={(item) => item.id}
            />
          </div>
        ) : filteredExercises.length === 0 ? (
          <div className="col-span-full text-center text-foreground/60">
            No exercises found
          </div>
        ) : (
          filteredExercises.map(renderExerciseCard)
        )}
      </Grid>
    </Section>
  )
}
