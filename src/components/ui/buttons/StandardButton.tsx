import React from 'react';
import { cn } from '@/shared/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  [
    // Core styles
    'inline-flex items-center justify-center gap-2',
    'ios-button', // iOS platform styles
    'transition-all duration-[var(--motion-natural)]',
    'ease-[var(--spring-ios-bounce)]',
    
    // Focus & Disabled states
    'focus-visible:outline-none focus-visible:ring-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    
    // iOS touch feedback
    'active:scale-[var(--touch-scale-press)]',
    'hover:scale-[var(--touch-scale-lift)]'
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border hover:border-border-hover bg-transparent',
        ghost: 'hover:bg-surface-hover',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
      },
      size: {
        default: 'var(--ios-min-touch-target)',  // iOS minimum
        sm: 'h-9 text-sm px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10 p-0' // Add icon size for icon-only buttons
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  enableHaptics?: boolean;
}

const StandardButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    isLoading,
    loadingText,
    leftIcon,
    rightIcon,
    enableHaptics,
    children, 
    disabled,
    onClick,
    ...props 
  }, ref) => {
    // Handle haptic feedback
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(10); // Short vibration
      }
      onClick?.(e);
    }, [enableHaptics, onClick]);

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <div className="h-4 w-4 animate-[spin_var(--spinner-speed)_linear_infinite] rounded-full border-2 border-current border-t-transparent" />
        )}
        {!isLoading && leftIcon}
        {isLoading ? loadingText : children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

StandardButton.displayName = 'StandardButton';

export { buttonVariants, StandardButton };
