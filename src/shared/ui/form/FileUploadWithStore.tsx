import { withFormStore } from '@/shared/lib'
import { FileUpload } from './FileUpload'

/**
 * FileUpload component connected to the form store
 * Automatically handles value and onChange through the form store
 * 
 * @example
 * // Connected to form store
 * <FileUploadWithStore 
 *   formId="profileForm" 
 *   name="avatar"
 *   accept="image/*"
 *   maxSize={5242880} // 5MB
 * />
 */
export const FileUploadWithStore = withFormStore(FileUpload, 'FileUpload')
