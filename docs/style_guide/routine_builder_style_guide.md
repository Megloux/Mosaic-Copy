# Routine Builder Style Guide

> Reference for applying the Routine Builder's visual language across the rest of Mosaic.

---

## Core Principles

1. **Dark-first** — `rgb(var(--core-black))` background everywhere. Content floats on dark.
2. **Glassmorphism** — Surfaces use translucent backgrounds + `backdrop-filter: blur()`.
3. **Ambient glow** — Subtle blurred color circles behind key elements (not on everything).
4. **Minimal borders** — Use `rgba(255,255,255,0.06)` or accent-colored borders at low opacity.
5. **Motion with purpose** — Spring curves for enters, smooth ease for hovers. No bouncy chaos.

---

## Color Usage

### Backgrounds
```css
/* Page background */
background-color: rgb(var(--core-black));

/* Card/surface */
background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
border: 1px solid rgba(255,255,255,0.06);

/* Active/selected card (use accent color) */
background: linear-gradient(135deg, rgba(ACCENT,0.14) 0%, rgba(ACCENT,0.04) 100%);
border: 1px solid rgba(ACCENT,0.22);
```

### Accent Colors (RGB triplets for `rgba()`)
| Name | RGB | Used For |
|------|-----|----------|
| Teal (brand) | `0,183,120` | Primary actions, "Create New", teal glow |
| Purple | `168,85,247` | Templates, custom exercises, PRO features |
| Red | `239,68,68` | Delete, destructive, Power Round |
| Amber | `251,191,36` | Warmup blocks, warnings |
| Blue | `59,130,246` | Lower Body, info |
| Pink | `236,72,153` | Upper Body |
| Green | `34,197,94` | Cable/Strap, success |
| Orange | `251,146,60` | Obliques, Stacked templates |
| Light Blue | `96,165,250` | Posterior, secondary info |

### Text Opacity Scale
```css
/* Primary text */
color: rgb(var(--core-white));          /* 100% */

/* Secondary text */
color: rgba(255,255,255,0.5);          /* 50% */

/* Tertiary / hint text */
color: rgba(255,255,255,0.4);          /* 40% */

/* Disabled / subtle */
color: rgba(255,255,255,0.25);         /* 25% */

/* Micro labels */
color: rgba(255,255,255,0.35);         /* 35% — section headers */
```

---

## Typography

### Font Tokens (from `tokens/typography.css`)
```css
font-family: var(--font-primary);       /* System font stack */
font-weight: var(--font-thin);          /* Light body text */
font-weight: 500;                       /* Medium — metadata */
font-weight: 600;                       /* Semibold — labels, buttons */
font-weight: 700;                       /* Bold — headings */
```

### Text Sizing Patterns
| Element | Size | Weight | Letter Spacing |
|---------|------|--------|----------------|
| Page title | `text-3xl` (30px) | 700 | `-0.03em` |
| Section label | `text-xs` uppercase | 600 | `tracking-widest` |
| Card title | `text-base` (16px) | 600 | `-0.01em` |
| Card subtitle | `text-xs` (12px) | `--font-thin` | default |
| Badge/tag | `text-[9px]` | 700 | `tracking-widest` |
| Exercise name | `text-sm` (14px) | 500 | `-0.01em` |
| Stats/metadata | `text-xs` or `text-[10px]` | 500 | default |

---

## Layout Patterns

### Page Structure
```
[Gradient Hero Header]     — pt-14 pb-8, gradient bg fading down
[Sticky Nav Bar]           — blur(20px), rgba(0,0,0,0.85) bg, border-bottom
[Content with padding]     — px-5, space-y-3 between cards
[Bottom safe area]         — pb-12
```

### Spacing
- Page horizontal padding: `px-5` (20px)
- Card internal padding: `p-4` to `p-5`
- Between cards: `space-y-3` (12px)
- Between sections: `mb-6` (24px)

### Card Shapes
- Cards: `rounded-2xl` (16px radius)
- Badges/pills: `rounded-full`
- Icon containers: `rounded-2xl` (large) or `rounded-xl` (medium) or `rounded-lg` (small)

---

## Component Patterns

