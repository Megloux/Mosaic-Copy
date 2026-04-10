import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Grid3X3,
  List,
  Plus
} from "lucide-react";
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { SearchInput } from '@/shared/ui/form';
import { StandardButton } from "@/components/ui/buttons/StandardButton";
import { useRoutineStore } from '@/features/routines/model/routineStore';
import { Template, TemplateBlock } from '@/features/routines/model/types';
import { cn } from '@/shared/lib/utils';

// Import sub-components
import { RoutineHeader } from "@/components/routines/builder/components/RoutineHeader";
import { RoutineBlock } from "@/components/routines/builder/components/RoutineBlock";
import { TemplateCard } from "@/components/routines/builder/components/TemplateCard";

// Import hooks
import { useRoutineCalculations } from "@/components/routines/builder/hooks/useRoutineCalculations";
import { useRoutineActions } from "@/components/routines/builder/hooks/useRoutineActions";

// Import related components
import { ExerciseSelection } from "@/components/routines/ExerciseSelection";
import { RoutineTypeModal } from "@/components/routines/RoutineTypeModal";

/**
 * RoutineBuilder Component
 * 
 * This component handles both template-based and custom routine creation.
 * It uses an accordion pattern for template selection and block management,
 * with a Spotify-inspired UI for exercise management.
 */
