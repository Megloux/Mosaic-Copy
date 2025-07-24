# MOSAIC MVP BUILD UNBLOCK HANDOFF

## 1. Project Overview

Mosaic is the "Spotify of Pilates Programming," a comprehensive React-based web application designed for fitness professionals, specifically focused on Pilates instruction. The application enables users to create, manage, and share workout routines, as well as access a curated library of exercises and templates.

The codebase is currently transitioning to a Feature-Slice Architecture (FSA), which organizes code by feature rather than by technical type. This architectural approach offers several benefits:

- **Improved Maintainability**: Code related to a specific feature is co-located, making it easier to understand and modify
- **Better Scalability**: New features can be added without affecting existing ones
- **Enhanced Developer Experience**: Clear boundaries between features reduce cognitive load
- **Simplified Dependency Management**: Dependencies flow in one direction, reducing circular dependencies

The FSA migration was in progress when the need for an MVP build arose, requiring temporary stubbing of some components to unblock the build process. This document provides a comprehensive guide for managing this transition.

## 2. FSA Migration Status

### 2.1 Completed Migration Components

The following components have been fully migrated to the FSA structure:

| Component | Original Location | FSA Location |
|-----------|------------------|-------------|
| RoutineBuilder | src/components/routines | src/features/routines/ui/RoutineBuilder |
| ExerciseSelection | src/components/routines | src/features/routines/ui/ExerciseSelection |
| TemplateSelection | src/components/routines | src/features/routines/ui/TemplateSelection |
| RoutineTypeModal | src/components/routines | src/features/routines/ui/RoutineTypeModal |
| FavoriteButton | src/components/ui/buttons | src/shared/ui/buttons/FavoriteButton |
| RemoveButton | src/components/ui/buttons | src/shared/ui/buttons/RemoveButton |
| ShareButton | src/components/ui/buttons | src/shared/ui/buttons/ShareButton |
| StandardButton | src/components/ui/buttons | src/shared/ui/buttons/StandardButton |
| PublicToggle | src/components/ui/buttons | src/shared/ui/buttons/PublicToggle |
| CheckboxGroupWithStore | src/components/ui/form | src/shared/ui/form/CheckboxGroupWithStore |
| DatePickerWithStore | src/components/ui/form | src/shared/ui/form/DatePickerWithStore |
| InputWithStore | src/components/ui/form | src/shared/ui/form/InputWithStore |
| RadioGroupWithStore | src/components/ui/form | src/shared/ui/form/RadioGroupWithStore |
| RangeSliderWithStore | src/components/ui/form | src/shared/ui/form/RangeSliderWithStore |
| SearchInputWithStore | src/components/ui/form | src/shared/ui/form/SearchInputWithStore |
| SelectWithStore | src/components/ui/form | src/shared/ui/form/SelectWithStore |
| SwitchWithStore | src/components/ui/form | src/shared/ui/form/SwitchWithStore |
| TimeInputWithStore | src/components/ui/form | src/shared/ui/form/TimeInputWithStore |
| FileUploadWithStore | src/components/ui/form | src/shared/ui/form/FileUploadWithStore |

The FSA migration established the following import/export patterns:

- **Named Exports**: All components and functions use named exports instead of default exports
- **Path Aliases**: Imports use path aliases like `@/features/*` and `@/shared/*` instead of relative paths
- **Public API**: Each feature exposes a public API through its index.ts file

### 2.2 In-Progress Components

The following components exist in both original and FSA locations, with the FSA version being the source of truth:

| Component | Original Location | FSA Location | Status |
|-----------|------------------|-------------|--------|
| VariationService | src/services | src/features/exercises/model/VariationService | Partially Migrated |
| TemplateService | src/services | src/features/templates/model/TemplateService | Partially Migrated |
| ExerciseService | src/services | src/features/exercises/model/ExerciseService | Partially Migrated |
| utils | src/lib/utils.ts | src/shared/lib/utils/index.ts | Partially Migrated |

