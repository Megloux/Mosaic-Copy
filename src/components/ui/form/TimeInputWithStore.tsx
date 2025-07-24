import { withFormStore } from '@/shared/lib/form-store'
import { TimeInput } from '@/shared/ui/form/TimeInput'

/**
 * TimeInput component connected to the form store
 * Automatically handles value and onChange through the form store
 */
export const TimeInputWithStore = withFormStore(TimeInput, 'TimeInput')
