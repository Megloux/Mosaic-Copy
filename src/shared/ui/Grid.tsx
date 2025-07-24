import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const gridVariants = cva(
  'grid',
  {
    variants: {
      layout: {
        responsive: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        fixed: 'grid-cols-1',
        auto: 'grid-auto-flow-dense'
      },
      gap: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8'
      },
      padding: {
        none: 'p-0',
        xs: 'p-1',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8'
      }
    },
    defaultVariants: {
      layout: 'responsive',
      gap: 'md',
      padding: 'none'
    }
  }
)

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  minChildWidth?: string
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyItems?: 'start' | 'center' | 'end' | 'stretch'
  loading?: boolean
  loadingItems?: number
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    children, 
    className,
    layout = 'responsive',
    gap = 'md',
    padding = 'none',
    cols = 4,
    minChildWidth,
    alignItems = 'stretch',
    justifyItems = 'stretch',
    loading = false,
    loadingItems = 3,
    ...props
  }, ref) => {
    // Generate grid template columns based on cols or minChildWidth
    const gridTemplateColumns = React.useMemo(() => {
      if (minChildWidth) {
        return `repeat(auto-fill, minmax(${minChildWidth}, 1fr))`
      }
      
      if (layout === 'fixed') {
        return `repeat(${cols}, 1fr)`
      }
      
      return undefined
    }, [cols, layout, minChildWidth])
    
    // Generate loading placeholders
    const loadingPlaceholders = React.useMemo(() => {
      if (!loading) return null
      
      return Array.from({ length: loadingItems }).map((_, i) => (
        <div 
          key={`loading-${i}`}
          className="animate-pulse bg-surface-hover/20 rounded-lg h-40"
        />
      ))
    }, [loading, loadingItems])
    
    const gridStyle = {
      gridTemplateColumns,
      alignItems,
      justifyItems,
    }
    
    return (
      <div
        ref={ref}
        className={cn(gridVariants({ layout, gap, padding }), className)}
        style={gridStyle}
        {...props}
      >
        {loading ? loadingPlaceholders : children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'
