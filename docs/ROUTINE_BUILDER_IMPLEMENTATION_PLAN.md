# Routine Builder Implementation Plan

## Overview

The Routine Builder is a sophisticated system that allows users to create workout routines either from predefined templates or from scratch. This document outlines the technical implementation plan and provides a clear roadmap for development.

## Implementation Status

### Completed Components
- **Template Selection UI**: Fully implemented with search functionality and gradient styling
- **Template Service**: Created service for fetching and caching template data
- **Exercise Service**: Implemented service with tag-matching algorithm
- **Routine Population Service**: Built service to transform templates into populated routines
- **State Management**: Implemented Zustand store with command pattern for undo/redo

### In Progress
- **Routine Builder UI**: Core structure planned, awaiting implementation
- **Exercise Recommendation UI**: Algorithm implemented in service, UI integration pending

### Pending
- **Drag-and-Drop Functionality**: Planned but not yet implemented
- **Routine Persistence**: API contracts defined, implementation pending

## Key Document Components and Their Value

This implementation plan includes several critical components that provide significant value for developers, even with full access to the codebase:

### 1. Complete Data Models with TypeScript Interfaces

**Value:**
- Provides a single source of truth for data structures
- Clearly defines relationships between templates, blocks, and exercises
- Ensures type safety during implementation
- Creates a shared vocabulary for the team

### 2. Explicit Tag-Matching Algorithm

**Value:**
- Makes business logic transparent rather than hidden in implementation details
- Provides a baseline algorithm that can be refined and optimized
- Ensures consistent behavior across the application
- Facilitates debugging and testing of this critical functionality

### 3. Detailed User Flows

**Value:**
- Ensures we're building for actual user journeys, not just technical requirements
- Highlights edge cases that might otherwise be overlooked
- Provides context for why certain features are needed
- Helps prioritize work based on user importance

### 4. Clear API Contracts

**Value:**
- Allows parallel development of frontend and backend components
- Creates clear boundaries of responsibility
- Makes it easier to mock data during development
- Provides a stable interface even as implementations change

### Development Time Savings

Even with access to the full codebase, this documentation saves significant development time by:

- Providing immediate context without requiring a deep dive into the code
- Making architectural decisions clear and explicit
- Ensuring consistent implementation across developers
- Serving as a reference point for the "source of truth" for business logic

## System Architecture

### Core Components

1. **Template Selection UI** (Completed)
   - Card-based interface for browsing and selecting templates
   - Search functionality for finding specific templates
   - Visual indicators for premium templates
   - Connected to TemplateService for data fetching
   - Integrated with Zustand store for state management

2. **Template Definition System** (Completed)
   - Database structure for template definitions
   - Block structure with exercise requirements
   - Tag-based exercise recommendations
   - Caching layer for performance optimization

3. **Routine Builder UI** (In Progress)
   - Template-based builder with predefined blocks
   - Custom builder with flexible structure
   - Exercise selection interface integrated with Exercise Library

4. **State Management** (Completed)
   - Zustand store for managing routine state
   - Command pattern for undo/redo functionality
   - Persistence layer for saving routines
   - Actions for template selection and routine manipulation

## Data Models

### Template Models

```typescript
// Template structure from database
interface Template {
  id: string;
  name: string;
  description: string;
  isProOnly: boolean;
  structure: TemplateStructure;
  createdAt: string;
  updatedAt: string;
}

interface TemplateStructure {
  blocks: TemplateBlock[];
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string[];
}

interface TemplateBlock {
  block_id: string;
  name: string;
  template_tags: string[];  // These match to exercise tags
  exercise_count: {
    min: number;
    max: number;
  };
  instructions: string;
  is_warmup: boolean;
  has_cardio_burst: boolean;
  position?: number; // For ordering blocks
}
```

### Exercise Models

