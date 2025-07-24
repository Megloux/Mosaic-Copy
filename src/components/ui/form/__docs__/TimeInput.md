# TimeInput Component Documentation

## Overview
TimeInput is an iOS-optimized component for entering durations in MM:SS format. It features vertical scrubbing, haptic feedback, and comprehensive accessibility support.

## Props Interface
```typescript
interface TimeInputProps {
  value: string                 // MM:SS format (required)
  onChange: (value: string) => void  // Change handler (required)
  maxTimeSeconds?: number       // Maximum allowed time
  allowScrubbing?: boolean     // Enable iOS scrubbing (default: true)
  enableHaptics?: boolean      // Enable haptic feedback (default: true)
  loading?: boolean            // Loading state
  disabled?: boolean           // Disabled state
  label?: string              // Input label
  error?: string              // Error message
  success?: string            // Success message
  helperText?: string         // Helper text
}
```

## iOS-Specific Features

### 1. Touch Interactions
- Vertical scrubbing with haptic feedback
- Touch target size: 44x44px (iOS standard)
- Double-tap to reset value

### 2. Haptic Feedback Patterns
- Value change: 10ms vibration
- Focus: 15ms vibration
- Scrubbing intervals: 5ms vibration
- Reset action: [10ms, 30ms, 10ms] pattern

### 3. Time Input Features
- MM:SS format enforcement
- Leading zero handling
- Maximum time validation
- Empty/invalid input recovery

## Current Implementation

### Format Handling
```typescript
// Input: "2:30" -> Output: "02:30"
// Input: "2"   -> Output: "02:00"
// Input: ""    -> Output: "00:00"
```

### Keyboard Support
- Arrow Up/Down: Increment/decrement by 5 seconds
- Shift + Arrow Up/Down: Increment/decrement by 60 seconds
- Double-click: Reset to "00:00"

## Schema Compatibility

### Current Format
- Internal: MM:SS string format
- Output: MM:SS string format
- Maximum: Configurable via maxTimeSeconds

### Supabase Schema Requirements (TO BE VERIFIED)
- Need to verify if Supabase expects MM:SS format
- Need to confirm maximum duration limits
- Need to validate time format conversion

## Known Limitations

1. Format Restrictions
   - Only supports MM:SS format
   - Does not support HH:MM:SS
   - Maximum time limited by maxTimeSeconds prop

2. iOS-Specific
   - Haptic patterns need validation against iOS standards
   - Touch target size verification needed
   - Animation timing curves need iOS compliance check

3. Schema Integration
   - Format compatibility with Supabase needs verification
   - Edge case handling needs validation
   - Maximum duration limits need confirmation

## Required Testing

1. Format Validation
   - [ ] Valid MM:SS inputs
   - [ ] Partial inputs
   - [ ] Empty value handling
   - [ ] Maximum time constraints
   - [ ] Invalid input recovery

2. iOS Feature Testing
   - [ ] Scrubbing behavior
   - [ ] Haptic feedback timing
   - [ ] Touch target measurements
   - [ ] Animation smoothness

3. Accessibility Testing
   - [ ] ARIA attributes
   - [ ] Keyboard navigation
   - [ ] Screen reader compatibility
   - [ ] Color contrast ratios

## Next Steps

1. Schema Validation
   - Verify format compatibility with Supabase
   - Test with actual exercise duration data
   - Document any required format conversions

2. iOS Compliance
   - Validate haptic patterns against iOS standards
   - Verify touch target sizes
   - Test animation timing curves

3. Test Suite Development
   - Create comprehensive Jest test suite
   - Add iOS-specific interaction tests
   - Document test coverage
