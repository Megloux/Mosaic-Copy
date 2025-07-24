# Mosaic Feature-Slice Architecture (FSA) Migration Tracker

---

## High-Level Migration Overview

### What Was the Old Approach?
- **Type-based structure:** Components, stores, and utilities were organized by type, not by feature.
- **Default exports:** Many files used `export default`, making imports ambiguous and refactoring error-prone.
- **Relative imports:** Most imports used relative paths (e.g., `../../components/Button`), which are fragile when moving files.

### Why Migrate?
- **Problems:**
  - Relative imports break easily and are hard to maintain.
  - Default exports lead to import mismatches and make automated refactoring risky.
  - Type-based structure makes it hard to see all code related to a single feature in one place.
- **Goals:**
  - Improve maintainability, scalability, and onboarding.
  - Enable safer, more consistent refactoring and feature development.

### What is Feature-Slice Architecture (FSA)?
- **Definition:** Organize code by feature/slice, so all UI, logic, state, and tests for a feature live together.
- **Benefits:**
  - Clear boundaries between features.
  - Easier to scale, refactor, and onboard.
  - Reduces accidental cross-feature dependencies.
  - Encourages consistent, maintainable code.

### The Migration Process
1. **Standardize Exports:**
   - Convert all files to use named exports only (no `export default`).
2. **Standardize Imports:**
   - Change all imports to use named imports and absolute paths (using TypeScript path aliases).
3. **Restructure by Feature:**
   - Move files so each feature (e.g., routines, exercises) has its own folder containing UI, logic, store, and tests.
4. **Update Barrels/Indexes:**
   - Ensure all `index.ts` files use named exports and absolute paths.
5. **Refactor Tests and Demos:**
   - Update test and demo files to use the new conventions and structure.
6. **Verify and Test:**
   - Run the test suite and fix any issues caused by import/export mismatches or path errors.
7. **Document the Changes:**
   - Track all conventions, gotchas, and migration steps in this document and update onboarding docs.

---

## Migration Progress Summary (as of April 22, 2025)

## What Has Been Accomplished
- **Feature-Slice Architecture Migration:**
  - Migrated form, exercise, routine, and workout player components, state, and APIs to feature-slice structure.
  - Refactored form components (e.g., TimeInput, CheckboxGroup, RadioGroup, DatePicker, Switch, RangeSlider, SearchInput, FileUpload) to use the `withFormStore` HOC pattern, reducing duplication and improving maintainability.
- **TypeScript Error Fixes:**
  - Addressed major TypeScript errors in form components and updated test cases to match new implementations.
- **Import Updates:**
  - Updated imports to use absolute paths in several features (exercise, routine, workout player).
- **Test Improvements:**
  - Began updating and fixing test cases for migrated components, with many tests now reflecting the new props and architecture.

## What Still Needs To Be Done
- **Exports/Imports Standardization:**
  - Convert all remaining default exports to named exports for components (form, exercise, routine, demo, etc.).
  - Update all imports to use named imports and absolute paths project-wide.
- **Test Failures:**
  - Resolve remaining test failures in exercise, routine, and workout player features.
  - Update test imports to match the new export/import style.
- **Deprecation Warnings:**
  - Update test implementations to use the latest React Testing Library patterns (e.g., using `act`).
- **Verification Script Issues:**
  - Address the specific incorrect imports and any other issues flagged by the automated script.

## Detailed Plan (Next Steps)
1. **Standardize Exports & Imports**
   - Convert all components to named exports.
   - Refactor all imports to use named/absolute imports, including in test files.
   - Prioritize form components, then exercise/routine/demo components.
2. **Fix Test Failures**
   - Systematically run and fix tests for each feature (form, exercise, routine, workout player).
   - Update test files to use correct import syntax and resolve any prop mismatches.
3. **Address Deprecation Warnings**
   - Refactor tests to use the React `act` function where needed.
4. **Final Verification**
   - Re-run the verification script to ensure all issues (exports, imports, tests) are resolved.
   - Document any remaining blockers or technical debt for future sprints.

---

## Overview
This document tracks the progress of migrating the Mosaic codebase to Feature-Slice Architecture (FSA).

## Migration Phases

### Phase 0: Preparation (Week 1: April 21-26, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Create directory structure | ✅ Completed | April 21, 2025 | Created main FSA directory structure |
| Update build configuration | ✅ Completed | April 21, 2025 | Updated tsconfig.json and vite.config.ts with path aliases |
| Set up ESLint rules | ✅ Completed | April 21, 2025 | Added rules to enforce FSA dependency structure |
| Create documentation | ✅ Completed | April 21, 2025 | FSA implementation plan created |
| Create migration scripts | ✅ Completed | April 21, 2025 | Created scripts for file migration and import updates |

