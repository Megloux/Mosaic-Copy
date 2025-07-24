import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'

const checkboxGroupVariants = cva('flex gap-2', {
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

const checkboxVariants = cva(
  [
    'group relative flex cursor-pointer items-center',
    'min-h-[var(--ios-min-touch-target)]',
    'touch-none select-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' ')
)

export interface CheckboxOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface CheckboxGroupProps extends VariantProps<typeof checkboxGroupVariants> {
  /** Name for the checkbox group */
  name: string
  /** Options for the checkbox group */
  options: CheckboxOption[]
  /** Currently selected values */
  value?: (string | number)[]
  /** Callback when selection changes */
  onChange?: (value: (string | number)[]) => void
  /** Label for the checkbox group */
  label?: string
  /** Helper text to display below the checkbox group */
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

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({
    name,
    options,
    value = [],
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
    const handleChange = React.useCallback((optionValue: string | number) => {
      if (disabled || loading) return
      handleHapticFeedback()
      
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
      
      onChange?.(newValue)
    }, [value, disabled, loading, onChange, handleHapticFeedback])

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
          role="group"
          className={cn(
            checkboxGroupVariants({ orientation }),
            className
          )}
        >
          {options.map((option) => {
            const isChecked = value.includes(option.value)
            const isDisabled = disabled || loading || option.disabled

            return (
              <label
                key={option.value}
                className={checkboxVariants()}
              >
                <div
                  className={cn(
                    'relative flex h-4 w-4 shrink-0 rounded',
                    'border border-primary',
                    isChecked && 'bg-primary',
                    error && 'border-destructive bg-destructive',
                    success && 'border-success bg-success'
                  )}
                >
                  <input
                    type="checkbox"
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleChange(option.value)}
                    className="sr-only"
                  />
                  {isChecked && (
                    <motion.svg
                      className="absolute inset-0 h-full w-full stroke-white p-[2px]"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      }}
                      viewBox="0 0 15 15"
                    >
                      <path
                        d="M3.5 7.5L6.5 10.5L12 5"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  )}
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

CheckboxGroup.displayName = 'CheckboxGroup'
