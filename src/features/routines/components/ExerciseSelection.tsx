import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Tag } from "lucide-react";
import { Modal } from '@/shared/ui';
import { SearchInput } from '@/shared/ui/form';
import { StandardButton } from '@/shared/ui/buttons/StandardButton';
import { Exercise } from '@/features/exercises/model/types';
import { TemplateBlock } from '@/features/routines/model/types';
import { cn } from '@/shared/lib/utils';
import { exerciseService } from '@/features/exercises/api/exerciseService';

interface ExerciseSelectionProps {
  open: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  blockId: string;
  templateBlock?: TemplateBlock;
}

/**
 * ExerciseSelection Component
 * 
 * This modal allows users to select exercises to add to a routine block.
 * It provides tag-based filtering and recommendations based on template tags.
 */
export const ExerciseSelection: React.FC<ExerciseSelectionProps> = ({
  open,
  onClose,
  onSelectExercise,
  blockId,
  templateBlock
}) => {
  // State
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch exercises on component mount
  useEffect(() => {
    const fetchExercises = async () => {
      setIsLoading(true);
      try {
        // If we have template tags, use them to get recommended exercises
        if (templateBlock?.template_tags && templateBlock.template_tags.length > 0) {
          const recommendedExercises = await exerciseService.getExercisesByTags(
            templateBlock.template_tags
          );
          setExercises(recommendedExercises);
          
          // Pre-select template tags
          setSelectedTags(templateBlock.template_tags);
        } else {
          // Otherwise, get all exercises
          const allExercises = await exerciseService.getAllExercises();
          setExercises(allExercises);
        }
        
        // Get all available tags
        // Note: Assuming exerciseService has a method to get all tags
        // If not available, we can extract unique tags from exercises
        const allTags = await exerciseService.getAllExercises()
          .then(exercises => {
            const tagSet = new Set<string>();
            exercises.forEach(exercise => {
              exercise.tags.forEach(tag => tagSet.add(tag));
            });
            return Array.from(tagSet);
          });
        
        setAvailableTags(allTags);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching exercises:", err);
        setError("Failed to load exercises. Please try again.");
        setIsLoading(false);
      }
    };
    
    if (open) {
      fetchExercises();
    }
  }, [open, templateBlock]);

  // Filter exercises based on search and selected tags
  useEffect(() => {
    let filtered = [...exercises];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(exercise => 
        selectedTags.every(tag => exercise.tags.includes(tag))
      );
    }
    
    setFilteredExercises(filtered);
  }, [exercises, searchQuery, selectedTags]);

  // Toggle a tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Handle selecting an exercise
  const handleSelectExercise = (exercise: Exercise) => {
    onSelectExercise(exercise);
    // Don't close the modal after selection to allow adding multiple exercises
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add to this routine"
      className="max-w-md mx-auto"
    >
      <div className="space-y-4">
        {/* Search input */}
        <SearchInput
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full"
        />
        
        {/* Tags */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "px-2 py-1 rounded-full text-xs transition-colors",
                  selectedTags.includes(tag)
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-white/70">Loading exercises...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-[rgb(var(--feedback-error))]">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-white/10 rounded-lg"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Recommended section header */}
        {!isLoading && !error && filteredExercises.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-white/80">
              {selectedTags.length > 0 ? "Matching exercises" : "Recommended exercises"}
            </h3>
            <p className="text-xs text-white/50">
              Based on {templateBlock ? "template tags" : "your routine"}
            </p>
          </div>
        )}
        
        {/* Exercises list */}
        {!isLoading && !error && (
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredExercises.length > 0 ? (
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredExercises.map((exercise, index) => (
                    <motion.div
                      key={`${exercise.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        ease: [0.23, 1, 0.32, 1]
                      }}
                    >
                      <div 
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => handleSelectExercise(exercise)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white/10 rounded overflow-hidden mr-3 flex-shrink-0">
                            {exercise.thumbnailUrl ? (
                              <img 
                                src={exercise.thumbnailUrl} 
                                alt={exercise.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/40?text=Ex";
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
                            <div className="flex flex-wrap gap-1 mt-1">
                              {exercise.tags.slice(0, 2).map(tag => (
                                <span 
                                  key={tag} 
                                  className="px-1.5 py-0.5 bg-white/10 rounded-full text-xs text-white/70"
                                >
                                  {tag}
                                </span>
                              ))}
                              {exercise.tags.length > 2 && (
                                <span className="text-xs text-white/50">
                                  +{exercise.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Plus className="h-5 w-5 text-white/50" />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-white/5 p-3 rounded-full mb-3">
                  <Search className="h-6 w-6 text-white/30" />
                </div>
                <h3 className="text-white/70 font-medium mb-1">No exercises found</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Try adjusting your search or tags to find what you're looking for
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <StandardButton
            onClick={onClose}
            variant="outline"
          >
            Done
          </StandardButton>
        </div>
      </div>
    </Modal>
  );
};
