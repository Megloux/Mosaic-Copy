#!/usr/bin/env node

/**
 * FSA Migration Script: Fix Imports
 * 
 * This script fixes import paths in TypeScript files to use the correct path aliases.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base paths
const SRC_PATH = path.resolve(process.cwd(), 'src');

/**
 * Find all TypeScript files in a directory
 * @param {string} dir - Directory to search
 * @returns {string[]} - Array of file paths
 */
function findTypeScriptFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    entries.forEach(entry => {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    });
  }
  
  traverse(dir);
  return files;
}

/**
 * Fix imports in a file
 * @param {string} filePath - Path to the file
 */
function fixImports(filePath) {
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Fix @shared imports
    const sharedRegex = /from ['"]@shared\/(.*?)['"]/g;
    if (sharedRegex.test(content)) {
      content = content.replace(sharedRegex, "from '@/shared/$1'");
      updated = true;
    }
    
    // Fix @features imports
    const featuresRegex = /from ['"]@features\/(.*?)['"]/g;
    if (featuresRegex.test(content)) {
      content = content.replace(featuresRegex, "from '@/features/$1'");
      updated = true;
    }
    
    // Fix @app imports
    const appRegex = /from ['"]@app\/(.*?)['"]/g;
    if (appRegex.test(content)) {
      content = content.replace(appRegex, "from '@/app/$1'");
      updated = true;
    }
    
    // Fix @pages imports
    const pagesRegex = /from ['"]@pages\/(.*?)['"]/g;
    if (pagesRegex.test(content)) {
      content = content.replace(pagesRegex, "from '@/pages/$1'");
      updated = true;
    }
    
    // Write updated content
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
  }
}

/**
 * Process all TypeScript files
 */
function processFiles() {
  console.log('Starting import path fixes...');
  
  // Find all TypeScript files
  const files = [
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'features')),
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'shared')),
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'app')),
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'pages'))
  ];
  
  // Fix imports in each file
  files.forEach(file => {
    fixImports(file);
  });
  
  console.log(`Import path fixes completed! Processed ${files.length} files.`);
}

// Execute the script
processFiles();