```typescript
// Exercise structure from Exercise Library
interface Exercise {
  id: string;
  name: string;
  description: string;
  tags: string[];
  difficulty: number; // 1-5 scale
  equipment: string[];
  muscleGroups: string[];
  duration: {
    default: number; // in seconds
    min: number;
    max: number;
  };
  thumbnailUrl: string;
  videoUrl: string;
  isResistance: boolean;
  orientationCode?: string;
}

// Exercise instance within a routine
interface RoutineExercise extends Exercise {
  sets: number;
  reps: number;
  duration: number; // in seconds
  weight?: number;
  notes?: string;
  restTime?: number;
}
```

### Routine Models

```typescript
// Complete routine structure (what gets saved)
interface Routine {
  id: string;
  name: string;
  description?: string;
  templateId?: string;  // If derived from a template
  createdAt: string;
  updatedAt: string;
  blocks: RoutineBlock[];
  totalDuration: number;
  difficulty: number;
  userId: string;
  isPublic: boolean;
  tags: string[];
}

interface RoutineBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | 'circuit' | string;
  position: number;
  exercises: RoutineExercise[];
  notes?: string;
  restBetweenExercises?: number;
}
```

### Command Pattern Models

```typescript
// For undo/redo functionality
interface Command {
  execute(): void;
  undo(): void;
  type: string;
  payload: any;
}

interface CommandHistory {
  undoStack: Command[];
  redoStack: Command[];
}
```

## API Contract

### Template APIs

```typescript
// Get all templates
GET /api/templates
Response: Template[]

// Get template by ID
GET /api/templates/:id
Response: Template

// Get template structure
GET /api/templates/:id/structure
Response: TemplateStructure
```

### Exercise APIs

```typescript
// Get all exercises
GET /api/exercises
Response: Exercise[]

// Get exercises by tags
GET /api/exercises?tags=tag1,tag2,tag3
Response: Exercise[]

// Get exercise by ID
GET /api/exercises/:id
Response: Exercise
```

### Routine APIs

```typescript
// Get user routines
GET /api/routines
Response: Routine[]

// Get routine by ID
GET /api/routines/:id
Response: Routine

// Create new routine
POST /api/routines
Body: { name, description, templateId?, blocks, isPublic }
Response: Routine

// Update routine
PUT /api/routines/:id
Body: { name?, description?, blocks?, isPublic? }
Response: Routine

// Delete routine
DELETE /api/routines/:id
Response: { success: boolean }
```

## Implementation Plan

### Phase 1: Data Layer & State Management (Completed)

#### 1.1 Template Data Service (Completed)

**Implementation Details:**
- Created a service to fetch template definitions from the database
- Implemented caching for template definitions with Map data structure
- Added validation logic to ensure templates have valid structure
- Created error handling for API failures

```typescript
// Template service implementation (simplified)
class TemplateService {
  private cache: Map<string, Template> = new Map();
  
  async getAllTemplates(): Promise<Template[]> {
    // Implementation fetches templates from API
    // Caches results for future use
    // Validates template structure
    // Returns array of templates
  }
  
  async getTemplateById(id: string): Promise<Template> {
    // Implementation fetches specific template
    // Uses cache when available
    // Validates template structure
    // Returns template or throws error
  }
  
  validateTemplate(template: Template): boolean {
    // Implementation validates template structure
    // Ensures all required fields are present
    // Checks that blocks have valid structure
    // Returns boolean indicating validity
  }
}
```

**Guardrails Implemented:**
- Templates are validated against schema before use
- Error handling for malformed templates and API failures
- Caching system to reduce API calls and improve performance

#### 1.2 Zustand Store Setup (Completed)

**Implementation Details:**
- Created Zustand store with typed state and actions
- Implemented command pattern for undo/redo functionality
- Added actions for template selection and routine manipulation
- Integrated with Template Service for data fetching

```typescript
// Store implementation (simplified)
const useRoutineStore = create<RoutineState & RoutineActions>((set, get) => ({
  // State management for templates, current routine, and history
  // Actions for fetching templates, selecting templates, and manipulating routines
  // Command pattern implementation for undo/redo
}));
```

**Guardrails Implemented:**
- Type safety for all state operations
- Immutable state updates for predictable behavior
- Error handling for API failures
- Command history management for undo/redo

### Phase 2: Template-Based Routine Builder

