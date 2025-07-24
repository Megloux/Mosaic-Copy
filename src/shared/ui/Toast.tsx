import { useEffect } from 'react'
import { cn } from '@/shared/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useToasts } from '@/store/uiStore'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export interface ToastProps {
  /** Toast ID */
  id: string
  /** Toast type */
  type?: 'info' | 'success' | 'warning' | 'error'
  /** Toast title */
  title: string
  /** Toast message */
  message?: string
  /** Auto-dismiss duration in ms (0 to disable) */
  duration?: number
  /** Whether toast can be dismissed */
  dismissible?: boolean
  /** Callback when toast is dismissed */
  onDismiss?: () => void
}

export const Toast = ({
  id,
  type = 'info',
  title,
  message,
  dismissible = true,
  onDismiss,
}: ToastProps) => {
  const { removeToast } = useToasts()
  
  const handleDismiss = () => {
    removeToast(id)
    onDismiss?.()
  }
  
  // Get icon based on type
  const IconComponent = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  }[type]
  
  // Get color based on type
  const colorClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }[type]
  
  // Get icon color based on type
  const iconColorClasses = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    error: 'text-red-500',
  }[type]
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }} // iOS spring curve
      className={cn(
        'flex items-start p-4 rounded-lg border shadow-sm',
        'max-w-md w-full',
        colorClasses
      )}
    >
      <div className={cn('flex-shrink-0 mr-3 mt-0.5', iconColorClasses)}>
        <IconComponent size={18} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium mb-1">{title}</h4>
        {message && <p className="text-xs opacity-90">{message}</p>}
      </div>
      
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'flex-shrink-0 ml-3 p-1 rounded-full',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'hover:bg-black/5 active:bg-black/10',
            'min-h-[var(--ios-min-touch-target)] min-w-[var(--ios-min-touch-target)]',
            'flex items-center justify-center'
          )}
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </motion.div>
  )
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useToasts()
  
  // Trigger haptic feedback when new toast appears
  useEffect(() => {
    if (toasts.length > 0 && window.navigator.vibrate) {
      window.navigator.vibrate(5)
    }
  }, [toasts.length])
  
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            dismissible={toast.dismissible}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
