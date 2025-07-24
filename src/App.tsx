import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ExerciseLibrary } from './pages/ExerciseLibrary'
import { RoutineBuilder } from './components/routines/RoutineBuilder'
import { Navigation } from './components/Navigation'
import SupabaseTest from './components/SupabaseTest'
import ErrorBoundary from './ErrorBoundary'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <Navigation />
          <Routes>
            <Route path="/exercises" element={
              <ErrorBoundary>
                <ExerciseLibrary />
              </ErrorBoundary>
            } />
            <Route path="/builder" element={
              <ErrorBoundary>
                <RoutineBuilder />
              </ErrorBoundary>
            } />
            <Route path="/routines" element={
              <ErrorBoundary>
                <div className="min-h-screen bg-gray-50 p-6">
                  <h1 className="text-2xl font-bold mb-4">Routines</h1>
                  <p>Routines page component not found in the codebase.</p>
                </div>
              </ErrorBoundary>
            } />
            <Route path="/" element={
              <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-12 px-4">
                  <h1 className="text-4xl font-bold text-gray-900 mb-8">MosaicWindsurf</h1>
                  <div className="space-y-6">
                    <SupabaseTest />
                    <div className="p-4 bg-blue-100 rounded">
                      <h2 className="font-bold mb-2">Available Routes:</h2>
                      <p className="mb-4">Click on the navigation links above to access the different sections of the app.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white shadow rounded">
                          <h3 className="font-bold text-lg mb-2">Exercise Library</h3>
                          <p className="text-gray-600 mb-3">Browse and search through the exercise collection.</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded">
                          <h3 className="font-bold text-lg mb-2">Routine Builder</h3>
                          <p className="text-gray-600 mb-3">Create and customize workout routines.</p>
                        </div>
                        <div className="p-4 bg-white shadow rounded">
                          <h3 className="font-bold text-lg mb-2">Routines</h3>
                          <p className="text-gray-600 mb-3">View saved workout routines.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}
