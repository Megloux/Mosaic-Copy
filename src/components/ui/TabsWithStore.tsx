import React from 'react'
import { Tabs, TabsProps } from '@/components/ui/Tabs'
import { useTabGroup } from '@/store/uiStore'

export interface TabsWithStoreProps extends Omit<TabsProps, 'activeTabId' | 'onTabChange'> {
  /** Unique ID for this tab group in the store */
  groupId: string
  /** Default active tab ID (only used if no value exists in store) */
  defaultTabId?: string
}

/**
 * Tabs component connected to the Zustand UI store
 * 
 * This component automatically manages tab state in the central store,
 * allowing for persistent tab selection across renders and app restarts.
 * 
 * @example
 * <TabsWithStore
 *   groupId="exercise-tabs"
 *   defaultTabId="details"
 *   items={[
 *     { id: 'details', label: 'Details', content: <DetailsTab /> },
 *     { id: 'history', label: 'History', content: <HistoryTab /> }
 *   ]}
 * />
 */
const TabsWithStore = React.forwardRef<HTMLDivElement, TabsWithStoreProps>(
  ({ groupId, defaultTabId, ...props }, ref) => {
    // Get tab state from store
    const { activeTab, setActiveTab } = useTabGroup(groupId)
    
    // Handle tab change
    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId)
    }
    
    return (
      <Tabs
        ref={ref}
        activeTabId={activeTab || defaultTabId}
        onTabChange={handleTabChange}
        {...props}
      />
    )
  }
)

TabsWithStore.displayName = 'TabsWithStore'

export { TabsWithStore }
