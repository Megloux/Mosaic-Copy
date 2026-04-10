/**
 * Routines Feature Public API
 */

// Standalone Builder (self-contained, no external dependencies)
export { RoutineBuilderEntry } from './ui/RoutineBuilderEntry';
export { RoutineBuilderPage } from './ui/RoutineBuilderPage';
export { TemplateGallery } from './ui/TemplateGallery';

// Components
export { ExerciseSelection } from './components/ExerciseSelection';
export { RoutineTypeModal } from './components/RoutineTypeModal';
export { TemplateSelection } from './components/TemplateSelection';

// Model
export { useRoutineStore } from './model/routineStore';
export type { Routine } from './model/types';

// API
export { TemplateService } from './api/templateService';
export { RoutinePopulationService } from './api/routinePopulationService';
