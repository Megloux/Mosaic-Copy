import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const selectVariants = cva(
  [
    'w-full',
    'transition-all duration-[var(--motion-natural)]',
    'min-h-[var(--ios-min-touch-target)]',
    'rounded-lg border bg-background px-3 py-2',
    'text-sm text-foreground',
    'focus-visible:outline-none focus-visible:ring-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'appearance-none',
    'bg-no-repeat bg-right',
    '[background-position:right_0.5rem_center]',
    '[background-size:1.5em_1.5em]',
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
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  /** Label for the select */
  label?: string
  /** Helper text to display below the select */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean
  /** Loading state */
  loading?: boolean
  /** Options for the select */
  options: SelectOption[]
  /** Placeholder text */
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    label,
    helperText,
    error,
    success,
    variant = error ? 'error' : success ? 'success' : 'default',
    enableHaptics = true,
    loading = false,
    options,
    placeholder,
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
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
      handleHapticFeedback()
      onChange?.(e)
    }, [onChange, handleHapticFeedback])

    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
      handleHapticFeedback()
      onFocus?.(e)
    }, [onFocus, handleHapticFeedback])

    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLSelectElement>) => {
      handleHapticFeedback()
      onBlur?.(e)
    }, [onBlur, handleHapticFeedback])

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
          <select
            ref={ref}
            className={cn(
              selectVariants({ variant }),
              className
            )}
            disabled={disabled || loading}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {loading && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2">
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

Select.displayName = 'Select'
