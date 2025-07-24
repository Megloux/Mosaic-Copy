import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const radioGroupVariants = cva('flex gap-2', {
  variants: {
    orientation: {
      horizontal: 'flex-row flex-wrap',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

const radioVariants = cva(
  [
    'group relative flex cursor-pointer items-center',
    'min-h-[var(--ios-min-touch-target)]',
    'touch-none select-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' ')
)

export interface RadioOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface RadioGroupProps extends VariantProps<typeof radioGroupVariants> {
  /** Name for the radio group */
  name: string
  /** Options for the radio group */
  options: RadioOption[]
  /** Currently selected value */
  value?: string | number
  /** Callback when selection changes */
  onChange?: (value: string | number) => void
  /** Label for the radio group */
  label?: string
  /** Helper text to display below the radio group */
  helperText?: string
  /** Error message to display */
  error?: string
  /** Success message to display */
  success?: string
  /** Whether to enable haptic feedback */
  enableHaptics?: boolean
  /** Loading state */
  loading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({
    name,
    options,
    value,
    onChange,
    orientation,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    className,
    ...props
  }, ref) => {
    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback(() => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(2) // Light vibration
      }
    }, [enableHaptics])

    // Handle change
    const handleChange = React.useCallback((newValue: string | number) => {
      if (disabled || loading) return
      handleHapticFeedback()
      onChange?.(newValue)
    }, [disabled, loading, onChange, handleHapticFeedback])

    return (
      <div className="space-y-1.5" ref={ref} {...props}>
        {label && (
          <div
            className={cn(
              'text-sm font-medium',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'text-destructive',
              success && 'text-success'
            )}
          >
            {label}
          </div>
        )}
        <div
          role="radiogroup"
          className={cn(
            radioGroupVariants({ orientation }),
            className
          )}
        >
          {options.map((option) => {
            const isChecked = value === option.value
            const isDisabled = disabled || loading || option.disabled

            return (
              <label
                key={option.value}
                className={radioVariants()}
              >
                <div className="relative flex h-4 w-4 shrink-0 rounded-full border border-primary">
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleChange(option.value)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full',
                      'transition-transform duration-[var(--motion-natural)]',
                      isChecked && 'scale-[0.8] bg-primary',
                      error && 'border-destructive bg-destructive',
                      success && 'border-success bg-success'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'ml-2 text-sm',
                    isDisabled && 'opacity-50'
                  )}
                >
                  {option.label}
                </span>
              </label>
            )
          })}
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

RadioGroup.displayName = 'RadioGroup'