### Phase 1: Shared Code Migration (Week 2: April 27-May 3, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Migrate UI components | ✅ Completed | April 21, 2025 | Moved UI components to shared/ui |
| Migrate shared utilities | ✅ Completed | April 21, 2025 | Moved shared utilities to shared/lib |
| Migrate API client code | ✅ Completed | April 21, 2025 | Moved API client code to shared/api |
| Update imports | ✅ Completed | April 21, 2025 | Updated imports in 93 files |
| Test shared components | ✅ Completed | April 21, 2025 | Created barrel files and fixed critical imports |
| Fix TypeScript errors in shared/ui components | ✅ Completed | April 21, 2025 | Fixed TypeScript errors in shared/ui components |

### Phase 2: Feature Migration - Exercises (Week 3: May 4-10, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Migrate exercise components | ✅ Completed | April 21, 2025 | Moved to features/exercises/components |
| Migrate exercise state | ✅ Completed | April 21, 2025 | Moved to features/exercises/model |
| Migrate exercise API | ✅ Completed | April 21, 2025 | Moved to features/exercises/api |
| Update imports | ✅ Completed | April 21, 2025 | Updated imports in exercise feature |
| Test exercise feature | 🔄 In Progress | | Working on fixing test failures |

### Phase 3: Feature Migration - Routines (Week 4: May 11-17, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Migrate routine components | ✅ Completed | April 21, 2025 | Moved to features/routines/components |
| Migrate routine builder | ✅ Completed | April 21, 2025 | Moved to features/routines/builder |
| Migrate routine state | ✅ Completed | April 21, 2025 | Moved to features/routines/model |
| Migrate routine API | ✅ Completed | April 21, 2025 | Moved to features/routines/api |
| Update imports | ✅ Completed | April 21, 2025 | Updated imports in routine feature |
| Test routine feature | 🔄 In Progress | | Working on fixing test failures |

### Phase 4: Feature Migration - Workout Player (Week 5: May 18-24, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Migrate player components | ✅ Completed | April 21, 2025 | Moved to features/workout-player/components |
| Migrate player state | ✅ Completed | April 21, 2025 | Moved to features/workout-player/model |
| Migrate player API | ✅ Completed | April 21, 2025 | Moved to features/workout-player/api |
| Update imports | ✅ Completed | April 21, 2025 | Updated imports in player feature |
| Test player feature | 🔄 In Progress | | Working on fixing test failures |

### Phase 5: Feature Migration - Variations (Week 5: May 18-24, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Migrate variation types | ✅ Completed | April 21, 2025 | Moved to features/variations/model |
| Migrate variation service | ✅ Completed | April 21, 2025 | Moved to features/variations/api |
| Migrate variation API | ✅ Completed | April 21, 2025 | Moved to features/variations/api |
| Update imports | ✅ Completed | April 21, 2025 | Updated imports in variations feature |
| Test variations feature | 🔄 In Progress | | Working on fixing test failures |

### Phase 6: Pages and App Integration (Week 6: May 25-31, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Update page components | ✅ Completed | April 21, 2025 | Moved to pages directory |
| Update app initialization | ✅ Completed | April 21, 2025 | Moved to app directory |
| Update main entry point | ✅ Completed | April 21, 2025 | Updated main.tsx |
| Fix remaining imports | 🔄 In Progress | | Working on fixing remaining import issues |
| Integration testing | 🔄 In Progress | | Working on fixing test failures |

### Phase 7: Cleanup and Optimization (Week 7: June 1-7, 2025)
| Task | Status | Completed | Notes |
|------|--------|-----------|-------|
| Remove deprecated files | ⏳ Not Started | | Remove files that have been migrated |
| Optimize barrel files | ✅ Completed | April 21, 2025 | Created barrel files for all features |
| Update documentation | 🔄 In Progress | | Updating documentation with final structure |
| Performance testing | ⏳ Not Started | | Test application performance |
| Final review | ⏳ Not Started | | Review the entire codebase |

## Success Criteria
- ✅ All components migrated to their appropriate locations in FSA structure
- ✅ All imports updated to use path aliases
- 🔄 No TypeScript errors (Working on fixing remaining errors)
- 🔄 All tests passing (Working on fixing test failures)
- 🔄 No regression in functionality (Testing in progress)
- ⏳ No regression in performance (To be evaluated)
- 🔄 Documentation updated to reflect new structure (In progress)

## Status Legend
- ✅ Completed
- 🔄 In Progress
- ⏳ Not Started
- ❌ Blocked

Last Updated: April 21, 2025
