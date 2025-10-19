import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface UIState {
  // Navigation
  sidebarOpen: boolean
  currentPage: string
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
  
  // Loading states
  loading: {
    global: boolean
    workflows: boolean
    agents: boolean
    media: boolean
    analytics: boolean
  }
  
  // Modals
  modals: {
    createWorkflow: boolean
    createAgent: boolean
    uploadMedia: boolean
    settings: boolean
  }

  // Additional UI state
  commandPaletteOpen: boolean
  notificationCenterOpen: boolean
  quickActionsOpen: boolean
  
  // Filters
  filters: {
    workflows: {
      status?: string
      type?: string
      search?: string
    }
    agents: {
      status?: string
      type?: string
      search?: string
    }
    media: {
      type?: string
      status?: string
      search?: string
    }
  }
  
  // Pagination
  pagination: {
    workflows: { page: number; limit: number }
    agents: { page: number; limit: number }
    media: { page: number; limit: number }
    analytics: { page: number; limit: number }
  }
}

interface UIActions {
  // Navigation actions
  setSidebarOpen: (open: boolean) => void
  setCurrentPage: (page: string) => void
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Notification actions
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void
  
  // Loading actions
  setLoading: (key: keyof UIState['loading'], loading: boolean) => void
  setGlobalLoading: (loading: boolean) => void
  
  // Modal actions
  setModal: (modal: keyof UIState['modals'], open: boolean) => void
  closeAllModals: () => void

  // Additional UI actions
  setCommandPaletteOpen: (open: boolean) => void
  setNotificationCenterOpen: (open: boolean) => void
  setQuickActionsOpen: (open: boolean) => void
  
  // Filter actions
  setFilter: (section: keyof UIState['filters'], filter: Partial<UIState['filters'][keyof UIState['filters']]>) => void
  clearFilters: (section: keyof UIState['filters']) => void
  
  // Pagination actions
  setPagination: (section: keyof UIState['pagination'], pagination: Partial<{ page: number; limit: number }>) => void
  resetPagination: (section: keyof UIState['pagination']) => void
}

export const useUIStore = create<UIState & UIActions>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sidebarOpen: true,
        currentPage: '/',
        theme: 'system',
        notifications: [],
        loading: {
          global: false,
          workflows: false,
          agents: false,
          media: false,
          analytics: false,
        },
        modals: {
          createWorkflow: false,
          createAgent: false,
          uploadMedia: false,
          settings: false,
        },
        commandPaletteOpen: false,
        notificationCenterOpen: false,
        quickActionsOpen: false,
        filters: {
          workflows: {},
          agents: {},
          media: {},
        },
        pagination: {
          workflows: { page: 1, limit: 10 },
          agents: { page: 1, limit: 10 },
          media: { page: 1, limit: 12 },
          analytics: { page: 1, limit: 10 },
        },

        // Navigation actions
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setCurrentPage: (page) => set({ currentPage: page }),

        // Theme actions
        setTheme: (theme) => set({ theme }),

        // Notification actions
        addNotification: (notification) => {
          const newNotification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            read: false,
          }
          set((state) => ({
            notifications: [...state.notifications, newNotification],
          }))
        },
        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }))
        },
        markNotificationAsRead: (id) => {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, read: true } : n
            ),
          }))
        },
        clearAllNotifications: () => set({ notifications: [] }),

        // Loading actions
        setLoading: (key, loading) => {
          set((state) => ({
            loading: { ...state.loading, [key]: loading },
          }))
        },
        setGlobalLoading: (loading) => {
          set((state) => ({
            loading: { ...state.loading, global: loading },
          }))
        },

        // Modal actions
        setModal: (modal, open) => {
          set((state) => ({
            modals: { ...state.modals, [modal]: open },
          }))
        },
        closeAllModals: () => {
          set({
            modals: {
              createWorkflow: false,
              createAgent: false,
              uploadMedia: false,
              settings: false,
            },
          })
        },

        // Additional UI actions
        setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
        setNotificationCenterOpen: (open) => set({ notificationCenterOpen: open }),
        setQuickActionsOpen: (open) => set({ quickActionsOpen: open }),

        // Filter actions
        setFilter: (section, filter) => {
          set((state) => ({
            filters: {
              ...state.filters,
              [section]: { ...state.filters[section], ...filter },
            },
          }))
        },
        clearFilters: (section) => {
          set((state) => ({
            filters: {
              ...state.filters,
              [section]: {},
            },
          }))
        },

        // Pagination actions
        setPagination: (section, pagination) => {
          set((state) => ({
            pagination: {
              ...state.pagination,
              [section]: { ...state.pagination[section], ...pagination },
            },
          }))
        },
        resetPagination: (section) => {
          set((state) => ({
            pagination: {
              ...state.pagination,
              [section]: { page: 1, limit: state.pagination[section].limit },
            },
          }))
        },
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          filters: state.filters,
          pagination: state.pagination,
        }),
      }
    ),
    { name: 'UIStore' }
  )
)