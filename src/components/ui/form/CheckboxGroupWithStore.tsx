import { withFormStore } from '@/shared/lib/form-store'
import { CheckboxGroup } from '@/shared/ui/form/CheckboxGroup';

/**
 * CheckboxGroup component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
 * // Connected to form store
 * <CheckboxGroupWithStore 
 *   formId="studioForm" 
 *   name="categories"
 *   options={[
 *     { label: 'Strength', value: 'strength' },
 *     { label: 'Cardio', value: 'cardio' },
 *   ]}
 * />
 */
export const CheckboxGroupWithStore = withFormStore(CheckboxGroup, 'CheckboxGroup')
