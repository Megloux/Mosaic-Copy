import { withFormStore } from '@/shared/lib/form-store'
import { Input } from '@/shared/ui/form/Input';

/**
 * Input component connected to the form store
 * Automatically handles value and onChange through the form store
 */
export const InputWithStore = withFormStore(Input, 'Input')
