/**
 * Auth Feature - Public Exports
 * 
 * This is what other parts of the app can import from @/features/auth
 */

// Store
export { 
  useAuthStore, 
  useUser, 
  useProfile, 
  useIsAuthenticated, 
  useAuthLoading, 
  useAuthError 
} from './model/authStore'
export type { AuthState } from './model/authStore'

// API
export type { Profile, AuthResult, ProfileResult } from './api/authApi'

// Components
export { LoginForm } from './components/LoginForm'
export { SignupForm } from './components/SignupForm'
export { ForgotPasswordForm } from './components/ForgotPasswordForm'
export { ProtectedRoute } from './components/ProtectedRoute'
export { DeleteAccountModal } from './components/DeleteAccountModal'
export { AuthHeader } from './components/AuthHeader'
