import React from 'react'
import { useReadContract } from 'wagmi'

import { DEMO_MARKET_ABI } from './abi'

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n))
}

const ProbabilityBar: React.FC<{ marketAddress: `0x${string}` }> = ({
  marketAddress,
}) => {
  const { data: pYes1e6 } = useReadContract({
    address: marketAddress,
    abi: DEMO_MARKET_ABI,
    functionName: 'pYes1e6',
    query: { refetchInterval: 1500 },
  })

  const p = typeof pYes1e6 === 'bigint' ? Number(pYes1e6) / 1_000_000 : 0.5
  const pct = clamp(Math.round(p * 100), 0, 100)

  return (
    <div className='mt-2'>
      <div className='flex items-center justify-between text-sm font-bold'>
        <div className='text-green-700'>YES {pct}%</div>
        <div className='text-red-700'>NO {100 - pct}%</div>
      </div>

      <div className='mt-2 h-3 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-200'>
        <div className='h-full bg-green-500' style={{ width: `${pct}%` }} />
      </div>

      <div className='mt-2 text-xs text-stripe-500'>
        解释：p(YES)=YES 资金占比。买入会即时推动该占比（Demo v0）。
      </div>
    </div>
  )
}

export default ProbabilityBar
