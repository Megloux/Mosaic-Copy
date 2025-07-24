# Routine Builder - Planning Document

## Overview
The Routine Builder is the next major component in the Mosaic application, allowing users to create, edit, and organize workout routines by combining exercises from the Exercise Library. Following Spotify's design principles, the Routine Builder will provide both guided templates and flexible customization options, with a focus on intuitive interactions and immediate visual feedback.

## User Flow

1. **Template Selection**
   - User initiates routine creation process
   - Presented with template selection screen
   - Chooses from predefined templates or "Custom Routine" option
   - Pro templates clearly marked with premium indicators

2. **Routine Building**
   - Template populates with predefined structure and exercise placeholders
   - User customizes by adding/removing exercises, adjusting parameters
   - Real-time preview and feedback as routine takes shape
   - Guided assistance based on template requirements

3. **Review & Save**
   - Summary view with statistics and overview
   - Final adjustments before saving
   - Options to share, export, or schedule the routine

## Template Selection Screen

Following the reference design but elevated to Spotify quality standards, the template selection screen will feature:

### Visual Design
- Clean, card-based layout with consistent spacing
- Bold typography with clear hierarchy
- Subtle animations on hover/selection
- Visual indicators for pro-only templates
- Dark mode optimized with proper contrast

### Template Options
Based on the database structure, we'll display:

1. **Power to Precision** - Build power through controlled movements
2. **The OG** - Classic Pilates exercises focusing on fundamentals
3. **Stacked - Anterior Day** - Targeted workout for the front of the body
4. **Stacked - Posterior Day** - Focused on the back of the body
5. **Stacked - Push/Pull Day** - Alternating push and pull movements
6. **Cable/Strap Focused** - Dynamic resistance training
7. **Upper Body Focus** - Concentrated upper body workout
8. **Lower Body Focus** - Targeted lower body exercises
9. **Power Round** - High-intensity workout with cardio bursts
10. **Custom Routine** - Start from scratch with a blank canvas
11. **New Folder** - Organizational option for saved routines

### Interaction Design
- Haptic feedback on selection (iOS)
- Smooth transitions between screens
- Contextual information on long-press
- Accessibility considerations for all interactions

## Core Components

### 1. TemplateSelectionScreen
- Grid/list of template options with visual previews
- Filter/search capabilities
- Pro badge indicators
- "Create New" and "Custom" options

### 2. RoutineBuilder
- Container component for the entire building experience
- Manages overall state and layout
- Coordinates between sub-components
- Implements command pattern for actions

### 3. RoutineHeader
- Routine name, description, and metadata
- Save/publish controls
- Overall routine settings
- Autosave indicators

### 4. BlockManager
- Visual representation of workout blocks (warm-up, strength, etc.)
- Add/remove/reorder blocks
- Block-level settings and parameters

### 5. ExerciseSelector
- Integration with Exercise Library
- Filtered view of available exercises
- Quick-add functionality
- Smart recommendations based on block type

### 6. RoutineTimeline
- Visual representation of the routine sequence
- Drag-and-drop exercise reordering
- Time-based visualization with proper scaling
- Zoom controls for macro/micro views
- Visual differentiation of blocks and exercise types

### 7. ExerciseConfigPanel
- Configure exercise-specific settings
- Duration, reps, resistance controls
- Notes and modifications
- Visual feedback on changes

### 8. RoutineSummary
- Statistics and overview of the routine
- Focus area breakdown
- Time and difficulty indicators
- Energy expenditure estimates

## Data Model

