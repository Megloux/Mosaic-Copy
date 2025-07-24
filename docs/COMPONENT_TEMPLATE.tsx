import React from 'react';

// Import dependencies from external libraries
import { SomeLibrary } from 'some-library';

// Import internal components using absolute paths
import { AnotherComponent } from '@/components/ui/AnotherComponent';
import { HelperComponent } from '@/components/ui/HelperComponent';

// Import types and utilities
import { SomeType } from '@/types/someType';
import { cn } from '@/lib/utils';

// Define component props interface
interface ComponentNameProps {
  /** Primary content or value */
  value: string;
  
  /** Optional secondary content */
  secondaryContent?: string;
  
  /** Handler for value changes */
  onChange: (value: string) => void;
  
  /** Optional error message */
  error?: string;
  
  /** Optional CSS class names */
  className?: string;
}

/**
 * ComponentName
 * 
 * Description of what this component does and when to use it.
 * Include any important usage notes or constraints.
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  value,
  secondaryContent = '',
  onChange,
  error,
  className = ''
}) => {
  // Component state
  const [internalState, setInternalState] = React.useState(value);
  
  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalState(e.target.value);
    onChange(e.target.value);
  };
  
  // Render component
  return (
    <div className={cn('component-base-class', className)}>
      {/* Component JSX */}
      <input 
        type="text"
        value={internalState}
        onChange={handleChange}
        aria-invalid={!!error}
      />
      
      {/* Conditional rendering example */}
      {error && (
        <div className="error-message">{error}</div>
      )}
      
      {/* Using other components */}
      <AnotherComponent />
    </div>
  );
};
