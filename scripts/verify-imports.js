#!/usr/bin/env node

/**
 * Import/Export Verification Script
 * 
 * This script scans the Mosaic codebase to identify:
 * 1. Components still using default exports that should be converted to named exports
 * 2. Imports that don't use the @/ prefix (absolute imports)
 * 3. Imports of components that have been converted but are still using default import syntax
 * 
 * Usage:
 *   node scripts/verify-imports.js
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENT_DIRS = [
  'components/ui',
  'components/exercises',
  'components/routines',
  'components/demos',
  'pages'
];

// Components that have been converted to named exports
// This list should be kept up to date as more components are converted
const CONVERTED_COMPONENTS = [
  'StandardButton',
  'SaveButton',
  'PublicToggle',
  'ShareButton',
  'FavoriteButton',
  'RemoveButton',
  'Modal',
  'Section',
  'Grid',
  'Tabs',
  'TabsWithStore',
  'List',
  'Toast',
  'Accordion',
  'Input',
  'SearchInput',
  'Select',
  'Switch',
  'ExerciseDetail',
  'ExerciseCard',
  'ExerciseSection',
  'RoutinePlayer',
  'RoutinePlayerWrapper',
  'CountdownTimer',
  'ExercisePreview',
  'ExerciseTimer',
  'RoutineBuilder',
  'TemplateCard',
  'UIComponentsDemo',
  'ExerciseDemo'
];

// Results containers
const defaultExports = [];
const relativeImports = [];
const incorrectImports = [];

/**
 * Check if a file contains a default export
 */
function checkForDefaultExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('export default ')) {
      const componentName = path.basename(filePath, path.extname(filePath));
      defaultExports.push({ componentName, filePath });
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
}

/**
 * Check if a file contains relative imports or incorrect import syntax
 */
function checkImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      // Check for relative imports (excluding node_modules and test utilities)
      if (line.includes('import ') && 
          line.includes(' from \'') && 
          !line.includes(' from \'@/') && 
          !line.includes(' from \'react') && 
          !line.includes(' from \'framer-motion') && 
          !line.includes(' from \'lucide-react') && 
          !line.includes(' from \'zustand') && 
          !line.includes(' from \'@testing-library') && 
          !line.includes(' from \'jest') && 
          line.includes('./')) {
        relativeImports.push({ filePath, line });
      }
      
      // Check for incorrect imports of converted components
      for (const component of CONVERTED_COMPONENTS) {
        if (line.includes(`import ${component} from `) && !line.includes(`import { ${component} } from `)) {
          incorrectImports.push({ filePath, component, line });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
}

/**
 * Recursively scan a directory for TypeScript/TSX files
 */
function scanDirectory(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'build') {
          scanDirectory(fullPath);
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        // Skip test files for now
        if (!entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
          checkForDefaultExport(fullPath);
          checkImports(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error);
  }
}

/**
 * Scan test files separately
 */
function scanTestFiles() {
  try {
    // Find all test files
    const testFiles = execSync('find src -name "*.test.tsx" -o -name "*.test.ts" -o -name "*.spec.tsx" -o -name "*.spec.ts"')
      .toString()
      .split('\n')
      .filter(Boolean)
      .map(file => path.resolve(file));
    
    for (const filePath of testFiles) {
      checkImports(filePath);
    }
  } catch (error) {
    console.error('Error scanning test files:', error);
  }
}

// Main execution
console.log('🔍 Scanning codebase for import/export issues...');

// Scan component directories
for (const dir of COMPONENT_DIRS) {
  scanDirectory(path.join(SRC_DIR, dir));
}

// Scan test files
scanTestFiles();

// Print results
console.log('\n📊 Scan Results:\n');

console.log('Components still using default exports:');
if (defaultExports.length === 0) {
  console.log('✅ All components are using named exports!');
} else {
  for (const { componentName, filePath } of defaultExports) {
    console.log(`❌ ${componentName}: ${filePath.replace(process.cwd(), '')}`);
  }
}

console.log('\nRelative imports that should be absolute:');
if (relativeImports.length === 0) {
  console.log('✅ All imports are using absolute paths!');
} else {
  for (const { filePath, line } of relativeImports) {
    console.log(`❌ ${filePath.replace(process.cwd(), '')}: ${line.trim()}`);
  }
}

console.log('\nIncorrect imports of components that have been converted:');
if (incorrectImports.length === 0) {
  console.log('✅ All imports are using the correct syntax!');
} else {
  for (const { filePath, component, line } of incorrectImports) {
    console.log(`❌ ${filePath.replace(process.cwd(), '')}: ${line.trim()}`);
    console.log(`   Should be: import { ${component} } from '...'`);
  }
}

console.log('\n✨ Done!');
