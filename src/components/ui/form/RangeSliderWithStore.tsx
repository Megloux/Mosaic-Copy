import { withFormStore } from '@/shared/lib/form-store'
import { RangeSlider } from '@/shared/ui/form/RangeSlider'

/**
 * RangeSlider component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
 * // Connected to form store
 * <RangeSliderWithStore 
 *   formId="workoutSettings" 
 *   name="intensity"
 *   min={1}
 *   max={10}
 * />
 */
export const RangeSliderWithStore = withFormStore(RangeSlider, 'RangeSlider')
