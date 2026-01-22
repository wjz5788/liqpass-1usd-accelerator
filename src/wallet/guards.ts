import { useWalletStore } from '../store/walletStore'

export function assertBaseConnected() {
  const s = useWalletStore.getState()
  if (!s.isConnected || !s.address) throw new Error('WALLET_NOT_CONNECTED')
  if (s.chainId !== 8453) throw new Error('WRONG_NETWORK')
  return { address: s.address, chainId: s.chainId }
}
