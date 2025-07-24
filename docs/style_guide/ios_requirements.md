# iOS App Store Requirements: Style Guide & Design Standards

## Core Requirements

### 1. Safe Areas & Layout
```typescript
interface iOSSafeAreas {
  // Required safe area insets
  safeAreaInsets: {
    top: string;    // Status bar + Dynamic Island
    bottom: string; // Home indicator
    left: string;   // Edge protection
    right: string;  // Edge protection
  };

  // Minimum touch target sizes
  touchTargets: {
    minimum: '44px'; // Apple's minimum touch target size
    spacing: '8px';  // Minimum spacing between touchable elements
  };
}
```

### 2. Typography
```typescript
interface iOSTypography {
  // Apple's system fonts
  fontFamily: {
    system: '-apple-system, BlinkMacSystemFont, "Helvetica Neue"';
    monospace: 'SF Mono';
  };

  // Dynamic Type sizes (must support all)
  dynamicType: {
    xSmall: string;      // 14px
    small: string;       // 15px
    medium: string;      // 16px
    large: string;       // 17px
    xLarge: string;      // 19px
    xxLarge: string;     // 21px
    xxxLarge: string;    // 23px
    accessibility1: string; // 28px
    accessibility2: string; // 33px
    accessibility3: string; // 40px
    accessibility4: string; // 47px
    accessibility5: string; // 53px
  };
}
```

### 3. Color Requirements
```typescript
interface iOSColors {
  // Support both light and dark mode
  colorSchemes: {
    light: ColorPalette;
    dark: ColorPalette;
  };

  // System colors (recommended to use)
  system: {
    blue: string;    // '#007AFF'
    green: string;   // '#34C759'
    indigo: string;  // '#5856D6'
    orange: string;  // '#FF9500'
    pink: string;    // '#FF2D55'
    purple: string;  // '#AF52DE'
    red: string;     // '#FF3B30'
    teal: string;    // '#5AC8FA'
    yellow: string;  // '#FFCC00'
    
    // Gray scale
    gray: string;    // '#8E8E93'
    gray2: string;   // '#636366'
    gray3: string;   // '#48484A'
    gray4: string;   // '#3A3A3C'
    gray5: string;   // '#2C2C2E'
    gray6: string;   // '#1C1C1E'
  };
}
```

## Accessibility Requirements

### 1. Dynamic Type Support
```typescript
// All text must support Dynamic Type
const DynamicTypeText = styled.Text`
  font-size: ${({ theme }) => theme.ios.dynamicType.medium};
  
  // Support Dynamic Type scaling
  @supports (font-size: -apple-system-body) {
    font-size: -apple-system-body;
  }
`;
```

### 2. VoiceOver Support
```typescript
interface AccessibilityProps {
  // Required accessibility properties
  accessibilityLabel: string;      // Description for VoiceOver
  accessibilityHint?: string;      // Additional context
  accessibilityRole: string;       // Role of the element
  accessibilityState?: {           // Current state
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
}
```

### 3. Reduced Motion
```typescript
const AnimationStyles = css`
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;
```

## UI Component Requirements

### 1. Navigation Patterns
```typescript
interface NavigationStyles {
  // Navigation bar
  navigationBar: {
    height: '44px';
    largeTitleHeight: '52px';
    backgroundColor: string;
    borderBottom: string;
  };

  // Tab bar
  tabBar: {
    height: '49px';
    itemWidth: '76px';
    iconSize: '28px';
    labelSize: '10px';
  };
}
```

### 2. Gesture Support
```typescript
interface GestureAreas {
  // Swipe gestures
  swipeableArea: {
    minHeight: '44px';
    feedback: 'haptic';
  };

  // Pull to refresh
  pullToRefresh: {
    threshold: '80px';
    indicator: 'system';
  };
}
```

### 3. Form Elements
```typescript
interface iOSFormElements {
  // Text inputs
  textField: {
    height: '44px';
    cornerRadius: '8px';
    padding: '10px';
  };

  // Buttons
  button: {
    minHeight: '44px';
    cornerRadius: '8px';
    systemBlue: '#007AFF';
  };

