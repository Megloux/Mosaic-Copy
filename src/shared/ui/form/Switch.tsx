import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

const switchVariants = cva(
  [
    'group relative inline-flex cursor-pointer',
    'touch-none select-none items-center',
    'min-h-[var(--ios-min-touch-target)]',
  ].join(' '),
  {
    variants: {
      size: {
        default: 'h-6 w-11',
        large: 'h-7 w-[52px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

const thumbVariants = cva(
  [
    'pointer-events-none block rounded-full bg-white',
    'shadow-lg ring-0 transition-transform',
    'group-active:w-[135%]', // iOS-style squeeze effect
  ].join(' '),
  {
    variants: {
      size: {
        default: 'h-5 w-5',
        large: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
)

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof switchVariants> {
  /** Whether the switch is checked */
  checked?: boolean
  /** Callback when the switch changes */
  onChange?: (checked: boolean) => void
  /** Label for the switch */
  label?: string
  /** Helper text to display below the switch */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean
  /** Loading state */
  loading?: boolean
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({
    className,
    size,
    checked = false,
    onChange,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    ...props
  }, ref) => {
    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback(() => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(3) // Light vibration
      }
    }, [enableHaptics])

    // Handle change
    const handleChange = React.useCallback(() => {
      if (disabled || loading) return
      handleHapticFeedback()
      onChange?.(!checked)
    }, [checked, disabled, loading, onChange, handleHapticFeedback])

    return (
      <div className="flex flex-col space-y-1.5">
        <button
          ref={ref}
          role="switch"
          aria-checked={checked}
          data-state={checked ? 'checked' : 'unchecked'}
          disabled={disabled || loading}
          onClick={handleChange}
          className={cn(
            switchVariants({ size }),
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
          {...props}
        >
          {label && (
            <span
              className={cn(
                'mr-2 text-sm font-medium',
                error && 'text-destructive',
                success && 'text-success'
              )}
            >
              {label}
            </span>
          )}
          <motion.div
            className={cn(
              'relative inline-flex h-full w-full shrink-0 rounded-full',
              'transition-colors duration-[var(--motion-natural)]',
              checked ? 'bg-primary' : 'bg-surface-hover',
              error && 'bg-destructive',
              success && 'bg-success'
            )}
            animate={loading ? { opacity: [1, 0.5, 1] } : undefined}
            transition={loading ? { repeat: Infinity, duration: 1 } : undefined}
          >
            <motion.span
              className={cn(
                thumbVariants({ size }),
                'absolute left-[2px] top-[2px]'
              )}
              animate={{
                x: checked ? (size === 'large' ? 26 : 22) : 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
            />
          </motion.div>
        </button>
        {(helperText || error || success) && (
          <p
            className={cn(
              'text-xs',
              error && 'text-destructive',
              success && 'text-success',
              !error && !success && 'text-foreground/60'
            )}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    )
  }
)

Switch.displayName = 'Switch'
