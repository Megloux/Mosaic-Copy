import { type ReactNode, useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { Check, WifiOff } from 'lucide-react';

/**
 * SaveButton is a reusable UI component for save operations.
 * It's a "dumb" component that handles only presentation,
 * leaving all business logic to the parent component.
 * 
 * Features:
 * - Loading state display
 * - Disabled state handling
 * - Multiple sizes and variants
 * - Customizable content
 * - Accessibility support
 * - Offline status awareness
 * 
 * @example
 * // Basic usage
 * <SaveButton onSave={handleSave}>
 *   Save Changes
 * </SaveButton>
 * 
 * // With loading state
 * <SaveButton 
 *   onSave={handleSave}
 *   isLoading={isSaving}
 *   disabled={!canSave}
 *   variant="primary"
 *   size="lg"
 * >
 *   Save Routine
 * </SaveButton>
 */
interface SaveButtonProps {
  /** Function called when save button is clicked */
  onSave: () => Promise<void>;
  
  /** Shows loading state ("...") when true */
  isLoading?: boolean;
  
  /** Disables button interactions when true */
  disabled?: boolean;
  
  /** Visual style variant */
  variant?: 'primary' | 'secondary';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Button content (text, icon, or both) */
  children?: ReactNode;
  
  /** Accessibility label for screen readers */
  ariaLabel?: string;
  
  /** Additional CSS classes */
  className?: string;
}

export function SaveButton({
  onSave,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  children = 'Save',
  ariaLabel,
  className = '',
}: SaveButtonProps) {
  const { isOnline } = useNetworkStatus();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'offline-saved'>('idle');
  
  // Reset save state after a delay
  useEffect(() => {
    if (saveState === 'saved' || saveState === 'offline-saved') {
      const timer = setTimeout(() => {
        setSaveState('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveState]);
  
  // Base styles always applied
  const baseStyles = 'rounded-md transition-all duration-200 flex items-center gap-2';
  
  // Size-specific padding and text size
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }[size];
  
  // Variant-specific colors and hover states
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }[variant];
  
  // Visual feedback for loading/disabled states
  const stateStyles = (isLoading || disabled) ? 'opacity-50 cursor-not-allowed' : '';
  
  // Handle save with offline awareness
  const handleSave = async () => {
    if (isLoading || disabled) return;
    
    setSaveState('saving');
    
    try {
      await onSave();
      setSaveState(isOnline ? 'saved' : 'offline-saved');
    } catch (error) {
      console.error('Save failed:', error);
      setSaveState('idle');
    }
  };
  
  // Determine button content based on state
  const getButtonContent = () => {
    if (isLoading || saveState === 'saving') return '...';
    if (saveState === 'saved') return <><Check size={16} /> Saved</>;
    if (saveState === 'offline-saved') return <><WifiOff size={16} /> Saved Offline</>;
    return children;
  };
  
  return (
    <button
      onClick={handleSave}
      disabled={isLoading || disabled}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${stateStyles} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Save')}
      title={!isOnline ? 'Changes will be saved locally while offline' : undefined}
    >
      {getButtonContent()}
    </button>
  );
}
