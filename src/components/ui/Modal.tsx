import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'

const modalVariants = cva(
  [
    'fixed inset-0 z-50',
    'flex items-center justify-center',
    'transition-all duration-[var(--motion-natural)]',
    'px-[var(--container-padding-md)]',
    'py-[calc(var(--container-padding-md)+env(safe-area-inset-top))]'
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-[var(--overlay-light)] backdrop-blur-sm',
        overlay: 'bg-[var(--overlay-heavy)] backdrop-blur-md'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const contentVariants = cva(
  [
    'relative overflow-hidden',
    'bg-surface shadow-[var(--shadow-lg)]',
    'transition-all duration-[var(--motion-natural)]',
    'rounded-lg'
  ].join(' '),
  {
    variants: {
      size: {
        default: 'w-full max-w-[var(--container-md)]',
        large: 'w-full max-w-[var(--container-lg)]',
        fullscreen: 'w-full h-full'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
)

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  open?: boolean
  onClose?: () => void
  size?: VariantProps<typeof contentVariants>['size']
  enableHaptics?: boolean
  loading?: boolean
  loadingContent?: React.ReactNode
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className, 
    variant, 
    size, 
    open, 
    onClose, 
    children,
    enableHaptics = true,
    loading = false,
    loadingContent,
    closeOnEscape = true,
    closeOnOverlayClick = true,
    ...props 
  }, ref) => {
    // Handle escape key
    React.useEffect(() => {
      if (!open || !closeOnEscape) return

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (enableHaptics && window.navigator.vibrate) {
            window.navigator.vibrate(3) // Light haptic
          }
          onClose?.()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onClose, closeOnEscape, enableHaptics])

    // Lock body scroll when modal is open
    React.useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [open])

    const handleOverlayClick = React.useCallback(() => {
      if (!closeOnOverlayClick) return
      
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(3) // Light haptic
      }
      onClose?.()
    }, [closeOnOverlayClick, onClose, enableHaptics])

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            className={cn(modalVariants({ variant }), className)}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            {...props}
          >
            <motion.div
              className={cn(contentVariants({ size }))}
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            >
              {loading ? (
                loadingContent || (
                  <div className="flex items-center justify-center p-[var(--container-padding-md)]">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )
              ) : children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

Modal.displayName = 'Modal'
