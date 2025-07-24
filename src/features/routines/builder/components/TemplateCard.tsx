import React from 'react';
import { motion } from 'framer-motion';
import { Template } from '@/features/routines/model/types';
import { StandardButton } from '@/components/ui/buttons/StandardButton';

interface TemplateCardProps {
  template: Template;
  onSelect: (templateId: string) => void;
}

/**
 * Template card component for displaying template options
 * Used in the template selection view
 */
export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect
}) => {
  return (
    <motion.div 
      className="bg-slate-800 rounded-lg p-4 shadow-md hover:bg-slate-700 transition-colors"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{template.name}</h3>
        {template.isProOnly && (
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs px-2 py-1 rounded-full font-bold">
            PRO
          </span>
        )}
      </div>
      
      <p className="text-sm text-white/70 mb-4 line-clamp-2">
        {template.description}
      </p>
      
      <div className="flex items-center justify-between text-xs text-white/50 mb-4">
        <span>{template.structure.difficulty}</span>
        <span>{template.structure.blocks.length} blocks</span>
        <span>{Math.round(template.structure.estimatedDuration / 60)} min</span>
      </div>
      
      {template.structure.focus.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {template.structure.focus.map((focus: string) => (
            <span 
              key={focus}
              className="bg-slate-600 text-white/80 text-xs px-2 py-1 rounded-full"
            >
              {focus}
            </span>
          ))}
        </div>
      )}
      
      <StandardButton 
        onClick={() => onSelect(template.id)}
        className="w-full"
      >
        Select Template
      </StandardButton>
    </motion.div>
  );
};
