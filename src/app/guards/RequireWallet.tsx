import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useWalletStore } from '../../store/walletStore'

type RequireWalletProps = {
  redirectTo?: string
  children: React.ReactNode
}

export default function RequireWallet(props: RequireWalletProps) {
  const location = useLocation()

  const walletState = useWalletStore(s => s)

  const allow =
    !!walletState.address && walletState.isConnected && walletState.chainId === 8453

  if (allow) return <>{props.children}</>

  const redirectTo = props.redirectTo ?? '/login'
  return <Navigate to={redirectTo} replace state={{ from: location }} />
}