  // Switches
  switch: {
    width: '51px';
    height: '31px';
    thumbSize: '29px';
  };
}
```

## Device Support Requirements

### 1. Screen Sizes
```typescript
interface iOSScreenSizes {
  // Must support all current iPhone sizes
  iphone: {
    '5.4inch': '375x812pt';  // iPhone 12 mini
    '6.1inch': '390x844pt';  // iPhone 12/13/14
    '6.7inch': '428x926pt';  // iPhone 12/13/14 Pro Max
  };

  // Support iPad if universal app
  ipad?: {
    '10.9inch': '820x1180pt';
    '11inch': '834x1194pt';
    '12.9inch': '1024x1366pt';
  };
}
```

### 2. Display Features
```typescript
interface DisplayFeatures {
  // Dynamic Island support
  dynamicIsland: {
    standardHeight: '37px';
    expandedHeight: '63px';
    safeArea: 'top-59px';
  };

  // Notch support
  notch: {
    height: '47px';
    safeArea: 'top-47px';
  };
}
```

## App Store Requirements

### 1. App Icons
```typescript
interface AppIconRequirements {
  // Required icon sizes
  icons: {
    iphone: {
      '60pt': '180x180px';  // @3x
      '40pt': '120x120px';  // @3x
      '20pt': '60x60px';    // @3x
    };
    ipad?: {
      '83.5pt': '167x167px';  // @2x
      '76pt': '152x152px';    // @2x
      '40pt': '80x80px';      // @2x
      '20pt': '40x40px';      // @2x
    };
    appStore: '1024x1024px';
  };

  // Icon design requirements
  design: {
    cornerRadius: '20.69%';
    safeArea: '15%';
    noAlpha: true;
    noTransparency: true;
  };
}
```

### 2. Launch Screen
```typescript
interface LaunchScreenRequirements {
  // Must match app's initial screen
  launchScreen: {
    background: string;
    elements: {
      position: 'fixed';
      noAnimation: true;
    };
    supportDarkMode: true;
  };
}
```

## Implementation Example

```typescript
// theme.ts
export const iosTheme = {
  // Base theme extended with iOS requirements
  ...baseTheme,
  ios: {
    safeAreas: iOSSafeAreas,
    typography: iOSTypography,
    colors: iOSColors,
    navigation: NavigationStyles,
    forms: iOSFormElements,
    screens: iOSScreenSizes,
    display: DisplayFeatures,
  },
};

// Component example
const IOSButton = styled.button`
  height: ${({ theme }) => theme.ios.forms.button.minHeight};
  border-radius: ${({ theme }) => theme.ios.forms.button.cornerRadius};
  background-color: ${({ theme }) => theme.ios.forms.button.systemBlue};
  
  // Support Dark Mode
  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.ios.colors.dark.primary};
  }
  
  // Support Reduced Motion
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
```

## Checklist for App Store Approval

1. **Accessibility**
   - [ ] Dynamic Type support for all text
   - [ ] VoiceOver compatibility
   - [ ] Sufficient color contrast
   - [ ] Reduced Motion support

2. **UI/UX**
   - [ ] Minimum touch target sizes (44x44pt)
   - [ ] Proper safe area implementation
   - [ ] Dark Mode support
   - [ ] Proper keyboard handling

3. **Visual Design**
   - [ ] All required app icon sizes
   - [ ] Launch screen matches first app screen
   - [ ] No custom back button designs
   - [ ] System-standard UI elements

4. **Device Support**
   - [ ] Works on all supported iPhone sizes
   - [ ] Proper handling of Dynamic Island
   - [ ] Proper handling of notch
   - [ ] Supports device rotation (if applicable)

5. **Performance**
   - [ ] Smooth animations (60fps)
   - [ ] Quick app launch time
   - [ ] Efficient memory usage
   - [ ] Responsive UI

## Testing Requirements

1. **Device Testing**
   - Test on smallest supported device
   - Test on largest supported device
   - Test on devices with Dynamic Island
   - Test on devices with notch

2. **Accessibility Testing**
   - Test with VoiceOver
   - Test with Dynamic Type (all sizes)
   - Test with Reduced Motion
   - Test with High Contrast

3. **Visual Testing**
   - Test in Light Mode
   - Test in Dark Mode
   - Test all dynamic colors
   - Test all UI states
