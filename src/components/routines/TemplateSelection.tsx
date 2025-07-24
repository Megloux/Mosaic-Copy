import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Search, Sparkles, PlusCircle, Folder } from "lucide-react";
import { MobileLayout } from '@/components/layouts/MobileLayout';
import { SearchInput } from '@/shared/ui/form';
import { Card } from "@/components/ui/cards";
import { cn } from '@/shared/lib/utils';
import { Template as TemplateType } from '@/features/routines/model/types';
import { templateService } from '@/features/routines/api/templateService';
import { useRoutineStore } from '@/features/routines/model/routineStore';

// Define our UI template interface (extends the data model Template)
interface Template extends Partial<TemplateType> {
  id: string;
  name: string;
  description: string;
  isProOnly?: boolean;
  isSpecial?: boolean;
}

// Function to get modern gradient background based on template id
const getGradientBackground = (id: string) => {
  // Create an array of modern gradient options with greys and navy blues
  const gradients = [
    "linear-gradient(135deg, #1E293B 0%, #334155 100%)", // Slate gradient
    "linear-gradient(135deg, #334155 0%, #475569 100%)", // Lighter slate
    "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", // Dark navy
    "linear-gradient(135deg, #1E293B 0%, #0F766E 100%)", // Navy to teal
    "linear-gradient(135deg, #1E293B 0%, #7C3AED 15%, #1E293B 100%)", // Navy with purple accent
    "linear-gradient(135deg, #0F172A 0%, #22D3EE 15%, #0F172A 100%)", // Navy with cyan accent
    "linear-gradient(135deg, #27272A 0%, #3F3F46 100%)", // Zinc gradient
    "linear-gradient(135deg, #292524 0%, #44403C 100%)", // Stone gradient
    "linear-gradient(135deg, #1E293B 0%, #F97316 15%, #1E293B 100%)", // Navy with orange pop
    "linear-gradient(135deg, #0F172A 0%, #0EA5E9 15%, #0F172A 100%)", // Navy with sky blue accent
  ];
  
  // Handle special cases first
  if (id === "custom") {
    return "linear-gradient(135deg, #0F172A 0%, #334155 100%)";
  }
  if (id === "new-folder") {
    return "linear-gradient(135deg, #27272A 0%, #3F3F46 100%)";
  }
  
  // Use hash of id to deterministically select a gradient
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

// Template Card Component using Card component
const TemplateCard = ({ template, onSelect }: { template: Template, onSelect: (template: Template) => void }) => {
  return (
    <Card 
      className="cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg"
      onClick={() => onSelect(template)}
    >
      <div 
        className="h-24 p-4 flex flex-col justify-between"
        style={{ 
          background: getGradientBackground(template.id),
          backgroundSize: "200% 200%",
          animation: template.isSpecial ? "gradient-shift 3s ease infinite" : "none"
        }}
      >
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-white">{template.name}</h3>
          {template.isProOnly && (
            <span className="bg-[#22D3EE] text-black text-xs px-2 py-0.5 rounded-full font-medium">
              PRO
            </span>
          )}
          {template.isSpecial && (
            <span className="flex items-center space-x-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>Featured</span>
            </span>
          )}
        </div>
        <div className="flex justify-between items-end">
          <p className="text-sm text-white/70 line-clamp-1">{template.description}</p>
          <ChevronRight className="h-5 w-5 text-white/50" />
        </div>
      </div>
    </Card>
  );
};

// Filter Tab Component
const FilterTab = ({ 
  label, 
  isActive, 
  onClick,
  showSpark = false
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
  showSpark?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm transition-colors",
        isActive 
          ? "bg-white/20 text-white font-medium" 
          : "bg-transparent text-white/60 hover:text-white/80"
      )}
    >
      <span className="flex items-center space-x-1">
        {showSpark && <Sparkles className="h-3 w-3 mr-1" />}
        {label}
      </span>
    </button>
  );
};

