import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import ErrorBoundary from './ErrorBoundary'
import { LoginForm, SignupForm, ForgotPasswordForm } from '@/features/auth'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'

// Import FSA components - Working ExerciseLibrary from Feature-Slice Architecture
import { ExerciseLibrary } from './features/exercises/components/ExerciseLibrary'
// import { RoutineBuilder } from './components/routines/RoutineBuilder'

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--core-black))', color: 'rgb(var(--core-white))' }}>
          <Navigation />
          <Routes>
            <Route path="/" element={
              <div className="p-8" style={{ fontFamily: 'var(--font-primary)', fontWeight: 'var(--font-thin)' }}>
                <h1 
                  className="mb-8" 
                  style={{ 
                    fontSize: 'var(--text-4xl)',
                    fontWeight: 'var(--font-brand)',
                    letterSpacing: 'var(--tracking-default)',
                    color: 'rgb(var(--core-teal))'
                  }}
                >
                  MOSAIC
                </h1>
                <div className="space-y-6">
                  <div 
                    className="p-6 rounded-lg" 
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  >
                    <h2 
                      className="mb-3" 
                      style={{ 
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-timer)',
                        color: 'rgb(var(--core-teal-light))'
                      }}
                    >
                      Welcome to Your Pilates Platform
                    </h2>
                    <p style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-thin)' }}>
                      The Spotify of Pilates Programming. Discover, create, and execute your perfect routine.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div 
                      className="p-6 rounded-lg transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--surface-base)' }}
                    >
                      <h3 
                        className="mb-3" 
                        style={{ 
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-timer)',
                          color: 'rgb(var(--core-white))'
                        }}
                      >
                        Exercise Library
                      </h3>
                      <p 
                        className="mb-4" 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-thin)',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        Browse and discover exercises with advanced filtering
                      </p>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'rgb(var(--core-teal))'
                        }}
                      >
                        Navigate → Exercises
                      </p>
                    </div>
                    <div 
                      className="p-6 rounded-lg transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--surface-base)' }}
                    >
                      <h3 
                        className="mb-3" 
                        style={{ 
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-timer)',
                          color: 'rgb(var(--core-white))'
                        }}
                      >
                        Routine Builder
                      </h3>
                      <p 
                        className="mb-4" 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-thin)',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        Create custom routines from templates or scratch
                      </p>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'rgb(var(--core-teal))'
                        }}
                      >
                        Navigate → Builder
                      </p>
                    </div>
                    <div 
                      className="p-6 rounded-lg transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--surface-base)' }}
                    >
                      <h3 
                        className="mb-3" 
                        style={{ 
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-timer)',
                          color: 'rgb(var(--core-white))'
                        }}
                      >
                        Routine Player
                      </h3>
                      <p 
                        className="mb-4" 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-thin)',
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        Execute routines with guided timer and instructions
                      </p>
                      <p 
                        style={{ 
                          fontSize: 'var(--text-xs)',
                          color: 'rgb(var(--core-teal))'
                        }}
                      >
                        Navigate → Player
                      </p>
                    </div>
                  </div>
                  <div 
                    className="p-6 rounded-lg" 
                    style={{ backgroundColor: 'var(--surface-accent)' }}
                  >
                    <h3 
                      className="mb-4" 
                      style={{ 
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-timer)',
                        color: 'rgb(var(--core-black))'
                      }}
                    >
                      Platform Features
                    </h3>
                    <ul className="space-y-2">
                      <li 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-thin)',
                          color: 'rgb(var(--core-black))'
                        }}
                      >
                        • Offline-first design with PWA capabilities
                      </li>
                      <li 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-thin)',
                          color: 'rgb(var(--core-black))'
                        }}
                      >
                        • iOS-native feel with Capacitor integration
                      </li>
                      <li 
                        style={{ 
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-thin)',
                          color: 'rgb(var(--core-black))'
                        }}
                      >
                        • Advanced exercise discovery and routine creation
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            } />
            <Route path="/exercises" element={
              <ExerciseLibrary 
                onAddToRoutineBuilder={(exercise) => {
                  console.log('Adding exercise to routine builder:', exercise.exercise_name)
                  // TODO: Implement routine builder integration
                }}
                className="min-h-screen"
              />
            } />
            <Route path="/builder" element={
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Routine Builder</h1>
                <div className="p-4 bg-yellow-100 rounded">
                  <p>🚧 Routine Builder component coming next...</p>
                </div>
              </div>
            } />
            <Route path="/routines" element={
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Routines</h1>
                <div className="p-4 bg-yellow-100 rounded">
                  <p>🚧 Routines component coming next...</p>
                </div>
              </div>
            } />
            {/* Auth Routes */}
            <Route path="/login" element={
              <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'rgb(var(--core-black))' }}>
                <LoginForm />
              </div>
            } />
            <Route path="/signup" element={
              <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'rgb(var(--core-black))' }}>
                <SignupForm />
              </div>
            } />
            <Route path="/forgot-password" element={
              <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'rgb(var(--core-black))' }}>
                <ForgotPasswordForm />
              </div>
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  )
}
