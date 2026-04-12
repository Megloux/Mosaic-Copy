import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-2xl border-[0.5px] border-white/[0.06] text-white backdrop-blur-md shadow-lg shadow-black/20',
  {
    variants: {
      variant: {
        default: 'bg-white/[0.04]',
        primary: 'bg-[rgba(0,183,120,0.06)] border-[rgba(0,183,120,0.15)]',
        secondary: 'bg-white/[0.06] border-white/[0.08]',
        destructive: 'bg-[rgba(239,68,68,0.06)] border-[rgba(239,68,68,0.15)]',
        outline: 'bg-transparent border-white/[0.08]',
      },
      size: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        compact: 'p-2',
        none: 'p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof cardVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  media?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    description, 
    media, 
    action, 
    footer, 
    isLoading = false,
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size }), className)}
        {...props}
      >
        {media && (
          <div className="overflow-hidden rounded-t-2xl">
            {media}
          </div>
        )}
        
        {(title || action) && (
          <div className="flex items-center justify-between gap-4 p-6 pb-2">
            {title && (
              <div>
                {typeof title === 'string' ? (
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                ) : (
                  title
                )}
                {description && (
                  <div className="text-sm" style={{ color: 'var(--text-secondary-color)', fontWeight: 'var(--text-secondary-weight)' }}>
                    {description}
                  </div>
                )}
              </div>
            )}
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        )}
        
        <div className={cn(!title && !media && "pt-6", "px-6 pb-6")}>
          {isLoading ? (
            <div className="flex flex-col space-y-3">
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/[0.06]"></div>
              <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]"></div>
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/[0.06]"></div>
            </div>
          ) : (
            children
          )}
        </div>
        
        {footer && (
          <div className="border-t border-white/[0.06] bg-white/[0.02] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