Current import path conventions for these components:
- Original locations typically use imports like `@/types/...`, `@/lib/...`, `@/components/...`
- FSA locations use imports like `@/features/*/model/types`, `@/shared/lib/...`, `@/shared/ui/...`

### 2.3 Non-Migrated Components

The following components haven't yet been moved to the FSA structure:

| Component | Current Location | Migration Plan |
|-----------|-----------------|---------------|
| RoutinePopulationService | src/services | Will be migrated to src/features/routines/model |
| useRoutineActions | src/components/routines/builder/hooks | Will be migrated to src/features/routines/model/hooks |
| IOSButton | src/components/ui/buttons | Will be migrated to src/shared/ui/buttons |
| NetworkService | src/services | Will be migrated to src/shared/api |
| useIOSTouch | src/hooks | Will be migrated to src/shared/lib/hooks |
| PasswordInput | src/components/ui/form | Will be migrated to src/shared/ui/form |

During MVP development, these components should be used from their original locations with their original import paths. After the MVP is complete, they will be migrated to the FSA structure.

## 3. Stubbing Inventory and Strategy

### 3.1 Previously Stubbed Files

Based on the "Mosaic Build Unblocking TODOs" document, the following files were previously stubbed:

#### Routine Components

1. **RoutineBuilder** (src/components/routines/builder/index.tsx)
   - **Purpose**: Main component for creating and editing routines
   - **Dependencies**: useRoutineStore, useRoutineActions, useRoutineCalculations
   - **Original Stubbing**: Entire routine-building logic removed, UI replaced with minimal shell
   - **Restoration Priority**: HIGH

2. **ExerciseSelection** (src/components/routines/ExerciseSelection.tsx)
   - **Purpose**: Component for selecting exercises to add to routines
   - **Dependencies**: exerciseService, useRoutineStore
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

3. **TemplateSelection** (src/components/routines/TemplateSelection.tsx)
   - **Purpose**: Component for selecting templates to base routines on
   - **Dependencies**: templateService, useRoutineStore
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

4. **RoutineTypeModal** (src/components/routines/RoutineTypeModal.tsx)
   - **Purpose**: Modal for selecting routine type when creating new routines
   - **Dependencies**: useRoutineStore, useUIStore
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

#### Form Components

5. **CheckboxGroupWithStore** (src/components/ui/form/CheckboxGroupWithStore.tsx)
   - **Purpose**: Form component for checkbox groups with form store integration
   - **Dependencies**: useFormStore, CheckboxGroup
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

6. **RadioGroupWithStore** (src/components/ui/form/RadioGroupWithStore.tsx)
   - **Purpose**: Form component for radio groups with form store integration
   - **Dependencies**: useFormStore, RadioGroup
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

7. **TimeInputWithStore** (src/components/ui/form/TimeInputWithStore.tsx)
   - **Purpose**: Form component for time input with form store integration
   - **Dependencies**: useFormStore, TimeInput
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

8. **InputWithStore** (src/components/ui/form/InputWithStore.tsx)
   - **Purpose**: Form component for text input with form store integration
   - **Dependencies**: useFormStore, Input
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

9. **FileUploadWithStore** (src/components/ui/form/FileUploadWithStore.tsx)
   - **Purpose**: Form component for file uploads with form store integration
   - **Dependencies**: useFormStore, FileUpload
   - **Original Stubbing**: All logic and UI replaced with minimal stub
   - **Restoration Priority**: MEDIUM

10. **RangeSliderWithStore** (src/components/ui/form/RangeSliderWithStore.tsx)
    - **Purpose**: Form component for range sliders with form store integration
    - **Dependencies**: useFormStore, RangeSlider
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

11. **SearchInputWithStore** (src/components/ui/form/SearchInputWithStore.tsx)
    - **Purpose**: Form component for search inputs with form store integration
    - **Dependencies**: useFormStore, SearchInput
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

12. **SelectWithStore** (src/components/ui/form/SelectWithStore.tsx)
    - **Purpose**: Form component for select dropdowns with form store integration
    - **Dependencies**: useFormStore, Select
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

