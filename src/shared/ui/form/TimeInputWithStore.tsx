import { withFormStore } from '@/shared/lib'
import { TimeInput } from './TimeInput'

/**
 * TimeInput component connected to the form store
 * Automatically handles value and onChange through the form store
 */
export const TimeInputWithStore = withFormStore(TimeInput, 'TimeInput')
