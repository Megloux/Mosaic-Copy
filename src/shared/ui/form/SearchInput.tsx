import React from 'react'
import { cn } from '@/shared/lib/utils'
import { Input, type InputProps } from './Input'
import { Search } from 'lucide-react'

export interface SearchInputProps extends Omit<InputProps, 'type' | 'clearButtonContent'> {
  /** Debounce delay in milliseconds */
  debounceMs?: number
  /** Callback when search is triggered */
  onSearch?: (value: string) => void
  /** Placeholder text */
  placeholder?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    className,
    debounceMs = 300,
    onChange,
    onSearch,
    enableHaptics = true,
    placeholder = 'Search...',
    onClear,
    onFocus,
    onBlur,
    ...props
  }, ref) => {
    const [debouncedValue, setDebouncedValue] = React.useState('')
    const [isFocused, setIsFocused] = React.useState(false)
    const debounceTimeout = React.useRef<NodeJS.Timeout>()
    
    // Handle haptic feedback
    const handleHapticFeedback = React.useCallback((pattern: number | number[] = 1) => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(pattern)
      }
    }, [enableHaptics])

    // Handle debounced search
    React.useEffect(() => {
      if (debouncedValue !== props.value) {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }

        debounceTimeout.current = setTimeout(() => {
          onSearch?.(debouncedValue)
          if (debouncedValue) {
            handleHapticFeedback(10) // Light haptic feedback when search is triggered
          }
        }, debounceMs)
      }

      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }
      }
    }, [debouncedValue, debounceMs, onSearch, props.value, handleHapticFeedback])

    // Handle change with debounce
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setDebouncedValue(e.target.value)
      onChange?.(e)
    }, [onChange])

    // Handle focus
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      handleHapticFeedback(15) // Medium haptic feedback on focus
      onFocus?.(e)
    }, [onFocus, handleHapticFeedback])

    // Handle blur
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }, [onBlur])

    // Handle clear
    const handleClear = React.useCallback(() => {
      handleHapticFeedback([10, 30, 10]) // Pattern haptic feedback on clear
      onClear?.()
    }, [onClear, handleHapticFeedback])

    // Handle keyboard shortcuts
    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      // Clear on Escape
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClear()
      }
      
      // Submit on Enter
      if (e.key === 'Enter') {
        e.preventDefault()
        onSearch?.(debouncedValue)
        handleHapticFeedback(20) // Stronger haptic feedback on search submission
      }
    }, [debouncedValue, onSearch, handleClear, handleHapticFeedback])

    return (
      <Input
        ref={ref}
        type="search"
        className={cn(
          'pl-9 transition-all duration-200',
          isFocused && 'ring-2 ring-primary/20',
          className
        )}
        clearable
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search"
        onClear={handleClear}
        clearButtonContent={
          <span className="flex h-4 w-4 items-center justify-center">×</span>
        }
        {...props}
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search 
            className={cn(
              "h-4 w-4 transition-colors duration-200",
              isFocused ? "text-primary" : "text-foreground/60"
            )}
          />
        </div>
      </Input>
    )
  }
)

SearchInput.displayName = 'SearchInput'
