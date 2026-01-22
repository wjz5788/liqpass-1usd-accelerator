import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useUserStore } from '../../store/userStore'
import { useWalletStore } from '../../store/walletStore'
import { isAdmin, isLoggedIn } from './roles'

type RequireRoleProps = {
  role: 'user' | 'admin'
  redirectTo?: string
  children: React.ReactNode
}

export default function RequireRole(props: RequireRoleProps) {
  const location = useLocation()

  const userState = useUserStore(s => s)
  const walletState = useWalletStore(s => s)

  const allow =
    props.role === 'admin' ? isAdmin(userState) : isLoggedIn(walletState)

  if (allow) return <>{props.children}</>

  const fallbackRedirect = props.role === 'admin' ? '/403' : '/login'
  const redirectTo = props.redirectTo ?? fallbackRedirect

  return <Navigate to={redirectTo} replace state={{ from: location }} />
}
