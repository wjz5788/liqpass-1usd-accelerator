import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { WalletButton } from '../../wallet/WalletButton'
import { useWalletStore } from '../../store/walletStore'

type LocationState = {
  from?: { pathname?: string }
}

export default function LoginRequiredPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const wallet = useWalletStore(s => s)

  const state = location.state as LocationState | null
  const hasFrom = !!state?.from?.pathname

  useEffect(() => {
    const isAuthed =
      wallet.isConnected && !!wallet.address && wallet.chainId === 8453
    if (!isAuthed) return

    const fromPath = state?.from?.pathname
    if (fromPath && fromPath !== '/login') {
      navigate(fromPath, { replace: true })
      return
    }

    navigate('/accelerator', { replace: true })
  }, [navigate, state?.from?.pathname, wallet.address, wallet.chainId, wallet.isConnected])

  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='card p-8'>
          <h1 className='text-2xl font-bold text-gray-900'>
            需要登录/连接钱包才能访问
          </h1>
          <p className='text-gray-600 mt-3'>
            你正在访问的页面需要登录或连接钱包。完成登录/连接后可继续。
          </p>

          <div className='mt-6 flex items-center gap-3'>
            <WalletButton />
            {wallet.isConnected && wallet.chainId !== 8453 && (
              <span className='text-sm text-amber-600'>当前网络不正确，请切换到 Base</span>
            )}
          </div>

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => navigate('/accelerator')}
              className='btn btn-primary'
            >
              返回 Accelerator
            </button>
            <button
              type='button'
              onClick={() =>
                hasFrom ? navigate(-1) : navigate('/accelerator')
              }
              className='btn btn-secondary'
            >
              返回上一页
            </button>
          </div>

          {hasFrom && (
            <div className='mt-6 text-xs text-gray-500'>
              from: {state?.from?.pathname}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
