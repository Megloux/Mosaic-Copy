# Mosaic UI Component System

## Core Principles

1. **Zero Dependencies Between Components**
   - Each component is fully self-contained
   - No shared state unless explicitly required
   - Components can be used independently

2. **iOS-First Design**
   - Minimum touch target size: 44x44px
   - Haptic feedback for interactions
   - iOS-style animations and spring curves
   - Safe area handling
   - Native-feeling interactions

3. **Consistent Component Structure**
   ```typescript
   interface ComponentProps {
     // Common props across components
     variant?: 'default' | 'outline' | 'ghost' | ...
     size?: 'sm' | 'md' | 'lg' | ...
     loading?: boolean
     disabled?: boolean
     className?: string
     // Component-specific props
     ...
   }
   ```

4. **State Management**
   - Loading states with skeleton UI
   - Error states with clear messaging
   - Disabled states with visual feedback
   - Active/hover states with animations

5. **Animation Standards**
   ```typescript
   // Animation durations
   --motion-natural: 200ms
   --spring-ios-bounce: cubic-bezier(0.32, 0.72, 0, 1)
   
   // Common animation pattern
   transition: {
     duration: 0.2,
     ease: [0.32, 0.72, 0, 1]
   }
   ```

## Component Library

### 1. StandardButton
- Variants: default, outline, ghost, destructive
- States: loading, disabled, hover, active
- Features:
  - Icon support (left/right)
  - Loading text
  - Haptic feedback
  - iOS-optimized touch targets

### 2. Accordion
- Variants: default, bordered
- States: expanded, collapsed, loading, error
- Features:
  - Animated transitions
  - Nested content support
  - iOS spring animations
  - Accessibility support

### 3. List
- Variants: default, separated
- Features:
  - Virtualization for large datasets
  - Drag and drop support
  - Selection support
  - Loading skeleton
  - Error states

### 4. Grid
- Layouts: grid, masonry, auto-sizing
- Features:
  - Responsive columns
  - Gap customization
  - Loading states
  - iOS-friendly heights

### 5. Modal
- Variants: default, overlay
- Features:
  - Smooth animations
  - iOS safe areas
  - Haptic feedback
  - Body scroll lock
  - Escape key support

### 6. Section
- Variants: default, raised, overlay, glass
- Features:
  - Sticky headers
  - Loading skeletons
  - Error states
  - Animated content

## CSS Variables

```css
/* Spacing */
--spacing-xs: 0.5rem
--spacing-sm: 1rem
--spacing-md: 1.5rem
--spacing-lg: 2rem

/* Container */
--container-padding-sm: 1rem
--container-padding-md: 1.5rem
--container-padding-lg: 2rem

/* Touch Targets */
--ios-min-touch-target: 44px

/* Animations */
--motion-natural: 200ms
--spring-ios-bounce: cubic-bezier(0.32, 0.72, 0, 1)

/* Overlays */
--overlay-light: rgba(0, 0, 0, 0.3)
--overlay-heavy: rgba(0, 0, 0, 0.5)
```

## Future Form Components Guidelines

1. **Consistent API Pattern**
   ```typescript
   interface FormFieldProps {
     // Common form field props
     label?: string
     error?: string
     required?: boolean
     disabled?: boolean
     // Validation
     validation?: ValidationRules
     // States
     loading?: boolean
     success?: boolean
   }
   ```

2. **Accessibility Requirements**
   - ARIA labels and roles
   - Error announcements
   - Keyboard navigation
   - Focus management

3. **State Management**
   - Validation states
   - Loading states
   - Error states
   - Success states
   - Focus states

4. **iOS Optimizations**
   - Native input behaviors
   - Haptic feedback
   - iOS-style animations
   - Keyboard handling

5. **Validation Pattern**
   ```typescript
   interface ValidationRules {
     required?: boolean
     pattern?: RegExp
     minLength?: number
     maxLength?: number
     custom?: (value: any) => boolean | string
   }
   ```

## Testing Standards

1. **Required Test Cases**
   - Rendering
   - User interactions
   - State changes
   - Accessibility
   - Responsive behavior

2. **Test Structure**
   ```typescript
   describe('ComponentName', () => {
     it('renders correctly', () => {})
     it('handles user interactions', () => {})
     it('manages states properly', () => {})
     it('meets accessibility requirements', () => {})
   })
   ```

## Performance Guidelines

1. **Optimization Techniques**
   - Memoization of callbacks
   - Virtualization for large lists
   - Lazy loading of heavy components
   - Image optimization

