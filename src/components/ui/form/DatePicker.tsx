import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { format, addDays, isSameDay, isWithinInterval, isBefore, isAfter, startOfWeek, endOfWeek } from 'date-fns'
import { Input } from '@/components/ui/form/Input'
import { motion, AnimatePresence } from 'framer-motion'

const datePickerVariants = cva(
  [
    'absolute left-0 z-50 mt-1 w-full',
    'rounded-lg border border-border bg-background p-4',
    'shadow-lg',
  ].join(' '),
  {
    variants: {
      view: {
        month: '',
        week: 'p-2',
      },
    },
    defaultVariants: {
      view: 'month',
    },
  }
)

// Recurring pattern options
export type RecurringPattern = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly'

// Event indicator type for showing events on the calendar
export interface DateEvent {
  date: Date
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

export interface DatePickerProps extends VariantProps<typeof datePickerVariants> {
  /** Selected date */
  value?: Date
  /** Callback when date changes */
  onChange?: (date: Date) => void
  /** For range selection - start date */
  startDate?: Date
  /** For range selection - end date */
  endDate?: Date
  /** Callback for range selection */
  onRangeChange?: (startDate: Date, endDate: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Label for the date picker */
  label?: string
  /** Helper text to display below the date picker */
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
  /** Format for displaying the date */
  displayFormat?: string
  /** Placeholder text */
  placeholder?: string
  /** Additional class name */
  className?: string
  /** Calendar view mode */
  view?: 'month' | 'week'
  /** Enable range selection */
  enableRangeSelection?: boolean
  /** Enable recurring pattern selection */
  enableRecurring?: boolean
  /** Current recurring pattern */
  recurringPattern?: RecurringPattern
  /** Callback when recurring pattern changes */
  onRecurringPatternChange?: (pattern: RecurringPattern) => void
  /** Event indicators to display on calendar */
  events?: DateEvent[]
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({
    value,
    onChange,
    startDate,
    endDate,
    onRangeChange,
    minDate,
    maxDate,
    label,
    helperText,
    error,
    success,
    enableHaptics = true,
    loading = false,
    disabled,
    displayFormat = 'MM/dd/yyyy',
    placeholder = 'Select date',
    className,
    view: initialView = 'month',
    enableRangeSelection = false,
    enableRecurring = false,
    recurringPattern = 'none',
    onRecurringPatternChange,
    events = [],
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [viewDate, setViewDate] = React.useState(value || new Date())
    const [view, setView] = React.useState(initialView)
    const [rangeSelectionMode, setRangeSelectionMode] = React.useState<'start' | 'end'>(
      startDate && !endDate ? 'end' : 'start'
    )
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Handle haptic feedback with different patterns
    const handleHapticFeedback = React.useCallback((pattern: number | number[] = 10) => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(pattern)
      }
    }, [enableHaptics])

    // Handle date selection
    const handleSelect = React.useCallback((date: Date) => {
      if (enableRangeSelection) {
        if (rangeSelectionMode === 'start') {
          // Set start date
          onRangeChange?.(date, endDate || date)
          setRangeSelectionMode('end')
          handleHapticFeedback(10)
        } else {
          // Set end date
          // Ensure end date is after start date
          if (startDate && isBefore(date, startDate)) {
            onRangeChange?.(date, startDate)
          } else {
            onRangeChange?.(startDate || date, date)
          }
          setRangeSelectionMode('start')
          handleHapticFeedback([10, 30, 10])
          setIsOpen(false)
        }
      } else {
        // Single date selection
        onChange?.(date)
        handleHapticFeedback(10)
        setIsOpen(false)
      }
    }, [enableRangeSelection, rangeSelectionMode, startDate, endDate, onChange, onRangeChange, handleHapticFeedback])

    // Handle recurring pattern change
    const handleRecurringChange = React.useCallback((pattern: RecurringPattern) => {
      onRecurringPatternChange?.(pattern)
      handleHapticFeedback(15)
    }, [onRecurringPatternChange, handleHapticFeedback])

    // Handle click outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Generate calendar grid
    const calendar = React.useMemo(() => {
      if (view === 'week') {
        // Week view - show current week
        const weekStart = startOfWeek(viewDate)
        const days: Date[] = []
        
        for (let i = 0; i < 7; i++) {
          days.push(addDays(weekStart, i))
        }
        
        return days
      } else {
        // Month view
        const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
        const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
        const days: Date[] = []

        // Add previous month days
        const firstDay = start.getDay()
        for (let i = firstDay; i > 0; i--) {
          days.push(
            new Date(viewDate.getFullYear(), viewDate.getMonth(), -i + 1)
          )
        }

        // Add current month days
        for (let i = 1; i <= end.getDate(); i++) {
          days.push(
            new Date(viewDate.getFullYear(), viewDate.getMonth(), i)
          )
        }

        // Add next month days
        const lastDay = end.getDay()
        for (let i = 1; i < 7 - lastDay; i++) {
          days.push(
            new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, i)
          )
        }

        return days
      }
    }, [viewDate, view])

    // Format display value
    const displayValue = React.useMemo(() => {
      if (enableRangeSelection && startDate) {
        if (endDate) {
          return `${format(startDate, displayFormat)} - ${format(endDate, displayFormat)}`
        }
        return `${format(startDate, displayFormat)} - Select end date`
      }
      return value ? format(value, displayFormat) : ''
    }, [value, startDate, endDate, enableRangeSelection, displayFormat])