#### 2.1 Template Population Logic (Completed)

**Implementation Details:**
- Created RoutinePopulationService to transform templates into routines
- Implemented tag-matching algorithm for exercise recommendations
- Added logic for determining appropriate exercise parameters
- Created structure for routine blocks based on template definition

**Tag-Matching Algorithm Implementation:**
```typescript
// Find exercises that match template tags (simplified)
function findMatchingExercises(templateTags: string[], exercises: Exercise[]): ScoredExercise[] {
  // Implementation scores exercises based on tag matches
  // Gives bonuses for exact matches and containing all template tags
  // Returns sorted array of exercises with scores
}
```

**Guardrails Implemented:**
- Validation of template structure before population
- Fallback mechanisms for missing template data
- Default parameter logic based on exercise type
- Performance optimization for large exercise libraries

#### 2.2 Exercise Recommendation Engine (In Progress)

**Technical Details:**
- Created filtering system to match exercises to template tags
- Implemented relevance scoring for exercise recommendations
- UI integration pending for displaying recommended exercises

**Next Steps:**
- Complete UI integration for exercise recommendations
- Add filtering and sorting options for recommendations
- Implement exercise selection and addition to routine blocks

### Phase 3: UI Integration and Interaction (Pending)

#### 3.1 Routine Builder UI

**Technical Details:**
- Create interface for viewing and editing populated routine
- Implement block and exercise management UI
- Add parameter editing for exercises

#### 3.2 Drag-and-Drop Functionality

**Technical Details:**
- Implement drag-and-drop for reordering exercises and blocks
- Connect to reordering actions in Zustand store
- Add visual feedback for drag operations

## Detailed User Flows

### 1. Template Selection to Builder

1. User navigates to Routine Builder
2. User views template options with search/filter capabilities
3. User selects a template (e.g., "Power to Precision")
4. System fetches complete template definition
5. System creates initial routine structure based on template
6. System pre-populates blocks with instructions and exercise requirements
7. User is presented with the Routine Builder interface showing the template structure
8. For each block, recommended exercises are displayed based on template tags
9. User selects exercises from recommendations to add to each block
10. System validates that minimum exercise requirements are met
11. User can adjust exercise parameters (sets, reps, duration)
12. User saves the completed routine

**Edge Cases:**
- If template fetch fails, show error and fallback templates
- If user wants to modify template structure, prompt for confirmation
- If recommended exercises don't meet user needs, provide access to full exercise library

### 2. Custom Routine Creation

1. User navigates to Routine Builder
2. User selects "Custom Routine" option
3. System creates empty routine with default name
4. User is presented with block type options (warmup, main, cooldown, circuit)
5. User adds blocks to the routine
6. For each block, user can browse the full exercise library
7. User adds exercises to blocks
8. User can reorder blocks and exercises via drag-and-drop
9. User adjusts exercise parameters
10. User names the routine and saves it

**Edge Cases:**
- If user attempts to save without exercises, show validation error
- If user navigates away without saving, prompt to save changes
- If user wants to convert custom routine to template, provide option

### 3. Editing Existing Routine

1. User navigates to My Routines
2. User selects a routine to edit
3. System loads routine data
4. User makes changes to exercises, parameters, or structure
5. Each change is recorded in the undo stack
6. User can undo/redo changes as needed
7. User saves the updated routine

**Edge Cases:**
- If routine data can't be loaded, show error and option to create new
- If changes can't be saved, offer to retry or save as new routine
- If user makes significant changes to template-based routine, ask if they want to unlink from template

## Component Dependencies

### Existing Components to Leverage

1. **UI Components**
   - Card (from @/components/ui/cards)
   - SearchInput (from @/components/ui/form)
   - MobileLayout (from @/components/layouts)
   - Input, Select, Switch components (from @/components/ui/form)

2. **Exercise Library Components**
   - ExerciseCard
   - ExerciseDetail
   - ExerciseFilter

3. **Animation Components**
   - Uses framer-motion for animations
   - Leverages motion.css tokens for consistent motion

### New Components to Build