13. **SwitchWithStore** (src/components/ui/form/SwitchWithStore.tsx)
    - **Purpose**: Form component for toggle switches with form store integration
    - **Dependencies**: useFormStore, Switch
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

#### Button Components

14. **FavoriteButton** (src/components/ui/buttons/FavoriteButton.tsx)
    - **Purpose**: Button for favoriting routines and exercises
    - **Dependencies**: useUIStore
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

15. **RemoveButton** (src/components/ui/buttons/RemoveButton.tsx)
    - **Purpose**: Button for removing items from routines and lists
    - **Dependencies**: useUIStore
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

16. **ShareButton** (src/components/ui/buttons/ShareButton.tsx)
    - **Purpose**: Button for sharing routines and exercises
    - **Dependencies**: useUIStore
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

17. **StandardButton** (src/components/ui/buttons/StandardButton.tsx)
    - **Purpose**: Standard button component with consistent styling
    - **Dependencies**: None
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

18. **PublicToggle** (src/components/ui/buttons/PublicToggle.tsx)
    - **Purpose**: Toggle for setting routines as public or private
    - **Dependencies**: useUIStore
    - **Original Stubbing**: All logic and UI replaced with minimal stub
    - **Restoration Priority**: MEDIUM

#### Store Files

19. **routineStore** (src/store/routineStore.ts)
    - **Purpose**: Zustand store for routine state management
    - **Dependencies**: None
    - **Original Stubbing**: All logic and state replaced with empty store
    - **Restoration Priority**: HIGH

20. **uiStore** (src/store/uiStore.ts)
    - **Purpose**: Zustand store for UI state management
    - **Dependencies**: None
    - **Original Stubbing**: All logic and state replaced with empty store
    - **Restoration Priority**: HIGH

21. **routinePlayerStore** (src/store/routinePlayerStore.ts)
    - **Purpose**: Zustand store for routine player state management
    - **Dependencies**: None
    - **Original Stubbing**: All logic and state replaced with empty store
    - **Restoration Priority**: HIGH

22. **exerciseStore** (src/store/exerciseStore.ts)
    - **Purpose**: Zustand store for exercise state management
    - **Dependencies**: None
    - **Original Stubbing**: All logic and state replaced with empty store
    - **Restoration Priority**: HIGH

23. **exerciseLibraryStore** (src/store/exerciseLibraryStore.ts)
    - **Purpose**: Zustand store for exercise library state management
    - **Dependencies**: None
    - **Original Stubbing**: All logic and state replaced with empty store
    - **Restoration Priority**: HIGH

24. **formStore** (src/store/formStore.ts)
    - **Purpose**: Zustand store for form state management
    - **Dependencies**: None
    - **Original Stubbing**: All logic and state replaced with empty store
    - **Restoration Priority**: HIGH

### 3.2 Stubbing Guidelines

#### Standard Format for Stub Implementation

```typescript
// =============================
// TEMPORARY: MVP Build Unblock - Component Stub
// Original implementation: src/features/path/to/original.tsx
// Purpose: [Brief explanation of component purpose]
// Dependencies: [List any critical dependencies]
// Restoration Priority: [High/Medium/Low]
// =============================

import { FC } from 'react';

interface ComponentProps {
  // Maintain the original component's prop interface
  prop1: string;
  prop2?: number;
  // etc.
}

export const ComponentName: FC<ComponentProps> = (props) => {
  // Minimal implementation to prevent runtime errors
  return (
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>ComponentName Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
  );
};
```

For store stubs:

```typescript
// =============================
// TEMPORARY: MVP Build Unblock - Store Stub
// Original implementation: src/features/path/to/original.ts
// Purpose: [Brief explanation of store purpose]
// Dependencies: [List any critical dependencies]
// Restoration Priority: [High/Medium/Low]
// =============================

import { create } from 'zustand';

export interface StoreState {
  // Maintain the original store's state interface
  // with minimal required properties
}

export interface StoreActions {
  // Maintain the original store's actions interface
  // with minimal required methods
}

export const useStore = create<StoreState & StoreActions>(() => ({
  // Minimal implementation to prevent runtime errors
}));
```