export const RoutineBuilder: React.FC = () => {
  // Get store data and actions
  const { 
    templates, 
    fetchTemplates, 
    currentRoutine, 
    selectedTemplate,
    selectTemplate,
    createEmptyRoutine
  } = useRoutineStore();

  // Calculate routine metrics
  const { totalDuration } = useRoutineCalculations(currentRoutine);
  
  // Get routine action handlers
  const { 
    handlePlay, 
    handleFavorite, 
    handleShare, 
    handleSave,
    handleAddExercise,
    handleRemoveExercise,
    handleReorderExercises,
    isFavorite,
    errorMessage,
    isRecovering,
    setErrorMessage
  } = useRoutineActions();

  // State for UI controls and template selection
  const [showRoutineTypeModal, setShowRoutineTypeModal] = useState(true);
  const [isCustomRoutine, setIsCustomRoutine] = useState(false);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
  const [exerciseSelectionOpen, setExerciseSelectionOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState("");
  const [activeTemplateBlock, setActiveTemplateBlock] = useState<TemplateBlock | undefined>(undefined);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Handle custom routine selection from the modal
  const handleSelectCustom = useCallback(() => {
    setShowRoutineTypeModal(false);
    setIsCustomRoutine(true);
    createEmptyRoutine();
  }, [createEmptyRoutine]);

  // Handle template selection from the modal
  const handleTemplateSelection = useCallback(() => {
    setShowRoutineTypeModal(false);
    setIsCustomRoutine(false);
    
    // If no template is selected yet, show the template selection view
    if (!selectedTemplate) {
      // This is where we'd show template options
      setViewMode('grid');
    }
  }, [selectedTemplate]);

  // Handle selecting a specific template
  const handleSelectSpecificTemplate = useCallback((templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      selectTemplate(template);
      setIsCustomRoutine(false);
    }
  }, [templates, selectTemplate]);

  // Filter templates based on search term
  const filteredTemplates = useCallback(() => {
    if (!templateSearchTerm.trim()) return templates;
    
    return templates.filter((template: Template) => 
      template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchTerm.toLowerCase())
    );
  }, [templates, templateSearchTerm])();

  // Handle expanding a block to view its exercises
  const handleExpandBlock = useCallback((blockId: string) => {
    setExpandedBlockId(prev => prev === blockId ? null : blockId);
    
    // Provide haptic feedback when expanding/collapsing a block
    if (window.navigator.vibrate) {
      window.navigator.vibrate(5); // Light haptic
    }
  }, []);

  // Handle adding an exercise to a specific block
  const handleAddExerciseToBlock = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    setExerciseSelectionOpen(true);
  }, []);

  // Handle error dismissal
  const handleDismissError = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setErrorMessage(null);
  }, [setErrorMessage]);

  // Render template selection view
  const renderTemplateSelection = useCallback(() => {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "px-4 py-2 rounded-full text-sm",
                activeTab === "all" 
                  ? "bg-white/20 text-white" 
                  : "bg-transparent text-white/70 hover:bg-white/10"
              )}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("popular")}
              className={cn(
                "px-4 py-2 rounded-full text-sm",
                activeTab === "popular" 
                  ? "bg-white/20 text-white" 
                  : "bg-transparent text-white/70 hover:bg-white/10"
              )}
            >
              Popular
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={cn(
                "px-4 py-2 rounded-full text-sm",
                activeTab === "new" 
                  ? "bg-white/20 text-white" 
                  : "bg-transparent text-white/70 hover:bg-white/10"
              )}
            >
              New
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-full",
                viewMode === 'grid' 
                  ? "bg-white/20" 
                  : "bg-transparent hover:bg-white/10"
              )}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-full",
                viewMode === 'list' 
                  ? "bg-white/20" 
                  : "bg-transparent hover:bg-white/10"
              )}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <SearchInput
          placeholder="Search templates..."
          value={templateSearchTerm}
          onChange={(e) => setTemplateSearchTerm(e.target.value)}
          className="w-full mb-4"
        />
        
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectSpecificTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition-colors"
                onClick={() => handleSelectSpecificTemplate(template.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-white/70 line-clamp-1">
                      {template.description}
                    </p>
                  </div>
                  
                  {template.isProOnly && (
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-1 rounded-full font-bold">
                      PRO
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <StandardButton
            onClick={handleSelectCustom}
            variant="secondary"
          >
            Create Custom Routine
          </StandardButton>
        </div>
      </div>
    );
  }, [activeTab, filteredTemplates, handleSelectCustom, handleSelectSpecificTemplate, templateSearchTerm, viewMode]);

  // Main render function
  return (
    <MobileLayout
      title="Build Routine"
      headerRight={
        currentRoutine && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEditMode(prev => !prev)}
              className={cn(
                "px-3 py-1 rounded-full text-xs",
                isEditMode ? "bg-blue-500 text-white" : "bg-white/10 text-white/70"
              )}
            >
              {isEditMode ? "Done" : "Edit"}
            </button>
          </div>
        )
      }
    >
      {/* Error message display */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/90 p-3 rounded-lg mb-4 mx-4"
          >
            <div className="flex items-start">
              <div className="flex-1">
                <p className="font-medium">{isRecovering ? "Recovering..." : "Error"}</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
              <button
                onClick={handleDismissError}
                className="p-1"
                aria-label="Dismiss error"
              >
                <Plus className="w-5 h-5 transform rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Routine Type Modal */}
      <RoutineTypeModal
        open={showRoutineTypeModal}
        onClose={() => setShowRoutineTypeModal(false)}
        onSelectCustom={handleSelectCustom}
        onSelectTemplate={handleTemplateSelection}
      />
      
      {/* Template Selection View */}
      {!showRoutineTypeModal && !currentRoutine && renderTemplateSelection()}
      
      {/* Routine Builder View */}
      {currentRoutine && (
        <div className="p-4">
          {/* Spotify-inspired header with actions */}
          <RoutineHeader
            title={currentRoutine.name || "New Routine"}
            duration={totalDuration}
            onPlay={handlePlay}
            onFavorite={handleFavorite}
            onShare={handleShare}
            onDownload={handleSave}
            isFavorite={isFavorite}
          />
          
          {/* Blocks section */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-3">Blocks</h2>
            
            {currentRoutine.blocks.map((block) => (
              <RoutineBlock
                key={block.id}
                block={block}
                isExpanded={expandedBlockId === block.id}
                onToggleExpand={() => handleExpandBlock(block.id)}
                onAddExercise={() => handleAddExerciseToBlock(block.id)}
                onRemoveExercise={(exerciseId) => handleRemoveExercise(block.id, exerciseId)}
                onReorderExercises={(newOrder) => handleReorderExercises(block.id, newOrder)}
                isEditMode={isEditMode}
              />
            ))}
            
            {isEditMode && (
              <button
                className="w-full py-3 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/15 transition-colors"
                onClick={() => {/* Add block logic */}}
              >
                <Plus className="w-5 h-5 mr-2" />
                <span>Add Block</span>
              </button>
            )}
          </div>
          
          {/* Exercise Selection Modal */}
          <ExerciseSelection
            open={exerciseSelectionOpen}
            onClose={() => setExerciseSelectionOpen(false)}
            onSelectExercise={(exercise) => {
              // Convert Exercise to RoutineExercise when adding
              const routineExercise = {
                ...exercise,
                sets: 1,
                reps: 10,
                duration: exercise.duration?.default || 45
              };
              handleAddExercise(activeBlockId, routineExercise);
              setExerciseSelectionOpen(false);
            }}
            blockId={activeBlockId}
            templateBlock={activeTemplateBlock}
          />
        </div>
      )}
    </MobileLayout>
  );
};
