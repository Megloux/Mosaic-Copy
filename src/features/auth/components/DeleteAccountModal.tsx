/**
 * DeleteAccountModal Component
 * 
 * Modal for account deletion - REQUIRED for iOS App Store compliance (Guideline 5.1.1(v))
 * Users must be able to delete their account from within the app.
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../model/authStore'
import { cn } from '@/shared/lib/utils'

export interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { deleteAccount, loading, error, clearError, user } = useAuthStore()
  
  const [confirmText, setConfirmText] = React.useState('')
  const [step, setStep] = React.useState<'warning' | 'confirm'>('warning')

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setConfirmText('')
      setStep('warning')
      clearError()
    }
  }, [isOpen, clearError])

  const handleDelete = async () => {
    const result = await deleteAccount()
    
    if (result.success) {
      onClose()
      navigate('/login')
    }
  }

  const canDelete = confirmText.toLowerCase() === 'delete my account'

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative w-full max-w-md mx-4',
        'bg-background rounded-2xl shadow-xl',
        'p-6 animate-in fade-in zoom-in-95 duration-200'
      )}>
        {step === 'warning' ? (
          <>
            {/* Warning Step */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="w-6 h-6 text-destructive"
                >
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 
                id="delete-account-title" 
                className="text-xl font-bold text-foreground"
              >
                Delete your account?
              </h2>
              <p className="text-foreground/60 mt-2">
                This action cannot be undone.
              </p>
            </div>

            <div className="space-y-3 mb-6 text-sm text-foreground/70">
              <p><strong>What will be deleted:</strong></p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Your account and login credentials
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  All your custom routines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Your workout history and progress
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  Any shared routines you created
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg font-medium',
                  'bg-muted text-foreground',
                  'hover:bg-muted/80 transition-colors',
                  'min-h-[var(--ios-min-touch-target)]'
                )}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep('confirm')}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg font-medium',
                  'bg-destructive text-destructive-foreground',
                  'hover:bg-destructive/90 transition-colors',
                  'min-h-[var(--ios-min-touch-target)]'
                )}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirm Step */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Confirm deletion
              </h2>
              <p className="text-foreground/60 mt-2">
                Type <strong>"delete my account"</strong> to confirm
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-xs text-foreground/50 mb-2">
                Logged in as: {user?.email}
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="delete my account"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={loading}
                className={cn(
                  'w-full py-3 px-4 rounded-lg',
                  'bg-background border border-border',
                  'text-foreground placeholder:text-foreground/40',
                  'focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive',
                  'disabled:opacity-50'
                )}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('warning')}
                disabled={loading}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg font-medium',
                  'bg-muted text-foreground',
                  'hover:bg-muted/80 transition-colors',
                  'disabled:opacity-50',
                  'min-h-[var(--ios-min-touch-target)]'
                )}
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!canDelete || loading}
                className={cn(
                  'flex-1 py-3 px-4 rounded-lg font-medium',
                  'bg-destructive text-destructive-foreground',
                  'hover:bg-destructive/90 transition-colors',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'min-h-[var(--ios-min-touch-target)]'
                )}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                    Deleting...
                  </span>
                ) : (
                  'Delete forever'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

DeleteAccountModal.displayName = 'DeleteAccountModal'
