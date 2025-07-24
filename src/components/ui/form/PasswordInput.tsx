import React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/form/Input'
import { StrengthIndicator, type PasswordStrength } from '@/components/ui/form/StrengthIndicator'
import { Eye, EyeOff } from 'lucide-react'
import zxcvbn from 'zxcvbn'

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  /** Current value of the password */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Show password strength indicator */
  showStrength?: boolean
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
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({
    className,
    value,
    onChange,
    showStrength = true,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    
    // Calculate password strength
    const strength = React.useMemo(() => {
      if (!value) return { score: 0, feedback: { suggestions: [] } }
      
      const result = zxcvbn(value)
      return {
        score: result.score,
        feedback: {
          warning: result.feedback.warning,
          suggestions: result.feedback.suggestions
        }
      } as PasswordStrength
    }, [value])

    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback((pattern: number | number[] = 1) => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(pattern)
      }
    }, [enableHaptics])

    // Handle value change
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled || loading) return
      onChange(e.target.value)
      handleHapticFeedback(10)
    }, [disabled, loading, onChange, handleHapticFeedback])

    // Handle focus
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      handleHapticFeedback(15)
      onFocus?.(e)
    }, [onFocus, handleHapticFeedback])

    // Handle blur
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }, [onBlur])

    // Toggle password visibility
    const togglePasswordVisibility = React.useCallback(() => {
      setShowPassword(!showPassword)
      handleHapticFeedback([10, 30])
    }, [showPassword, handleHapticFeedback])

    return (
      <div className={cn('space-y-1.5', className)}>
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
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            error={error}
            success={success}
            className="pr-10"
            {...props}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2',
              'p-1 rounded-md',
              'text-foreground/60 hover:text-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            disabled={disabled || loading}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {showStrength && value && (
          <StrengthIndicator strength={strength} />
        )}
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

PasswordInput.displayName = 'PasswordInput'
