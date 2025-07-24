import { withFormStore } from '@/shared/lib'
import { SearchInput } from 'src/shared/ui/form/SearchInput'

/**
 * SearchInput component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
 * // Connected to form store
 * <SearchInputWithStore 
 *   formId="exerciseSearch" 
 *   name="query"
 *   placeholder="Search exercises..."
 * />
 */
export const SearchInputWithStore = withFormStore(SearchInput, 'SearchInput')
