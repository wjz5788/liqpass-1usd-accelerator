import React from 'react'
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { DEMO_MARKET_ABI } from './abi'

const ResolvePanel: React.FC<{ marketAddress: `0x${string}` }> = ({
  marketAddress,
}) => {
  const { data: resolved } = useReadContract({
    address: marketAddress,
    abi: DEMO_MARKET_ABI,
    functionName: 'resolved',
    query: { refetchInterval: 1500 },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: mining } = useWaitForTransactionReceipt({ hash })

  const busy = isPending || mining
  const isResolved = !!resolved

  const resolveYes = () =>
    writeContract({
      address: marketAddress,
      abi: DEMO_MARKET_ABI,
      functionName: 'resolve',
      args: [true],
    })

  const resolveNo = () =>
    writeContract({
      address: marketAddress,
      abi: DEMO_MARKET_ABI,
      functionName: 'resolve',
      args: [false],
    })

  const claim = () =>
    writeContract({
      address: marketAddress,
      abi: DEMO_MARKET_ABI,
      functionName: 'claim',
      args: [],
    })

  return (
    <div className='space-y-2'>
      <div className='text-xs font-bold text-stripe-600'>
        状态：{isResolved ? '已结算' : '未结算'}
      </div>

      {!isResolved ? (
        <div className='flex gap-2'>
          <button
            type='button'
            disabled={busy}
            onClick={resolveYes}
            className='flex-1 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-black disabled:opacity-50'
          >
            {busy ? '处理中…' : 'Resolve YES'}
          </button>
          <button
            type='button'
            disabled={busy}
            onClick={resolveNo}
            className='flex-1 px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-black disabled:opacity-50'
          >
            {busy ? '处理中…' : 'Resolve NO'}
          </button>
        </div>
      ) : (
        <button
          type='button'
          disabled={busy}
          onClick={claim}
          className='w-full px-3 py-2 rounded-xl bg-stripe-900 text-white text-sm font-black disabled:opacity-50'
        >
          {busy ? '处理中…' : 'Claim (测试领奖)'}
        </button>
      )}

      <div className='text-xs text-stripe-600'>
        Resolver 仅用于 Demo。后面你可以换多签/可审计证据验证模块。
      </div>
    </div>
  )
}

export default ResolvePanel
