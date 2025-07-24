# Mosaic Build Unblocking TODOs

_Last updated: 2025-04-25 11:23 EDT_

This document tracks **all temporary changes, stubs, and TODOs** made to unblock the Mosaic TypeScript build. It is intended for handoff, restoration, and stakeholder visibility. Each entry includes file locations, detailed descriptions, restoration priority, and dependency notes.

---

## 1. [src/components/routines/builder/index.tsx](src/components/routines/builder/index.tsx)
**Component:** RoutineBuilder
- **Temporary Changes:**
  - Entire routine-building logic, state, and handlers removed or stubbed.
  - All UI replaced with a minimal shell:
    ```tsx
    <div className="p-4 text-center text-white bg-slate-800 rounded-lg">
      <h1>Routine Builder MVP Shell</h1>
      <p>UI and logic temporarily replaced with stubs to unblock build. Restore full UI after MVP build.</p>
    </div>
    ```
  - All imports except `React` and `useEffect` removed.
  - Top-of-file comment:
    ```ts
    // =============================
    // TEMPORARY: Imports removed for MVP build unblock
    // Restore as needed after MVP shell is replaced
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Must restore hooks (`useRoutineStore`, `useRoutineActions`, `useRoutineCalculations`) and subcomponents (`RoutineHeader`, `RoutineBlock`, etc.) before restoring this shell.

---

## 2. [src/components/hoc/withFormStore.tsx](src/components/hoc/withFormStore.tsx)
**Component:** withFormStore (HOC)
- **Temporary Changes:**
  - Type checks for props (`formId`, `name`, `value`, `onChange`) loosened by casting to `any`.
  - All such lines marked with `// TODO: TEMPORARY: Loosened type checks to unblock build`.
- **Restoration Priority:** MEDIUM
- **Dependencies:** Should be restored in tandem with form component type tightening and store typing.

---

## 3. [src/components/routines/RoutineBuilder.old.tsx](src/components/routines/RoutineBuilder.old.tsx)
**Component:** RoutineBuilder (Legacy/Old)
- **Temporary Changes:**
  - Entire file commented out and replaced with a minimal shell:
    ```tsx
    <div className="p-4 text-center text-white bg-slate-700 rounded-lg">
      <h1>RoutineBuilder.old.tsx Temporarily Disabled</h1>
      <p>This legacy RoutineBuilder is commented out to unblock the MVP build. Restore as needed after MVP shell is live.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TEMPORARY: MVP Build Unblock - All logic, UI, and imports below are commented out or stubbed.
    // Restore full functionality after MVP build. See handoff doc for details.
    // =============================
    ```
- **Restoration Priority:** LOW (unless legacy code is needed for MVP, then escalate)
- **Dependencies:** None (standalone legacy file)

---

## 4. [src/components/routines/builder/hooks/useRoutineActions.ts](src/components/routines/builder/hooks/useRoutineActions.ts)
**Component/Hook:** useRoutineActions
- **Temporary Changes:**
  - All logic, state, and handlers commented out.
  - File replaced with a stub returning only empty/dummy handlers and values.
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic, handlers, and state. Restore full hook after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH (needed for restoring RoutineBuilder logic)
- **Dependencies:** Depends on store shape and routine builder restoration.

---

## 5. [src/components/routines/builder/hooks/useRoutineCalculations.ts](src/components/routines/builder/hooks/useRoutineCalculations.ts)
**Component/Hook:** useRoutineCalculations
- **Temporary Changes:**
  - All calculation logic commented out.
  - File replaced with a stub returning zero/empty values for all calculations.
  - All imports removed.
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all calculation logic. Restore full hook after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH (needed for restoring RoutineBuilder logic)
- **Dependencies:** Used by RoutineBuilder and other routine-related components.

---

## 6. [src/components/hoc/withFormStore.tsx](src/components/hoc/withFormStore.tsx)
**Component:** withFormStore
- **Temporary Changes:**
  - Type checks for props (`formId`, `name`, `value`, `onChange`) loosened by casting to `any`.
  - All such lines marked with `// TODO: TEMPORARY: Loosened type checks to unblock build`.
