import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  timeRemaining: number;
  totalDuration: number;
  isInFinalCountdown?: boolean;
  themeColor?: string;
  className?: string;
  children?: React.ReactNode;
  isAppleWatch?: boolean;
}

/**
 * CountdownTimer Component
 * 
 * Displays a circular timer with a progress indicator that decreases as time counts down.
 * The timer changes color during the final countdown.
 * Optimized for both mobile and Apple Watch displays.
 */
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  timeRemaining,
  totalDuration,
  isInFinalCountdown = false,
  themeColor = '#22D3EE',
  className = '',
  children,
  isAppleWatch = false
}) => {
  // Calculate progress as a percentage (0-100)
  const progress = Math.max(0, Math.min(100, (timeRemaining / totalDuration) * 100));
  
  // State for Digital Crown rotation (Apple Watch)
  const [crownRotation, setCrownRotation] = useState(0);
  
  // Calculate the circle circumference - 50% bigger than before
  // Use smaller size for Apple Watch
  const size = isAppleWatch ? 180 : 270; // Increased from 120/180
  const strokeWidth = isAppleWatch ? 5 : 8; // Increased from 4/6
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate the stroke dash offset based on progress
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  // Generate color variations based on theme color
  const getTimerColor = () => {
    if (isInFinalCountdown) return '#ef4444'; // Red for final countdown
    return themeColor;
  };
  
  // Handle Digital Crown rotation for Apple Watch
  useEffect(() => {
    if (!isAppleWatch) return;
    
    // This is a placeholder for the actual Apple Watch Digital Crown API
    // In a real implementation, you would use WatchKit or watchOS APIs
    const handleCrownRotation = (event: any) => {
      setCrownRotation(prev => prev + event.detail.delta);
      
      // Here you would trigger haptic feedback when the crown is rotated
      // This would use the watchOS haptic feedback API
    };
    
    // Add event listener for Digital Crown rotation
    // This is a placeholder - actual implementation would use watchOS APIs
    window.addEventListener('crownrotate', handleCrownRotation);
    
    return () => {
      window.removeEventListener('crownrotate', handleCrownRotation);
    };
  }, [isAppleWatch]);
  
  return (
    <div className={`relative ${className}`}>
      {/* Background circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gray-900 shadow-lg opacity-80"></div>
      </div>
      
      {/* SVG for progress circle */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getTimerColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Timer content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
      
      {/* Apple Watch Digital Crown indicator (only visible on Apple Watch) */}
      {isAppleWatch && (
        <div 
          className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gray-300 rounded-full opacity-50"
          style={{ 
            transform: `translateY(-50%) rotate(${crownRotation}deg)`,
            transformOrigin: 'center left'
          }}
        />
      )}
    </div>
  );
};

export { CountdownTimer };