1. **Template-Specific Components**
   - TemplateBlockComponent
   - ExerciseRecommendations
   - TemplateRequirementIndicator

2. **Builder Components**
   - RoutineBlockList
   - BlockTypeSelector
   - ExerciseParameterEditor
   - DraggableExercise
   - DropZone

3. **Utility Components**
   - UndoRedoControls
   - RoutineSummary
   - ValidationIndicator

### Third-Party Dependencies

1. **Core Libraries**
   - Zustand for state management
   - Framer Motion for animations
   - react-beautiful-dnd for drag-and-drop
   - date-fns for duration calculations

2. **UI Enhancement**
   - react-virtualized for handling large exercise lists
   - react-spring for physics-based animations
   - use-gesture for touch interactions

## Technical Architecture Diagram

```
┌─────────────────────────────────────┐
│           User Interface            │
├─────────────┬───────────┬───────────┤
│  Template   │  Builder  │  Review   │
│  Selection  │    UI     │    UI     │
│ (Completed) │ (Pending) │ (Pending) │
└─────┬───────┴─────┬─────┴─────┬─────┘
      │             │           │
┌─────▼─────────────▼───────────▼─────┐
│            State Management          │
├─────────────┬───────────┬───────────┤
│   Routine   │  Command  │ Exercise  │
│    Store    │  Pattern  │ Selection │
│ (Completed) │(Completed)│(Completed)│
└─────┬───────┴─────┬─────┴─────┬─────┘
      │             │           │
┌─────▼─────────────▼───────────▼─────┐
│               Data Layer             │
├─────────────┬───────────┬───────────┤
│  Template   │ Exercise  │  Routine  │
│ Definitions │  Library  │ Persistence│
│ (Completed) │(Completed)│ (Pending) │
└─────────────┴───────────┴───────────┘
```

## Key Technical Considerations

### 1. Performance

The Routine Builder needs to handle complex state with potentially many exercises and blocks. We'll implement:

- Virtualized lists for large exercise libraries
- Memoization for expensive computations
- Optimistic UI updates for a responsive feel
- Lazy loading of exercise details and images

### 2. Accessibility

To ensure the Routine Builder is usable by everyone:

- Full keyboard navigation support
- Screen reader compatibility with ARIA labels
- Sufficient color contrast for all UI elements
- Support for iOS and Android accessibility features

### 3. Error Handling

Robust error handling will prevent user frustration:

- Graceful degradation when network requests fail
- Clear error messages for validation failures
- Automatic retry for transient errors
- Data recovery options for unsaved changes

## Testing Strategy

1. **Unit Tests**
   - Test individual components in isolation
   - Verify store actions behave as expected
   - Validate command pattern correctly handles undo/redo

2. **Integration Tests**
   - Test the flow between template selection and builder
   - Verify exercise recommendations match template tags
   - Ensure data persistence works correctly

3. **User Testing**
   - Observe real users creating routines from templates
   - Gather feedback on the custom builder experience
   - Identify pain points in the exercise selection process

## Conclusion

This implementation plan provides a structured approach to building a complex, interactive Routine Builder system. By breaking the work into focused phases and components, we can ensure a high-quality result that meets both technical requirements and user expectations.

The plan balances technical considerations with user experience goals, ensuring that the final product is not only functionally complete but also delightful to use. Regular testing and feedback throughout the implementation process will help us refine and improve the system as we build it.

## Implementation Progress Summary

As of April 2025, we have successfully completed the following:

1. **Data Layer**
   - Implemented TemplateService for fetching and caching templates
   - Created ExerciseService with tag-matching algorithm
   - Built RoutinePopulationService for transforming templates into routines

2. **State Management**
   - Implemented Zustand store with command pattern
   - Created actions for template selection and routine manipulation
   - Set up type-safe state management

3. **UI Components**
   - Completed Template Selection UI with search and filtering
   - Connected UI to data services and state management
   - Added loading and error states for better UX

The next phase will focus on implementing the Routine Builder UI, integrating the exercise recommendation engine, and adding drag-and-drop functionality for exercise and block management.
