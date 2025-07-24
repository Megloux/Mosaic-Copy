import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { Input } from '@/shared/ui/form/Input'
import { formatTimeInput, timeToSeconds, secondsToTime } from '@/shared/lib/utils/timeFormat'

const timeInputVariants = cva(
  [
    'relative w-full',
    'transition-all duration-[var(--motion-natural)]',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'w-16',
        md: 'w-20',
        lg: 'w-24',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface TimeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'>,
    VariantProps<typeof timeInputVariants> {
  /** Value in MM:SS format */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Label for the input */
  label?: string
  /** Helper text */
  helperText?: string
  /** Error message */
  error?: string
  /** Success message */
  success?: string
  /** Enable haptic feedback */
  enableHaptics?: boolean
  /** Loading state */
  loading?: boolean
  /** Maximum time in seconds */
  maxTimeSeconds?: number
  /** Enable scrubbing */
  allowScrubbing?: boolean
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({
    className,
    size,
    value = "00:00",
    onChange,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    maxTimeSeconds = 0,
    allowScrubbing = true,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [touchStartY, setTouchStartY] = React.useState<number | null>(null)
    const [scrubStartValue, setScrubStartValue] = React.useState<number>(0)
    const [isScrubbing, setIsScrubbing] = React.useState(false)

    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback((pattern: number | number[] = 1) => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(pattern)
      }
    }, [enableHaptics])

    // Handle value change
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || loading) return
      
      let formattedTime = formatTimeInput(e.target.value)
      
      // Apply maximum time constraint
      if (maxTimeSeconds > 0) {
        const timeInSeconds = timeToSeconds(formattedTime)
        if (timeInSeconds > maxTimeSeconds) {
          formattedTime = secondsToTime(maxTimeSeconds)
        }
      }
      
      onChange(formattedTime)
      handleHapticFeedback(10)
    }, [disabled, loading, maxTimeSeconds, onChange, handleHapticFeedback])

    // Handle focus
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
      handleHapticFeedback(15)
      onFocus?.(e)
    }, [onFocus, handleHapticFeedback])

    // Handle blur
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      if (!value || value === ':') {
        onChange('00:00')
      }
      onBlur?.(e)
    }, [value, onChange, onBlur])

    // Handle scrubbing
    const handleTouchStart = React.useCallback((e: React.TouchEvent<HTMLInputElement>) => {
      if (!allowScrubbing || disabled || loading) return
      
      setTouchStartY(e.touches[0].clientY)
      setScrubStartValue(timeToSeconds(value))
      setIsScrubbing(true)
      handleHapticFeedback(20)
    }, [allowScrubbing, disabled, loading, value, handleHapticFeedback])

    const handleTouchMove = React.useCallback((e: React.TouchEvent<HTMLInputElement>) => {
      if (!isScrubbing || touchStartY === null || disabled || loading) return
      
      e.preventDefault()
      
      const touchDelta = touchStartY - e.touches[0].clientY
      const sensitivityFactor = 0.5
      const secondsDelta = Math.round(touchDelta * sensitivityFactor)
      
      let newSeconds = scrubStartValue + secondsDelta
      newSeconds = Math.max(0, newSeconds)
      
      if (maxTimeSeconds > 0) {
        newSeconds = Math.min(newSeconds, maxTimeSeconds)
      }
      
      onChange(secondsToTime(newSeconds))
      
      // Haptic feedback on 5-second intervals
      if (newSeconds % 5 === 0) {
        handleHapticFeedback(5)
      }
    }, [
      isScrubbing,
      touchStartY,
      disabled,
      loading,
      scrubStartValue,
      maxTimeSeconds,
      onChange,
      handleHapticFeedback,
    ])

    const handleTouchEnd = React.useCallback(() => {
      if (!isScrubbing) return
      
      setIsScrubbing(false)
      setTouchStartY(null)
      handleHapticFeedback([10, 30, 10])
    }, [isScrubbing, handleHapticFeedback])

    // Handle keyboard
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled || loading) return
      
      let currentSeconds = timeToSeconds(value)
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        
        const delta = e.key === 'ArrowUp' ? 1 : -1
        const step = e.shiftKey ? 60 : 5
        
        currentSeconds += delta * step
        currentSeconds = Math.max(0, currentSeconds)
        
        if (maxTimeSeconds > 0) {
          currentSeconds = Math.min(currentSeconds, maxTimeSeconds)
        }
        
        onChange(secondsToTime(currentSeconds))
        handleHapticFeedback(10)
      }
    }, [disabled, loading, value, maxTimeSeconds, onChange, handleHapticFeedback])

    // Handle double click to reset
    const handleDoubleClick = React.useCallback(() => {
      if (disabled || loading) return
      onChange('00:00')
      handleHapticFeedback([10, 30, 10])
    }, [disabled, loading, onChange, handleHapticFeedback])

    return (
      <div className={cn(timeInputVariants({ size }), className)}>
        {label && (
          <div
            className={cn(
              'text-sm font-medium leading-none',
              disabled && 'cursor-not-allowed opacity-50',
              error && 'text-destructive',
              success && 'text-success'
            )}
          >
            {label}
          </div>
        )}
        <div className="relative mt-1.5">
          <Input
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            onDoubleClick={handleDoubleClick}
            disabled={disabled || loading}
            error={error}
            success={success}
            className={cn(
              'font-mono text-right',
              isScrubbing && 'cursor-ns-resize',
              allowScrubbing && 'pr-6'
            )}
            {...props}
          />
          {allowScrubbing && !disabled && !loading && (
            <motion.div
              className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/40"
              animate={isScrubbing ? { scale: 1.2 } : { scale: 1 }}
            >
              ⋮
            </motion.div>
          )}
        </div>
        {(helperText || error || success) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
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

TimeInput.displayName = 'TimeInput'
