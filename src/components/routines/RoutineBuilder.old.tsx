import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { 
  Plus, 
  X, 
  Info, 
  Trash2, 
  Grip, 
  ChevronLeft, 
  MoreHorizontal, 
  Play,
  ChevronDown,
  ChevronUp,
  Grid3X3,
  List,
  Heart,
  Share2,
  Download,
  Clock,
  Users
} from "lucide-react";
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { Accordion } from "@/components/ui/Accordion";
import { SearchInput } from "@/components/ui/form";
import { StandardButton } from "@/components/ui/buttons/StandardButton";
import { useRoutineStore } from "@/store/routineStore";
import { Template, TemplateBlock, RoutineBlock, RoutineExercise } from "@/types/templates";
import { Exercise } from "@/types/exercises";
import { cn } from "@/lib/utils";
import { ExerciseSelection } from "@/components/routines/ExerciseSelection";
import { RoutineTypeModal } from "@/components/routines/RoutineTypeModal";

/**
 * RoutineBuilder Component
 * 
 * This component handles both template-based and custom routine creation.
 * It uses an accordion pattern for template selection and block management,
 * with a Spotify-inspired UI for exercise management.
 */
const RoutineBuilder: React.FC = () => {
  // Get state and actions from the Zustand store
  const { 
    templates, 
    selectedTemplate, 
    currentRoutine,
    isLoading,
    error,
    fetchTemplates,
    selectTemplate,
    addExerciseToBlock,
    removeExerciseFromBlock,
    updateExercise,
    reorderExercise,
    addBlock,
    removeBlock,
    updateBlock,
    reorderBlock,
    saveRoutine
  } = useRoutineStore();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedTemplates, setExpandedTemplates] = useState<string[]>([]);
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([]);
  const [showRoutineTypeModal, setShowRoutineTypeModal] = useState(true);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [isCustomRoutine, setIsCustomRoutine] = useState(false);
  const [exerciseSelectionOpen, setExerciseSelectionOpen] = useState(false);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [activeTemplateBlock, setActiveTemplateBlock] = useState<TemplateBlock | undefined>(undefined);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [blockExercisesMap, setBlockExercisesMap] = useState<Record<string, RoutineExercise[]>>({});
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // State for template selection
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Update blockExercisesMap when currentRoutine changes
  useEffect(() => {
    if (currentRoutine?.blocks) {
      const newMap: Record<string, RoutineExercise[]> = {};
      currentRoutine.blocks.forEach(block => {
        newMap[block.id] = [...block.exercises];
      });
      setBlockExercisesMap(newMap);
    }
  }, [currentRoutine]);

  // Memoize filtered templates for better performance
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Filter by search query
      const matchesSearch = 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by tab
      if (activeTab === "all") {
        return matchesSearch;
      } else if (activeTab === "pro" && template.isProOnly) {
        return matchesSearch;
      } else if (activeTab === "free" && !template.isProOnly) {
        return matchesSearch;
      }
      
      return false;
    });
  }, [templates, searchQuery, activeTab]);

  // Function to handle selecting a specific template
  const handleSelectSpecificTemplate = useCallback((templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      selectTemplate(template);
      setIsCustomRoutine(false);
    }
  }, [templates, selectTemplate]);

  // Memoize template items for better performance
  const templateItems = useMemo(() => {
    return filteredTemplates.map((template: Template, index: number) => ({
      id: template.id,
      title: template.name,
      description: template.description,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-white/70">{template.description}</p>
          
          {template.structure?.blocks?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Blocks:</h4>
              <ul className="space-y-1">
                {template.structure.blocks.map((block: TemplateBlock, index: number) => (
                  <li key={index} className="text-sm text-white/70 flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full mr-2 text-xs">
                      {index + 1}
                    </span>
                    {block.name} 
                    <span className="ml-2 text-xs text-white/50">
                      ({block.exercise_count.min}-{block.exercise_count.max} exercises)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <StandardButton 
            onClick={() => handleSelectSpecificTemplate(template.id)}
            className="w-full"
          >
            Select Template
          </StandardButton>
        </div>
      )
    }));
  }, [filteredTemplates, handleSelectSpecificTemplate]);

  // Filter templates based on search term
  const filteredTemplatesBySearchTerm = useMemo(() => {
    if (!templateSearchTerm.trim()) return templates;
    
    return templates.filter((template: Template) => 
      template.name.toLowerCase().includes(templateSearchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(templateSearchTerm.toLowerCase())
    );
  }, [templates, templateSearchTerm]);

  // Use callback for toggle functions to prevent unnecessary re-renders
  const toggleExerciseSelection = useCallback((exerciseId: string) => {
    // Provide light haptic feedback when selecting/deselecting
    if (window.navigator.vibrate) {
      window.navigator.vibrate(3); // Light haptic feedback
    }
    
    setSelectedExercises(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId) 
        : [...prev, exerciseId]
    );
  }, []);

  // Use callback for toggle block expansion
  const toggleBlockExpansion = useCallback((blockId: string) => {
    // Provide medium haptic feedback when expanding/collapsing
    if (window.navigator.vibrate) {
      window.navigator.vibrate(5); // Medium haptic feedback
    }
    
    setExpandedBlocks(prev => 
      prev.includes(blockId)
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  }, []);

  // Handle selecting custom routine from the initial modal
  const handleSelectCustom = useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsRecovering(false);
      
      // Find the custom template
      const customTemplate = templates.find((t: Template) => t.id === "custom");
      if (!customTemplate) {
        throw new Error("Custom template not found. Please try refreshing the app.");
      }
      
      // Select the template using our Zustand store
      await selectTemplate(customTemplate.id);
      
      // Set as custom routine
      setIsCustomRoutine(true);
      
      // Close the routine type modal
      setShowRoutineTypeModal(false);
      
      // Expand all blocks by default
      if (currentRoutine?.blocks) {
        setExpandedBlocks(currentRoutine.blocks.map((block: RoutineBlock) => block.id));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create custom routine";
      console.error("Error creating custom routine:", err);
      setErrorMessage(errorMsg);
      
      // Recovery strategy
      setIsRecovering(true);
      setTimeout(() => {
        // Try to recover by resetting state
        setIsRecovering(false);
        setErrorMessage(null);
      }, 3000);
    }
  }, [templates, selectTemplate, currentRoutine]);

  // Handle selecting template option from the initial modal
  const handleSelectTemplate = useCallback(() => {
    setShowRoutineTypeModal(false);
    setShowTemplateSelection(true);
  }, []);

  // Handle template selection from the template selection screen
  const handleTemplateSelection = useCallback(() => {
    setShowRoutineTypeModal(false);
    setIsCustomRoutine(false);
    
    // If no template is selected yet, show the template selection view
    if (!selectedTemplate) {
      // This is where we'd show template options
      setViewMode('grid');
    }
  }, [selectedTemplate]);

  // Handle adding an exercise to a block
  const handleAddExercise = useCallback((blockId: string, exercise: RoutineExercise) => {
    // Provide haptic feedback when adding an exercise
    if (window.navigator.vibrate) {
      window.navigator.vibrate(8); // Medium-strong haptic
    }
    
    addExerciseToBlock(blockId, exercise);
  }, [addExerciseToBlock]);

  // Handle removing an exercise from a block
  const handleRemoveExercise = useCallback((blockId: string, exerciseId: string) => {
    // Provide haptic feedback when removing an exercise
    if (window.navigator.vibrate) {
      window.navigator.vibrate([5, 10, 5]); // Pattern for deletion
    }
    
    removeExerciseFromBlock(blockId, exerciseId);
    // Remove from selected exercises if it was selected
    setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
  }, [removeExerciseFromBlock, selectedExercises]);

  // Handle removing multiple exercises
  const handleRemoveSelectedExercises = useCallback((blockId: string) => {
    selectedExercises.forEach(exerciseId => {
      removeExerciseFromBlock(blockId, exerciseId);
    });
    setSelectedExercises([]);
    setIsEditMode(false);
  }, [removeExerciseFromBlock, selectedExercises]);

  // Handle adding a new block
  const handleAddBlock = useCallback(() => {
    const newBlock: RoutineBlock = {
      id: `block-${Date.now()}`,
      name: "New Block",
      type: "main",
      position: currentRoutine.blocks.length,
      exercises: [],
      notes: "",
      restBetweenExercises: 60
    };
    
    addBlock(newBlock);
    
    // Expand the new block
    setExpandedBlocks([...expandedBlocks, newBlock.id]);
  }, [currentRoutine, addBlock]);

  // Handle saving the routine
  const handleSaveRoutine = useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsRecovering(false);
      
      if (!currentRoutine || !currentRoutine.blocks || currentRoutine.blocks.length === 0) {
        throw new Error("Cannot save an empty routine. Please add at least one block with exercises.");
      }
      
      // Check if any block has exercises
      const hasExercises = currentRoutine.blocks.some((block: RoutineBlock) => block.exercises.length > 0);
      if (!hasExercises) {
        throw new Error("Please add at least one exercise to your routine before saving.");
      }
      
      const savedRoutine = await saveRoutine();
      console.log("Routine saved:", savedRoutine);
      // Here you could navigate to a success page or show a toast
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save routine";
      console.error("Error saving routine:", err);
      setErrorMessage(errorMsg);
      
      // Recovery strategy
      setIsRecovering(true);
      setTimeout(() => {
        // Try to recover by resetting state
        setIsRecovering(false);
        setErrorMessage(null);
      }, 3000);
    }
  }, [currentRoutine, saveRoutine]);

  // Open exercise selection modal for a specific block
  const openExerciseSelection = useCallback((blockId: string) => {
    setActiveBlockId(blockId);
    
    // If this is a template-based routine, find the corresponding template block
    if (selectedTemplate && !isCustomRoutine) {
      const routineBlock = currentRoutine.blocks.find(block => block.id === blockId);
      const blockIndex = routineBlock ? currentRoutine.blocks.indexOf(routineBlock) : -1;
      
      if (blockIndex >= 0 && selectedTemplate.structure.blocks[blockIndex]) {
        setActiveTemplateBlock(selectedTemplate.structure.blocks[blockIndex]);
      } else {
        setActiveTemplateBlock(undefined);
      }
    } else {
      setActiveTemplateBlock(undefined);
    }
    
    setExerciseSelectionOpen(true);
  }, [selectedTemplate, currentRoutine, isCustomRoutine]);

  // Handle reordering exercises within a block with haptic feedback
  const handleReorderExercises = useCallback((blockId: string, newOrder: RoutineExercise[]) => {
    // Provide haptic feedback when reordering completes
    if (window.navigator.vibrate) {
      window.navigator.vibrate([10, 20, 10]); // Pattern for reordering
    }
    
    setBlockExercisesMap({
      ...blockExercisesMap,
      [blockId]: newOrder
    });
    
    // Update the store with the new order
    newOrder.forEach((exercise, newIndex) => {
      const block = currentRoutine.blocks.find((b: RoutineBlock) => b.id === blockId);
      if (!block) return;
      
      const oldIndex = block.exercises.findIndex(e => e.id === exercise.id);
      if (oldIndex !== -1 && oldIndex !== newIndex) {
        reorderExercise(blockId, oldIndex, newIndex);
      }
    });
  }, [blockExercisesMap, currentRoutine, reorderExercise]);

  // Optimize exercise rendering with windowing for large lists
  const renderExercises = useCallback((blockId: string, exercises: RoutineExercise[]) => {
    // Early return for empty state
    if (!exercises.length) {
      return (
        <div className="text-center py-6 bg-white/5 rounded-lg">
          <p className="text-sm text-white/50">No exercises added yet</p>
          <StandardButton 
            onClick={() => openExerciseSelection(blockId)}
            variant="outline"
            size="sm"
            className="mt-2"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Exercise
          </StandardButton>
        </div>
      );
    }

    // For small lists (under 20 items), render normally
    if (exercises.length < 20) {
      if (viewMode === 'grid') {
        // Grid view rendering...
        return (
          <div className="grid grid-cols-2 gap-2">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={cn(
                  "flex flex-col p-3 rounded-lg cursor-pointer",
                  isEditMode ? "bg-white/10" : "bg-white/5",
                  selectedExercises.includes(exercise.id) && "ring-2 ring-[rgb(var(--feedback-info))]"
                )}
                onClick={() => isEditMode && toggleExerciseSelection(exercise.id)}
                onKeyDown={(e) => {
                  if (isEditMode && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    toggleExerciseSelection(exercise.id);
                  }
                }}
                tabIndex={isEditMode ? 0 : -1}
                role={isEditMode ? "checkbox" : "listitem"}
                aria-checked={isEditMode ? selectedExercises.includes(exercise.id) : undefined}
              >
                {/* Exercise content... */}
                <div className="relative w-full aspect-square bg-white/10 rounded overflow-hidden mb-2">
                  {exercise.thumbnailUrl ? (
                    <img 
                      src={exercise.thumbnailUrl} 
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      loading="lazy" // Lazy load images
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=Ex";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                      Exercise
                    </div>
                  )}
                  {isEditMode && (
                    <div className={cn(
                      "absolute top-2 right-2 w-5 h-5 rounded-full border-2",
                      selectedExercises.includes(exercise.id) 
                        ? "border-[rgb(var(--feedback-info))] bg-[rgb(var(--feedback-info))]" 
                        : "border-white/30"
                    )} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium truncate">{exercise.name}</h4>
                  <p className="text-xs text-white/50 truncate">
                    {typeof exercise.duration === 'number' 
                      ? `${Math.floor(exercise.duration / 60)}:${(exercise.duration % 60).toString().padStart(2, '0')}` 
                      : '00:45'}
                  </p>
                </div>
                {!isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveExercise(blockId, exercise.id);
                    }}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white/70 hover:text-white transition-colors duration-[var(--motion-natural)] var(--ease-standard)"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        );
      }

      // List view with Reorder
      return (
        <Reorder.Group 
          axis="y" 
          values={exercises} 
          onReorder={(newOrder) => handleReorderExercises(blockId, newOrder)}
          className="space-y-2"
        >
          {exercises.map((exercise) => (
            <Reorder.Item
              key={exercise.id}
              value={exercise}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                isEditMode ? "bg-white/10" : "bg-white/5",
                selectedExercises.includes(exercise.id) && "ring-2 ring-[rgb(var(--feedback-info))]"
              )}
              whileDrag={{ 
                scale: 1.02,
                boxShadow: "var(--shadow-lg)",
                zIndex: 10,
                transition: { 
                  duration: 0.2, 
                  ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
                }
              }}
            >
              {/* Exercise list item content... */}
              <div 
                className="flex items-center flex-1"
                onClick={() => isEditMode && toggleExerciseSelection(exercise.id)}
                onKeyDown={(e) => {
                  if (isEditMode && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    toggleExerciseSelection(exercise.id);
                  }
                }}
                tabIndex={isEditMode ? 0 : -1}
                role={isEditMode ? "checkbox" : "listitem"}
                aria-checked={isEditMode ? selectedExercises.includes(exercise.id) : undefined}
              >
                {isEditMode ? (
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0",
                    selectedExercises.includes(exercise.id) 
                      ? "border-[rgb(var(--feedback-info))] bg-[rgb(var(--feedback-info))]" 
                      : "border-white/30"
                  )} />
                ) : (
                  <Grip className="h-4 w-4 text-white/30 mr-3 cursor-grab" />
                )}
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-white/10 rounded overflow-hidden mr-3 flex-shrink-0">
                    {exercise.thumbnailUrl ? (
                      <img 
                        src={exercise.thumbnailUrl} 
                        alt={exercise.name}
                        className="w-full h-full object-cover"
                        loading="lazy" // Lazy load images
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=Ex";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                        Ex
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{exercise.name}</h4>
                    <p className="text-xs text-white/50">
                      {typeof exercise.duration === 'number'
                        ? `${Math.floor(exercise.duration / 60)}:${(exercise.duration % 60).toString().padStart(2, '0')}`
                        : '00:45'}
                    </p>
                  </div>
                </div>
              </div>
              {!isEditMode && (
                <button
                  onClick={() => handleRemoveExercise(blockId, exercise.id)}
                  className="p-2 text-white/50 hover:text-white/80 transition-colors duration-[var(--motion-natural)] var(--ease-standard)"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              )}
            </Reorder.Item>
          ))}
        </Reorder.Group>
      );
    }
    
    // For large lists (20+ items), implement windowing
    // This is a simplified version - in a real app, you'd use a library like react-window or react-virtualized
    const visibleExercises = exercises.slice(0, 20);
    
    return (
      <div className="space-y-2">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2">
            {visibleExercises.map((exercise) => (
              // Grid item rendering (same as above)
              <div
                key={exercise.id}
                className={cn(
                  "flex flex-col p-3 rounded-lg cursor-pointer",
                  isEditMode ? "bg-white/10" : "bg-white/5",
                  selectedExercises.includes(exercise.id) && "ring-2 ring-[rgb(var(--feedback-info))]"
                )}
                onClick={() => isEditMode && toggleExerciseSelection(exercise.id)}
              >
                {/* Exercise content (abbreviated) */}
                <div className="relative w-full aspect-square bg-white/10 rounded overflow-hidden mb-2">
                  {exercise.thumbnailUrl ? (
                    <img 
                      src={exercise.thumbnailUrl} 
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=Ex";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
                      Exercise
                    </div>
                  )}
                  {isEditMode && (
                    <div className={cn(
                      "absolute top-2 right-2 w-5 h-5 rounded-full border-2",
                      selectedExercises.includes(exercise.id) 
                        ? "border-[rgb(var(--feedback-info))] bg-[rgb(var(--feedback-info))]" 
                        : "border-white/30"
                    )} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium truncate">{exercise.name}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view for large lists (simplified without Reorder for better performance)
          visibleExercises.map((exercise) => (
            <div
              key={exercise.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg",
                isEditMode ? "bg-white/10" : "bg-white/5"
              )}
            >
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-white/10 rounded overflow-hidden mr-3 flex-shrink-0">
                  {exercise.thumbnailUrl && (
                    <img 
                      src={exercise.thumbnailUrl} 
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium">{exercise.name}</h4>
                </div>
              </div>
            </div>
          ))
        )}
        
        {exercises.length > 20 && (
          <div className="text-center py-2 text-xs text-white/50">
            Showing 20 of {exercises.length} exercises
          </div>
        )}
      </div>
    );
  }, [viewMode, isEditMode, selectedExercises, toggleExerciseSelection, handleRemoveExercise, handleReorderExercises, openExerciseSelection]);

  // Render template selection accordion with memoization
  const renderTemplateSelection = useCallback(() => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Select a Template</h2>
          <StandardButton 
            onClick={handleSelectCustom}
            variant="outline"
            size="sm"
          >
            Custom Routine
          </StandardButton>
        </div>
        
        <SearchInput
          placeholder="Search templates..."
          value={templateSearchTerm}
          onChange={(e) => setTemplateSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex space-x-2 mb-6">
          <button
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "all" 
                ? "bg-white/15 text-white" 
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
            )}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "pro" 
                ? "bg-white/15 text-white" 
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
            )}
            onClick={() => setActiveTab("pro")}
          >
            Pro
          </button>
          <button
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === "free" 
                ? "bg-white/15 text-white" 
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
            )}
            onClick={() => setActiveTab("free")}
          >
            Free
          </button>
        </div>
        
        <Accordion
          items={templateItems}
          variant="separated"
          multiple={true}
          defaultExpanded={expandedTemplates}
          onExpandedChange={setExpandedTemplates}
          enableHaptics={true}
          loading={isLoading}
          error={error ? new Error(error) : null}
        />
      </div>
    );
  }, [templateItems, templateSearchTerm, activeTab, expandedTemplates, isLoading, error, handleSelectCustom]);

  // Calculate total routine duration
  const calculateTotalDuration = useCallback(() => {
    if (!currentRoutine?.blocks) return 0;
    
    return currentRoutine.blocks.reduce((total: number, block: RoutineBlock) => {
      // Handle exercises in each block
      const blockDuration = block.exercises.reduce((blockTotal: number, exercise: RoutineExercise) => {
        // Get duration from exercise (RoutineExercise has duration as a number)
        return blockTotal + (exercise.duration || 45);
      }, 0);
      
      return total + blockDuration;
    }, 0);
  }, [currentRoutine]);

  // Format seconds to mm:ss or hh:mm format
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    } else {
      return `${minutes}min`;
    }
  }, []);

  // Render blocks accordion or Spotify-style routine view
  const renderBlocks = useCallback(() => {
    if (!currentRoutine) return null;

    // Calculate total duration
    const totalDuration = calculateTotalDuration();
    const formattedDuration = formatDuration(totalDuration);

    // For the Spotify-style view, we'll show blocks as sections
    return (
      <div className="space-y-6">
        {/* Header with routine name and play button */}
        <div className="flex flex-col space-y-4">
          {/* Back button and title */}
          <div className="flex items-center">
            <button 
              onClick={() => {
                // Go back to template selection if we came from there
                if (!isCustomRoutine) {
                  setShowTemplateSelection(true);
                } else {
                  // Otherwise go back to the routine type modal
                  setShowRoutineTypeModal(true);
                }
              }}
              className="mr-3 p-2 rounded-full bg-white/5 hover:bg-white/10"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          
          {/* Routine title and creator */}
          <div>
            <h1 className="text-3xl font-bold">{currentRoutine.name || "My Routine"}</h1>
            <div className="flex items-center mt-1">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                <Users className="h-3 w-3" />
              </div>
              <span className="text-sm text-white/80">You</span>
            </div>
          </div>
          
          {/* Duration and exercise count */}
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Clock className="h-4 w-4" />
            <span>{formattedDuration}</span>
            <span className="w-1 h-1 bg-white/40 rounded-full"></span>
            <span>{currentRoutine.blocks.reduce((total, block) => total + block.exercises.length, 0)} exercises</span>
          </div>
          
          {/* Action icons */}
          <div className="flex items-center space-x-6 py-2">
            <button 
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Download routine"
            >
              <Download className="h-6 w-6" />
            </button>
            <button 
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Add to favorites"
            >
              <Heart className="h-6 w-6" />
            </button>
            <button 
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Share routine"
            >
              <Share2 className="h-6 w-6" />
            </button>
            <button 
              className="text-white/70 hover:text-white transition-colors"
              aria-label="More options"
            >
              <MoreHorizontal className="h-6 w-6" />
            </button>
            <div className="flex-grow"></div>
            <StandardButton
              onClick={() => console.log("Play routine")}
              className="rounded-full w-14 h-14 flex items-center justify-center bg-[rgb(var(--feedback-success))]"
              aria-label="Play routine"
            >
              <Play className="h-7 w-7" />
            </StandardButton>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          <StandardButton
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            size="sm"
            className="flex-1"
          >
            {isEditMode ? "Done" : "Edit"}
          </StandardButton>
          <StandardButton
            onClick={() => {
              const blockId = currentRoutine.blocks[0]?.id;
              if (blockId) openExerciseSelection(blockId);
            }}
            variant="outline"
            size="sm"
            className="flex-1"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add
          </StandardButton>
          <StandardButton
            onClick={() => console.log("Sort")}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Sort
          </StandardButton>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-[var(--motion-natural)] var(--ease-standard)"
            aria-label={viewMode === 'list' ? "Switch to grid view" : "Switch to list view"}
          >
            {viewMode === 'list' ? <Grid3X3 className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
        </div>
        
        {/* Selected exercises actions */}
        {isEditMode && selectedExercises.length > 0 && (
          <div className="bg-white/10 p-3 rounded-lg flex items-center justify-between shadow-[var(--shadow-sm)]">
            <p className="text-sm">{selectedExercises.length} selected</p>
            <StandardButton
              onClick={() => {
                const blockId = currentRoutine.blocks[0]?.id;
                if (blockId) handleRemoveSelectedExercises(blockId);
              }}
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Remove
            </StandardButton>
          </div>
        )}

        {/* Exercises list with accordion blocks */}
        <div className="space-y-6">
          {currentRoutine.blocks.map((block) => (
            <div key={block.id} className="space-y-3">
              {/* Block header with expand/collapse */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleBlockExpansion(block.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleBlockExpansion(block.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={expandedBlocks.includes(block.id)}
                aria-controls={`block-content-${block.id}`}
              >
                <div className="flex items-center">
                  {expandedBlocks.includes(block.id) ? (
                    <ChevronUp className="h-4 w-4 mr-2 text-white/50" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-2 text-white/50" />
                  )}
                  <h2 className="text-lg font-medium">{block.name}</h2>
                </div>
                {!isEditMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openExerciseSelection(block.id);
                    }}
                    className="p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-[var(--motion-natural)] var(--ease-standard)"
                    aria-label={`Add exercise to ${block.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Block content (exercises) */}
              {expandedBlocks.includes(block.id) && (
                <div 
                  className="pl-6"
                  id={`block-content-${block.id}`}
                  role="region"
                  aria-labelledby={`block-header-${block.id}`}
                >
                  {/* Block info (from template) */}
                  {!isCustomRoutine && selectedTemplate && (
                    <div className="mb-3 p-3 bg-white/5 rounded-lg shadow-[var(--shadow-xs)]">
                      <p className="text-sm text-white/70">
                        {block.notes || "Add exercises to this block"}
                      </p>
                      {block.type === "warmup" && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/10 rounded-full text-xs text-white/70">
                          Warm-up
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Exercises */}
                  {renderExercises(block.id, blockExercisesMap[block.id] || block.exercises)}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Add block button */}
        {!isEditMode && (
          <StandardButton
            onClick={handleAddBlock}
            variant="outline"
            className="w-full"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Block
          </StandardButton>
        )}
        
        {/* Save button */}
        <StandardButton
          onClick={handleSaveRoutine}
          className="w-full"
          aria-label="Save routine"
        >
          Save Routine
        </StandardButton>
      </div>
    );
  }, [currentRoutine, isEditMode, selectedExercises, handleRemoveSelectedExercises, handleAddBlock, handleSaveRoutine]);

  return (
    <MobileLayout title="Routine Builder" showBackButton={true}>
      <div className="px-4 pt-2 pb-6">
        {/* Error message display */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-[rgb(var(--feedback-error))]/10 border border-[rgb(var(--feedback-error))]/30 rounded-lg text-white shadow-[var(--shadow-sm)]">
            <p className="text-sm font-medium">{errorMessage}</p>
            {isRecovering && (
              <p className="text-xs mt-1 text-white/70">Attempting to recover...</p>
            )}
          </div>
        )}
        
        {/* Initial Routine Type Modal */}
        <RoutineTypeModal
          open={showRoutineTypeModal}
          onClose={() => setShowRoutineTypeModal(false)}
          onSelectCustom={handleSelectCustom}
          onSelectTemplate={handleSelectTemplate}
        />
        
        {/* Template Selection or Routine Builder */}
        {!showRoutineTypeModal && (
          showTemplateSelection ? renderTemplateSelection() : renderBlocks()
        )}
        
        {/* Exercise Selection Modal */}
        {activeBlockId && (
          <ExerciseSelection
            open={exerciseSelectionOpen}
            onClose={() => setExerciseSelectionOpen(false)}
            onSelectExercise={(exercise) => {
              // Convert Exercise to RoutineExercise when adding
              const routineExercise: RoutineExercise = {
                ...exercise,
                sets: 1,
                reps: 10,
                duration: exercise.duration?.default || 45
              };
              handleAddExercise(activeBlockId, routineExercise);
            }}
            blockId={activeBlockId}
            templateBlock={activeTemplateBlock}
          />
        )}
      </div>
    </MobileLayout>
  );
};

export default RoutineBuilder;
