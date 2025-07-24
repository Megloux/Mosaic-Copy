#!/usr/bin/env node

/**
 * FSA Migration Script: Update Imports
 * 
 * This script updates imports in files that have been moved to the new
 * Feature-Slice Architecture (FSA) structure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base paths
const SRC_PATH = path.resolve(process.cwd(), 'src');

// Import mappings
const importMappings = {
  // UI Components
  '@/components/ui/buttons': '@shared/ui/buttons',
  '@/components/ui/form': '@shared/ui/form',
  '@/components/ui/': '@shared/ui/',
  
  // Exercise Feature
  '@/components/exercises': '@features/exercises/components',
  '@/store/exerciseLibraryStore': '@features/exercises/model/exerciseLibraryStore',
  '@/store/exerciseStore': '@features/exercises/model/exerciseStore',
  '@/types/exercises': '@features/exercises/model/types',
  '@/services/ExerciseService': '@features/exercises/api/exerciseService',
  
  // Routines Feature
  '@/components/routines/builder': '@features/routines/builder/components',
  '@/components/routines/player': '@features/workout-player/components',
  '@/components/routines': '@features/routines/components',
  '@/store/routineStore': '@features/routines/model/routineStore',
  '@/store/routinePlayerStore': '@features/workout-player/model/routinePlayerStore',
  '@/types/templates': '@features/routines/model/types',
  '@/services/TemplateService': '@features/routines/api/templateService',
  '@/services/RoutinePopulationService': '@features/routines/api/routinePopulationService',
  '@/api/routines': '@features/routines/api',
  
  // Variations Feature
  '@/api/variations': '@features/variations/api',
  '@/services/VariationService': '@features/variations/api/variationService',
  '@/types/variations': '@features/variations/model/types',
  '@/data/core/variations': '@features/variations/model/data',
  
  // Shared API and Utilities
  '@/lib/supabase': '@shared/api/supabase',
  '@/lib/utils/timeFormat': '@shared/lib/utils/timeFormat',
  '@/lib/verify-connection': '@shared/lib/network/verify-connection',
  '@/lib/network': '@shared/lib/network',
  '@/lib/storage': '@shared/lib/storage',
  '@/lib/utils': '@shared/lib/utils',
  
  // App
  '@/App': '@app/App',
  '@/service-worker-registration': '@app/service-worker-registration',
  '@/service-worker': '@app/service-worker'
};

/**
 * Update imports in a file
 * @param {string} filePath - Path to the file
 */
function updateImports(filePath) {
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Update imports
    Object.entries(importMappings).forEach(([from, to]) => {
      const regex = new RegExp(`from ['"]${from}['"]`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `from '${to}'`);
        updated = true;
      }
      
      // Also handle relative imports that might have been missed
      const relativeRegex = new RegExp(`from ['"]\\.\\./(.*?)${from.replace('@/', '')}['"]`, 'g');
      if (relativeRegex.test(content)) {
        content = content.replace(relativeRegex, `from '${to}'`);
        updated = true;
      }
    });
    
    // Write updated content
    if (updated) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating imports in ${filePath}:`, error);
  }
}

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
 * Process all TypeScript files
 */
function processFiles() {
  console.log('Starting FSA import updates...');
  
  // Find all TypeScript files in the new structure
  const files = [
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'features')),
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'shared')),
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'app')),
    ...findTypeScriptFiles(path.resolve(SRC_PATH, 'pages'))
  ];
  
  // Update imports in each file
  files.forEach(file => {
    updateImports(file);
  });
  
  console.log(`FSA import updates completed! Processed ${files.length} files.`);
}

// Execute the script
processFiles();