```typescript
// Template definition from database
interface Template {
  id: string;
  name: string;
  description: string;
  structure: {
    blocks: TemplateBlock[];
  };
  is_pro_only: boolean;
  created_at: string;
}

interface TemplateBlock {
  block_id: string;
  name: string;
  exercises: string[]; // Exercise IDs or types
}

// Runtime routine model
interface Routine {
  id: string;
  template_id?: string; // Optional reference to source template
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_template: boolean;
  metadata: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_duration: number; // in minutes
    focus_areas: string[];
    tags: string[];
  };
  blocks: RoutineBlock[];
}

interface RoutineBlock {
  id: string;
  name: string;
  type: 'warmup' | 'main' | 'cooldown' | 'circuit' | string;
  position: number;
  exercises: RoutineExercise[];
  
  // Block-level settings
  rest_between_exercises?: number; // in seconds
  repeat_count?: number;
}

interface RoutineExercise {
  id: string;
  exercise_id: string; // Reference to Exercise from Library
  position: number;
  duration: number; // in seconds
  reps?: number;
  sets?: number;
  resistance?: {
    light_springs: number;
    heavy_springs: number;
  };
  notes?: string;
  modifications?: string;
  
  // Transition information
  transition_time?: number; // Time before next exercise
  transition_type?: 'rest' | 'active' | 'setup';
}
```

## Enhanced State Management

We'll implement a robust state management system using Zustand with several key enhancements:

### Command Pattern for Actions

Following Spotify's approach to playlist editing, we'll implement a command pattern that:

```typescript
// Command interface
interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}

// Example commands
class AddExerciseCommand implements Command {
  constructor(
    private store: RoutineBuilderStore,
    private blockId: string,
    private exercise: Exercise,
    private position?: number
  ) {}
  
  execute() {
    this.store.addExerciseToBlock(this.blockId, this.exercise, this.position);
  }
  
  undo() {
    this.store.removeExerciseFromBlock(this.blockId, this.exercise.id);
  }
  
  redo() {
    this.execute();
  }
}
```

### Derived State & Selectors

```typescript
interface RoutineBuilderState {
  // ... base state
  
  // Derived values
  selectors: {
    getTotalDuration: () => number;
    getExerciseCount: () => number;
    getFocusAreaBreakdown: () => Record<string, number>;
    getBlockDuration: (blockId: string) => number;
  };
}
```

### Persistence Strategy

```typescript
// In store creation
const useRoutineBuilderStore = create<RoutineBuilderState>()(
  persist(
    // Store implementation
    {
      // ...
    },
    {
      name: 'routine-builder-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentRoutine: state.currentRoutine,
        commandHistory: state.commandHistory,
      }),
    }
  )
);

// Server synchronization
const syncWithServer = async (routine: Routine) => {
  try {
    const response = await api.saveRoutine(routine);
    return response.data;
  } catch (error) {
    // Error handling with retry logic
  }
};
```

### Error Handling

```typescript
interface RoutineBuilderState {
  // ... other state
  
  error: {
    type: 'save' | 'load' | 'update' | null;
    message: string | null;
    timestamp: number | null;
  };
  
  // Error actions
  setError: (type: string, message: string) => void;
  clearError: () => void;
  retryFailedOperation: () => Promise<void>;
}
```

## Mobile & Touch Optimizations

### Touch Interactions

- Custom drag handlers for iOS/Android
- Larger touch targets (minimum 44x44pt)
- Momentum scrolling for timeline
- Haptic feedback on key actions
- Gesture recognition for common actions (pinch to zoom, swipe to delete)

### Viewport Adaptations

- Responsive layout with breakpoints
- Bottom sheet patterns for mobile configuration
- Collapsible panels to maximize screen space
- Context-aware UI that prioritizes relevant controls

### iOS-Specific Requirements

- Safe area compliance
- Native-feeling animations and transitions
- Support for dynamic type
- Proper keyboard handling

## User Experience Flow Details

### Empty States

- Guided empty states with clear CTAs
- Animated illustrations for visual interest
- Contextual help and suggestions
- Quick-start options from templates

### Progressive Disclosure

- Essential controls visible by default
- Advanced options in expandable sections
- Context-sensitive help tooltips
- "Learn more" links for complex features

### Feedback Mechanisms

- Visual confirmation of actions
- Subtle animations for state changes
- Toast notifications for background processes
- Progress indicators for longer operations

### Autosave Functionality

- Automatic saving at regular intervals
- Visual indicator of save status
- Conflict resolution for simultaneous edits
- Local draft preservation during connectivity issues

## Performance Considerations

### Virtualization Strategy

For routines with many exercises, we'll implement:

