import { withFormStore } from '@/shared/lib'
import { DatePicker } from './DatePicker';

/**
 * DatePicker component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
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
export const DatePickerWithStore = withFormStore(DatePicker, 'DatePicker')
