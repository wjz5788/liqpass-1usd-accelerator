import React from 'react'

import { ConnectButton } from '@rainbow-me/rainbowkit'

function shortAddr(a?: string) {
  if (!a) return ''
  return a.slice(0, 6) + '...' + a.slice(-4)
}

type WalletButtonProps = {
  connectClassName?: string
  wrongNetworkClassName?: string
  chainClassName?: string
  accountClassName?: string
}

export function WalletButton(props: WalletButtonProps) {
  const connectClassName = props.connectClassName ?? 'btn btn-primary'
  const wrongNetworkClassName =
    props.wrongNetworkClassName ?? 'btn btn-outline'
  const chainClassName = props.chainClassName ?? 'btn btn-secondary'
  const accountClassName = props.accountClassName ?? 'btn btn-secondary'

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        if (!connected) {
          return (
            <button type='button' onClick={openConnectModal} className={connectClassName}>
              连接钱包
            </button>
          )
        }

        const isWrongNetwork = chain.id !== 8453
        if (isWrongNetwork) {
          return (
            <button type='button' onClick={openChainModal} className={wrongNetworkClassName}>
              切换到 Base
            </button>
          )
        }

        return (
          <div className='flex items-center gap-2'>
            <button type='button' onClick={openChainModal} className={chainClassName}>
              {chain.name}
            </button>
            <button type='button' onClick={openAccountModal} className={accountClassName}>
              {shortAddr(account.address)}
            </button>
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
