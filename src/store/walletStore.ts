import { create } from 'zustand'

type WalletState = {
  address?: `0x${string}`
  chainId?: number
  isConnected: boolean
  setWallet: (p: {
    address?: `0x${string}`
    chainId?: number
    isConnected: boolean
  }) => void
  reset: () => void
}

export const useWalletStore = create<WalletState>(set => ({
  address: undefined,
  chainId: undefined,
  isConnected: false,
  setWallet: p => set(p),
  reset: () => set({ address: undefined, chainId: undefined, isConnected: false }),
}))