2. **Bundle Size**
   - Keep dependencies minimal
   - Code splitting
   - Tree shaking support

## Documentation Standards

Each component should include:
1. Props documentation with TypeScript
2. Usage examples
3. Accessibility notes
4. iOS-specific considerations
5. Performance implications

## Zustand State Management Integration

### Core Principles

1. **Bottom-Up Migration Strategy**
   - First priority: Components with direct API/database calls
   - Second priority: Components using mock data
   - Third priority: Components with local state that should be shared

2. **Component-Store Connection Pattern**
   ```typescript
   // Preferred pattern for connecting components to store
   function MyComponent() {
     // Select only the specific state needed by this component
     const { data, loading, error } = useMyStore(state => ({
       data: state.data,
       loading: state.loading,
       error: state.error
     }));
     
     // Use store actions directly
     const { fetchData } = useMyStore();
     
     // Initialize data on mount
     useEffect(() => {
       if (!data.length) {
         fetchData();
       }
     }, [data, fetchData]);
     
     // Component rendering logic...
   }
   ```

3. **State Selection Best Practices**
   - Use fine-grained selectors to prevent unnecessary re-renders
   - Memoize complex selectors with `useMemo`
   - Avoid selecting the entire store state
   - Use equality functions for complex objects

4. **Handling Loading and Error States**
   - Always reflect store loading state in the UI
   - Implement consistent error handling patterns
   - Use toast notifications for transient errors
   - Implement retry mechanisms for critical operations

5. **Offline-First Approach**
   - Components should handle both online and offline scenarios
   - Display appropriate UI indicators for offline status
   - Implement optimistic updates where appropriate
   - Handle synchronization conflicts gracefully

6. **Testing Connected Components**
   ```typescript
   describe('ConnectedComponent', () => {
     it('renders with store data', () => {
       // Mock the store
       jest.spyOn(storeHooks, 'useMyStore').mockImplementation(() => ({
         data: mockData,
         loading: false,
         error: null,
         fetchData: jest.fn()
       }));
       
       render(<ConnectedComponent />);
       // Test assertions...
     });
     
     it('handles loading state', () => {
       jest.spyOn(storeHooks, 'useMyStore').mockImplementation(() => ({
         data: [],
         loading: true,
         error: null,
         fetchData: jest.fn()
       }));
       
       render(<ConnectedComponent />);
       // Test loading UI...
     });
   });
   ```

### Migration Process

1. **Replace Direct API Calls**
   - Move API/database calls to store actions
   - Implement proper error handling in store actions
   - Add loading state management in the store

2. **Replace Local State**
   - Identify local state that should be shared
   - Move state to the appropriate store
   - Update component to use store state

3. **Update UI for Store Data**
   - Ensure UI reflects store loading states
   - Implement error handling UI
   - Add offline indicators where appropriate

4. **Example: Before and After Migration**

   **Before:**
   ```typescript
   function ExampleComponent() {
     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState(null);
     
     const fetchData = async () => {
       setLoading(true);
       try {
         const response = await supabase.from('table').select('*');
         setData(response.data);
         setError(null);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     
     useEffect(() => {
       fetchData();
     }, []);
     
     // Component rendering...
   }
   ```

   **After:**
   ```typescript
   function ExampleComponent() {
     const { data, loading, error } = useDataStore(state => ({
       data: state.data,
       loading: state.loading,
       error: state.error
     }));
     
     const { fetchData } = useDataStore();
     
     useEffect(() => {
       if (!data.length) {
         fetchData();
       }
     }, [data, fetchData]);
     
     // Component rendering with the same UI...
   }
   ```

### Performance Considerations

1. **Prevent Unnecessary Re-renders**
   - Use shallow equality checks for object comparisons
   - Implement memoization for expensive computations
   - Split large stores into domain-specific slices

2. **Optimize Store Subscriptions**
   ```typescript
   // Bad: Subscribing to the entire store
   const store = useMyStore();
   
   // Good: Subscribing only to needed slices
   const { specificData } = useMyStore(state => ({
     specificData: state.specificData
   }));
   
   // Better: Using equality function for complex objects
   const { complexData } = useMyStore(
     state => ({ complexData: state.complexData }),
     shallow
   );
   ```

3. **Batch Updates**
   - Group related state updates to minimize re-renders
   - Use the store's `setState` for batching multiple updates

4. **Debugging Connected Components**
   - Use the Redux DevTools Extension with Zustand
   - Implement logging middleware in development
   - Add store persistence for development debugging
