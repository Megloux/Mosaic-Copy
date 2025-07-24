# Mosaic Import/Export Standards

This document outlines the standardized patterns for imports and exports in the Mosaic codebase.

## Export Standards

1. **Use Named Exports**
   - All components should use named exports, not default exports
   - Example: `export const MyComponent = () => { ... }`

2. **Component Naming**
   - Component names should be PascalCase
   - Component names should match their file names (without the extension)
   - Example: `MyComponent.tsx` should export `export const MyComponent`

3. **Type Annotations**
   - Include React.FC or other appropriate type annotations for components
   - Example: `export const MyComponent: React.FC<MyComponentProps> = () => { ... }`

4. **Barrel Files**
   - Use named exports in barrel files (index.ts)
   - Example: `export { MyComponent } from './MyComponent'`

## Import Standards

1. **Use Absolute Imports**
   - Use absolute imports with the `@/` prefix for all internal imports
   - Example: `import { Button } from '@/components/ui/buttons/Button'`

2. **Named Imports**
   - Use named imports to match the named exports
   - Example: `import { MyComponent } from '@/components/MyComponent'`

3. **Grouping Imports**
   - Group imports in the following order:
     1. React and React-related libraries
     2. Third-party libraries
     3. Internal components and utilities
     4. Types and interfaces
     5. Assets and styles

4. **Destructuring Imports**
   - Destructure imports when importing multiple items from the same module
   - Example: `import { useState, useEffect } from 'react'`

## Common Pitfalls

1. **Circular Dependencies**
   - Avoid circular dependencies by carefully structuring your imports
   - If you encounter circular dependencies, consider refactoring your component structure

2. **Default vs Named Exports**
   - Always use named exports for components
   - Default exports can lead to inconsistent naming and make refactoring more difficult

3. **Relative vs Absolute Imports**
   - Avoid relative imports (e.g., `import { Button } from '../Button'`)
   - Relative imports make it harder to move files and can lead to deep nesting

4. **Re-exporting Components**
   - When re-exporting components from barrel files, use named exports
   - Example: `export { Button } from './Button'` instead of `export { default as Button } from './Button'`

## ESLint Rules

The following ESLint rules are enforced to maintain these standards:

```json
{
  "rules": {
    "import/no-default-export": "error",
    "import/no-relative-parent-imports": "error",
    "import/order": [
      "error",
      {
        "groups": [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling", "index"]
        ],
        "pathGroups": [
          {
            "pattern": "react",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "@/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ]
  }
}
```

## Component Template

When creating a new component, use the following template:

```tsx
import React from 'react';

// Import dependencies
import { SomeLibrary } from 'some-library';

// Import internal components
import { AnotherComponent } from '@/components/AnotherComponent';

// Define props interface
interface MyComponentProps {
  prop1: string;
  prop2?: number;
}

/**
 * MyComponent
 * 
 * Description of what this component does.
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  prop1,
  prop2 = 0
}) => {
  // Component logic
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

## Testing Standards

When writing tests for components:

1. Use named imports matching the component's export
2. Use absolute imports with the `@/` prefix
3. Example: `import { MyComponent } from '@/components/MyComponent'`
