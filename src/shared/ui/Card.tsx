import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-background',
        primary: 'bg-primary/10 border-primary/20',
        secondary: 'bg-secondary/10 border-secondary/20',
        destructive: 'bg-destructive/10 border-destructive/20',
        outline: 'bg-transparent',
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
          <div className="overflow-hidden rounded-t-lg">
            {media}
          </div>
        )}
        
        {(title || action) && (
          <div className="flex items-center justify-between gap-4 p-6 pb-2">
            {title && (
              <div>
                {typeof title === 'string' ? (
                  <h3 className="text-lg font-semibold">{title}</h3>
                ) : (
                  title
                )}
                {description && (
                  <div className="text-sm text-muted-foreground">
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
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted"></div>
            </div>
          ) : (
            children
          )}
        </div>
        
        {footer && (
          <div className="border-t bg-muted/50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
);
