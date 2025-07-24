import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { PlusCircle, BookOpen } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface RoutineTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSelectCustom: () => void;
  onSelectTemplate: () => void;
}

/**
 * Modal that appears when creating a new routine, offering options for
 * "Custom" or "Template" based routines.
 */
export const RoutineTypeModal: React.FC<RoutineTypeModalProps> = ({
  open,
  onClose,
  onSelectCustom,
  onSelectTemplate
}) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      variant="overlay"
      size="default"
    >
      <div className="p-6 space-y-6">
        <h2 className="text-xl font-bold text-center">Create Routine</h2>
        <p className="text-sm text-white/70 text-center">
          Choose how you want to build your routine
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Custom Routine Option */}
          <motion.div
            whileHover={{ 
              scale: 1.02,
              transition: { 
                duration: 0.2, 
                ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
              }
            }}
            whileTap={{ 
              scale: 0.98, 
              transition: { 
                duration: 0.05, // Using motion-instant
                ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
              }
            }}
            className={cn(
              "p-5 rounded-lg cursor-pointer",
              "bg-gradient-to-br from-[#0F172A] to-[#334155]",
              "border border-white/var(--border-opacity-subtle)",
              "hover:border-[rgb(var(--feedback-info))]",
              "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
              "transition-all duration-[var(--motion-natural)] var(--ease-standard)"
            )}
            onClick={onSelectCustom}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-[rgb(var(--feedback-info))]/20">
                <PlusCircle className="h-6 w-6 text-[rgb(var(--feedback-info))]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Custom Routine</h3>
                <p className="text-sm text-white/70">
                  Start from scratch and build your own routine exactly how you want it.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Template Option */}
          <motion.div
            whileHover={{ 
              scale: 1.02,
              transition: { 
                duration: 0.2, 
                ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
              }
            }}
            whileTap={{ 
              scale: 0.98, 
              transition: { 
                duration: 0.05, // Using motion-instant
                ease: [0.24, 1.12, 0.76, 1] // Using spring-ios-snap
              }
            }}
            className={cn(
              "p-5 rounded-lg cursor-pointer",
              "bg-gradient-to-br from-[#1E293B] to-[#475569]",
              "border border-white/var(--border-opacity-subtle)",
              "hover:border-white/var(--border-opacity-medium)",
              "shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
              "transition-all duration-[var(--motion-natural)] var(--ease-standard)"
            )}
            onClick={onSelectTemplate}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-full bg-white/20">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Use Template</h3>
                <p className="text-sm text-white/70">
                  Choose from professionally designed templates to get started quickly.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Modal>
  );
};
