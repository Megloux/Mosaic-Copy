import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useIOSTouch } from '@/hooks/useIOSTouch';

export interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /** 'default' is an alias for 'primary' (StandardButton compat) */
  variant?: 'primary' | 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  /** 'sm' is an alias for 'compact' (StandardButton compat) */
  size?: 'default' | 'compact' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  /** Alias for loading (StandardButton compat) */
  isLoading?: boolean;
  /** Text to show while loading (replaces children) */
  loadingText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  /** Alias for icon+left (StandardButton compat) */
  leftIcon?: React.ReactNode;
  /** Alias for icon+right (StandardButton compat) */
  rightIcon?: React.ReactNode;
  status?: 'idle' | 'loading' | 'success' | 'error';
  /** Accepted for compat — haptics are always enabled via useIOSTouch */
  enableHaptics?: boolean;
}

export const IOSButton = React.forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'default',
    loading: loadingProp = false,
    isLoading: isLoadingProp,
    loadingText,
    disabled = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    leftIcon,
    rightIcon,
    status = 'idle',
    enableHaptics,
    className,
    type = 'button',
    onClick,
    ...props
  }, ref) => {
    const { triggerHaptic } = useIOSTouch();
    const [isPressed, setIsPressed] = React.useState(false);
    const [isLongPress, setIsLongPress] = React.useState(false);
    const pressTimeoutRef = React.useRef<NodeJS.Timeout>();

    // Merge compat aliases
    const loading = isLoadingProp ?? loadingProp;
    const resolvedLeftIcon = leftIcon ?? (icon && iconPosition === 'left' ? icon : undefined);
    const resolvedRightIcon = rightIcon ?? (icon && iconPosition === 'right' ? icon : undefined);
    const resolvedVariant = variant === 'default' ? 'primary' : variant;
    const resolvedSize = size === 'sm' ? 'compact' : size;

    // Click handler with haptic feedback
    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return;
      triggerHaptic();
      onClick?.(e);
    }, [disabled, loading, onClick, triggerHaptic]);

    // Touch handlers for press animation
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

      // Animation and Interaction
      'transition-all duration-[var(--motion-natural)]',
      'ease-[var(--spring-ios-bounce)]',
      isPressed && !isLongPress && 'scale-[var(--touch-scale-press)]',
      !disabled && 'hover:scale-[var(--touch-scale-lift)]',

      // Size Variants
      {
        'px-4 py-2 text-xs': resolvedSize === 'default',
        'px-3 py-1.5 text-[10px]': resolvedSize === 'compact',
        'px-8 py-3 text-sm': resolvedSize === 'lg',
        'h-10 w-10 p-0': resolvedSize === 'icon',
      },

      // Visual Variants
      {
        // Primary: teal accent CTA
        'border-primary/30 bg-primary text-black hover:bg-primary/90 hover:shadow-[0_0_20px_0_rgba(0,183,120,0.25)]':
          resolvedVariant === 'primary',
        // Secondary: dark with subtle border and glow
        'border-white/10 bg-black text-white hover:border-primary/30 hover:shadow-[0_0_20px_0_rgba(0,183,120,0.15)]':
          resolvedVariant === 'secondary',
        // Outline: transparent with visible border
        'border-white/10 bg-transparent text-white hover:bg-white/5 hover:border-white/20':
          resolvedVariant === 'outline',
        // Ghost: invisible until hover
        'border-transparent bg-transparent text-white hover:bg-white/5':
          resolvedVariant === 'ghost',
        // Destructive: red accent
        'border-red-500/30 bg-black text-white hover:border-red-500/50 hover:shadow-[0_0_20px_0_rgba(239,68,68,0.15)]':
          resolvedVariant === 'destructive',
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
        type={type}
        disabled={disabled || loading}
        className={buttonStyles}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className="flex items-center justify-center gap-2 w-full">
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="truncate">{loadingText ?? children}</span>
            </>
          ) : (
            <>
              {resolvedLeftIcon}
              {children && <span className="truncate">{children}</span>}
              {resolvedRightIcon}
            </>
          )}
        </span>
      </button>
    );
  }
);

IOSButton.displayName = 'IOSButton';
