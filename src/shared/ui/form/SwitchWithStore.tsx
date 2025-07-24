import { withFormStore } from '@/shared/lib'
import { Switch } from 'src/shared/ui/form/Switch'

/**
 * Switch component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
 * // Connected to form store
 * <SwitchWithStore formId="userPreferences" name="darkMode" />
 */
export const SwitchWithStore = withFormStore(Switch, 'Switch')
