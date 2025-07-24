# Mosaic Typography System

## Font Weights
| Weight | Token | Usage |
|--------|-------|-------|
| 100 | --font-thin | Hero titles, large displays |
| 200 | --font-extra-light | Section headers, timer displays |
...

## Text Sizes
| Size | Token | Usage |
|------|-------|-------|
| 12px | --text-xs | Helper text, timestamps |
| 14px | --text-sm | Secondary information, metadata |
...

## Usage Patterns
### Exercise Cards
```tsx
<ExerciseCard 
  title="className='text-xl font-light tracking-wider'"
  description="className='text-base font-normal leading-relaxed'"
/>
