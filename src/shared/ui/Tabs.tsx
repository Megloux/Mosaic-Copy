import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/lib/utils'
import { motion } from 'framer-motion'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  content?: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  /** Array of tab items */
  items: TabItem[]
  /** Default active tab ID */
  defaultTabId?: string
  /** Controlled active tab ID */
  activeTabId?: string
  /** Callback when tab changes */
  onTabChange?: (tabId: string) => void
  /** Orientation of tabs */
  orientation?: 'horizontal' | 'vertical'
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Variant style */
  variant?: 'default' | 'pills' | 'underline'
  /** Full width tabs */
  fullWidth?: boolean
  /** Loading state */
  loading?: boolean
  /** Enable haptic feedback */
  enableHaptics?: boolean
  /** Additional class name */
  className?: string
  /** Tab list class name */
  tabListClassName?: string
  /** Tab panel class name */
  tabPanelClassName?: string
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    items,
    defaultTabId,
    activeTabId: controlledActiveTabId,
    onTabChange,
    orientation = 'horizontal',
    size = 'md',
    variant = 'default',
    fullWidth = false,
    loading = false,
    enableHaptics = true,
    className,
    tabListClassName,
    tabPanelClassName,
    ...props
  }, ref) => {
    // Determine if component is controlled or uncontrolled
    const isControlled = controlledActiveTabId !== undefined
    
    // State for uncontrolled component
    const [activeTabId, setActiveTabId] = useState<string>(
      isControlled ? controlledActiveTabId! : (defaultTabId || items[0]?.id || '')
    )
    
    // Update internal state when controlled value changes
    useEffect(() => {
      if (isControlled && controlledActiveTabId) {
        setActiveTabId(controlledActiveTabId)
      }
    }, [isControlled, controlledActiveTabId])
    
    // Refs for measuring tab widths and positions
    const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
    const [indicatorStyles, setIndicatorStyles] = useState({
      width: 0,
      height: 0,
      transform: '',
      left: 0,
      bottom: 0,
    })
    
    // Update indicator position when active tab changes
    useEffect(() => {
      const activeTabRef = tabRefs.current[activeTabId]
      if (!activeTabRef) return
      
      if (orientation === 'horizontal') {
        setIndicatorStyles({
          width: activeTabRef.offsetWidth,
          height: 2,
          transform: `translateX(${activeTabRef.offsetLeft}px)`,
          left: 0,
          bottom: 0,
        })
      } else {
        setIndicatorStyles({
          width: 2,
          height: activeTabRef.offsetHeight,
          transform: `translateY(${activeTabRef.offsetTop}px)`,
          left: 0,
          bottom: 0,
        })
      }
    }, [activeTabId, orientation, items])
    
    // Handle tab change
    const handleTabChange = (tabId: string) => {
      // Skip if tab is disabled or already active
      const tab = items.find(item => item.id === tabId)
      if (tab?.disabled || tabId === activeTabId) return
      
      // Trigger haptic feedback
      if (enableHaptics && window.navigator.vibrate) {
        window.navigator.vibrate(10)
      }
      
      // Update state if uncontrolled
      if (!isControlled) {
        setActiveTabId(tabId)
      }
      
      // Call onChange callback
      onTabChange?.(tabId)
    }
    
    // Get active tab content
    const activeTab = items.find(item => item.id === activeTabId)
    
    // Size classes
    const sizeClasses = {
      sm: 'text-sm h-8',
      md: 'text-base h-10',
      lg: 'text-lg h-12',
    }
    
    // Variant classes
    const variantClasses = {
      default: 'border-b border-border',
      pills: 'gap-1 p-1 rounded-lg bg-muted/30',
      underline: 'border-b border-border',
    }
    
    return (
      <div 
        ref={ref}
        className={cn(
          'w-full',
          className
        )}
        {...props}
      >
        {/* Tab List */}
        <div
          className={cn(
            'relative',
            orientation === 'horizontal' ? 'flex flex-row' : 'flex flex-col',
            variantClasses[variant],
            tabListClassName
          )}
          role="tablist"
          aria-orientation={orientation}
        >
          {items.map((item) => (
            <button
              key={item.id}
              ref={el => tabRefs.current[item.id] = el}
              role="tab"
              type="button"
              aria-selected={activeTabId === item.id}
              aria-controls={`panel-${item.id}`}
              tabIndex={activeTabId === item.id ? 0 : -1}
              className={cn(
                'relative flex items-center justify-center px-3',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'transition-colors duration-200',
                sizeClasses[size],
                fullWidth && 'flex-1',
                variant === 'pills' && activeTabId === item.id && 'bg-background shadow-sm rounded',
                variant !== 'pills' && activeTabId === item.id && 'text-primary',
                variant !== 'pills' && activeTabId !== item.id && 'text-muted-foreground hover:text-foreground',
                item.disabled && 'opacity-50 cursor-not-allowed',
                'min-h-[var(--ios-min-touch-target)] min-w-[var(--ios-min-touch-target)]'
              )}
              disabled={item.disabled || loading}
              onClick={() => handleTabChange(item.id)}
            >
              {item.icon && (
                <span className={cn('mr-2', !item.label && 'mr-0')}>
                  {item.icon}
                </span>
              )}
              {item.label}
            </button>
          ))}
          
          {/* Animated Indicator */}
          {variant !== 'pills' && (
            <motion.div
              className={cn(
                'absolute bg-primary',
                orientation === 'horizontal' ? 'bottom-0 left-0' : 'left-0 top-0'
              )}
              style={{
                width: `${indicatorStyles.width}px`,
                height: `${indicatorStyles.height}px`,
                transform: indicatorStyles.transform,
                left: `${indicatorStyles.left}px`,
                bottom: `${indicatorStyles.bottom}px`,
              }}
              transition={{
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1] // iOS spring curve
              }}
            />
          )}
        </div>
        
        {/* Tab Panels */}
        {activeTab?.content && (
          <div
            id={`panel-${activeTabId}`}
            role="tabpanel"
            aria-labelledby={activeTabId}
            tabIndex={0}
            className={cn(
              'mt-2 focus:outline-none',
              loading && 'opacity-60',
              tabPanelClassName
            )}
          >
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ) : (
              activeTab.content
            )}
          </div>
        )}
      </div>
    )
  }
)

Tabs.displayName = 'Tabs'
