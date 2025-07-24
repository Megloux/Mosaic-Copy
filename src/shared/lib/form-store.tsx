import React from 'react'
import { useFormField, useForm } from '@/store/formStore'

/**
 * Higher-order component that connects a form component to the Zustand form store
 * This allows form components to be used with or without the form store
 */
export function withFormStore(
  Component: React.ComponentType<any>,
  displayName: string
) {
  // Define props for the wrapped component
  interface WithStoreProps {
    formId?: string;
    name?: string;
    value?: any;
    onChange?: any;
    error?: string;
    [key: string]: any;
  }

  const WithFormStore = React.forwardRef<any, WithStoreProps>((props, ref) => {
    const { 
      formId, 
      name, 
      value: propValue, 
      onChange: propOnChange,
      error: propError,
      ...rest 
    } = props;
    
    // If formId is provided, use the form store
    const isConnected = Boolean(formId && name);
    
    // Get field from form store if connected
    const field = isConnected && formId && name
      ? useFormField(formId, name)
      : null;
    
    // Determine value and onChange based on connection status
    const value = isConnected && field ? field.value : propValue;
    
    const handleChange = React.useCallback((newValue: any) => {
      if (isConnected && field) {
        field.setValue(newValue);
      } else if (propOnChange) {
        // Handle different types of onChange handlers
        if (typeof newValue === 'object' && newValue.target) {
          // Handle React.ChangeEvent
          propOnChange(newValue);
        } else {
          // Handle direct value
          propOnChange(newValue);
        }
      }
    }, [isConnected, field, propOnChange]);
    
    // Get error from form store if connected
    const error = isConnected && field ? field.error : propError;
    
    // Pass props to the component
    return <Component 
      {...rest}
      value={value}
      onChange={handleChange}
      error={error}
      ref={ref}
    />;
  });
  
  WithFormStore.displayName = `withFormStore(${displayName})`;
  
  return WithFormStore;
}

// Re-export form hooks for convenience
export { useForm, useFormField };