- **Restoration Priority:** MEDIUM
- **Dependencies:** Should be restored with form component type tightening.

---

## 7. [src/components/ui/form/CheckboxGroup.tsx](src/components/ui/form/CheckboxGroup.tsx)
**Component:** CheckboxGroup
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>CheckboxGroup Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 8. [src/components/ui/form/RadioGroup.tsx](src/components/ui/form/RadioGroup.tsx)
**Component:** RadioGroup
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>RadioGroup Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 9. [src/components/ui/form/TimeInput.tsx](src/components/ui/form/TimeInput.tsx)
**Component:** TimeInput
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>TimeInput Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 10. NEXT FILES TO PROCESS
- All files with TypeScript or lint errors flagged in the last build (see build logs for exact paths):
  - src/components/ui/form/*.tsx (other form components)
  - src/components/routines/ExerciseSelection.tsx, RoutineTypeModal.tsx
  - src/components/ui/buttons/*, src/components/ui/Grid.tsx, etc.
  - src/store/routineStore.ts, src/store/uiStore.ts
  - src/data/core/exercises.ts, src/types/templates.ts, etc.
- **Action:**
  - For each, remove or comment out unused imports/variables, stub logic if needed, and add a TODO comment with details.
  - Add each change to this document as you go.

---

## 11. [src/components/routines/builder/__tests__/useRoutineCalculations.test.ts](src/components/routines/builder/__tests__/useRoutineCalculations.test.ts)
**Component/Test:** useRoutineCalculations (test)
- **Temporary Changes:**
  - All tests stubbed/disabled due to the stubbed hook signature (no arguments).
  - Only a single test remains, matching the stub output:
    ```ts
    it('is temporarily disabled for MVP unblock', () => {
      const { result } = renderHook(() => useRoutineCalculations());
      expect(result.current.totalDuration).toBe(0);
      expect(result.current.formattedDuration).toBe('0:00');
      expect(result.current.estimatedCalories).toBe(0);
    });
    ```
  - Top-of-describe comment:
    ```ts
    // TODO: TEMPORARY: MVP Build Unblock - All tests stubbed/disabled due to stubbed hook signature. Restore after MVP build.
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Restore after `useRoutineCalculations` is restored to full logic/signature.

---

## 12. [src/components/routines/TemplateSelection.tsx](src/components/routines/TemplateSelection.tsx)
**Component:** TemplateSelection
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-4 text-center text-white bg-slate-800 rounded-lg">
      <h1>TemplateSelection Temporarily Unavailable</h1>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by routine builder and template flows. Restore after core MVP shell is live.

---

## 13. [src/components/routines/ExerciseSelection.tsx](src/components/routines/ExerciseSelection.tsx)
**Component:** ExerciseSelection
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-4 text-center text-white bg-slate-800 rounded-lg">
      <h1>ExerciseSelection Temporarily Unavailable</h1>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by routine builder and exercise flows. Restore after core MVP shell is live.

---

## 14. [src/components/routines/RoutineTypeModal.tsx](src/components/routines/RoutineTypeModal.tsx)
**Component:** RoutineTypeModal
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-4 text-center text-white bg-slate-800 rounded-lg">
      <h1>RoutineTypeModal Temporarily Unavailable</h1>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by routine builder and template flows. Restore after core MVP shell is live.

---

## 15. [src/components/ui/form/CheckboxGroupWithStore.tsx](src/components/ui/form/CheckboxGroupWithStore.tsx)
**Component:** CheckboxGroupWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>CheckboxGroupWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 16. [src/components/ui/form/RadioGroupWithStore.tsx](src/components/ui/form/RadioGroupWithStore.tsx)
**Component:** RadioGroupWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>RadioGroupWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 17. [src/components/ui/form/TimeInputWithStore.tsx](src/components/ui/form/TimeInputWithStore.tsx)
**Component:** TimeInputWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>TimeInputWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 18. [src/components/ui/form/InputWithStore.tsx](src/components/ui/form/InputWithStore.tsx)
**Component:** InputWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>InputWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 19. [src/components/ui/form/FileUploadWithStore.tsx](src/components/ui/form/FileUploadWithStore.tsx)
**Component:** FileUploadWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>FileUploadWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 20. [src/components/ui/form/RangeSliderWithStore.tsx](src/components/ui/form/RangeSliderWithStore.tsx)
**Component:** RangeSliderWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>RangeSliderWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 21. [src/components/ui/form/SearchInputWithStore.tsx](src/components/ui/form/SearchInputWithStore.tsx)
**Component:** SearchInputWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>SearchInputWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 22. [src/components/ui/form/SelectWithStore.tsx](src/components/ui/form/SelectWithStore.tsx)
**Component:** SelectWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>SelectWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 23. [src/components/ui/form/SwitchWithStore.tsx](src/components/ui/form/SwitchWithStore.tsx)
**Component:** SwitchWithStore
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <div className="p-2 text-center text-gray-400 bg-slate-900 rounded">
      <h2>SwitchWithStore Temporarily Unavailable</h2>
      <p>Component stubbed to unblock MVP build. Restore after MVP.</p>
    </div>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by forms and routines. Restore after core MVP shell is live.

---

## 24. [src/components/ui/buttons/FavoriteButton.tsx](src/components/ui/buttons/FavoriteButton.tsx)
**Component:** FavoriteButton
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <button className="p-2 text-center text-gray-400 bg-slate-900 rounded" disabled>
      <span>FavoriteButton Temporarily Unavailable</span>
      <span className="block text-xs">Component stubbed to unblock MVP build. Restore after MVP.</span>
    </button>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by routine and favorites flows. Restore after core MVP shell is live.

---

## 25. [src/components/ui/buttons/RemoveButton.tsx](src/components/ui/buttons/RemoveButton.tsx)
**Component:** RemoveButton
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <button className="p-2 text-center text-gray-400 bg-slate-900 rounded" disabled>
      <span>RemoveButton Temporarily Unavailable</span>
      <span className="block text-xs">Component stubbed to unblock MVP build. Restore after MVP.</span>
    </button>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by routine and library flows. Restore after core MVP shell is live.

---

## 26. [src/components/ui/buttons/ShareButton.tsx](src/components/ui/buttons/ShareButton.tsx)
**Component:** ShareButton
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <button className="p-2 text-center text-gray-400 bg-slate-900 rounded" disabled>
      <span>ShareButton Temporarily Unavailable</span>
      <span className="block text-xs">Component stubbed to unblock MVP build. Restore after MVP.</span>
    </button>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by sharing flows. Restore after core MVP shell is live.

---

## 27. [src/components/ui/buttons/IOSButton.tsx](src/components/ui/buttons/IOSButton.tsx)
**Component:** IOSButton
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <button className="p-2 text-center text-gray-400 bg-slate-900 rounded" disabled>
      <span>IOSButton Temporarily Unavailable</span>
      <span className="block text-xs">Component stubbed to unblock MVP build. Restore after MVP.</span>
    </button>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by iOS-specific flows. Restore after core MVP shell is live.

---

## 28. [src/components/ui/buttons/PublicToggle.tsx](src/components/ui/buttons/PublicToggle.tsx)
**Component:** PublicToggle
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <button className="p-2 text-center text-gray-400 bg-slate-900 rounded" disabled>
      <span>PublicToggle Temporarily Unavailable</span>
      <span className="block text-xs">Component stubbed to unblock MVP build. Restore after MVP.</span>
    </button>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by public/private flows. Restore after core MVP shell is live.

---

## 29. [src/components/ui/buttons/StandardButton.tsx](src/components/ui/buttons/StandardButton.tsx)
**Component:** StandardButton
- **Temporary Changes:**
  - All logic and UI commented out and replaced with a minimal stub:
    ```tsx
    <button className="p-2 text-center text-gray-400 bg-slate-900 rounded" disabled>
      <span>StandardButton Temporarily Unavailable</span>
      <span className="block text-xs">Component stubbed to unblock MVP build. Restore after MVP.</span>
    </button>
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and UI. Restore full component after MVP build.
    // =============================
    ```
- **Restoration Priority:** MEDIUM
- **Dependencies:** Used by all flows using StandardButton. Restore after core MVP shell is live.

---

## 30. [src/store/routineStore.ts](src/store/routineStore.ts)
**Component:** useRoutineStore (Zustand store)
- **Temporary Changes:**
  - All logic and state commented out and replaced with an empty Zustand store and placeholder interfaces:
    ```ts
    export interface RoutineState {}
    export interface RoutineActions {}
    export const useRoutineStore = create<RoutineState & RoutineActions>(() => ({}));
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and state. Restore full Zustand store after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Used by all routine builder and player flows. Restore after core MVP shell is live.

---

## 31. [src/store/uiStore.ts](src/store/uiStore.ts)
**Component:** useUIStore (Zustand store)
- **Temporary Changes:**
  - All logic and state commented out and replaced with an empty Zustand store and placeholder interface:
    ```ts
    export interface UIState {}
    export const useUIStore = create<UIState>(() => ({}));
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and state. Restore full Zustand store after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Used by all UI flows. Restore after core MVP shell is live.

---

## 32. [src/store/routinePlayerStore.ts](src/store/routinePlayerStore.ts)
**Component:** useRoutinePlayerStore (Zustand store)
- **Temporary Changes:**
  - All logic and state commented out and replaced with an empty Zustand store and placeholder interface:
    ```ts
    export interface RoutinePlayerState {}
    export const useRoutinePlayerStore = create<RoutinePlayerState>(() => ({}));
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and state. Restore full Zustand store after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Used by all routine player flows. Restore after core MVP shell is live.

---

## 33. [src/store/exerciseStore.ts](src/store/exerciseStore.ts)
**Component:** useExerciseStore (Zustand store)
- **Temporary Changes:**
  - All logic and state commented out and replaced with an empty Zustand store and placeholder interface:
    ```ts
    export interface ExerciseState {}
    export const useExerciseStore = create<ExerciseState>(() => ({}));
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and state. Restore full Zustand store after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Used by all exercise flows. Restore after core MVP shell is live.

---

## 34. [src/store/exerciseLibraryStore.ts](src/store/exerciseLibraryStore.ts)
**Component:** useExerciseLibraryStore (Zustand store)
- **Temporary Changes:**
  - All logic and state commented out and replaced with an empty Zustand store and placeholder interface:
    ```ts
    export interface ExerciseLibraryState {}
    export const useExerciseLibraryStore = create<ExerciseLibraryState>(() => ({}));
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and state. Restore full Zustand store after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Used by all exercise library flows. Restore after core MVP shell is live.

---

## 35. [src/store/formStore.ts](src/store/formStore.ts)
**Component:** useFormStore (Zustand store)
- **Temporary Changes:**
  - All logic and state commented out and replaced with an empty Zustand store and placeholder interfaces:
    ```ts
    export type FormValue = string | number | boolean | string[] | null;
    export interface FormField {}
    export interface FormState {}
    export const useFormStore = create<FormState>(() => ({}));
    ```
  - Top-of-file comment:
    ```ts
    // =============================
    // TODO: TEMPORARY: MVP Build Unblock - Commented out all logic and state. Restore full Zustand store after MVP build.
    // =============================
    ```
- **Restoration Priority:** HIGH
- **Dependencies:** Used by all form flows. Restore after core MVP shell is live.

# Restoration Guidance
- Restore files in order of HIGH priority first, then MEDIUM, then LOW.
- Restore dependencies before dependents (see notes above).
- Use this doc as a checklist for systematic restoration after MVP build is achieved.

---

_This document is maintained by Cascade AI and the Mosaic team. Please update it with every new temporary change or restoration._