### Hero Header
```
- Teal gradient background: linear-gradient(180deg, rgba(0,183,120,0.22) 0%, rgba(0,0,0,0) 100%)
- Blurred circle glow behind: w-[400px] h-[250px] blur-[120px] rgba(0,183,120,0.10)
- Eyebrow label (uppercase, teal, tracking-widest)
- Title (text-3xl, bold, tight leading)
- Subtitle (text-sm, 50% white)
```

### Sticky Header Bar
```css
position: sticky; top: 0; z-index: 20;
background-color: rgba(0,0,0,0.85);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border-bottom: 1px solid rgba(255,255,255,0.06);
padding: 12px 20px;
```

### Action Buttons (Primary)
```
- Background: accent color at 15% opacity
- Text: accent color at full
- Rounded: rounded-full
- Font: text-xs font-semibold
- Hover: scale(1.03)
- Tap: scale(0.97)
```

### Action Buttons (Secondary/Ghost)
```
- Background: rgba(255,255,255,0.06)
- Text: rgba(255,255,255,0.5)
- Same rounded-full, text-xs font-semibold
```

### Cards with Accent Identity
```
- Each card gets an RGB triplet (e.g., '168,85,247')
- Background: linear-gradient using that RGB at 0.20 → 0.04
- Border: rgba(RGB, 0.12)
- Ambient glow: blurred circle in top-right at rgba(RGB, 0.15)
- Icons/stats use the accent at 0.7 opacity
```

### Expandable Block Cards
```
- Header: click toggles expanded state
- ChevronDown icon rotates 180° with motion
- Body uses AnimatePresence + motion.div with height animation
- Empty state: centered icon + instruction text + action buttons
- Filled state: vertical list of exercise rows with add buttons at bottom
```

### Exercise Rows
```
- Layout: flex row — grip handle | index badge | name + metadata | remove button
- Index badge: 24px rounded-lg square, accent colored
- Metadata line: duration · spring info · tags (separated by · dots at white/10)
- Remove button: hidden, appears on group-hover (opacity transition)
- Custom exercises: dashed purple border, inline text input, duration dropdown
```

---

## Motion Tokens (from `tokens/motion.css`)

### Timing
```css
transition-duration: var(--motion-natural);  /* Standard transitions */
transition-duration: var(--motion-smooth);   /* Slower, smoother */
```

### Framer Motion Curves
```js
// Enter animation (spring-like overshoot)
ease: [0.24, 1.12, 0.76, 1]

// Standard
duration: 0.3

// Staggered list items
delay: index * 0.05  (gallery cards)
delay: index * 0.06  (block cards)
```

### Interaction States
```js
whileHover: { scale: 1.01 }   // Cards, large buttons
whileHover: { scale: 1.02 }   // Gallery template cards
whileHover: { scale: 1.03 }   // Small action buttons
whileHover: { scale: 1.1 }    // Icon buttons
whileTap:   { scale: 0.97 }   // Cards, large buttons
whileTap:   { scale: 0.9 }    // Icon buttons
```

---

## Iconography

- **Library**: `lucide-react`
- **Size scale**: `w-3 h-3` (tiny) → `w-5 h-5` (standard) → `w-6 h-6` (featured)
- Icons inherit color from `style={{ color: ... }}`, not className
- Common icons used:
  - Navigation: `ArrowLeft`, `ChevronDown`
  - Actions: `Plus`, `Trash2`, `Save`, `RotateCcw`
  - Content: `Flame` (warmup), `Zap` (main), `Snowflake` (cooldown)
  - Features: `Lock` (PRO), `Layers` (blocks), `Clock` (time)
  - Builder: `PenLine` (custom), `GripVertical` (drag), `LayoutTemplate` (templates)

---

## Do's and Don'ts

**Do:**
- Use CSS custom properties (`var(--core-teal)`, `var(--motion-natural)`) for consistency
- Use `rgba()` with RGB triplets for easy opacity adjustment
- Keep gradients subtle — max 20% accent opacity at the bright end
- Use `backdrop-filter: blur()` on overlapping surfaces
- Add `transitionDuration: 'var(--motion-natural)'` to interactive elements

**Don't:**
- Use solid background colors on cards (always gradient or translucent)
- Use white text at full opacity for anything but primary headings
- Add borders thicker than 1px
- Use drop shadows (use ambient glow blurs instead)
- Use emojis in the UI except for template identity icons
