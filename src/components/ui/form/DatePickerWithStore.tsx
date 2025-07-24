import { DatePicker } from '@/shared/ui/form/DatePicker'
import { withFormStore } from '@/shared/lib/form-store'

/**
 * DatePicker component connected to the Zustand form store
 * 
 * This component can be used in two ways:
 * 1. Standalone with direct value/onChange props
 * 2. Connected to form store with formId/name props
 * 
 * @example
 * // Standalone usage
 * <DatePickerWithStore value={new Date()} onChange={handleChange} />
 * 
 * // Connected to form store
 * <DatePickerWithStore formId="studioSchedule" name="classDate" />
 * 
 * // Range selection with form store
 * <DatePickerWithStore 
 *   formId="studioSchedule" 
 *   name="classRange" 
 *   enableRangeSelection 
 *   startDateField="startDate"
 *   endDateField="endDate"
 * />
 */

// Define the props for the DatePickerWithStore component
export interface DatePickerWithStoreProps {
  /** Form ID for Zustand store connection */
  formId?: string
  /** Field name in the form */
  name?: string
  /** For range selection - start date field name */
  startDateField?: string
  /** For range selection - end date field name */
  endDateField?: string
  /** Direct value for standalone usage */
  value?: Date
  /** Callback for standalone usage */
  onChange?: (date: Date) => void
  /** For range selection - direct start date */
  startDate?: Date
  /** For range selection - direct end date */
  endDate?: Date
  /** Callback for range selection standalone usage */
  onRangeChange?: (startDate: Date, endDate: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Label for the date picker */
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
}

// Create a wrapper component to handle the conversion between form values and DatePicker props
const DatePickerWrapper = (props: DatePickerWithStoreProps) => {
  const {
    value,
    onChange,
    startDate,
    endDate,
    onRangeChange,
    ...rest
  } = props

  // Handle date value conversion for the DatePicker component
  const handleChange = (date: Date) => {
    if (onChange) {
      onChange(date)
    }
  }

  // Handle range selection
  const handleRangeChange = (start: Date, end: Date) => {
    if (onRangeChange) {
      onRangeChange(start, end)
    }
  }

  return (
    <DatePicker
      value={value}
      onChange={handleChange}
      startDate={startDate}
      endDate={endDate}
      onRangeChange={handleRangeChange}
      {...rest}
    />
  )
}

// Connect the DatePickerWrapper to the form store
export const DatePickerWithStore = withFormStore(DatePickerWrapper, 'DatePicker')
