import { withFormStore } from '@/shared/lib'
import { RadioGroup } from 'src/shared/ui/form/RadioGroup'

/**
 * RadioGroup component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
 * // Connected to form store
 * <RadioGroupWithStore 
 *   formId="routineForm" 
 *   name="type"
 *   options={[
 *     { label: 'Workout', value: 'workout' },
 *     { label: 'Stretch', value: 'stretch' },
 *   ]}
 * />
 */
export const RadioGroupWithStore = withFormStore(RadioGroup, 'RadioGroup')
