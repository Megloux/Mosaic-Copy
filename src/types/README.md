# Mosaic Type System

## Overview
This directory contains the TypeScript type definitions for Mosaic, the Spotify of Pilates Programming. The type system is designed to ensure data consistency across the entire application.

## File Structure
- `ids.ts` - ID pattern definitions and validation
- `models.ts` - Core data models matching database schema
- `index.ts` - Central export point

## ID Patterns
We use consistent text-based IDs throughout the application:
- Exercises: `e1`, `e2`, ... (e.g., "e1" for Modified Plank)
- Categories: `c1`, `c2`, ... (e.g., "c1" for Abs)
- Blocks: `b1`, `b2`, ... (e.g., "b1" for CenterCore)
- Routines: `r1`, `r2`, ... (for user-created routines)
- Templates: `t1`, `t2`, ... (for pre-built templates)

## Usage Examples

### Compile-Time Type Checking
```typescript
import { Exercise, ExerciseId } from '@/types';

// ✅ Valid - matches e{number} pattern
const validId: ExerciseId = "e1";

// ❌ Type Error - doesn't match pattern
const invalidId: ExerciseId = "exercise1";
```

### Runtime Validation
```typescript
import { isExerciseId, assertExercise } from '@/types';

// Type Guard Usage
if (isExerciseId(someId)) {
    // TypeScript knows someId is ExerciseId here
}

// Data Validation
try {
    const exercise = assertExercise(data);
    // exercise is typed as Exercise
} catch (error) {
    // Handle invalid data
}
```

### Working with IDs
```typescript
import { getIdNumber, createId } from '@/types';

const num = getIdNumber("e1"); // returns 1
const newId = createId("e", 2); // returns "e2"
```

## Why This Design?
1. **Type Safety**: Catch ID format errors at compile time
2. **Runtime Validation**: Validate external data (API responses, user input)
3. **Database Alignment**: Types exactly match Supabase schema
4. **Developer Experience**: Clear patterns and helpful utilities

## Best Practices
1. Always use the provided type guards for runtime checks
2. Use Zod schemas when validating external data
3. Never create IDs manually - use the `createId` helper
4. Add new types to the appropriate file and export via `index.ts`
