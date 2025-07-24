import React from 'react'
import { cn } from '@/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import { Virtuoso } from 'react-virtuoso'

const listVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: 'divide-y divide-border',
        separated: 'space-y-[var(--spacing-sm)]'
      },
      padding: {
        none: '',
        small: '[&>*]:p-[var(--container-padding-sm)]',
        medium: '[&>*]:p-[var(--container-padding-md)]',
        large: '[&>*]:p-[var(--container-padding-lg)]'
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'medium'
    }
  }
)

export interface ListProps<T> 
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'onDragEnd'>,
    VariantProps<typeof listVariants> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  keyExtractor: (item: T) => string
  emptyState?: React.ReactNode
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  loading?: boolean
  loadingState?: React.ReactNode
  error?: Error | null
  errorState?: React.ReactNode
  enableHaptics?: boolean
  draggable?: boolean
  onDragEnd?: (startIndex: number, endIndex: number) => void
  virtualize?: boolean
  height?: number
}

export const List = React.forwardRef<HTMLDivElement, ListProps<any>>(
  ({ 
    className,
    variant,
    padding,
    items,
    renderItem,
    keyExtractor,
    emptyState,
    selectable = false,
    selectedIds = [],
    onSelectionChange,
    loading = false,
    loadingState,
    error = null,
    errorState,
    enableHaptics = false,
    draggable = false,
    onDragEnd,
    virtualize = false,
    ...props 
  }, ref) => {
    const [draggedItem, setDraggedItem] = React.useState<number | null>(null)

    const handleItemClick = React.useCallback((id: string) => {
      if (!selectable || !onSelectionChange) return

      // Haptic feedback
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(5) // Subtle vibration
      }

      const newSelectedIds = selectedIds.includes(id)
        ? selectedIds.filter(selectedId => selectedId !== id)
        : [...selectedIds, id]

      onSelectionChange(newSelectedIds)
    }, [selectable, onSelectionChange, enableHaptics, selectedIds])

    const handleDragStart = (e: React.DragEvent, index: number) => {
      if (!draggable) return
      setDraggedItem(index)
      e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      if (!draggable) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    }, [draggable])

    const handleDrop = React.useCallback((e: React.DragEvent, dropIndex: number) => {
      if (!draggable || draggedItem === null || !onDragEnd) return
      e.preventDefault()
      onDragEnd(draggedItem, dropIndex)
      setDraggedItem(null)

      // Haptic feedback
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(10) // Stronger vibration for drop
      }
    }, [draggable, draggedItem, onDragEnd, enableHaptics])

    // Loading state with skeleton UI
    if (loading) {
      return loadingState || (
        <div
          ref={ref}
          className={cn(listVariants({ variant, padding }), className)}
          role="status"
          {...props}
        >
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="animate-pulse space-y-3 p-[var(--container-padding-md)]"
            >
              <div className="h-4 w-3/4 rounded bg-surface-hover" />
              <div className="h-3 w-1/2 rounded bg-surface-hover" />
            </div>
          ))}
        </div>
      )
    }

    // Error state
    if (error) {
      return errorState || (
        <div
          ref={ref}
          className={cn(listVariants({ variant, padding }), className)}
          role="alert"
          {...props}
        >
          <div className="flex flex-col items-center justify-center p-4 text-destructive">
            <p className="text-sm font-medium">Error loading items</p>
            <p className="text-xs">{error.message}</p>
          </div>
        </div>
      )
    }

    // Empty state
    if (items.length === 0) {
      return emptyState || (
        <div
          ref={ref}
          className={cn(listVariants({ variant, padding }), className)}
          role="status"
          {...props}
        >
          <div className="flex items-center justify-center p-4 text-foreground/60">
            <p className="text-sm">No items to display</p>
          </div>
        </div>
      )
    }

    const renderListItem = (item: any, index: number) => {
      const id = keyExtractor(item)
      const isSelected = selectedIds.includes(id)

      return (
        <div
          role={selectable ? 'option' : 'listitem'}
          aria-selected={selectable ? isSelected : undefined}
          onClick={selectable ? () => handleItemClick(id) : undefined}
          draggable={draggable}
          onDragStart={e => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={e => handleDrop(e, index)}
          className={cn(
            'min-h-[var(--ios-min-touch-target)]',
            'transition-all duration-[var(--motion-natural)]',
            'ease-[var(--spring-ios-bounce)]',
            selectable && 'cursor-pointer ios-button',
            variant === 'separated' && 'rounded-lg border border-border',
            isSelected && 'bg-primary/5',
            draggable && 'cursor-move',
            draggedItem === index && 'opacity-50',
            selectable || draggable ? 'hover:bg-surface-hover/50 active:bg-surface-hover' : ''
          )}
        >
          {renderItem(item, index)}
        </div>
      )
    }

    // Virtualized list for large datasets
    if (virtualize) {
      return (
        <div
          ref={ref}
          className={cn(listVariants({ variant, padding }), className)}
          role={selectable ? 'listbox' : 'list'}
          aria-multiselectable={selectable}
          {...props}
        >
          <Virtuoso
            data={items}
            itemContent={(index, item) => renderListItem(item, index)}
            style={{ height: '100%' }}
          />
        </div>
      )
    }

    // Regular list
    return (
      <div
        ref={ref}
        className={cn(listVariants({ variant, padding }), className)}
        role={selectable ? 'listbox' : 'list'}
        aria-multiselectable={selectable}
        {...props}
      >
        {items.map((item, index) => renderListItem(item, index))}
      </div>
    )
  }
)

List.displayName = 'List'