#### Type Safety Requirements

1. **Maintain Original Interfaces**: All stubs must maintain the original component's prop interfaces and type definitions
2. **No `any` Types**: Avoid using `any` types unless absolutely necessary
3. **Proper TypeScript Typing**: Use proper TypeScript types for all props and state
4. **Type Assertions**: Use type assertions only when necessary and document why they are needed

#### Testing Expectations for Stubbed Components

1. **Disable Complex Tests**: Tests that rely on complex component behavior should be disabled with clear TODO comments
2. **Basic Rendering Tests**: Maintain basic rendering tests for stubbed components
3. **Mock Dependencies**: Use mocks for dependencies in tests
4. **Test Stubs**: Add simple tests for stub behavior where appropriate

## 4. Technical Debt Tracking

### Priority Classification System

| Priority | Description | Timeline |
|----------|-------------|----------|
| HIGH | Critical for core functionality | Restore immediately after MVP |
| MEDIUM | Important but not blocking | Restore within 2-4 weeks after MVP |
| LOW | Nice-to-have | Restore as time permits |

### Tracking Methods

1. **Code Comments**: All stubbed files include standardized TODO comments that can be easily searched
2. **This Document**: The comprehensive list in this document serves as the source of truth
3. **GitHub Issues**: Create an issue for each stubbed component with appropriate labels
4. **Jira Board**: Add technical debt tickets to the project board with appropriate priority

### Timeline Expectations

1. **HIGH Priority**: Restore within 1-2 weeks after MVP launch
2. **MEDIUM Priority**: Restore within 2-4 weeks after MVP launch
3. **LOW Priority**: Restore within 1-2 months after MVP launch

## 5. Restoration Roadmap

### Phase 1: Core State Management (Weeks 1-2)

1. Restore all Zustand stores:
   - routineStore
   - uiStore
   - formStore
   - routinePlayerStore
   - exerciseStore
   - exerciseLibraryStore

2. Restore core hooks:
   - useRoutineActions
   - useRoutineCalculations

### Phase 2: Core UI Components (Weeks 3-4)

1. Restore routine builder components:
   - RoutineBuilder
   - ExerciseSelection
   - TemplateSelection
   - RoutineTypeModal

2. Restore button components:
   - StandardButton
   - FavoriteButton
   - RemoveButton
   - ShareButton
   - PublicToggle

### Phase 3: Form Components (Weeks 5-6)

1. Restore form components:
   - InputWithStore
   - SelectWithStore
   - CheckboxGroupWithStore
   - RadioGroupWithStore
   - TimeInputWithStore
   - RangeSliderWithStore
   - SearchInputWithStore
   - SwitchWithStore
   - FileUploadWithStore

### Testing Strategy

1. **Unit Tests**: Write comprehensive unit tests for each restored component
2. **Integration Tests**: Ensure components work together correctly
3. **E2E Tests**: Add end-to-end tests for critical user flows

## 6. Appendix: Useful Resources

### FSA Architecture References

- [Feature-Sliced Design Official Documentation](https://feature-sliced.design/)
- [FSA Migration Guide](https://feature-sliced.design/docs/guides/migration)
- [Atomic Design Principles](https://bradfrost.com/blog/post/atomic-web-design/)

### Tools for Managing the Stubbing/Restoration Process

- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [ESLint Rules for Import/Export](https://github.com/import-js/eslint-plugin-import)
- [Zustand Store Documentation](https://github.com/pmndrs/zustand)

### Project-Specific Resources

- [Mosaic Architecture Overview](docs/FEATURE_SLICE_ARCHITECTURE.md)
- [FSA Migration Tracker](docs/FSA_MIGRATION_TRACKER.md)
- [Exercise Type Transition Guide](EXERCISE_TYPE_TRANSITION.md)
