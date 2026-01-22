import { useUIStore } from '../store/uiStore'

export function useUI() {
  const {
    theme,
    modal,
    notifications,
    isLoading,
    loadingText,
    sidebarOpen,
    headerFixed,
    activePreviewVideoId,
    setTheme,
    toggleTheme,
    openModal,
    closeModal,
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading,
    setSidebarOpen,
    toggleSidebar,
    setHeaderFixed,
    setActivePreviewVideoId,
  } = useUIStore()

  // 主题相关
  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
  }

  const handleToggleTheme = () => {
    toggleTheme()
  }

  // 模态框相关
  const handleOpenModal = (type: typeof modal.type, data?: any) => {
    openModal(type, data)
  }

  const handleCloseModal = () => {
    closeModal()
  }

  // 通知相关
  const showNotification = (
    notification: Parameters<typeof addNotification>[0]
  ) => {
    return addNotification(notification)
  }

  const showSuccessNotification = (message: string, duration?: number) => {
    return addNotification({
      type: 'success',
      message,
      duration,
    })
  }

  const showErrorNotification = (message: string, duration?: number) => {
    return addNotification({
      type: 'error',
      message,
      duration,
    })
  }

  const showWarningNotification = (message: string, duration?: number) => {
    return addNotification({
      type: 'warning',
      message,
      duration,
    })
  }

  const showInfoNotification = (message: string, duration?: number) => {
    return addNotification({
      type: 'info',
      message,
      duration,
    })
  }

  const hideNotification = (id: string) => {
    removeNotification(id)
  }

  const clearAllNotifications = () => {
    clearNotifications()
  }

  // 加载状态相关
  const handleSetLoading = (loading: boolean, text?: string) => {
    setLoading(loading, text)
  }

  // 侧边栏相关
  const handleSetSidebarOpen = (open: boolean) => {
    setSidebarOpen(open)
  }

  const handleToggleSidebar = () => {
    toggleSidebar()
  }

  // 头部固定相关
  const handleSetHeaderFixed = (fixed: boolean) => {
    setHeaderFixed(fixed)
  }

  return {
    // 状态
    theme,
    modal,
    notifications,
    isLoading,
    loadingText,
    sidebarOpen,
    headerFixed,
    activePreviewVideoId,

    // 主题方法
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,

    // 模态框方法
    openModal: handleOpenModal,
    closeModal: handleCloseModal,

    // 通知方法
    showNotification,
    showSuccessNotification,
    showErrorNotification,
    showWarningNotification,
    showInfoNotification,
    hideNotification,
    clearAllNotifications,

    // 加载状态方法
    setLoading: handleSetLoading,

    // 侧边栏方法
    setSidebarOpen: handleSetSidebarOpen,
    toggleSidebar: handleToggleSidebar,

    // 头部固定方法
    setHeaderFixed: handleSetHeaderFixed,

    setActivePreviewVideoId,
  }
}
