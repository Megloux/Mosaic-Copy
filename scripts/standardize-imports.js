#!/usr/bin/env node

/**
 * Import/Export Standardization Script
 * 
 * This script automates the process of:
 * 1. Converting default exports to named exports
 * 2. Updating imports to use absolute paths with @/ prefix
 * 3. Fixing import statements for components that have been converted
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const COMPONENT_EXTENSIONS = ['.tsx', '.ts'];
const IGNORED_DIRS = ['node_modules', 'dist', 'build', '.git'];
const ROOT_ALIAS = '@/';

// Counters for reporting
const stats = {
  defaultExportsConverted: 0,
  relativeImportsFixed: 0,
  incorrectImportsFixed: 0,
  filesProcessed: 0,
  errors: 0
};

/**
 * Find all TypeScript/React files in the project
 */
function findTsFiles(dir) {
  let results = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    if (IGNORED_DIRS.includes(item)) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      results = results.concat(findTsFiles(fullPath));
    } else if (COMPONENT_EXTENSIONS.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }
  
  return results;
}

/**
 * Convert default exports to named exports
 */
function convertDefaultExportToNamed(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Skip if file already uses named exports
  if (content.includes(`export const ${fileName}`) || 
      content.includes(`export function ${fileName}`) ||
      content.includes(`export class ${fileName}`)) {
    return content;
  }
  
  // Match default export patterns
  const defaultExportPatterns = [
    {
      regex: /export default function (\w+)/g,
      replacement: 'export function $1'
    },
    {
      regex: /export default class (\w+)/g,
      replacement: 'export class $1'
    },
    {
      regex: /export default (function|const|let|var) (\w+)/g,
      replacement: 'export $1 $2'
    },
    {
      regex: /export default (\w+)/g,
      replacement: (match, name) => {
        // Only replace if the name matches the file name (case insensitive)
        if (name.toLowerCase() === fileName.toLowerCase()) {
          return `export const ${name}`;
        }
        return match;
      }
    },
    {
      regex: /const (\w+) = \(.*\) => {[\s\S]*?};\s*export default (\1);/g,
      replacement: (match, name) => {
        return match.replace(`export default ${name};`, `export { ${name} };`);
      }
    },
    {
      regex: /function (\w+)\(.*\) {[\s\S]*?}\s*export default (\1);/g,
      replacement: (match, name) => {
        return match.replace(`export default ${name};`, `export { ${name} };`);
      }
    },
    {
      regex: /export default React\.forwardRef\(\(/g,
      replacement: (match) => {
        return `export const ${fileName} = React.forwardRef((`;
      }
    }
  ];
  
  let modified = false;
  
  // Apply each pattern
  for (const pattern of defaultExportPatterns) {
    const newContent = content.replace(pattern.regex, pattern.replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
      stats.defaultExportsConverted++;
      break;
    }
  }
  
  return modified ? content : null;
}

/**
 * Convert relative imports to absolute imports with @/ prefix
 */
function convertRelativeImportsToAbsolute(filePath, content) {
  const relativeImportRegex = /import\s+(?:(?:{[^}]*})|(?:[\w*]+))\s+from\s+['"](\.[\.\/]+[^'"]+)['"]/g;
  const srcDir = path.resolve(SRC_DIR);
  const fileDir = path.dirname(filePath);
  
  return content.replace(relativeImportRegex, (match, importPath) => {
    // Resolve the absolute path
    const absolutePath = path.resolve(fileDir, importPath);
    
    // Create path relative to src directory
    const relativeToSrc = path.relative(srcDir, absolutePath);
    
    // Only convert if the import is within the src directory
    if (!relativeToSrc.startsWith('..')) {
      stats.relativeImportsFixed++;
      return match.replace(importPath, `${ROOT_ALIAS}${relativeToSrc}`);
    }
    
    return match;
  });
}

/**
 * Fix incorrect imports for components that have been converted to named exports
 */
function fixIncorrectImports(content) {
  // Pattern: import ComponentName from 'path' -> import { ComponentName } from 'path'
  const defaultImportRegex = /import\s+(\w+)\s+from\s+['"](@\/[^'"]+)['"]/g;
  
  return content.replace(defaultImportRegex, (match, componentName, importPath) => {
    // Skip React and other libraries
    if (componentName === 'React' || importPath.includes('node_modules')) {
      return match;
    }
    
    stats.incorrectImportsFixed++;
    return `import { ${componentName} } from '${importPath}'`;
  });
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}...`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Step 1: Convert default exports to named exports
    const updatedContent = convertDefaultExportToNamed(filePath);
    if (updatedContent) {
      content = updatedContent;
      modified = true;
    }
    
    // Step 2: Convert relative imports to absolute imports
    const absoluteImportsContent = convertRelativeImportsToAbsolute(filePath, content);
    if (absoluteImportsContent !== content) {
      content = absoluteImportsContent;
      modified = true;
    }
    
    // Step 3: Fix incorrect imports for components that have been converted
    const fixedImportsContent = fixIncorrectImports(content);
    if (fixedImportsContent !== content) {
      content = fixedImportsContent;
      modified = true;
    }
    
    // Save changes if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
    }
    
    stats.filesProcessed++;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    stats.errors++;
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Finding TypeScript/React files...');
  const files = findTsFiles(SRC_DIR);
  console.log(`Found ${files.length} files to process.`);
  
  // Process form components first
  const formComponents = files.filter(file => file.includes('/form/'));
  const otherFiles = files.filter(file => !file.includes('/form/'));
  
  console.log('🔄 Processing form components first...');
  formComponents.forEach(processFile);
  
  console.log('🔄 Processing remaining files...');
  otherFiles.forEach(processFile);
  
  // Print summary
  console.log('\n📊 Summary:');
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Default exports converted: ${stats.defaultExportsConverted}`);
  console.log(`Relative imports fixed: ${stats.relativeImportsFixed}`);
  console.log(`Incorrect imports fixed: ${stats.incorrectImportsFixed}`);
  console.log(`Errors: ${stats.errors}`);
}

// Run the script
main();
