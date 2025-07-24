import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const inputVariants = cva(
  [
    'w-full',
    'transition-all duration-[var(--motion-natural)]',
    'min-h-[var(--ios-min-touch-target)]',
    'rounded-lg border bg-background px-3 py-2',
    'text-sm text-foreground',
    'placeholder:text-foreground/60',
    'focus-visible:outline-none focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'border-border',
          'focus-visible:border-primary',
          'focus-visible:ring-primary/20',
        ],
        error: [
          'border-destructive',
          'focus-visible:border-destructive',
          'focus-visible:ring-destructive/20',
        ],
        success: [
          'border-success',
          'focus-visible:border-success',
          'focus-visible:ring-success/20',
        ],
      },
      // iOS-style clear button
      clearable: {
        true: 'pr-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      clearable: false,
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Label for the input */
  label?: string
  /** Helper text to display below the input */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean
  /** Loading state */
  loading?: boolean
  /** Custom clear button content */
  clearButtonContent?: React.ReactNode
  /** Callback when clear button is clicked */
  onClear?: () => void
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    label,
    helperText,
    error,
    success,
    variant = error ? 'error' : success ? 'success' : 'default',
    clearable,
    clearButtonContent,
    enableHaptics = true,
    loading = false,
    onClear,
    onChange,
    onFocus,
    onBlur,
    disabled,
    ...props
  }, ref) => {
    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback(() => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(1) // Very subtle vibration
      }
    }, [enableHaptics])

    // Enhanced event handlers
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      handleHapticFeedback()
      onChange?.(e)
    }, [onChange, handleHapticFeedback])

    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      handleHapticFeedback()
      onFocus?.(e)
    }, [onFocus, handleHapticFeedback])

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      handleHapticFeedback()
      onBlur?.(e)
    }, [onBlur, handleHapticFeedback])

    const handleClear = React.useCallback(() => {
      if (disabled || loading) return
      handleHapticFeedback()
      onClear?.()
    }, [disabled, loading, onClear, handleHapticFeedback])

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            className={cn(
              'text-sm font-medium leading-none',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'text-destructive',
              success && 'text-success'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={cn(
              inputVariants({ variant, clearable }),
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          {clearable && props.value && !disabled && !loading && (
            <button
              type="button"
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'p-1 opacity-60 transition-opacity',
                'hover:opacity-100',
                'focus:outline-none focus:ring-2',
                'focus:ring-primary/20',
                'disabled:cursor-not-allowed disabled:opacity-30'
              )}
              onClick={handleClear}
              disabled={disabled || loading}
            >
              {clearButtonContent || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              )}
            </button>
          )}
          {loading && (
            <div
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                clearable && props.value ? 'right-8' : 'right-2'
              )}
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
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

Input.displayName = 'Input'
