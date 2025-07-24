# Zustand Form Component Integration Guide

This guide explains how form components in the Mosaic application integrate with Zustand for state management, providing a consistent pattern for handling form state across the application.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Form Store Architecture](#form-store-architecture)
3. [Integration Patterns](#integration-patterns)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Offline Support](#offline-support)
7. [Testing Connected Components](#testing-connected-components)

## Core Principles

Our form component integration with Zustand follows these core principles:

1. **Separation of Concerns**: Base form components remain pure UI components, while store-connected versions handle state management.
2. **Flexibility**: Components can be used with or without the Zustand store.
3. **Consistency**: All form components follow the same integration pattern.
4. **Performance**: State updates are optimized to prevent unnecessary re-renders.
5. **Type Safety**: Full TypeScript support throughout the integration.
6. **Persistence**: Form state can be persisted across sessions when needed.

## Form Store Architecture

The form state management is built on a central Zustand store that handles:

- Form field values
- Validation state
- Error messages
- Touch/dirty state
- Form submission state

### Key Store Features

```typescript
// Core form state interfaces
interface FormField {
  value: FormValue
  error?: string
  touched: boolean
  dirty: boolean
  valid: boolean
}

interface FormState {
  // Data
  forms: Record<string, Record<string, FormField>>
  
  // Status
  isSubmitting: Record<string, boolean>
  submitCount: Record<string, number>
  
  // Actions
  registerForm: (formId: string) => void
  setField: (formId: string, fieldName: string, value: FormValue) => void
  // ... other actions
}
```

## Integration Patterns

### 1. Higher-Order Component (HOC) Pattern

We use a `withFormStore` HOC to connect form components to the Zustand store:

```typescript
// Example of connecting a component to the form store
const TimeInputWithStore = withFormStore(TimeInput, 'TimeInput')
```

This HOC:
- Handles the connection to the form store
- Manages value and onChange props
- Passes through other props to the base component
- Provides error and loading states

### 2. Direct Hook Usage

For more complex forms or custom components, you can use the form hooks directly:

```typescript
// Using form hooks directly
const { value, error, setValue, setTouched } = useFormField('myForm', 'fieldName')
const { isSubmitting, resetForm, isValid } = useForm('myForm')
```

## Usage Examples

### Basic Form Component Usage

```tsx
// Standalone usage (without Zustand)
<TimeInput 
  value="01:30" 
  onChange={handleChange} 
  maxTimeSeconds={300} 
/>

// Connected to Zustand store
<TimeInputWithStore 
  formId="exerciseForm" 
  name="duration" 
  maxTimeSeconds={300} 
/>
```

### Complete Form Example

```tsx
import { useForm } from '@/store/formStore'
import { TimeInputWithStore, InputWithStore, SelectWithStore } from '@/components/ui/form'

const ExerciseForm = () => {
  const formId = 'exerciseForm'
  const form = useForm(formId)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.isValid()) {
      return
    }
    
    form.setSubmitting(true)
    
    try {
      const values = form.getValues()
      await saveExercise(values)
      form.resetForm()
    } catch (error) {
      console.error('Failed to save exercise:', error)
    } finally {
      form.setSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <InputWithStore
        formId={formId}
        name="name"
        label="Exercise Name"
        required
      />
      
      <SelectWithStore
        formId={formId}
        name="category"
        label="Category"
      >
        <option value="strength">Strength</option>
        <option value="cardio">Cardio</option>
      </SelectWithStore>
      
      <TimeInputWithStore
        formId={formId}
        name="duration"
        label="Duration"
        maxTimeSeconds={3600}
      />
      
      <button 
        type="submit" 
        disabled={form.isSubmitting || !form.isDirty()}
      >
        {form.isSubmitting ? 'Saving...' : 'Save Exercise'}
      </button>
    </form>
  )
}
```

## Best Practices

### 1. State Selection

To prevent unnecessary re-renders, be specific about which parts of the form state you select:

```typescript
// Good: Only select what you need
const isSubmitting = useFormStore(state => state.isSubmitting[formId])

// Bad: Selecting the entire state
const formStore = useFormStore()
const isSubmitting = formStore.isSubmitting[formId]
```

### 2. Form IDs

Use consistent, descriptive form IDs across your application:

```typescript
// Good
const formId = 'exerciseForm'
const formId = 'userProfileForm'

// Bad
const formId = 'form1'
const formId = 'f'
```

### 3. Field Validation

Perform validation at the appropriate times:

```typescript
// Validate on blur
<InputWithStore
  formId={formId}
  name="email"
  onBlur={() => {
    validateField(formId, 'email', (value) => {
      if (!value) return 'Email is required'
      if (!isValidEmail(value)) return 'Invalid email format'
      return undefined
    })
  }}
/>
```

## Offline Support

The form store includes persistence middleware to support offline usage:

```typescript
// Form store is configured with persistence
export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      // Store implementation
    }),
    {
      name: 'mosaic-form-storage',
      partialize: (state) => ({
        // Only persist form values, not errors or status
        forms: /* ... */
      })
    }
  )
)
```

This ensures that:
1. Form data is preserved if the user goes offline
2. Users can continue filling forms while offline
3. Data can be synchronized when connectivity is restored

## Testing Connected Components

When testing form components connected to Zustand:

```typescript
// Example test for a connected component
it('should update form store when value changes', () => {
  // Render component
  render(<TimeInputWithStore formId="testForm" name="duration" />)
  
  // Interact with component
  fireEvent.change(screen.getByRole('textbox'), { target: { value: '02:30' } })
  
  // Verify store was updated
  expect(useFormStore.getState().forms.testForm.duration.value).toBe('02:30')
})
```

For more complex testing scenarios, you can mock the form store:

```typescript
// Mock the form store
jest.mock('@/store/formStore', () => ({
  useFormStore: jest.fn(),
  useFormField: jest.fn(),
  useForm: jest.fn()
}))

// Set up mock implementation
beforeEach(() => {
  useFormField.mockReturnValue({
    value: '01:30',
    error: undefined,
    touched: false,
    setValue: jest.fn(),
    setTouched: jest.fn()
  })
})
```

---

By following these integration patterns and best practices, we ensure consistent, maintainable, and performant form handling throughout the Mosaic application.
