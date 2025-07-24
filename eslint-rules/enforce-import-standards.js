/**
 * @fileoverview Rule to enforce Mosaic import/export standards
 * @author Mosaic Team
 */

"use strict";

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce Mosaic import/export standards",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
    schema: [], // no options
  },
  create: function (context) {
    return {
      // Check for default exports in component files
      ExportDefaultDeclaration(node) {
        const filename = context.getFilename();
        
        // Skip non-component files
        if (!filename.includes('/components/') && !filename.includes('/pages/')) {
          return;
        }
        
        // Skip index files that re-export components
        if (filename.endsWith('/index.ts') || filename.endsWith('/index.tsx')) {
          return;
        }
        
        context.report({
          node,
          message: "Use named exports instead of default exports for components",
          fix(fixer) {
            // This is a simple fix that might not work in all cases
            // More complex cases would need manual intervention
            const sourceCode = context.getSourceCode();
            const exportToken = sourceCode.getFirstToken(node);
            const defaultToken = sourceCode.getTokenAfter(exportToken);
            
            if (node.declaration.type === "Identifier") {
              // For cases like: export default ComponentName
              const componentName = node.declaration.name;
              return fixer.replaceText(node, `export { ${componentName} }`);
            }
            
            // For other cases, just suggest removing 'default'
            return fixer.replaceTextRange(
              [exportToken.range[0], defaultToken.range[1]],
              "export"
            );
          }
        });
      },
      
      // Check for relative imports that should be absolute
      ImportDeclaration(node) {
        const source = node.source.value;
        
        // Skip external modules and test utilities
        if (!source.startsWith('.') || 
            source.includes('react') || 
            source.includes('framer-motion') || 
            source.includes('lucide-react') || 
            source.includes('zustand') || 
            source.includes('@testing-library') || 
            source.includes('jest')) {
          return;
        }
        
        const filename = context.getFilename();
        
        // Skip test files importing from the file they're testing
        if ((filename.includes('.test.') || filename.includes('.spec.')) && 
            (source === '..' || source === '../' || source === './')) {
          return;
        }
        
        context.report({
          node,
          message: "Use absolute imports with @/ prefix instead of relative imports",
          // No automatic fix for this as it requires resolving the correct absolute path
        });
      },
      
      // Check for default imports of components that should use named imports
      ImportDefaultSpecifier(node) {
        const parent = node.parent;
        
        // Skip if not an import declaration
        if (parent.type !== 'ImportDeclaration') {
          return;
        }
        
        const source = parent.source.value;
        
        // Skip external modules
        if (!source.startsWith('.') && !source.startsWith('@/')) {
          return;
        }
        
        // Skip non-component imports
        if (source.includes('/utils/') || 
            source.includes('/hooks/') || 
            source.includes('/store/') || 
            source.includes('/types/') || 
            source.includes('/constants/')) {
          return;
        }
        
        const componentName = node.local.name;
        
        // Check if this is a component name (PascalCase)
        if (/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
          context.report({
            node,
            message: `Use named import for component: import { ${componentName} } from '${source}'`,
            fix(fixer) {
              return fixer.replaceText(node, `{ ${componentName} }`);
            }
          });
        }
      }
    };
  }
};
