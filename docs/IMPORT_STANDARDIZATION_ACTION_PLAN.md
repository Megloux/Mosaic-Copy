# Mosaic Import Standardization Action Plan

Based on our verification script results, this document outlines a systematic approach to standardizing imports and exports across the Mosaic codebase.

## Key Issues Identified

Our verification script identified three main categories of issues:

1. **Components still using default exports (27 components)**
2. **Relative imports that should be absolute (51 instances)**
3. **Incorrect imports of components that have been converted (3 instances)**

## Prioritized Action Plan

### Phase 1: Form Components (Highest Priority)

Form components are foundational and widely used throughout the application. We'll start by standardizing these components:

1. **DatePicker & DatePickerWithStore**
2. **CheckboxGroup & CheckboxGroupWithStore**
3. **RadioGroup & RadioGroupWithStore**
4. **TimeInput & TimeInputWithStore**
5. **FileUpload & FileUploadWithStore**
6. **PasswordInput**
7. **RangeSlider & RangeSliderWithStore**
8. **StrengthIndicator**

For each component:
- Convert default exports to named exports
- Update all imports to use absolute paths with the @/ prefix
- Update all imports to use named import syntax
- Update corresponding test files

### Phase 2: Exercise and Routine Components

These components are critical for the core functionality of the application:

1. **ExerciseLibrary**
2. **ExerciseSelection**
3. **RoutineTypeModal**
4. **TemplateSelection**

For each component:
- Convert default exports to named exports
- Update all imports to use absolute paths with the @/ prefix
- Update all imports to use named import syntax
- Update corresponding test files

### Phase 3: Demo Components

Demo components are less critical but still need to be standardized:

1. **DatePickerDemo**
2. **FormComponentsDemo**
3. **component-test page**

For each component:
- Convert default exports to named exports
- Update all imports to use absolute paths with the @/ prefix
- Update all imports to use named import syntax

### Phase 4: Test Files

Update all remaining test files to use:
- Absolute imports with the @/ prefix
- Named import syntax for components that have been converted

## Implementation Approach

For each component, follow this checklist:

1. **Update the component export**:
   ```tsx
   // Before
   export default ComponentName
   
   // After
   export const ComponentName = ...
   ```

2. **Update all imports of the component**:
   ```tsx
   // Before
   import ComponentName from '../../path/to/ComponentName'
   
   // After
   import { ComponentName } from '@/components/path/to/ComponentName'
   ```

3. **Update any re-exports in barrel files**:
   ```tsx
   // Before
   export { default as ComponentName } from './ComponentName'
   
   // After
   export { ComponentName } from './ComponentName'
   ```

4. **Update test files**:
   ```tsx
   // Before
   import ComponentName from '../ComponentName'
   
   // After
   import { ComponentName } from '@/components/path/to/ComponentName'
   ```

5. **Verify the component still works as expected**:
   - Run tests
   - Check the component in the UI

## Verification and Monitoring

After each phase:

1. **Run the verification script** to ensure all targeted issues have been resolved
2. **Run the test suite** to ensure no functionality has been broken
3. **Update the progress spreadsheet** in `IMPORT_STANDARDIZATION_PROGRESS.md`

## ESLint Integration

To prevent regression and catch issues early:

1. **Add the custom ESLint rule** to the project's ESLint configuration:
   ```js
   // .eslintrc.js
   module.exports = {
     // ...
     rules: {
       // ...
       'mosaic/enforce-import-standards': 'warn',
     },
   }
   ```

2. **Set up a pre-commit hook** to run the ESLint check before committing code

## Special Cases to Watch For

1. **Components with forwarded refs**: Ensure the named export is properly set up with forwardRef
2. **Higher-order components**: Make sure the wrapped component is exported as a named export
3. **Components with multiple exports**: Ensure all exports are named exports
4. **Barrel files**: Update any index.ts files that re-export components

## Timeline

- **Phase 1 (Form Components)**: 2 days
- **Phase 2 (Exercise and Routine Components)**: 2 days
- **Phase 3 (Demo Components)**: 1 day
- **Phase 4 (Test Files)**: 2 days
- **ESLint Integration and Final Verification**: 1 day

Total estimated time: 8 working days

## Conclusion

By following this systematic approach, we'll ensure that all components in the Mosaic codebase are standardized to use named exports and absolute imports. This will enhance code maintainability, reduce build errors, and improve developer experience.
