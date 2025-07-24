import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva } from 'class-variance-authority'
import { motion, useMotionValue, useTransform } from 'framer-motion'

const sliderVariants = cva(
  [
    'relative flex w-full touch-none select-none items-center',
    'min-h-[var(--ios-min-touch-target)]',
  ].join(' ')
)

export interface RangeSliderProps {
  /** Current value */
  value: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step value */
  step?: number
  /** Callback when value changes */
  onChange?: (value: number) => void
  /** Callback when user starts dragging */
  onDragStart?: () => void
  /** Callback when user stops dragging */
  onDragEnd?: () => void
  /** Label for the slider */
  label?: string
  /** Helper text to display below the slider */
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
  /** Show value label */
  showValue?: boolean
  /** Format value label */
  formatValue?: (value: number) => string
  /** Additional class name */
  className?: string
}

export const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  ({
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    onDragStart,
    onDragEnd,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    showValue = true,
    formatValue = (v) => v.toString(),
    className,
    ...props
  }, ref) => {
    // Motion values for smooth animations
    const dragX = useMotionValue(0)
    const percent = useTransform(dragX, [0, 100], [0, 100])
    
    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback(() => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(1) // Very light vibration
      }
    }, [enableHaptics])

    // Convert percent to value
    const percentToValue = React.useCallback((percent: number) => {
      const range = max - min
      const rawValue = (percent / 100) * range + min
      return Math.round(rawValue / step) * step
    }, [max, min, step])

    // Convert value to percent
    const valueToPercent = React.useCallback((value: number) => {
      return ((value - min) / (max - min)) * 100
    }, [max, min])

    // Update value when dragging
    React.useEffect(() => {
      const unsubscribe = percent.onChange((latest) => {
        const newValue = percentToValue(latest)
        if (newValue !== value) {
          handleHapticFeedback()
          onChange?.(newValue)
        }
      })
      return () => unsubscribe()
    }, [percent, value, onChange, percentToValue, handleHapticFeedback])

    // Set initial position
    React.useEffect(() => {
      dragX.set(valueToPercent(value))
    }, [dragX, value, valueToPercent])

    return (
      <div className="space-y-1.5" ref={ref} {...props}>
        <div className="flex items-center justify-between">
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
          {showValue && (
            <div className="text-sm text-foreground/60">
              {formatValue(value)}
            </div>
          )}
        </div>
        <motion.div
          className={cn(
            sliderVariants(),
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          {/* Track */}
          <div
            className={cn(
              'relative h-1.5 w-full rounded-full',
              'bg-surface-hover'
            )}
          >
            {/* Active track */}
            <motion.div
              className={cn(
                'absolute h-full rounded-full',
                'bg-primary',
                error && 'bg-destructive',
                success && 'bg-success'
              )}
              style={{ width: percent }}
            />
          </div>
          {/* Thumb */}
          <motion.div
            className={cn(
              'absolute top-1/2 h-4 w-4',
              'rounded-full bg-white shadow-lg ring-0',
              'touch-none cursor-grab active:cursor-grabbing',
              disabled && 'cursor-not-allowed'
            )}
            style={{
              x: dragX,
              y: '-50%',
            }}
            drag="x"
            dragConstraints={{
              left: 0,
              right: 100,
            }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={() => {
              handleHapticFeedback()
              onDragStart?.()
            }}
            onDragEnd={() => {
              handleHapticFeedback()
              onDragEnd?.()
            }}
          />
        </motion.div>
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

RangeSlider.displayName = 'RangeSlider'
