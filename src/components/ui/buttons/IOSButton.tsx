import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIOSTouch } from '@/hooks/useIOSTouch';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'default' | 'compact';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  status?: 'idle' | 'loading' | 'success' | 'error';
}

export const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'default',
    loading = false,
    disabled = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    status = 'idle',
    className,
    onClick,
    ...props
  }, ref) => {
    const { isIOS, triggerHaptic } = useIOSTouch();
    const [isPressed, setIsPressed] = React.useState(false);
    const [isLongPress, setIsLongPress] = React.useState(false);
    const pressTimeoutRef = React.useRef<NodeJS.Timeout>();
    
    // Debounced click handler
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      triggerHaptic();
      onClick?.(e);
    }, [disabled, loading, onClick, triggerHaptic]);

    // Long press detection
    const handleTouchStart = () => {
      setIsPressed(true);
      pressTimeoutRef.current = setTimeout(() => {
        setIsLongPress(true);
      }, 500);
    };

    const handleTouchEnd = () => {
      setIsPressed(false);
      setIsLongPress(false);
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
    };

    const buttonStyles = cn(
      // Core Styles
      'inline-flex items-center justify-center',
      'font-modern font-[100] uppercase tracking-[0.3em]',
      'border-[0.5px] rounded-md',
      'min-h-[44px]',
      
      // Performance Optimizations
      'contain-layout',
      'will-change-transform',
      'ios-tap-transparent',
      
      // Animation and Interaction
      'transition-all duration-[var(--motion-natural)]',
      'ease-[var(--spring-ios-bounce)]',
      isPressed && !isLongPress && 'scale-[var(--touch-scale-press)]',
      !disabled && 'hover:scale-[var(--touch-scale-lift)]',
      
      // Size Variants
      {
        'px-4 py-2 text-xs': size === 'default',
        'px-3 py-1.5 text-[10px]': size === 'compact',
      },
      
      // Visual Variants with Glow
      {
        'border-white/10 bg-black text-white hover:border-primary/30 hover:shadow-[0_0_20px_0_rgba(0,183,120,0.15)]': 
          variant === 'primary',
        'border-gray-500 bg-black text-white hover:border-primary/30 hover:shadow-[0_0_20px_0_rgba(0,183,120,0.15)]': 
          variant === 'secondary',
        'border-red-500/30 bg-black text-white hover:border-red-500/50 hover:shadow-[0_0_20px_0_rgba(239,68,68,0.15)]': 
          variant === 'destructive',
      },
      
      // Status Styles
      status === 'success' && 'animate-save-complete',
      status === 'error' && 'animate-save-error',
      
      // States
      'disabled:opacity-50 disabled:pointer-events-none',
      'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
      loading && 'cursor-wait',
      fullWidth && 'w-full',
      
      className
    );

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || loading}
        className={buttonStyles}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-busy={loading}
        role="button"
        {...props}
      >
        <span className="flex items-center justify-center gap-2 w-full">
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="truncate">{children}</span>
            </>
          ) : (
            <>
              {icon && iconPosition === 'left' && icon}
              <span className="truncate">{children}</span>
              {icon && iconPosition === 'right' && icon}
            </>
          )}
        </span>
      </button>
    );
  }
);

IOSButton.displayName = 'IOSButton';
