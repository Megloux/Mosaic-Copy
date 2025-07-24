import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Routine } from '@/types/templates'

// Types for toast notifications
export type ToastType = 'info' | 'success' | 'warning' | 'error'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  dismissible?: boolean
}

// Types for modals
export interface Modal {
  id: string
  component: string
  props?: Record<string, any>
}

// UI Store State
interface UIState {
  // Tabs
  activeTabs: Record<string, string>
  setActiveTab: (groupId: string, tabId: string) => void
  
  // Toasts
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearToasts: () => void
  
  // Modals
  modals: Modal[]
  openModal: (modal: Omit<Modal, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Routine Player
  routinePlayerVisible: boolean
  currentPlayingRoutine: Routine | null
  showRoutinePlayer: (routine: Routine) => void
  hideRoutinePlayer: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Tabs state
      activeTabs: {},
      setActiveTab: (groupId, tabId) => 
        set(state => ({
          activeTabs: {
            ...state.activeTabs,
            [groupId]: tabId
          }
        })),
      
      // Toasts state
      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        set(state => ({
          toasts: [...state.toasts, { ...toast, id }]
        }))
        
        // Auto-dismiss toast if duration is set
        if (toast.duration) {
          setTimeout(() => {
            get().removeToast(id)
          }, toast.duration)
        }
        
        return id
      },
      removeToast: (id) => set(state => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
      })),
      clearToasts: () => set({ toasts: [] }),
      
      // Modals state
      modals: [],
      openModal: (modal) => {
        const id = `modal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        set(state => ({
          modals: [...state.modals, { ...modal, id }]
        }))
        return id
      },
      closeModal: (id) => set(state => ({
        modals: state.modals.filter(modal => modal.id !== id)
      })),
      closeAllModals: () => set({ modals: [] }),
      
      // Theme state
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Sidebar state
      sidebarOpen: true,
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      // Routine Player state
      routinePlayerVisible: false,
      currentPlayingRoutine: null,
      showRoutinePlayer: (routine) => set({ 
        routinePlayerVisible: true,
        currentPlayingRoutine: routine
      }),
      hideRoutinePlayer: () => set({ 
        routinePlayerVisible: false,
        currentPlayingRoutine: null
      })
    }),
    {
      name: 'mosaic-ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        activeTabs: state.activeTabs,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)

// Selector hooks for better performance
export const useToasts = () => useUIStore(state => ({
  toasts: state.toasts,
  addToast: state.addToast,
  removeToast: state.removeToast,
  clearToasts: state.clearToasts
}))

export const useModals = () => useUIStore(state => ({
  modals: state.modals,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals
}))

export const useTheme = () => useUIStore(state => ({
  theme: state.theme,
  setTheme: state.setTheme
}))

export const useSidebar = () => useUIStore(state => ({
  sidebarOpen: state.sidebarOpen,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen
}))

export const useTabGroup = (groupId: string) => useUIStore(state => ({
  activeTab: state.activeTabs[groupId],
  setActiveTab: (tabId: string) => state.setActiveTab(groupId, tabId)
}))

// Selector hook for the Routine Player
export const useRoutinePlayer = () => useUIStore(state => ({
  visible: state.routinePlayerVisible,
  routine: state.currentPlayingRoutine,
  showRoutinePlayer: state.showRoutinePlayer,
  hideRoutinePlayer: state.hideRoutinePlayer
}))
