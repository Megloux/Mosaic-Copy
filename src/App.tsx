import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import ErrorBoundary from './ErrorBoundary'
import { LoginForm, SignupForm, ForgotPasswordForm, ProtectedRoute, EmailVerificationPage, ResetPasswordPage, useAuthStore } from '@/features/auth'
import { PrivacyPolicy } from '@/pages/PrivacyPolicy'
import { ToastContainer } from '@/shared/ui/Toast'
import { ProfilePage } from '@/features/profile'
import { Card } from '@/shared/ui/Card'

// Import FSA components - Working ExerciseLibrary from Feature-Slice Architecture
import { ExerciseLibrary } from './features/exercises/components/ExerciseLibrary'
// Standalone Routine Builder (self-contained, no legacy dependencies)
import { RoutineBuilderEntry } from './features/routines/ui/RoutineBuilderEntry'

export default function App() {
  const { initialize, initialized, loading } = useAuthStore()

  // Initialize auth on app load
  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <Router>
      <ErrorBoundary>
        {/* Show loading screen while checking auth state */}
        {(!initialized || loading) ? (
          <div 
            className="min-h-screen flex items-center justify-center" 
            style={{ backgroundColor: 'rgb(var(--core-black))' }}
          >
            <div className="flex flex-col items-center gap-4">
              <div 
                className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"
                style={{ borderColor: 'rgb(var(--core-teal))' }}
              />
              <p 
                className="text-sm"
                style={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 'var(--font-thin)'
                }}
              >
                Loading...
              </p>
            </div>
          </div>
        ) : (
          <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--core-black))', color: 'rgb(var(--core-white))' }}>
            <Navigation />
            <ToastContainer />
            <Routes>
            <Route path="/" element={
              <div className="p-4 pt-6" style={{ fontFamily: 'var(--font-primary)', fontWeight: 'var(--font-thin)' }}>
                <div className="space-y-6">
                  <Card variant="primary" size="default">
                    <h2 className="text-xl font-semibold mb-3" style={{ color: 'rgb(var(--core-teal-light))' }}>
                      Welcome to Your Pilates Platform
                    </h2>
                    <p className="text-base text-white/80" style={{ fontWeight: 'var(--font-thin)' }}>
                      The Spotify of Pilates Programming. Discover, create, and execute your perfect routine.
                    </p>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/exercises" className="block transition-all duration-200 hover:scale-[1.02]">
                      <Card size="default" className="h-full">
                        <h3 className="text-lg font-semibold mb-3">Exercise Library</h3>
                        <p className="text-sm text-white/70 mb-4" style={{ fontWeight: 'var(--font-thin)' }}>
                          Browse and discover exercises with advanced filtering
                        </p>
                        <p className="text-xs" style={{ color: 'rgb(var(--core-teal))' }}>Navigate → Exercises</p>
                      </Card>
                    </Link>
                    <Link to="/builder" className="block transition-all duration-200 hover:scale-[1.02]">
                      <Card size="default" className="h-full">
                        <h3 className="text-lg font-semibold mb-3">Routine Builder</h3>
                        <p className="text-sm text-white/70 mb-4" style={{ fontWeight: 'var(--font-thin)' }}>
                          Create custom routines from templates or scratch
                        </p>
                        <p className="text-xs" style={{ color: 'rgb(var(--core-teal))' }}>Navigate → Builder</p>
                      </Card>
                    </Link>
                    <Card size="default">
                      <h3 className="text-lg font-semibold mb-3">Routine Player</h3>
                      <p className="text-sm text-white/70 mb-4" style={{ fontWeight: 'var(--font-thin)' }}>
                        Execute routines with guided timer and instructions
                      </p>
                      <p className="text-xs" style={{ color: 'rgb(var(--core-teal))' }}>Navigate → Player</p>
                    </Card>
                  </div>
                  <Card variant="secondary" size="default">
                    <h3 className="text-lg font-semibold mb-4">Platform Features</h3>
                    <ul className="space-y-2 text-sm text-white/70" style={{ fontWeight: 'var(--font-thin)' }}>
                      <li>Offline-first design with PWA capabilities</li>
                      <li>iOS-native feel with Capacitor integration</li>
                      <li>Advanced exercise discovery and routine creation</li>
                    </ul>
                  </Card>
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
            <Route path="/builder" element={<RoutineBuilderEntry />} />
            <Route path="/routines" element={
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Routines</h1>
                <Card size="default" variant="secondary">
                  <p className="text-white/60">Routines component coming next...</p>
                </Card>
              </div>
            } />
            {/* Profile Route - Protected */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
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
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </div>
        )}
      </ErrorBoundary>
    </Router>
  )
}
