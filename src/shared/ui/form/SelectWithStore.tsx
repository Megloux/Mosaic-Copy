import { withFormStore } from '@/shared/lib'
import { Select } from './Select'

/**
 * Select component connected to the form store
 * Automatically handles value and onChange through the form store
 */
export const SelectWithStore = withFormStore(Select, 'Select')
