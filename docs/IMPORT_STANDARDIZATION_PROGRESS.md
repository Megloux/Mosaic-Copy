# Mosaic Import Standardization Progress

This document tracks the progress of standardizing import/export patterns across the Mosaic codebase.

## Component Mapping Spreadsheet

| Component Path | Component Name | Original Export Type | Current Export Type | Import Type | Status | Dependencies |
|----------------|----------------|---------------------|---------------------|-------------|--------|--------------|
| **UI Components** |
| `/components/ui/buttons/StandardButton.tsx` | StandardButton | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/buttons/SaveButton.tsx` | SaveButton | Named | Named | Absolute | ✅ Done | - |
| `/components/ui/buttons/PublicToggle.tsx` | PublicToggle | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/buttons/ShareButton.tsx` | ShareButton | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/buttons/FavoriteButton.tsx` | FavoriteButton | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/buttons/RemoveButton.tsx` | RemoveButton | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/Modal.tsx` | Modal | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/Section.tsx` | Section | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/Grid.tsx` | Grid | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/Tabs.tsx` | Tabs | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/TabsWithStore.tsx` | TabsWithStore | Default | Named | Absolute | ✅ Done | Tabs |
| `/components/ui/List.tsx` | List | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/Toast.tsx` | Toast, ToastContainer | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/Accordion.tsx` | Accordion | Default | Named | Absolute | ✅ Done | - |
| **Form Components** |
| `/components/ui/form/Input.tsx` | Input | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/SearchInput.tsx` | SearchInput | Default | Named | Absolute | ✅ Done | Input |
| `/components/ui/form/Select.tsx` | Select | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/Switch.tsx` | Switch | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/DatePicker.tsx` | DatePicker | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/RadioGroup.tsx` | RadioGroup | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/CheckboxGroup.tsx` | CheckboxGroup | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/TimeInput.tsx` | TimeInput | Default | Named | Absolute | ✅ Done | Input |
| `/components/ui/form/FileUpload.tsx` | FileUpload | Default | Named | Absolute | ✅ Done | - |
| `/components/ui/form/PasswordInput.tsx` | PasswordInput | Default | Named | Absolute | ✅ Done | Input, StrengthIndicator |
| `/components/ui/form/RangeSlider.tsx` | RangeSlider | Default | Named | Absolute | ✅ Done | - |
| **Exercise Components** |
| `/components/exercises/ExerciseDetail.tsx` | ExerciseDetail | Default | Named | Absolute | ✅ Done | Modal, Card, StandardButton |
| `/components/exercises/ExerciseCard.tsx` | ExerciseCard | Default | Named | Absolute | ✅ Done | Card |
| `/components/exercises/ExerciseSection.tsx` | ExerciseSection | Default | Named | Absolute | ✅ Done | Section, StandardButton |
| `/components/exercises/ExerciseLibrary.tsx` | ExerciseLibrary | Default | Named | Absolute | ✅ Done | Grid, SearchInput, ExerciseCard, ExerciseDetail |
| **Routine Player Components** |
| `/components/routines/player/RoutinePlayer.tsx` | RoutinePlayer | Default | Named | Absolute | ✅ Done | CountdownTimer |
| `/components/routines/player/RoutinePlayerWrapper.tsx` | RoutinePlayerWrapper | Default | Named | Absolute | ✅ Done | RoutinePlayer |
| `/components/routines/player/components/CountdownTimer.tsx` | CountdownTimer | Default | Named | Absolute | ✅ Done | - |
| `/components/routines/player/components/ExercisePreview.tsx` | ExercisePreview | Default | Named | Absolute | ✅ Done | - |
| `/components/routines/player/components/ExerciseTimer.tsx` | ExerciseTimer | Default | Named | Absolute | ✅ Done | - |
| **Routine Builder Components** |
| `/components/routines/builder/index.tsx` | RoutineBuilder | Default | Named | Absolute | ✅ Done | StandardButton |
| `/components/routines/builder/components/TemplateCard.tsx` | TemplateCard | Default | Named | Absolute | ✅ Done | StandardButton |
| `/components/routines/RoutineBuilder.old.tsx` | RoutineBuilder | Default | Named | Absolute | ✅ Done | StandardButton |
| `/components/routines/ExerciseSelection.tsx` | ExerciseSelection | Default | Named | Absolute | ✅ Done | StandardButton |
| `/components/routines/TemplateSelection.tsx` | TemplateSelection | Default | Named | Absolute | ✅ Done | Card, SearchInput |
| `/components/routines/RoutineTypeModal.tsx` | RoutineTypeModal | Default | Named | Absolute | ✅ Done | Modal |
| **Demo Components** |
| `/components/demos/UIComponentsDemo.tsx` | UIComponentsDemo | Default | Named | Absolute | ✅ Done | Section, Card, StandardButton, SaveButton |
| `/components/demos/DatePickerDemo.tsx` | DatePickerDemo | Default | Named | Absolute | ✅ Done | DatePicker, DatePickerWithStore |
| `/components/demos/FormComponentsDemo.tsx` | FormComponentsDemo | Default | Named | Absolute | ✅ Done | CheckboxGroup, RadioGroup, Switch, FileUpload, DatePicker |
| **Page Components** |
| `/pages/ExerciseDemo.tsx` | ExerciseDemo | Default | Named | Absolute | ✅ Done | Section, StandardButton |
| **Test Files** |
| `/components/ui/buttons/__tests__/StandardButton.test.tsx` | StandardButton Test | Default | Named | Relative | ✅ Done | StandardButton |
| `/components/ui/__tests__/Modal.test.tsx` | Modal Test | Default | Named | Absolute | ✅ Done | Modal |
| `/components/ui/__tests__/Section.test.tsx` | Section Test | Default | Named | Absolute | ✅ Done | Section |
| `/components/ui/__tests__/Grid.test.tsx` | Grid Test | Default | Named | Absolute | ✅ Done | Grid |
| `/components/ui/form/__tests__/TimeInput.test.tsx` | TimeInput Test | Default | Named | Absolute | ✅ Done | TimeInput |
| `/components/exercises/__tests__/ExerciseLibrary.test.tsx` | ExerciseLibrary Test | Default | Named | Absolute | ✅ Done | ExerciseLibrary |
| `/components/routines/player/__tests__/RoutinePlayer.test.tsx` | RoutinePlayer Test | Default | Named | Absolute | ✅ Done | RoutinePlayer |
| `/components/routines/__tests__/ExerciseSelection.test.tsx` | ExerciseSelection Test | Default | Named | Absolute | ✅ Done | ExerciseSelection |

## Progress Summary

- **Total Components**: 40
- **Completed Components**: 39 (97.5%)
- **Pending Components**: 1 (2.5%)
- **Total Test Files**: 8
- **Completed Test Files**: 8 (100%)
- **Pending Test Files**: 0 (0%)
- **ESLint Configuration**: ✅ Done

## Next Steps

1. **Fix remaining TypeScript errors** in the FormComponentsDemo component
2. **Create a component template** for new components that follows the standardized patterns
3. **Add automated checks to the CI pipeline** to prevent regressions
4. **Run ESLint** across the codebase to identify any remaining issues
5. **Document the ESLint rules** in the team's development guidelines

## Implementation Checklist for Component Conversion

For each component:
1. Update the component export to a named export
2. Update all imports of the component across the codebase
3. Update any re-exports of the component (e.g., in barrel files)
4. Update test files that import the component
5. Verify that the component still works as expected

## Notes

- Some components have both named and default exports, which required careful updates
- Components with forwarded refs have been handled properly
- The standardization process has revealed some TypeScript errors that should be addressed separately
