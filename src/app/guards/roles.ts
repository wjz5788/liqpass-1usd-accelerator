import { useUserStore } from '../../store/userStore'
import { useWalletStore } from '../../store/walletStore'

type UserState = ReturnType<typeof useUserStore.getState>
type WalletState = ReturnType<typeof useWalletStore.getState>

type UnknownUser = Record<string, unknown>

export function isLoggedIn(wallet: WalletState): boolean {
  return !!wallet.address && wallet.isConnected && wallet.chainId === 8453
}

export function isAdmin(state: UserState): boolean {
  if (!state.user) return false

  const user = state.user as unknown as UnknownUser

  if (user.isAdmin === true) return true
  if (user.role === 'admin') return true

  return false
}
