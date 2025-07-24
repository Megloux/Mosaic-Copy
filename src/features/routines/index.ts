/**
 * Routines Feature Public API
 */

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
