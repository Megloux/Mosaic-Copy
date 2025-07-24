import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'overflow-hidden transition-all',
  {
    variants: {
      variant: {
        default: 'bg-surface hover:bg-surface-hover',
        raised: 'bg-surface-raised hover:bg-surface-raised/90 shadow-sm',
        outline: 'border border-border hover:border-border-hover bg-transparent'
      },
      padding: {
        none: '',
        small: 'var(--container-padding-sm)',
        medium: 'var(--container-padding-md)',
        large: 'var(--container-padding-lg)'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'medium'
    }
  }
)

export interface CardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string
  description?: string
  action?: React.ReactNode
  media?: React.ReactNode
  footer?: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className,
    variant,
    padding,
    title,
    description,
    action,
    media,
    footer,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...props}
      >
        {media && (
          <div className="aspect-video relative overflow-hidden">
            {media}
          </div>
        )}
        <div className={cn(!media && cardVariants({ padding }))}>
          {(title || description || action) && (
            <div className="flex items-start justify-between gap-4">
              <div>
                {title && (
                  <h3 className="leading-none tracking-tight">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-foreground/60">
                    {description}
                  </p>
                )}
              </div>
              {action && (
                <div className="flex-shrink-0">
                  {action}
                </div>
              )}
            </div>
          )}
          {children}
        </div>
        {footer && (
          <div className={cn(
            'border-t border-border',
            cardVariants({ padding })
          )}>
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'
