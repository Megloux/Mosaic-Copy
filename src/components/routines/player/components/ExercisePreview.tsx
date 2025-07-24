import React from 'react';
import { formatTime } from '@/components/routines/builder/utils/formatters';
import { RoutineExercise } from '@/types/templates';
import { cn } from '@/lib/utils';

interface ExercisePreviewProps {
  exercise: RoutineExercise;
  isSecondary?: boolean;
  themeColor?: string;
}

/**
 * ExercisePreview Component
 * 
 * Displays a preview of an upcoming exercise in the workout routine.
 * Shows the exercise name, duration, and a thumbnail if available.
 */
const ExercisePreview: React.FC<ExercisePreviewProps> = ({
  exercise,
  isSecondary = false,
  themeColor = '#ffffff'
}) => {
  const { name, duration, thumbnailUrl } = exercise;
  
  return (
    <div 
      className={cn(
        "flex items-center p-3 rounded-lg mb-3",
        isSecondary ? "opacity-70" : ""
      )}
    >
      {/* Exercise thumbnail or placeholder */}
      <div 
        className={cn(
          "w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 flex items-center justify-center",
          `bg-[${themeColor}]/10`
        )}
      >
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn("text-xs font-medium", `text-[${themeColor}]/70`)}>
            {name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      
      {/* Exercise info */}
      <div className="flex flex-col flex-1">
        <h3 className="text-base font-medium truncate">
          {name}
        </h3>
        <span className="text-sm text-gray-400">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export { ExercisePreview };