// Search Component with premium styling
const SearchBar = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-white/50" />
      </div>
      <input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={cn(
          "w-full pl-10 pr-4 py-2 rounded-full",
          "bg-white/5 border border-white/10",
          "text-white placeholder:text-white/50",
          "focus:outline-none focus:ring-2 focus:ring-white/20",
          "transition-all duration-200"
        )}
      />
    </div>
  );
};

// TemplateSelection Component
// 
// Displays a list of routine templates that users can select from.
export const TemplateSelection = () => {
  const navigate = useNavigate();
  const { selectTemplate } = useRoutineStore();
  
  // State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  
  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await templateService.getAllTemplates();
        
        // Add special templates
        const allTemplates: Template[] = [
          {
            id: "custom",
            name: "Custom Routine",
            description: "Build your routine from scratch",
            isSpecial: true,
            structure: {
              blocks: []
            }
          },
          ...fetchedTemplates,
          {
            id: "new-folder",
            name: "Create Folder",
            description: "Organize your routines",
            isSpecial: true,
            structure: {
              blocks: []
            }
          }
        ];
        
        setTemplates(allTemplates);
        setFilteredTemplates(allTemplates);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to load templates. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  // Filter templates based on search and active filter
  useEffect(() => {
    let filtered = [...templates];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "featured") {
        filtered = filtered.filter(template => template.isSpecial);
      } else if (activeFilter === "pro") {
        filtered = filtered.filter(template => template.isProOnly);
      } else {
        filtered = filtered.filter(template => 
          template.structure.focus?.includes(activeFilter)
        );
      }
    }
    
    setFilteredTemplates(filtered);
  }, [templates, searchQuery, activeFilter]);
  
  // Handle template selection
  const handleSelectTemplate = (template: Template) => {
    if (template.id === "custom") {
      // Create a new empty routine
      selectTemplate(null);
      navigate("/routines/builder");
    } else if (template.id === "new-folder") {
      // TODO: Implement folder creation
      alert("Folder creation coming soon!");
    } else {
      // Select the template and navigate to builder
      selectTemplate(template);
      navigate("/routines/builder");
    }
  };
  
  return (
    <MobileLayout
      title="Templates"
      showBackButton={false}
      className="pb-20"
    >
      <div className="space-y-6">
        {/* Search and filters */}
        <div className="space-y-4">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex space-x-1">
              <FilterTab 
                label="All" 
                isActive={activeFilter === "all"} 
                onClick={() => setActiveFilter("all")} 
              />
              <FilterTab 
                label="Featured" 
                isActive={activeFilter === "featured"} 
                onClick={() => setActiveFilter("featured")} 
                showSpark
              />
              <FilterTab 
                label="Strength" 
                isActive={activeFilter === "strength"} 
                onClick={() => setActiveFilter("strength")} 
              />
              <FilterTab 
                label="Cardio" 
                isActive={activeFilter === "cardio"} 
                onClick={() => setActiveFilter("cardio")} 
              />
              <FilterTab 
                label="Flexibility" 
                isActive={activeFilter === "flexibility"} 
                onClick={() => setActiveFilter("flexibility")} 
              />
              <FilterTab 
                label="Pro" 
                isActive={activeFilter === "pro"} 
                onClick={() => setActiveFilter("pro")} 
              />
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white/30"></div>
            <p className="mt-4 text-white/70">Loading templates...</p>
          </div>
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-400">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-white/10 rounded-lg"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Templates grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: [0.23, 1, 0.32, 1]
                  }}
                >
                  <TemplateCard 
                    template={template} 
                    onSelect={handleSelectTemplate} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Empty state */}
            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-white/5 p-3 rounded-full mb-3">
                  <Search className="h-6 w-6 text-white/30" />
                </div>
                <h3 className="text-white/70 font-medium mb-1">No templates found</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Try adjusting your search or filters to find what you're looking for
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};
