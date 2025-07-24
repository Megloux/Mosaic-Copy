import React from 'react';
import { motion } from 'framer-motion';
import { formatTime } from '@/components/routines/builder/utils/formatters';
import { cn } from '@/lib/utils';

interface ExerciseTimerProps {
  timeRemaining: number;
  totalDuration: number;
  isInFinalCountdown: boolean;
  themeColor?: string;
}

/**
 * ExerciseTimer Component
 * 
 * Displays a circular timer with the remaining time for the current exercise.
 * Changes color during the final countdown (last 20 seconds for exercises ≥ 1 minute).
 */
const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  timeRemaining,
  totalDuration,
  isInFinalCountdown,
  themeColor = '#ffffff'
}) => {
  // Calculate the progress for the circular timer (0 to 1)
  const progress = 1 - (timeRemaining / totalDuration);
  
  // Calculate the circumference of the circle
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke-dashoffset based on progress
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="120"
          cy="120"
          r={radius}
          fill="transparent"
          stroke="#333333"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="120"
          cy="120"
          r={radius}
          fill="transparent"
          stroke={isInFinalCountdown ? '#ef4444' : themeColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      <div className="absolute flex flex-col items-center">
        <span className={cn(
          "text-5xl font-bold",
          isInFinalCountdown ? "text-red-500" : `text-[${themeColor}]`
        )}>
          {formatTime(timeRemaining)}
        </span>
        <span className="text-gray-400 mt-2">
          remaining
        </span>
      </div>
    </div>
  );
};

export { ExerciseTimer };