```typescript
// Example with react-window
import { FixedSizeList } from 'react-window';

const ExerciseList = ({ exercises }) => (
  <FixedSizeList
    height={500}
    width="100%"
    itemCount={exercises.length}
    itemSize={80}
  >
    {({ index, style }) => (
      <ExerciseItem 
        exercise={exercises[index]} 
        style={style}
      />
    )}
  </FixedSizeList>
);
```

### Optimistic Updates

```typescript
const saveRoutine = async () => {
  // Store previous state for rollback
  const previousRoutine = { ...currentRoutine };
  
  // Optimistically update UI
  setSaveStatus('saving');
  
  try {
    // Attempt actual save
    await api.saveRoutine(currentRoutine);
    setSaveStatus('saved');
  } catch (error) {
    // Rollback on failure
    setCurrentRoutine(previousRoutine);
    setSaveStatus('failed');
    setError('save', error.message);
  }
};
```

### Lazy Loading

- Dynamic imports for non-critical components
- On-demand loading of exercise details
- Prefetching based on user behavior patterns
- Asset optimization for images and animations

### Memory Management

- Cleanup of event listeners in component unmount
- Proper disposal of drag-and-drop instances
- Throttling/debouncing of frequent events
- Memoization of expensive calculations

## Advanced Timeline Visualization

### Time Representation

- Proportional visual sizing based on duration
- Color coding for different exercise types
- Clear delineation of transitions and rest periods
- Compact vs. expanded views

### Zoom Levels

- Macro view: Entire routine at a glance
- Standard view: Block-level focus
- Micro view: Detailed exercise parameters
- Smooth transitions between zoom levels

### Visual Cues

- Distinct styling for different block types
- Icons representing exercise categories
- Visual indicators for transitions and rest
- Progress indicators for completed portions

### Preview Mechanism

- Hover/tap to preview exercise details
- Quick-view cards with essential information
- Inline video thumbnails where available
- Contextual actions based on preview

## Implementation Phases

### Phase 1: Template Selection & Core Structure
- Implement template selection screen
- Set up data models and Zustand store with command pattern
- Create basic layout and navigation
- Implement routine metadata editing

### Phase 2: Block & Exercise Management
- Implement block creation and management
- Integrate Exercise Library selector
- Create exercise configuration panel
- Build basic timeline representation

### Phase 3: Timeline & Interactions
- Implement advanced timeline visualization
- Add drag-and-drop with mobile optimization
- Create zoom levels and preview functionality
- Implement routine statistics and feedback

### Phase 4: Polish & Performance
- Add animations and micro-interactions
- Implement virtualization and performance optimizations
- Add sharing and export functionality
- Implement autosave and error handling

## Integration with Exercise Library

The Routine Builder will integrate with the Exercise Library through:

1. **Component Reuse**
   - Reuse ExerciseCard for consistent display
   - Leverage ExerciseDetail for viewing exercise details
   - Adapt Grid component for template selection

2. **State Integration**
   - Access Exercise Library state for available exercises
   - Maintain separation of concerns between browsing and building
   - Share exercise data models and types

3. **UI Consistency**
   - Follow the same design tokens and patterns
   - Maintain the Spotify-inspired visual language
   - Ensure consistent animations and interactions

## Testing Strategy

1. **Component Tests**
   - Test each component in isolation
   - Verify correct rendering in different states
   - Test user interactions and state updates

2. **Integration Tests**
   - Test interaction between components
   - Verify data flow through the application
   - Test drag-and-drop functionality

3. **Store Tests**
   - Test command pattern implementation
   - Verify undo/redo functionality
   - Test derived state calculations
   - Verify persistence and error handling

4. **Performance Tests**
   - Measure and optimize render times
   - Test with large datasets
   - Verify memory usage patterns

## Accessibility Considerations

- Keyboard navigation for all interactions
- Alternative interactions for drag-and-drop
- ARIA attributes for dynamic content
- Color contrast ratios meeting WCAG standards
- Screen reader announcements for state changes
- Focus management for modal dialogs

## Next Steps

1. Create the template selection screen
2. Implement the Zustand store with command pattern
3. Build the block management interface
4. Begin integration with the Exercise Library
