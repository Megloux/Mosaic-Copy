import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NetworkState {
  // Status
  isOnline: boolean
  isSyncing: boolean
  lastSyncTime: number | null
  pendingChanges: number
  
  // Actions
  setOnline: (status: boolean) => void
  setSyncing: (status: boolean) => void
  setLastSyncTime: (time: number) => void
  setPendingChanges: (count: number) => void
  incrementPendingChanges: () => void
  decrementPendingChanges: () => void
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      // Initial state
      isOnline: navigator.onLine,
      isSyncing: false,
      lastSyncTime: null,
      pendingChanges: 0,
      
      // Actions
      setOnline: (status: boolean) => set({ isOnline: status }),
      setSyncing: (status: boolean) => set({ isSyncing: status }),
      setLastSyncTime: (time: number) => set({ lastSyncTime: time }),
      setPendingChanges: (count: number) => set({ pendingChanges: count }),
      incrementPendingChanges: () => set(state => ({ pendingChanges: state.pendingChanges + 1 })),
      decrementPendingChanges: () => set(state => ({ 
        pendingChanges: Math.max(0, state.pendingChanges - 1) 
      })),
    }),
    {
      name: 'network-status',
    }
  )
)

// Initialize network listeners
export function initNetworkListeners() {
  const updateOnlineStatus = () => {
    useNetworkStore.getState().setOnline(navigator.onLine)
    
    // Dispatch custom event for components to listen to
    window.dispatchEvent(new CustomEvent('networkStatusChanged', { 
      detail: { isOnline: navigator.onLine } 
    }))
  }
  
  // Set up event listeners
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
  
  // Initial status
  updateOnlineStatus()
  
  return () => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  }
}

// Hook for components to use
export function useNetworkStatus() {
  return useNetworkStore(state => ({
    isOnline: state.isOnline,
    isSyncing: state.isSyncing,
    lastSyncTime: state.lastSyncTime,
    pendingChanges: state.pendingChanges,
  }))
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initNetworkListeners()
}
