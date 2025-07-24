# SaveButton Component

## Overview
The SaveButton component handles two distinct save patterns in Mosaic, similar to Spotify's playlist management:

1. Primary Save (✓)
   - Used when saving your own routines
   - Shows save status with checkmark
   - Includes processing state
   - Provides haptic feedback for success/error

2. Favorite Action (♥)
   - Used for saving public routines to your library
   - Pro-user feature only
   - Immediate feedback
   - Heart icon with haptic confirmation

## Interface

```typescript
interface SaveButtonProps extends Omit<StandardButtonProps, 'variant' | 'children'> {
  /** Is this a favorite action (♥) vs primary save (✓) */
  isFavoriteAction: boolean;
  
  /** Current saved/favorited status */
  isSaved: boolean;
  
  /** Pro user check for favorite action */
  isProUser?: boolean;
  
  /** Callback when save/favorite status changes */
  onSaveChange: (newStatus: boolean) => void;
  
  /** Optional name of routine for aria-label */
  routineName?: string;
}
```

## Use Cases

### 1. Saving Your Own Routine
```typescript
// When creating/editing your own routine
<SaveButton
  isFavoriteAction={false}
  isSaved={routineIsSaved}
  onSaveChange={handleSaveRoutine}
  routineName="Morning Flow"
/>
```

### 2. Favoriting Public Routines
```typescript
// When viewing someone else's public routine
<SaveButton
  isFavoriteAction={true}
  isSaved={isInFavorites}
  isProUser={userIsPro}
  onSaveChange={handleFavoriteRoutine}
  routineName="Luke's Power Flow"
/>
```

## Behavior Patterns

### Primary Save (Your Routines)
1. Initial Save:
   - User creates routine
   - Clicks save
   - Haptic feedback on success
   - Visual checkmark confirmation

2. Auto-save Updates:
   - Changes during editing
   - Silent save in background
   - No haptic feedback needed

### Favorite (Public Routines)
1. Pro Users:
   - Can favorite any public routine
   - Immediate heart fill animation
   - Haptic confirmation
   - Appears in their saved routines

2. Basic Users:
   - Heart icon disabled
   - Tooltip suggesting upgrade
   - No haptic feedback

### Shared Routines
- No save button needed
- Automatically appears in recipient's library
- Can be removed like any saved routine

## iOS-Specific Behavior

### Haptic Feedback Patterns
1. Primary Save:
   - Tap: Light haptic (acknowledgment)
   - Success: Success haptic
   - Error: Error haptic pattern

2. Favorite Action:
   - Tap: Light haptic
   - Instant success feedback
   - No processing state needed

### Touch Feedback
- Clear active states
- iOS-native touch response
- Proper touch target size (44px)
- Disabled state visual feedback

## Visual States

### Primary Save Button
```css
/* Default */
background: transparent;
border: 2px solid var(--color-primary);

/* Saved */
background: var(--color-primary);
checkmark: visible;

/* Processing */
opacity: 0.7;
spinner: visible;

/* Error */
border-color: var(--color-error);
```

### Favorite Button
```css
/* Default */
color: var(--color-primary);
heart-fill: 0%;

/* Saved */
color: var(--color-primary);
heart-fill: 100%;

/* Disabled (Basic User) */
opacity: 0.5;
pointer-events: none;
```

## Accessibility

### ARIA Labels
```typescript
// Primary Save
`${isSaved ? 'Update' : 'Save'} ${routineName} routine`

// Favorite
`${isSaved ? 'Remove' : 'Save'} ${routineName} to your library`
```

### Keyboard Navigation
- Tab focus with visible focus ring
- Space/Enter to trigger
- Escape to cancel save action

## Testing Considerations

1. Primary Save States:
   - Initial save
   - Update existing
   - Error handling
   - Processing state

2. Favorite Action:
   - Pro user access
   - Basic user restrictions
   - Toggle behavior

3. Haptic Feedback:
   - Correct timing
   - Appropriate patterns
   - Error states

4. Accessibility:
   - Screen reader support
   - Keyboard navigation
   - ARIA labels

## Best Practices

1. Use Primary Save (✓) for:
   - User's own routine creation
   - Routine modifications
   - Any process requiring confirmation

2. Use Favorite (♥) for:
   - Public routine library
   - Featured routines
   - Shared routine collection

3. Never use SaveButton for:
   - Individual exercise saving
   - Template management
   - System settings

4. Always provide:
   - Clear success/error feedback
   - Appropriate haptic response
   - Visual state indication
   - Proper accessibility support
