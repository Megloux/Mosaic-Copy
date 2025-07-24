import React from 'react'
import { useFormField, useForm } from '@/store/formStore'

/**
 * Higher-order component that connects a form component to the Zustand form store
 * This allows form components to be used with or without the form store
 */
export function withFormStore<P extends { 
  value: any; 
  onChange: (value: any) => void;
  error?: string;
  [key: string]: any; 
}>(
  Component: React.ComponentType<P>,
  displayName: string
) {
  type WithStoreProps = Omit<P, 'value' | 'onChange'> & {
    formId?: string;
    name?: string;
    value?: P['value'];
    onChange?: P['onChange'];
  };

  const WithFormStore = React.forwardRef<any, WithStoreProps>((props, ref) => {
    const formId = props.formId;
    const name = props.name;
    const propValue = props.value;
    const propOnChange = props.onChange;
    
    // Remove these props before passing the rest to the component
    const { formId: _, name: __, value: ___, onChange: ____, ...rest } = props;
    
    // If formId is provided, use the form store
    const isConnected = Boolean(formId && name);
    
    // Get field from form store if connected
    const field = isConnected && formId && name
      ? useFormField(formId, name)
      : null;
      
    // Get form from form store if connected
    const form = isConnected && formId
      ? useForm(formId)
      : null;
    
    // Determine value and onChange based on connection status
    const value = isConnected && field ? field.value : propValue;
    
    const handleChange = React.useCallback((newValue: any) => {
      if (isConnected && field) {
        field.setValue(newValue);
        field.setTouched(true);
        propOnChange?.(newValue);
      } else {
        propOnChange?.(newValue);
      }
    }, [isConnected, field, propOnChange]);
    
    // Determine error message
    const error = isConnected && field ? field.error : (rest as any).error;
    
    // Determine loading state
    const loading = isConnected && form ? form.isSubmitting : (rest as any).loading;
    
    // Cast the component props to the expected type
    const componentProps = {
      value,
      onChange: handleChange,
      error,
      loading,
      name, 
      ...rest
    } as unknown as P;
    
    return <Component ref={ref} {...componentProps} />;
  });
  
  WithFormStore.displayName = `withFormStore(${displayName})`;
  
  return WithFormStore;
}
