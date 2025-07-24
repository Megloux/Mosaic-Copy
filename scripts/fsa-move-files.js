#!/usr/bin/env node

/**
 * FSA Migration Script: Move Files
 * 
 * This script moves files from their current locations to their new locations
 * according to the Feature-Slice Architecture (FSA) structure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base paths
const SRC_PATH = path.resolve(process.cwd(), 'src');
const FEATURES_PATH = path.resolve(SRC_PATH, 'features');
const SHARED_PATH = path.resolve(SRC_PATH, 'shared');
const APP_PATH = path.resolve(SRC_PATH, 'app');
const PAGES_PATH = path.resolve(SRC_PATH, 'pages');

// File mappings
const fileMappings = [
  // Shared UI Components
  {
    from: 'components/ui/buttons/StandardButton.tsx',
    to: 'shared/ui/buttons/StandardButton.tsx'
  },
  {
    from: 'components/ui/buttons/FavoriteButton.tsx',
    to: 'shared/ui/buttons/FavoriteButton.tsx'
  },
  {
    from: 'components/ui/buttons/ShareButton.tsx',
    to: 'shared/ui/buttons/ShareButton.tsx'
  },
  {
    from: 'components/ui/buttons/RemoveButton.tsx',
    to: 'shared/ui/buttons/RemoveButton.tsx'
  },
  {
    from: 'components/ui/buttons/PublicToggle.tsx',
    to: 'shared/ui/buttons/PublicToggle.tsx'
  },
  {
    from: 'components/ui/form/Input.tsx',
    to: 'shared/ui/form/Input.tsx'
  },
  {
    from: 'components/ui/form/Select.tsx',
    to: 'shared/ui/form/Select.tsx'
  },
  {
    from: 'components/ui/form/TimeInput.tsx',
    to: 'shared/ui/form/TimeInput.tsx'
  },
  {
    from: 'components/ui/form/CheckboxGroup.tsx',
    to: 'shared/ui/form/CheckboxGroup.tsx'
  },
  {
    from: 'components/ui/form/RadioGroup.tsx',
    to: 'shared/ui/form/RadioGroup.tsx'
  },
  {
    from: 'components/ui/form/DatePicker.tsx',
    to: 'shared/ui/form/DatePicker.tsx'
  },
  {
    from: 'components/ui/form/Switch.tsx',
    to: 'shared/ui/form/Switch.tsx'
  },
  {
    from: 'components/ui/form/RangeSlider.tsx',
    to: 'shared/ui/form/RangeSlider.tsx'
  },
  {
    from: 'components/ui/form/SearchInput.tsx',
    to: 'shared/ui/form/SearchInput.tsx'
  },
  {
    from: 'components/ui/form/FileUpload.tsx',
    to: 'shared/ui/form/FileUpload.tsx'
  },
  {
    from: 'components/ui/Accordion.tsx',
    to: 'shared/ui/Accordion.tsx'
  },
  {
    from: 'components/ui/Grid.tsx',
    to: 'shared/ui/Grid.tsx'
  },
  {
    from: 'components/ui/List.tsx',
    to: 'shared/ui/List.tsx'
  },
  {
    from: 'components/ui/Modal.tsx',
    to: 'shared/ui/Modal.tsx'
  },
  {
    from: 'components/ui/Section.tsx',
    to: 'shared/ui/Section.tsx'
  },
  {
    from: 'components/ui/Tabs.tsx',
    to: 'shared/ui/Tabs.tsx'
  },
  {
    from: 'components/ui/Toast.tsx',
    to: 'shared/ui/Toast.tsx'
  },
  
  // Store-Connected Components
  {
    from: 'components/ui/form/InputWithStore.tsx',
    to: 'shared/ui/form/InputWithStore.tsx'
  },
  {
    from: 'components/ui/form/SelectWithStore.tsx',
    to: 'shared/ui/form/SelectWithStore.tsx'
  },
  {
    from: 'components/ui/form/TimeInputWithStore.tsx',
    to: 'shared/ui/form/TimeInputWithStore.tsx'
  },
  {
    from: 'components/ui/form/CheckboxGroupWithStore.tsx',
    to: 'shared/ui/form/CheckboxGroupWithStore.tsx'
  },
  {
    from: 'components/ui/form/RadioGroupWithStore.tsx',
    to: 'shared/ui/form/RadioGroupWithStore.tsx'
  },
  {
    from: 'components/ui/form/SwitchWithStore.tsx',
    to: 'shared/ui/form/SwitchWithStore.tsx'
  },
  {
    from: 'components/ui/form/DatePickerWithStore.tsx',
    to: 'shared/ui/form/DatePickerWithStore.tsx'
  },
  {
    from: 'components/ui/form/SearchInputWithStore.tsx',
    to: 'shared/ui/form/SearchInputWithStore.tsx'
  },
  {
    from: 'components/ui/form/RangeSliderWithStore.tsx',
    to: 'shared/ui/form/RangeSliderWithStore.tsx'
  },
  {
    from: 'components/ui/form/FileUploadWithStore.tsx',
    to: 'shared/ui/form/FileUploadWithStore.tsx'
  },
  {
    from: 'components/ui/TabsWithStore.tsx',
    to: 'shared/ui/TabsWithStore.tsx'
  },
  
  // Exercise Feature
  {
    from: 'components/exercises/ExerciseCard.tsx',
    to: 'features/exercises/components/ExerciseCard.tsx'
  },
  {
    from: 'components/exercises/ExerciseDetail.tsx',
    to: 'features/exercises/components/ExerciseDetail.tsx'
  },
  {
    from: 'components/exercises/ExerciseLibrary.tsx',
    to: 'features/exercises/components/ExerciseLibrary.tsx'
  },
  {
    from: 'components/exercises/ExerciseSection.tsx',
    to: 'features/exercises/components/ExerciseSection.tsx'
  },
  {
    from: 'components/exercises/__tests__/ExerciseLibrary.test.tsx',
    to: 'features/exercises/components/__tests__/ExerciseLibrary.test.tsx'
  },
  {
    from: 'store/exerciseLibraryStore.ts',
    to: 'features/exercises/model/exerciseLibraryStore.ts'
  },
  {
    from: 'store/exerciseStore.ts',
    to: 'features/exercises/model/exerciseStore.ts'
  },
  {
    from: 'store/__tests__/exerciseLibraryStore.test.ts',
    to: 'features/exercises/model/__tests__/exerciseLibraryStore.test.ts'
  },
  {
    from: 'types/exercises.ts',
    to: 'features/exercises/model/types.ts'
  },
  {
    from: 'services/ExerciseService.ts',
    to: 'features/exercises/api/exerciseService.ts'
  },
  
  // Routines Feature
  {
    from: 'components/routines/ExerciseSelection.tsx',
    to: 'features/routines/components/ExerciseSelection.tsx'
  },
  {
    from: 'components/routines/RoutineTypeModal.tsx',
    to: 'features/routines/components/RoutineTypeModal.tsx'
  },
  {
    from: 'components/routines/TemplateSelection.tsx',
    to: 'features/routines/components/TemplateSelection.tsx'
  },
  {
    from: 'components/routines/__tests__/ExerciseSelection.test.tsx',
    to: 'features/routines/components/__tests__/ExerciseSelection.test.tsx'
  },
  {
    from: 'store/routineStore.ts',
    to: 'features/routines/model/routineStore.ts'
  },
  {
    from: 'types/templates.ts',
    to: 'features/routines/model/types.ts'
  },
  {
    from: 'services/TemplateService.ts',
    to: 'features/routines/api/templateService.ts'
  },
  {
    from: 'services/RoutinePopulationService.ts',
    to: 'features/routines/api/routinePopulationService.ts'
  },
  {
    from: 'api/routines/routines.ts',
    to: 'features/routines/api/routines.ts'
  },
  {
    from: 'api/routines/relationships.ts',
    to: 'features/routines/api/relationships.ts'
  },
  {
    from: 'api/routines/routines.test.ts',
    to: 'features/routines/api/__tests__/routines.test.ts'
  },
  
  // Routine Builder Sub-Feature
  {
    from: 'components/routines/builder/components/ExerciseItem.tsx',
    to: 'features/routines/builder/components/ExerciseItem.tsx'
  },
  {
    from: 'components/routines/builder/components/RoutineBlock.tsx',
    to: 'features/routines/builder/components/RoutineBlock.tsx'
  },
  {
    from: 'components/routines/builder/components/RoutineHeader.tsx',
    to: 'features/routines/builder/components/RoutineHeader.tsx'
  },
  {
    from: 'components/routines/builder/components/TemplateCard.tsx',
    to: 'features/routines/builder/components/TemplateCard.tsx'
  },
  {
    from: 'components/routines/builder/index.tsx',
    to: 'features/routines/builder/components/RoutineBuilder.tsx'
  },
  {
    from: 'components/routines/builder/hooks/useRoutineCalculations.ts',
    to: 'features/routines/builder/model/useRoutineCalculations.ts'
  },
  {
    from: 'components/routines/builder/__tests__/ExerciseItem.test.tsx',
    to: 'features/routines/builder/components/__tests__/ExerciseItem.test.tsx'
  },
  {
    from: 'components/routines/builder/__tests__/RoutineBlock.test.tsx',
    to: 'features/routines/builder/components/__tests__/RoutineBlock.test.tsx'
  },
  {
    from: 'components/routines/builder/__tests__/RoutineHeader.test.tsx',
    to: 'features/routines/builder/components/__tests__/RoutineHeader.test.tsx'
  },
  {
    from: 'components/routines/builder/__tests__/TemplateCard.test.tsx',
    to: 'features/routines/builder/components/__tests__/TemplateCard.test.tsx'
  },
  {
    from: 'components/routines/builder/__tests__/formatters.test.ts',
    to: 'features/routines/builder/lib/__tests__/formatters.test.ts'
  },
  {
    from: 'components/routines/builder/__tests__/useRoutineActions.test.ts',
    to: 'features/routines/builder/model/__tests__/useRoutineActions.test.ts'
  },
  {
    from: 'components/routines/builder/__tests__/useRoutineCalculations.test.ts',
    to: 'features/routines/builder/model/__tests__/useRoutineCalculations.test.ts'
  },
  
  // Workout Player Feature
  {
    from: 'components/routines/player/RoutinePlayer.tsx',
    to: 'features/workout-player/components/RoutinePlayer.tsx'
  },
  {
    from: 'components/routines/player/RoutinePlayerWrapper.tsx',
    to: 'features/workout-player/components/RoutinePlayerWrapper.tsx'
  },
  {
    from: 'components/routines/player/components/CountdownTimer.tsx',
    to: 'features/workout-player/components/CountdownTimer.tsx'
  },
  {
    from: 'components/routines/player/components/ExercisePreview.tsx',
    to: 'features/workout-player/components/ExercisePreview.tsx'
  },
  {
    from: 'components/routines/player/components/ExerciseTimer.tsx',
    to: 'features/workout-player/components/ExerciseTimer.tsx'
  },
  {
    from: 'components/routines/player/__tests__/CountdownTimer.test.tsx',
    to: 'features/workout-player/components/__tests__/CountdownTimer.test.tsx'
  },
  {
    from: 'components/routines/player/__tests__/RoutinePlayer.test.tsx',
    to: 'features/workout-player/components/__tests__/RoutinePlayer.test.tsx'
  },
  {
    from: 'store/routinePlayerStore.ts',
    to: 'features/workout-player/model/routinePlayerStore.ts'
  },
  
  // Variations Feature
  {
    from: 'api/variations/variations.ts',
    to: 'features/variations/api/variations.ts'
  },
  {
    from: 'services/VariationService.ts',
    to: 'features/variations/api/variationService.ts'
  },
  {
    from: 'types/variations.ts',
    to: 'features/variations/model/types.ts'
  },
  {
    from: 'data/core/variations.ts',
    to: 'features/variations/model/data.ts'
  },
  
  // Shared API and Utilities
  {
    from: 'lib/supabase/api.ts',
    to: 'shared/api/supabase/api.ts'
  },
  {
    from: 'lib/supabase/client.ts',
    to: 'shared/api/supabase/client.ts'
  },
  {
    from: 'lib/supabase/hooks.ts',
    to: 'shared/api/supabase/hooks.ts'
  },
  {
    from: 'lib/supabase/types.ts',
    to: 'shared/api/supabase/types.ts'
  },
  {
    from: 'lib/utils/timeFormat.ts',
    to: 'shared/lib/utils/timeFormat.ts'
  },
  {
    from: 'lib/verify-connection.ts',
    to: 'shared/lib/network/verify-connection.ts'
  },
  
  // App
  {
    from: 'App.tsx',
    to: 'app/App.tsx'
  },
  {
    from: 'service-worker-registration.ts',
    to: 'app/service-worker-registration.ts'
  },
  {
    from: 'service-worker.ts',
    to: 'app/service-worker.ts'
  }
];

/**
 * Move a file from source to destination
 * @param {string} source - Source file path
 * @param {string} destination - Destination file path
 */
function moveFile(source, destination) {
  try {
    // Create directory if it doesn't exist
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Check if source file exists
    if (!fs.existsSync(source)) {
      console.error(`Source file not found: ${source}`);
      return;
    }
    
    // Copy file
    fs.copyFileSync(source, destination);
    console.log(`Moved ${source} to ${destination}`);
    
    // We're not deleting the original files yet to be safe
    // fs.unlinkSync(source);
  } catch (error) {
    console.error(`Error moving ${source} to ${destination}:`, error);
  }
}

/**
 * Process all file mappings
 */
function processFileMappings() {
  console.log('Starting FSA file migration...');
  
  fileMappings.forEach(mapping => {
    const source = path.resolve(SRC_PATH, mapping.from);
    const destination = path.resolve(SRC_PATH, mapping.to);
    moveFile(source, destination);
  });
  
  console.log('FSA file migration completed!');
}

// Execute the script
processFileMappings();
