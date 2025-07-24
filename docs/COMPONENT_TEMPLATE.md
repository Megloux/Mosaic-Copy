# Mosaic Component Template

This document provides a standardized template for creating new components in the Mosaic project. Following these patterns will ensure consistency across the codebase and prevent build errors.

## Basic Component Template

```tsx
import React from 'react'
import { cn } from '@/lib/utils'

// Import other components using named imports and absolute paths
import { SomeOtherComponent } from '@/components/path/to/SomeOtherComponent'

// Define component props interface with ComponentNameProps naming convention
export interface ExampleComponentProps {
  /** Add JSDoc comments for props */
  label: string
  /** Optional props should be marked with ? */
  description?: string
  /** Include type information */
  items: string[]
  /** Document callback props */
  onItemSelect: (item: string) => void
  /** Document boolean flags */
  isLoading?: boolean
  /** Document className for styling customization */
  className?: string
}

/**
 * ExampleComponent - Brief description of what this component does
 * 
 * Longer description if needed. Include usage examples or important notes.
 */
export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  label,
  description,
  items,
  onItemSelect,
  isLoading = false, // Default values for optional props
  className,
}) => {
  // Component implementation
  return (
    <div className={cn('example-component', className)}>
      <h3>{label}</h3>
      {description && <p>{description}</p>}
      
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item} onClick={() => onItemSelect(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Set displayName for debugging
ExampleComponent.displayName = 'ExampleComponent'
```

## Component with Forwarded Ref

```tsx
import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ExampleInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Add JSDoc comments for additional props */
  label?: string
  /** Error message */
  error?: string
  /** Helper text */
  helperText?: string
}

/**
 * ExampleInput - An input component with forwarded ref
 */
export const ExampleInput = forwardRef<HTMLInputElement, ExampleInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="example-input-container">
        {label && <label>{label}</label>}
        <input
          ref={ref}
          className={cn('example-input', error && 'error', className)}
          {...props}
        />
        {helperText && <p className="helper-text">{helperText}</p>}
        {error && <p className="error-text">{error}</p>}
      </div>
    )
  }
)

// Set displayName for debugging
ExampleInput.displayName = 'ExampleInput'
```

## Component with Children

```tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface ExampleContainerProps {
  /** Title for the container */
  title: string
  /** Optional description */
  description?: string
  /** Children elements */
  children: React.ReactNode
  /** Additional class name */
  className?: string
}

/**
 * ExampleContainer - A container component that accepts children
 */
export const ExampleContainer: React.FC<ExampleContainerProps> = ({
  title,
  description,
  children,
  className,
}) => {
  return (
    <div className={cn('example-container', className)}>
      <div className="example-container-header">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className="example-container-content">
        {children}
      </div>
    </div>
  )
}

// Set displayName for debugging
ExampleContainer.displayName = 'ExampleContainer'
```

## Test File Template

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ExampleComponent } from '@/components/path/to/ExampleComponent'

describe('ExampleComponent', () => {
  const mockOnItemSelect = jest.fn()
  const defaultProps = {
    label: 'Example Label',
    items: ['Item 1', 'Item 2', 'Item 3'],
    onItemSelect: mockOnItemSelect,
  }

  beforeEach(() => {
    mockOnItemSelect.mockClear()
  })

  it('renders correctly with required props', () => {
    render(<ExampleComponent {...defaultProps} />)
    
    expect(screen.getByText('Example Label')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(
      <ExampleComponent 
        {...defaultProps} 
        description="This is a description" 
      />
    )
    
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('shows loading state when isLoading is true', () => {
    render(<ExampleComponent {...defaultProps} isLoading />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Item 1')).not.toBeInTheDocument()
  })

  it('calls onItemSelect when an item is clicked', () => {
    render(<ExampleComponent {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Item 2'))
    
    expect(mockOnItemSelect).toHaveBeenCalledWith('Item 2')
  })
})
```

## Import/Export Standards

1. **Always use named exports for components**:
   ```tsx
   // ✅ Good
   export const MyComponent = () => { /* ... */ }
   
   // ❌ Bad
   const MyComponent = () => { /* ... */ }
   export default MyComponent
   ```

2. **Always use absolute imports with @/ prefix**:
   ```tsx
   // ✅ Good
   import { Button } from '@/components/ui/Button'
   
   // ❌ Bad
   import Button from '../../components/ui/Button'
   ```

3. **Always use named imports for components**:
   ```tsx
   // ✅ Good
   import { Button } from '@/components/ui/Button'
   
   // ❌ Bad
   import Button from '@/components/ui/Button'
   ```

4. **Use PascalCase for component names**:
   ```tsx
   // ✅ Good
   export const UserProfile = () => { /* ... */ }
   
   // ❌ Bad
   export const userProfile = () => { /* ... */ }
   ```

5. **Use ComponentNameProps naming convention for props interfaces**:
   ```tsx
   // ✅ Good
   export interface ButtonProps { /* ... */ }
   
   // ❌ Bad
   export interface IButton { /* ... */ }
   ```

## Common Pitfalls

1. **Circular Dependencies**: Be careful not to create circular dependencies between components. If Component A imports Component B and Component B imports Component A, this creates a circular dependency that can cause build errors.

2. **Re-exports in Barrel Files**: When using barrel files (index.ts) to re-export components, make sure to update these when changing from default to named exports:
   ```tsx
   // Before (with default exports)
   export { default as Button } from './Button'
   
   // After (with named exports)
   export { Button } from './Button'
   ```

3. **Higher-Order Components**: When using HOCs, make sure to export the wrapped component as a named export:
   ```tsx
   // ✅ Good
   export const EnhancedComponent = withSomeHOC(BaseComponent)
   
   // ❌ Bad
   export default withSomeHOC(BaseComponent)
   ```

4. **Test Files**: Don't forget to update test files when changing component exports. Test files often import the components they're testing, so they need to be updated to use the new named import syntax.
