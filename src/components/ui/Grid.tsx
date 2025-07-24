import React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Masonry } from 'react-virtualized'

const gridVariants = cva(
  'grid w-full',
  {
    variants: {
      layout: {
        grid: '',
        masonry: 'grid-none', // Will use Masonry component
        auto: 'grid-cols-auto-fit' // Custom utility for auto-sizing
      },
      gap: {
        none: 'gap-0',
        small: 'gap-[var(--spacing-sm)]',
        medium: 'gap-[var(--spacing-md)]',
        large: 'gap-[var(--spacing-lg)]'
      },
      padding: {
        none: 'p-0',
        small: 'p-[var(--container-padding-sm)]',
        medium: 'p-[var(--container-padding-md)]',
        large: 'p-[var(--container-padding-lg)]'
      }
    },
    defaultVariants: {
      layout: 'grid',
      gap: 'medium',
      padding: 'none'
    }
  }
)

export interface GridProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  minChildWidth?: string // For auto-sizing
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyItems?: 'start' | 'center' | 'end' | 'stretch'
  loading?: boolean
  loadingItems?: number
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    children, 
    className,
    layout,
    cols = 1, 
    minChildWidth,
    gap = 'medium',
    padding,
    alignItems = 'stretch',
    justifyItems = 'stretch',
    loading = false,
    loadingItems = 6,
    ...props 
  }, ref) => {
    // Responsive column classes with better mobile-first approach
    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
      12: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12'
    }

    // Loading skeleton
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            gridVariants({ layout: 'grid', gap, padding }),
            colClasses[cols],
            className
          )}
          {...props}
        >
          {Array.from({ length: loadingItems }).map((_, i) => (
            <div 
              key={i}
              className={cn(
                'animate-pulse space-y-4',
                'min-h-[var(--ios-min-touch-target)]',
                'rounded-lg bg-surface-hover/30'
              )}
            />
          ))}
        </div>
      )
    }

    // Auto-sizing grid
    if (minChildWidth) {
      const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minChildWidth}, 1fr))`
      }

      return (
        <div
          ref={ref}
          className={cn(gridVariants({ gap, padding }), className)}
          style={gridStyle}
          {...props}
        >
          {children}
        </div>
      )
    }

    // Masonry layout
    if (layout === 'masonry') {
      return (
        <div
          ref={ref}
          className={cn(gridVariants({ layout, gap, padding }), className)}
          {...props}
        >
          <Masonry
            columnCount={cols}
            columnGutter={gap === 'none' ? 0 : parseInt(getComputedStyle(document.documentElement).getPropertyValue(`--spacing-${gap}`))}
            columnWidth={200} // Base width, will be responsive
            height={600} // Required prop
            width={800} // Required prop
            autoHeight={true}
            cellCount={React.Children.count(children)}
            cellMeasurerCache={{
              defaultHeight: 250,
              defaultWidth: 200,
              fixedWidth: true,
            }}
            cellPositioner={(index) => ({
              columnIndex: index % cols,
              rowIndex: Math.floor(index / cols),
              offset: 0,
            })}
            cellRenderer={({ index, key, style }) => (
              <div key={key} style={style}>
                {React.Children.toArray(children)[index]}
              </div>
            )}
          >
            {children}
          </Masonry>
        </div>
      )
    }

    // Standard grid
    return (
      <div
        ref={ref}
        className={cn(
          gridVariants({ layout, gap, padding }),
          !minChildWidth && colClasses[cols],
          `items-${alignItems}`,
          `justify-items-${justifyItems}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Grid.displayName = 'Grid'
