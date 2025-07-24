# Template Selection Screen - Design Specification

## Overview
The Template Selection screen is the entry point to the Routine Builder, offering users a curated collection of workout templates and the option to create custom routines. Following Spotify's design principles, this screen emphasizes visual appeal, clear information hierarchy, and intuitive interactions.

## Visual Design

```
┌─────────────────────────────────────────────────┐
│                                             ⚙️   │
│  ← My Routines                                  │
│                                                 │
│  Choose Template                                │
│  ───────────────────────────────────────────── │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🔥 Power to Precision                 > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🧘 The OG                             > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💪 Stacked - Anterior Day     ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💪 Stacked - Posterior Day    ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💪 Stacked - Push/Pull Day    ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🔄 Cable/Strap Focused        ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💪 Upper Body Focus          ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 🦵 Lower Body Focus          ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ⚡ Power Round                ✦ PRO  > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ✨ Custom Routine                     > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 📁 New Folder                         > │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Design Elements

### Typography
- **Header**: "Choose Template" - 28px, SFProDisplay-Bold
- **Template Names**: 18px, SFProDisplay-Semibold
- **PRO Badge**: 14px, SFProDisplay-Medium, uppercase

### Color Scheme
- **Background**: Deep gradient (#121212 to #181818)
- **Card Background**: #282828
- **Card Hover State**: #3E3E3E
- **Text**: Primary white (#FFFFFF), Secondary light gray (#B3B3B3)
- **PRO Badge**: Gold gradient (#F2C94C to #F2994A)
- **Icons**: Category-specific accent colors

### Animations & Interactions
- **Card Hover**: Subtle scale (1.02) and elevation increase
- **Card Press**: Scale down (0.98) with haptic feedback
- **Selection Transition**: Smooth crossfade to routine builder
- **Back Button**: Elastic back animation

## Component Specifications

### TemplateCard Component
```tsx
interface TemplateCardProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  isProOnly: boolean;
  onSelect: (id: string) => void;
}
```

### Visual States
1. **Default**: Clean card with left-aligned icon and name
2. **Hover/Focus**: Subtle elevation and scale increase
3. **Active/Pressed**: Scale reduction with haptic feedback
4. **Disabled**: Reduced opacity (for unavailable pro templates)

### Accessibility Features
- High contrast mode support
- Screen reader descriptions for each template
- Keyboard navigation with clear focus states
- Touch targets minimum 44×44pt

## High-Fidelity Mockup

### Card Design
```
┌─────────────────────────────────────────────┐
│                                             │
│  🔥  Power to Precision                  >  │
│     Build power through controlled moves    │
│                                             │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│                                             │
│  💪  Stacked - Anterior Day      ✦ PRO  >  │
│     Front body focus: chest, abs, quads     │
│                                             │
└─────────────────────────────────────────────┘
```

### PRO Badge Design
```
  ✦ PRO  
```
- Gold gradient background
- Star symbol prefix
- Uppercase "PRO" text
- Subtle glow effect

### Empty State
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                      🏋️‍♀️                        │
│                                                 │
│           Create Your First Routine             │
│                                                 │
│    Choose a template or start from scratch      │
│    to build your perfect workout routine        │
│                                                 │
│    ┌─────────────────────────────────────┐     │
│    │       Browse Templates               │     │
│    └─────────────────────────────────────┘     │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Micro-Interactions

### Template Card Selection
1. User taps template card
2. Card scales down briefly (0.98)
3. Haptic feedback (light tap)
4. Card scales up (1.05) with elevation
5. Card content fades out
6. Screen transitions to Routine Builder

### PRO Template Interaction (Non-Subscribers)
1. User taps PRO template card
2. Card scales down briefly (0.98)
3. Haptic feedback (light tap)
4. PRO badge pulses with glow effect
5. Upgrade modal slides up from bottom
6. Background dims with blur effect

## Implementation Notes

### Reusable Components
- Leverage existing `Card` component with custom styling
- Use `Grid` component for responsive layout
- Adapt `Modal` component for PRO upgrade prompt

### Performance Considerations
- Lazy load template thumbnails
- Preload first template data on screen entry
- Cache recently viewed templates

### Responsive Behavior
- **Mobile**: Single column, full-width cards
- **Tablet**: Two-column grid with larger cards
- **Desktop**: Three-column grid with hover effects

## Animation Specifications

### Card Hover Animation
```css
.template-card {
  transition: transform 0.2s ease-out, 
              box-shadow 0.2s ease-out;
}

.template-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```

### Selection Animation
```css
@keyframes cardSelection {
  0% { transform: scale(1); }
  40% { transform: scale(0.98); }
  100% { transform: scale(1.05); }
}

.template-card.selected {
  animation: cardSelection 0.3s ease-out forwards;
}
```

## Design Tokens

```typescript
// Color tokens
const colors = {
  background: {
    primary: '#121212',
    secondary: '#181818',
    card: '#282828',
    cardHover: '#3E3E3E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
  },
  accent: {
    pro: {
      start: '#F2C94C',
      end: '#F2994A',
    },
  },
};

// Typography tokens
const typography = {
  header: {
    fontFamily: 'SFProDisplay-Bold',
    fontSize: '28px',
    lineHeight: '34px',
  },
  card: {
    title: {
      fontFamily: 'SFProDisplay-Semibold',
      fontSize: '18px',
      lineHeight: '22px',
    },
    description: {
      fontFamily: 'SFProDisplay-Regular',
      fontSize: '14px',
      lineHeight: '18px',
    },
  },
  badge: {
    fontFamily: 'SFProDisplay-Medium',
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
};

// Spacing tokens
const spacing = {
  card: {
    padding: '16px',
    marginBottom: '12px',
    borderRadius: '8px',
  },
  header: {
    marginBottom: '24px',
    marginTop: '16px',
  },
};

// Animation tokens
const animation = {
  duration: {
    short: '0.2s',
    medium: '0.3s',
    long: '0.5s',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
};
```

## Next Steps

1. Implement base `TemplateCard` component
2. Create template selection screen layout
3. Add animations and interactions
4. Implement PRO badge and upgrade flow
5. Connect to template data from database
6. Add analytics tracking for template selection
