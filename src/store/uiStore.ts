import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ModalState {
  isOpen: boolean
  type: 'login' | 'register' | 'wallet' | 'project' | 'ticket' | 'none'
  data?: any
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface UIStore {
  theme: Theme
  modal: ModalState
  notifications: Notification[]
  isLoading: boolean
  loadingText: string
  sidebarOpen: boolean
  headerFixed: boolean

  activePreviewVideoId: string | null

  setTheme: (theme: Theme) => void
  toggleTheme: () => void

  openModal: (type: ModalState['type'], data?: any) => void
  closeModal: () => void

  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void

  setLoading: (loading: boolean, text?: string) => void

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void

  setHeaderFixed: (fixed: boolean) => void

  setActivePreviewVideoId: (id: string | null) => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  theme: 'dark',
  modal: {
    isOpen: false,
    type: 'none',
  },
  notifications: [],
  isLoading: false,
  loadingText: 'Loading...',
  sidebarOpen: false,
  headerFixed: true,

  activePreviewVideoId: null,

  setTheme: theme => {
    set({ theme })
    localStorage.setItem('theme', theme)
    // 这里可以添加主题切换的副作用，如更新文档根元素的类名
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },

  toggleTheme: () => {
    const currentTheme = get().theme
    get().setTheme(currentTheme === 'light' ? 'dark' : 'light')
  },

  openModal: (type, data) => set({ modal: { isOpen: true, type, data } }),

  closeModal: () =>
    set({ modal: { isOpen: false, type: 'none', data: undefined } }),

  addNotification: notification => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { id, ...notification }

    set(state => ({
      notifications: [...state.notifications, newNotification],
    }))

    // 自动移除通知
    if (notification.duration !== 0) {
      setTimeout(() => {
        get().removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  },

  removeNotification: id => {
    set(state => ({
      notifications: state.notifications.filter(
        notification => notification.id !== id
      ),
    }))
  },

  clearNotifications: () => set({ notifications: [] }),

  setLoading: (isLoading, text = 'Loading...') =>
    set({ isLoading, loadingText: text }),

  setSidebarOpen: sidebarOpen => set({ sidebarOpen }),

  toggleSidebar: () => {
    const currentSidebarOpen = get().sidebarOpen
    set({ sidebarOpen: !currentSidebarOpen })
  },

  setHeaderFixed: headerFixed => set({ headerFixed }),

  setActivePreviewVideoId: activePreviewVideoId =>
    set({ activePreviewVideoId }),
}))
