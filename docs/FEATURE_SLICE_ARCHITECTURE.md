# Feature-Slice Architecture (FSA) in Mosaic

## Overview

This document describes the Feature-Slice Architecture (FSA) implementation in the Mosaic codebase. FSA is a methodology for organizing code in a frontend application that promotes maintainability, scalability, and clear separation of concerns.

## Directory Structure

The Mosaic codebase is organized according to the following FSA structure:

```
src/
├── app/                  # Application initialization, global providers, etc.
├── pages/                # Application pages/routes
├── features/             # Business logic features
│   ├── exercises/        # Exercise feature
│   │   ├── api/          # API integration for exercises
│   │   ├── components/   # UI components for exercises
│   │   ├── lib/          # Feature-specific utilities
│   │   └── model/        # State management for exercises
│   ├── routines/         # Routines feature
│   ├── workout-player/   # Workout player feature
│   └── variations/       # Variations feature
├── shared/               # Shared code used across features
│   ├── api/              # Shared API clients and utilities
│   ├── lib/              # Shared utilities
│   └── ui/               # Shared UI components
└── entities/             # Business entities (if needed)
```

## Layer Responsibilities

### App Layer
- Application initialization
- Global providers (theme, auth, etc.)
- Service worker registration
- Root layout

### Pages Layer
- Route definitions
- Page layouts
- Integration of features for each page

### Features Layer
Each feature is organized into its own directory with the following structure:

- **api/** - API integration for the feature
- **components/** - UI components specific to the feature
- **lib/** - Feature-specific utilities
- **model/** - State management for the feature (stores, hooks, types)

### Shared Layer
- **api/** - Shared API clients and utilities
- **lib/** - Shared utilities and helper functions
- **ui/** - Shared UI components that are used across features

## Import Rules

To maintain the architecture and prevent circular dependencies, we follow these import rules:

1. Layers can only import from layers below them:
   - Pages can import from features, shared, and entities
   - Features can import from shared and entities
   - Shared can import from entities
   - Entities cannot import from any other layer

2. Within a feature, modules can only import from their own feature or from lower layers:
   - Components can import from model, lib, and api
   - Model can import from lib and api
   - Lib can import from api
   - API should not import from other modules within the feature

3. Always use absolute imports with path aliases:
   - `@/app/*` for app layer
   - `@/pages/*` for pages layer
   - `@/features/*` for features layer
   - `@/shared/*` for shared layer
   - `@/entities/*` for entities layer

## Barrel Files

Each feature and shared module has a barrel file (`index.ts`) that exports the public API for that module. This helps maintain clear boundaries between modules and makes imports cleaner.

Example:
```typescript
// src/features/exercises/index.ts
export { ExerciseCard, ExerciseDetail } from './components';
export { useExerciseStore } from './model';
export type { Exercise, ExerciseCategory } from './model/types';
```

## State Management

State is organized into three categories:

1. **Feature State** - State specific to a feature, managed within the feature's model directory
2. **Shared State** - State shared between features, managed in the shared layer
3. **UI State** - Local component state for UI concerns

## Testing

Tests are organized alongside the code they are testing:

- Component tests are in `__tests__` directories within the component directories
- Model tests are in `__tests__` directories within the model directories
- API tests are in `__tests__` directories within the API directories

## Benefits of FSA in Mosaic

- **Clear Boundaries** - Each feature is isolated with clear boundaries
- **Scalability** - New features can be added without affecting existing ones
- **Maintainability** - Code is organized by business domain, making it easier to understand
- **Reusability** - Shared code is properly separated from feature-specific code
- **Testability** - Clear boundaries make testing easier
- **Onboarding** - New developers can understand the codebase more quickly

## Migration Status

The migration to FSA is tracked in the [FSA_MIGRATION_TRACKER.md](./FSA_MIGRATION_TRACKER.md) file.
