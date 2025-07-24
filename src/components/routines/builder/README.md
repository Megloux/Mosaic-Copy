# Routine Builder Component

A Spotify-inspired UI for creating and managing workout routines in the Mosaic app.

## Component Architecture

The Routine Builder has been refactored into a modular component system for better maintainability, testability, and collaboration:

```
/src/components/routines/
├── builder/                  # Everything related to RoutineBuilder stays together
│   ├── index.tsx             # Main export (formerly RoutineBuilder.tsx but slimmer)
│   ├── components/           # Sub-components used only by RoutineBuilder
│   │   ├── RoutineHeader.tsx # Spotify-inspired header with action buttons
│   │   ├── RoutineBlock.tsx  # Individual block with exercises
│   │   ├── ExerciseItem.tsx  # Exercise display component
│   │   └── TemplateCard.tsx  # Template selection card
│   ├── hooks/                # Hooks specific to RoutineBuilder
│   │   ├── useRoutineCalculations.ts # Duration and metrics calculations
│   │   └── useRoutineActions.ts      # Action handlers with haptic feedback
│   └── utils/                # Utility functions for RoutineBuilder
│       └── formatters.ts     # Time formatting utilities
```

## User Flow

1. User selects "+" from various places in the app
2. A modal pops up offering "Custom" or "Template" options
3. For custom routines, the user sees a blank routine builder
4. For template-based routines, all blocks are shown and expand to display applicable exercises
5. All routine builders have an "Add Exercise" button

## Features

- **Play Button**: Start the routine
- **Favorite Button**: Mark routines as favorites
- **Share Options**: Share routines with others
- **Time Keeper**: Display total routine duration
- **Save Routine Button**: Save the routine
- **Haptic Feedback**: Tactile response for various interactions
- **Error Handling**: Graceful recovery from errors

## Component Breakdown

### Main Component (index.tsx)

The main RoutineBuilder component orchestrates the overall flow and state management. It:

- Handles the initial modal for routine type selection
- Manages the template selection view
- Coordinates the blocks and exercises
- Handles edit mode and view transitions

### RoutineHeader

A Spotify-inspired header component that displays:

- Routine title
- Total duration
- Action buttons (play, favorite, share, download)

### RoutineBlock

Displays a block of exercises with:

- Expandable/collapsible accordion behavior
- Exercise list with drag-and-drop reordering in edit mode
- Add exercise button

### ExerciseItem

Displays an individual exercise with:

- Exercise name and duration
- Drag handle in edit mode
- Remove button in edit mode
- Info button in view mode

### TemplateCard

Displays a template option in the template selection view with:

- Template name and description
- Difficulty level and estimated duration
- Focus areas
- PRO badge (if applicable)

## Hooks

### useRoutineCalculations

Handles calculations related to the routine:

- Total duration calculation
- Duration formatting
- Estimated calories calculation

### useRoutineActions

Centralizes action handlers with haptic feedback:

- Play, favorite, share, save actions
- Exercise management (add, remove, reorder)
- Error handling and recovery

## Utils

### formatters.ts

Utility functions for formatting time values:

- `formatDuration`: Formats seconds to "30min" or "1h 30min"
- `formatExerciseDuration`: Formats seconds to "mm:ss" format

## Testing

Each component and utility has corresponding test files in the `__tests__` directory:

- Unit tests for utility functions
- Hook tests with mock data
- Component tests with simulated user interactions

## Usage

```tsx
import { RoutineBuilder } from '@/components/routines';

// In your route or page component
const MyPage = () => {
  return <RoutineBuilder />;
};
```

## Design Principles

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components are designed to be reusable
3. **Testability**: Logic is separated from presentation for easier testing
4. **Performance**: Memoization and optimized rendering
5. **Accessibility**: ARIA attributes and keyboard navigation

## Spotify-Inspired Elements

- Header with play, favorite, share buttons
- List/grid toggle for template selection
- Card-based UI for templates and exercises
- Expandable blocks similar to playlists
- Duration display in familiar format
