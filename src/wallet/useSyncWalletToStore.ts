import { useEffect } from 'react'

import { useAccount, useChainId } from 'wagmi'

import { useWalletStore } from '../store/walletStore'

export function useSyncWalletToStore() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const setWallet = useWalletStore(s => s.setWallet)

  useEffect(() => {
    setWallet({ address, chainId, isConnected })
  }, [address, chainId, isConnected, setWallet])
}
