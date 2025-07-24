import React from 'react';
import { cn } from '@/shared/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

const sectionVariants = cva(
  [
    'relative w-full',
    'transition-all duration-[var(--motion-natural)]',
    'ease-[var(--spring-ios-bounce)]'
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-background',
        raised: 'bg-surface-raised shadow-sm',
        overlay: 'bg-surface-overlay shadow-md',
        glass: 'bg-background/80 backdrop-blur-md'
      },
      padding: {
        none: 'p-0',
        small: 'p-[var(--container-padding-sm)]',
        default: 'p-[var(--container-padding-md)]',
        large: 'p-[var(--container-padding-lg)]'
      },
      border: {
        none: 'border-0',
        hairline: 'border-[0.5px] border-border',
        subtle: 'border-[0.5px] border-border/10'
      },
      radius: {
        none: 'rounded-none',
        small: 'rounded-md',
        default: 'rounded-lg',
        large: 'rounded-xl',
        full: 'rounded-[var(--radius-full)]'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      border: 'none',
      radius: 'default'
    }
  }
);

type SectionVariants = NonNullable<Parameters<typeof sectionVariants>[0]>;

export interface SectionProps extends React.HTMLAttributes<HTMLElement>, 
  Omit<VariantProps<typeof sectionVariants>, keyof SectionVariants> {
  heading?: string;
  description?: string;
  action?: React.ReactNode;
  stickyHeader?: boolean;
  fullHeight?: boolean;
  variant?: SectionVariants['variant'];
  padding?: SectionVariants['padding'];
  border?: SectionVariants['border'];
  radius?: SectionVariants['radius'];
  loading?: boolean;
  loadingContent?: React.ReactNode;
  error?: Error | null;
  errorContent?: React.ReactNode;
  animate?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  heading,
  description,
  action,
  stickyHeader = false,
  fullHeight = false,
  variant = 'default',
  padding = 'default',
  border = 'none',
  radius = 'default',
  loading = false,
  loadingContent,
  error = null,
  errorContent,
  animate = false,
  className,
  children,
  ...props
}, ref) => {
  const Header = heading ? (
    <motion.div
      className={cn(
        'flex items-center justify-between gap-4',
        'mb-[var(--spacing-md)]',
        stickyHeader && 'sticky top-0 z-10 bg-inherit backdrop-blur-md py-[var(--container-padding-sm)] -mx-[var(--container-padding-md)]'
      )}
      initial={animate ? { opacity: 0, y: -10 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="flex-1 space-y-[var(--spacing-xs)]">
        <motion.h2 
          className="font-modern tracking-wider text-xl text-foreground"
          initial={animate ? { opacity: 0 } : undefined}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ delay: 0.1 }}
        >
          {heading}
        </motion.h2>
        {description && (
          <motion.p 
            className="text-sm text-foreground/60"
            initial={animate ? { opacity: 0 } : undefined}
            animate={animate ? { opacity: 1 } : undefined}
            transition={{ delay: 0.2 }}
          >
            {description}
          </motion.p>
        )}
      </div>
      {action && (
        <motion.div 
          className="flex-shrink-0"
          initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
          animate={animate ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  ) : null;

  // Loading state
  if (loading) {
    return (
      <motion.section
        ref={ref}
        className={cn(
          sectionVariants({ variant, padding, border, radius }),
          fullHeight && 'min-h-[100vh]',
          className
        )}
        initial={animate ? { opacity: 0, y: 20 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        {...(props as any)}
      >
        {loadingContent || (
          <>
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/3 rounded-md bg-surface-hover/30" />
              <div className="h-4 w-1/2 rounded-md bg-surface-hover/30" />
              <div className="mt-8 space-y-3">
                <div className="h-20 rounded-lg bg-surface-hover/30" />
                <div className="h-20 rounded-lg bg-surface-hover/30" />
              </div>
            </div>
          </>
        )}
      </motion.section>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.section
        ref={ref}
        className={cn(
          sectionVariants({ variant, padding, border, radius }),
          fullHeight && 'min-h-[100vh]',
          className
        )}
        initial={animate ? { opacity: 0, y: 20 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        {...(props as any)}
      >
        {errorContent || (
          <div
            className={cn(
              'flex flex-col items-center justify-center space-y-4 py-12 text-center',
              className,
              Array.isArray(className) ? className.join(' ') : className
            )}
          >
            <div className="text-destructive">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-destructive">Error loading section</p>
              <p className="mt-1 text-sm text-foreground/60">{error.message}</p>
            </div>
          </div>
        )}
      </motion.section>
    );
  }

  return (
    <motion.section
      ref={ref}
      className={cn(
        sectionVariants({ variant, padding, border, radius }),
        fullHeight && 'min-h-[100vh]',
        className
      )}
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      animate={animate ? { opacity: 1, y: 0 } : undefined}
      {...(props as any)}
    >
      {Header}
      <motion.div 
        className="w-full"
        initial={animate ? { opacity: 0 } : undefined}
        animate={animate ? { opacity: 1 } : undefined}
        transition={{ delay: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
});

Section.displayName = 'Section';
