import React from 'react'
import { cn } from '@/shared/lib/utils'
import { ChevronDown } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const accordionVariants = cva(
  [
    'w-full',
    'transition-all duration-[var(--motion-natural)]'
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'divide-y divide-border',
        separated: 'space-y-[var(--spacing-sm)]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface AccordionProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  items: {
    id: string
    title: string
    content: React.ReactNode
    description?: string
    disabled?: boolean
  }[]
  defaultExpanded?: string[]
  multiple?: boolean
  onExpandedChange?: (expanded: string[]) => void
  loading?: boolean
  error?: Error | null
  enableHaptics?: boolean
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ 
    className,
    variant,
    items,
    defaultExpanded = [],
    multiple = false,
    onExpandedChange,
    loading,
    error,
    enableHaptics,
    ...props 
  }, ref) => {
    const [expanded, setExpanded] = React.useState<string[]>(defaultExpanded)

    const handleToggle = React.useCallback((id: string) => {
      // Haptic feedback
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(5); // Subtle vibration
      }

      const newExpanded = multiple
        ? expanded.includes(id)
          ? expanded.filter(itemId => itemId !== id)
          : [...expanded, id]
        : expanded.includes(id)
          ? []
          : [id]

      setExpanded(newExpanded)
      onExpandedChange?.(newExpanded)
    }, [expanded, multiple, enableHaptics, onExpandedChange])

    // Loading state
    if (loading) {
      return (
        <div className={cn(accordionVariants({ variant }), className)} {...props}>
          {[1, 2].map((i) => (
            <div 
              key={i}
              className="animate-pulse space-y-4 p-[var(--container-padding-md)]"
            >
              <div className="h-5 w-2/3 rounded bg-surface-hover" />
              <div className="h-4 w-1/3 rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      )
    }

    // Error state
    if (error) {
      return (
        <div 
          className={cn(
            accordionVariants({ variant }), 
            'p-[var(--container-padding-md)] text-destructive',
            className
          )} 
          {...props}
        >
          {error.message}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(accordionVariants({ variant }), className)}
        {...props}
      >
        {items.map(({ id, title, description, content, disabled }) => {
          const isExpanded = expanded.includes(id)
          
          return (
            <div
              key={id}
              className={cn(
                'min-h-[var(--ios-min-touch-target)]',
                variant === 'separated' && 'border border-border rounded-lg overflow-hidden'
              )}
            >
              <button
                type="button"
                onClick={() => !disabled && handleToggle(id)}
                className={cn(
                  'flex w-full items-center justify-between',
                  'p-[var(--container-padding-md)]',
                  'min-h-[var(--ios-min-touch-target)]',
                  'ios-button',
                  'transition-colors duration-[var(--motion-natural)]',
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-ring focus-visible:ring-offset-2',
                  disabled && 'opacity-50 cursor-not-allowed',
                  !disabled && 'hover:bg-surface-hover active:bg-surface-hover/80'
                )}
                aria-expanded={isExpanded}
                aria-disabled={disabled}
                disabled={disabled}
              >
                <div>
                  <div className="text-sm font-medium leading-none">{title}</div>
                  {description && (
                    <div className="mt-1 text-sm text-foreground/60 leading-snug">
                      {description}
                    </div>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0',
                    'transition-transform duration-[var(--motion-natural)]',
                    'ease-[var(--spring-ios-bounce)]',
                    isExpanded && 'rotate-180'
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden',
                  'transition-all duration-[var(--motion-natural)]',
                  'ease-[var(--spring-ios-bounce)]',
                  isExpanded ? 'max-h-screen' : 'max-h-0'
                )}
                aria-hidden={!isExpanded}
              >
                <div 
                  className={cn(
                    'p-[var(--container-padding-md)] pt-0',
                    'opacity-0 translate-y-2',
                    'transition-all duration-[var(--motion-natural)]',
                    'ease-[var(--spring-ios-bounce)]',
                    isExpanded && 'opacity-100 translate-y-0'
                  )}
                >
                  {content}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

Accordion.displayName = 'Accordion'
