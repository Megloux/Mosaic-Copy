import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and optimizes them with tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseStyles = cn(
  // Typography - extreme minimal luxury
  "font-inter font-[100]",
  "uppercase tracking-[0.5em]",
  "text-[0.8rem]",
  "leading-relaxed",
  
  // Borders
  "border-[0.25px]",
  
  // Colors & States
  "border-white/5",
  "text-white/90",
  "transition-all duration-300",
  
  // Dark mode
  "dark:border-white/5",
  "dark:text-white/90"
);

// Add heading styles for "WELCOME TO MOSAIC" type text
export const headingStyles = cn(
  baseStyles,
  "text-[1.2rem]",
  "tracking-[0.6em]",
  "font-[100]",
  "text-white/95"
);