    return (
      <div className="relative space-y-1.5" ref={containerRef}>
        <Input
          ref={inputRef}
          value={displayValue}
          placeholder={placeholder}
          readOnly
          onClick={() => !disabled && !loading && setIsOpen(true)}
          label={label}
          helperText={helperText}
          error={error}
          success={success}
          loading={loading}
          disabled={disabled}
          className={className}
          {...props}
        />
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={cn(datePickerVariants({ view }))}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1] // iOS spring curve
              }}
            >
              {/* View toggle */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleHapticFeedback()
                      setView('month')
                    }}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      view === 'month' 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground/70 hover:bg-surface-hover"
                    )}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleHapticFeedback()
                      setView('week')
                    }}
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      view === 'week' 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground/70 hover:bg-surface-hover"
                    )}
                  >
                    Week
                  </button>
                </div>
                
                {enableRangeSelection && (
                  <div className="text-xs text-foreground/70">
                    {rangeSelectionMode === 'start' ? 'Select start date' : 'Select end date'}
                  </div>
                )}
              </div>
              
              {/* Calendar header */}
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    handleHapticFeedback()
                    if (view === 'week') {
                      setViewDate(addDays(viewDate, -7))
                    } else {
                      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
                    }
                  }}
                  className="p-1 hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="font-medium">
                  {view === 'week' 
                    ? `${format(startOfWeek(viewDate), 'MMM d')} - ${format(endOfWeek(viewDate), 'MMM d, yyyy')}`
                    : format(viewDate, 'MMMM yyyy')}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleHapticFeedback()
                    if (view === 'week') {
                      setViewDate(addDays(viewDate, 7))
                    } else {
                      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
                    }
                  }}
                  className="p-1 hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Calendar grid */}
              <div className={cn(
                "grid gap-1 text-center text-sm",
                view === 'week' ? "grid-cols-7" : "grid-cols-7"
              )}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div
                    key={day}
                    className="mb-1 font-medium text-foreground/60"
                  >
                    {day}
                  </div>
                ))}
                {calendar.map((date, i) => {
                  const isSelected = value && isSameDay(date, value)
                  const isRangeStart = startDate && isSameDay(date, startDate)
                  const isRangeEnd = endDate && isSameDay(date, endDate)
                  const isInRange = startDate && endDate && 
                    isWithinInterval(date, { start: startDate, end: endDate })
                  const isToday = isSameDay(date, new Date())
                  const isOutsideMonth = date.getMonth() !== viewDate.getMonth()
                  const isDisabled = (
                    (minDate && isBefore(date, minDate)) ||
                    (maxDate && isAfter(date, maxDate))
                  )
                  
                  // Find events for this date
                  const dateEvents = events.filter(event => 
                    isSameDay(event.date, date)
                  )
                  
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative flex flex-col items-center justify-center",
                        view === 'week' ? "p-2" : "p-1",
                        isOutsideMonth && view !== 'week' && "opacity-40"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => !isDisabled && handleSelect(date)}
                        className={cn(
                          'relative flex h-8 w-8 items-center justify-center rounded-full',
                          'transition-colors duration-[var(--motion-natural)]',
                          isSelected && 'bg-primary text-primary-foreground',
                          isRangeStart && 'bg-primary text-primary-foreground',
                          isRangeEnd && 'bg-primary text-primary-foreground',
                          isInRange && !isRangeStart && !isRangeEnd && 'bg-primary/20',
                          isToday && !isSelected && !isRangeStart && !isRangeEnd && 'border border-primary',
                          isDisabled && 'cursor-not-allowed opacity-50',
                          !isSelected && !isRangeStart && !isRangeEnd && !isDisabled && 'hover:bg-surface-hover'
                        )}
                        disabled={isDisabled}
                      >
                        <span className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          isRangeStart && !isRangeEnd && "after:absolute after:right-0 after:h-full after:w-1/2 after:bg-primary/20",
                          isRangeEnd && !isRangeStart && "after:absolute after:left-0 after:h-full after:w-1/2 after:bg-primary/20"
                        )}>
                          {date.getDate()}
                        </span>
                      </button>
                      
                      {/* Event indicators */}
                      {dateEvents.length > 0 && (
                        <div className="mt-1 flex gap-0.5">
                          {dateEvents.slice(0, 3).map((event, idx) => (
                            <div 
                              key={idx}
                              className={cn(
                                "h-1 w-1 rounded-full",
                                event.type === 'primary' && "bg-primary",
                                event.type === 'secondary' && "bg-secondary",
                                event.type === 'success' && "bg-success",
                                event.type === 'warning' && "bg-warning",
                                event.type === 'error' && "bg-error",
                                !event.type && "bg-primary"
                              )}
                            />
                          ))}
                          {dateEvents.length > 3 && (
                            <div className="text-[10px] text-foreground/60">
                              +{dateEvents.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Recurring pattern selection */}
              {enableRecurring && (
                <div className="mt-4 border-t border-border pt-3">
                  <div className="mb-2 text-xs font-medium text-foreground/70">Repeat</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'none', label: 'None' },
                      { value: 'daily', label: 'Daily' },
                      { value: 'weekly', label: 'Weekly' },
                      { value: 'biweekly', label: 'Bi-weekly' },
                      { value: 'monthly', label: 'Monthly' }
                    ].map((pattern) => (
                      <button
                        key={pattern.value}
                        type="button"
                        onClick={() => handleRecurringChange(pattern.value as RecurringPattern)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          recurringPattern === pattern.value 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground/70 hover:bg-surface-hover"
                        )}
                      >
                        {pattern.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'
