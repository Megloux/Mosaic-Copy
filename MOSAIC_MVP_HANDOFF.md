# Mosaic MVP Handoff Document

## Project Overview

Mosaic is a React-based web application for fitness professionals, specifically focused on Pilates instruction. The application allows users to create, manage, and share workout routines, as well as access a library of exercises and templates.

The codebase is currently transitioning to a Feature-Slice Architecture (FSA), which organizes code by feature rather than by technical type. This architectural migration was in progress when the need for an MVP build arose, requiring temporary stubbing of some components to unblock the build process.

## FSA Migration Status

The FSA migration has been partially completed and the progress has been preserved in the main branch. The migration involves:

1. Moving components from type-based directories (`components/`, `services/`, etc.) to feature-based directories (`features/`, `shared/`, etc.)
2. Updating import paths to use path aliases (`@/features/`, `@/shared/`, etc.)
3. Standardizing exports to use named exports rather than default exports
4. Implementing proper public APIs through index files

The current state of the migration is preserved in a series of commits:
- Part 1: Core routine components and services
- Part 2: Form components
- Part 3: Utilities and store
- Part 4: Test files
- Part 5: Index files and component exports
- Final: Type definitions

## Stubbing Strategy

### Components Requiring Stubbing

The following components need to be stubbed for the MVP build:

1. **Routine Components**:
   - RoutineBuilder.tsx
   - ExerciseSelection.tsx
   - TemplateSelection.tsx
   - RoutineTypeModal.tsx

2. **Form Components**:
   - CheckboxGroupWithStore.tsx
   - DatePickerWithStore.tsx
   - InputWithStore.tsx
   - RadioGroupWithStore.tsx
   - RangeSliderWithStore.tsx
   - SearchInputWithStore.tsx
   - SelectWithStore.tsx
   - SwitchWithStore.tsx
   - TimeInputWithStore.tsx
   - FileUploadWithStore.tsx

3. **Button Components**:
   - FavoriteButton.tsx
   - RemoveButton.tsx
   - ShareButton.tsx
   - StandardButton.tsx
   - PublicToggle.tsx

### Stubbing Guidelines

When implementing stubs, follow these guidelines to ensure consistency and maintainability:

1. **Standard Format**:
   ```tsx
   import { FC } from 'react';
   
   // STUB: This component is temporarily stubbed for MVP build
   // TODO: Replace with full implementation after MVP
   export const ComponentName: FC<ComponentProps> = (props) => {
     return <div className="stub-component">ComponentName Stub</div>;
   };
   ```

2. **Type Safety**:
   - Maintain the original component's prop interface
   - Use proper TypeScript types for all props
   - Do not use `any` types unless absolutely necessary

3. **Documentation**:
   - Add a `// STUB` comment at the top of each stubbed file
   - Include a `// TODO` comment with instructions for future implementation
   - Document any non-obvious behavior or requirements

4. **Minimal Functionality**:
   - Stubs should render a minimal UI that indicates they are stubs
   - For form components, implement basic value handling to prevent runtime errors
   - For service files, implement minimal functionality to prevent runtime errors

### Example Stub Implementation

```tsx
import { FC } from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

// STUB: This component is temporarily stubbed for MVP build
// TODO: Replace with full implementation after MVP
export const StandardButton: FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`stub-button ${className}`}
    >
      {children}
    </button>
  );
};
```

## Component Inventory

| Component | Status | Location | Stub Priority |
|-----------|--------|----------|--------------|
| RoutineBuilder | Restored | src/components/routines | High |
| ExerciseSelection | Restored | src/components/routines | High |
| TemplateSelection | Restored | src/components/routines | High |
| RoutineTypeModal | Restored | src/components/routines | High |
| FavoriteButton | Restored | src/components/ui/buttons | Medium |
| RemoveButton | Restored | src/components/ui/buttons | Medium |
| ShareButton | Restored | src/components/ui/buttons | Medium |
| StandardButton | Restored | src/components/ui/buttons | Medium |
| PublicToggle | Restored | src/components/ui/buttons | Medium |
| CheckboxGroupWithStore | Restored | src/components/ui/form | High |
| DatePickerWithStore | Restored | src/components/ui/form | High |
| InputWithStore | Restored | src/components/ui/form | High |
| RadioGroupWithStore | Restored | src/components/ui/form | High |
| RangeSliderWithStore | Restored | src/components/ui/form | High |
| SearchInputWithStore | Restored | src/components/ui/form | High |
| SelectWithStore | Restored | src/components/ui/form | High |
| SwitchWithStore | Restored | src/components/ui/form | High |
| TimeInputWithStore | Restored | src/components/ui/form | High |
| FileUploadWithStore | Restored | src/components/ui/form | High |
| VariationService | Restored | src/services | Medium |
| TemplateService | Restored | src/services | Medium |
| ExerciseService | Restored | src/services | Medium |
| routineStore | Updated | src/store | High |

## Restoration Roadmap

The long-term plan is to replace all stubs with their full implementations as the FSA migration continues. The restoration process should follow these steps:

1. **Identify Dependencies**:
   - For each stubbed component, identify its dependencies
   - Ensure all dependencies are properly implemented or stubbed

2. **Implement Core Components First**:
   - Start with high-priority components (form components, routine builder)
   - Then move to medium-priority components (buttons, services)
   - Finally, implement low-priority components

3. **Testing Strategy**:
   - Write unit tests for each component before replacing its stub
   - Ensure all tests pass before merging the implementation
   - Update integration tests as needed

4. **Documentation Updates**:
   - Update this document as stubs are replaced
   - Document any architectural decisions or changes

## Technical Debt Tracking

To track which components are stubbed and need to be replaced, we will use the following methods:

1. **Code Comments**:
   - All stubbed files will include a `// STUB` comment
   - These can be easily searched to find all stubs

2. **GitHub Issues**:
   - Create an issue for each stubbed component
   - Use labels to indicate priority and status
   - Link issues to the relevant files

3. **This Document**:
   - Update the Component Inventory section as stubs are replaced
   - Track progress in the Restoration Roadmap section

4. **Regular Reviews**:
   - Conduct regular reviews of stubbed components
   - Update priorities based on project needs
   - Assign developers to replace stubs based on expertise

## Conclusion

This MVP build unblock process is a temporary measure to allow development to continue while the FSA migration is in progress. By following the guidelines in this document, we can ensure that the stubbing process is systematic, well-documented, and reversible, minimizing technical debt and making it easier to continue the architectural migration in the future.
