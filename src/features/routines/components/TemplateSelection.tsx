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
const TemplateCard: React.FC<{ 
  template: Template; 
  onSelect: (template: Template) => void; 
}> = ({ template, onSelect }) => {
  // Special styling for custom template
  const isCustom = template.id === "custom";
  const isFolder = template.id === "new-folder";
  const isNewTemplate = template.isProOnly; // Using isProOnly as a flag for "NEW"
  
  return (
    <Card
      className={cn(
        "relative mb-3 overflow-hidden cursor-pointer",
        "border border-white/var(--border-opacity-medium)",
        "shadow-sm hover:shadow-lg",
        "transition-all duration-[var(--motion-natural)] var(--ease-standard)",
        isCustom ? 'ring-1 ring-[rgb(var(--feedback-info))]' : '',
        isFolder ? 'ring-1 ring-white/var(--border-opacity-subtle)' : ''
      )}
      style={{ 
        background: getGradientBackground(template.id)
      }}
      onClick={() => onSelect(template)}
    >
      <motion.div
        whileHover={{ 
          scale: 1.01, 
          y: -2,
          transition: { 
            duration: 0.2, 
            ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
          }
        }}
        whileTap={{ 
          scale: 0.98, // Using touch-scale-press
          transition: { 
            duration: 0.05, // Using motion-instant
            ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
          }
        }}
        className="p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              {isCustom && <PlusCircle className="h-4 w-4 text-[rgb(var(--feedback-info))]" />}
              {isFolder && <Folder className="h-4 w-4 text-white/70" />}
              
              {isNewTemplate && (
                <div className="bg-[rgb(var(--feedback-success))] text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm mr-2 text-black">
                  NEW
                </div>
              )}
              <h3 className={cn(
                "text-base font-medium text-white",
                isCustom ? 'text-[rgb(var(--feedback-info))/90]' : ''
              )}>
                {template.name}
              </h3>
            </div>
            <p className="text-sm text-white/70 pr-4 leading-relaxed">
              {template.description}
            </p>
          </div>
          <div className="bg-[var(--surface-base)] p-1.5 rounded-full">
            <ChevronRight className="h-4 w-4 text-white/70" />
          </div>
        </div>
        
        {/* Subtle overlay */}
        <div className="
          absolute inset-0 
          bg-gradient-to-br from-white/[var(--border-opacity-subtle)] to-transparent
          pointer-events-none"
        />
      </motion.div>
    </Card>
  );
};

// Filter Tab Component
const FilterTab: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  showSpark?: boolean;
}> = ({ label, isActive, onClick, showSpark }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
        isActive 
          ? "bg-white/15 text-white" 
          : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {showSpark && <Sparkles className="h-3.5 w-3.5" />}
      </div>
    </button>
  );
};

// Search Component with premium styling
const SearchBar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-6">
      <div className="
        absolute inset-0 -z-10 rounded-xl
        bg-[rgb(var(--feedback-info))/10]
        blur-xl opacity-50
      "/>
      <SearchInput
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
          backdrop-blur-sm bg-black/40 
          border-white/var(--border-opacity-subtle)
          focus:border-white/var(--border-opacity-medium) 
          focus:ring-white/var(--border-opacity-subtle)
          placeholder:text-white/40 text-white
          shadow-[var(--shadow-sm)]
        "
      />
    </div>
  );
};

/**
 * TemplateSelection Component
 * 
 * Displays a list of routine templates that users can select from.
 */
export const TemplateSelection: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get the selectTemplate action from our Zustand store
  const { selectTemplate } = useRoutineStore();
  
  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await templateService.getAllTemplates();
        
        // Add our special templates
        const allTemplates = [
          {
            id: "custom",
            name: "Custom Routine",
            description: "Build your own workout from scratch",
            isProOnly: false,
            isSpecial: true,
            structure: {
              blocks: [],
              estimatedDuration: 0,
              difficulty: "beginner" as const,
              focus: ["Custom"]
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          ...fetchedTemplates.map(template => ({
            ...template,
            isSpecial: false
          })),
          {
            id: "new-folder",
            name: "New Folder",
            description: "Organize your routines in folders",
            isProOnly: false,
            isSpecial: true,
            structure: {
              blocks: [],
              estimatedDuration: 0,
              difficulty: "beginner" as const,
              focus: []
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        setTemplates(allTemplates);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching templates:", err);
        setError("Failed to load templates. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchTemplates();
  }, []);
  
  // Filter templates based on search and active tab
  const filteredTemplates = templates.filter(template => {
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
  
  // Handle template selection
  const handleSelectTemplate = async (template: Template) => {
    try {
      if (template.id === "new-folder") {
        // Handle folder creation (would be implemented separately)
        console.log("Creating new folder");
        return;
      }
      
      // Select the template using our Zustand store
      await selectTemplate(template.id);
      
      // Navigate to the routine builder
      navigate("/routines/builder");
    } catch (err) {
      console.error("Error selecting template:", err);
      // Could show an error toast here
    }
  };

  return (
    <MobileLayout title="Templates" showBackButton={false}>
      <div className="px-4 pt-2 pb-6">
        {/* Search bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {/* Filter tabs */}
        <div className="flex space-x-2 mb-6">
          <FilterTab 
            label="All" 
            isActive={activeTab === "all"} 
            onClick={() => setActiveTab("all")} 
          />
          <FilterTab 
            label="Pro" 
            isActive={activeTab === "pro"} 
            onClick={() => setActiveTab("pro")} 
            showSpark
          />
          <FilterTab 
            label="Free" 
            isActive={activeTab === "free"} 
            onClick={() => setActiveTab("free")} 
          />
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-white/70">Loading templates...</p>
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
        
        {/* Templates grid */}
        <div className="grid grid-cols-1 gap-3">
          <AnimatePresence>
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
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
          
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
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
      </div>
    </MobileLayout>
  );
};
