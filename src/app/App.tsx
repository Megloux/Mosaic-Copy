import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ExerciseDemo } from '@/pages/ExerciseDemo'
import { ExerciseLibrary } from '@/features/exercises/components/ExerciseLibrary'
import { SupabaseTest } from '@/components/SupabaseTest'
import { SaveButton } from '@/components/ui/buttons/SaveButton'
import { NetworkStatusIndicator } from '@/components/ui/NetworkStatusIndicator'
import { NetworkToast } from '@/components/ui/NetworkToast'
import { RoutinePlayerWrapper } from '@/components/routines/player/RoutinePlayerWrapper'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/exercises" element={<ExerciseLibrary onAddToRoutineBuilder={(exercise) => console.log('Add to routine:', exercise)} />} />
          <Route path="/" element={
            <div className="min-h-screen bg-gray-50">
              <div className="max-w-7xl mx-auto py-12 px-4">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">MosaicWindsurf</h1>
                <div className="space-y-6">
                  <SupabaseTest />
                  <SaveButton onSave={async () => console.log('Save clicked')} />
                  <ExerciseDemo />
                </div>
              </div>
            </div>
          } />
        </Routes>
        
        {/* Offline functionality components */}
        <NetworkStatusIndicator />
        <NetworkToast />
        
        {/* Routine Player */}
        <RoutinePlayerWrapper />
      </Router>
    </QueryClientProvider>
  );
}
