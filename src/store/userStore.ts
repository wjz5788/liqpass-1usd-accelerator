import { create } from 'zustand'

interface User {
  id: string
  address: string
  avatar: string
  username: string
  email?: string
}

interface Wallet {
  address: string
  balance: number
  chainId: number
  connected: boolean
}

interface UserStore {
  user: User | null
  wallet: Wallet | null
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setWallet: (wallet: Wallet | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  updateUserProfile: (data: Partial<User>) => Promise<User>
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  wallet: null,
  isLoading: false,
  error: null,

  setUser: user => set({ user }),

  setWallet: wallet => set({ wallet }),

  setLoading: loading => set({ isLoading: loading }),

  setError: error => set({ error }),

  connectWallet: async () => {
    set({ isLoading: true, error: null })
    try {
      // 这里可以替换为实际的钱包连接逻辑，如MetaMask、WalletConnect等
      // 模拟钱包连接
      const mockWallet: Wallet = {
        address: '0x742d35Cc6634C0532925a3b814a175fc37d6Ce14',
        balance: 10.5,
        chainId: 1,
        connected: true,
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      set({ wallet: mockWallet, isLoading: false })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to connect wallet',
        isLoading: false,
      })
      throw error
    }
  },

  disconnectWallet: () => {
    set({ wallet: null })
  },

  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null })
    try {
      // 这里可以替换为实际的登录逻辑
      // 模拟登录
      const mockUser: User = {
        id: '1',
        address: '0x742d35Cc6634C0532925a3b814a175fc37d6Ce14',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
        username: 'user123',
        email: email,
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      set({ user: mockUser, isLoading: false })
      return mockUser
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false,
      })
      throw error
    }
  },

  logout: () => {
    set({ user: null, wallet: null })
  },

  updateUserProfile: async (data: Partial<User>) => {
    set({ isLoading: true, error: null })
    try {
      // 这里可以替换为实际的更新用户信息逻辑
      // 模拟更新用户信息
      const currentUser = useUserStore.getState().user
      if (!currentUser) {
        throw new Error('User not logged in')
      }

      const updatedUser: User = {
        ...currentUser,
        ...data,
      }

      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000))

      set({ user: updatedUser, isLoading: false })
      return updatedUser
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to update profile',
        isLoading: false,
      })
      throw error
    }
  },
}))
