import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { useWalletStore } from '../../../store/walletStore'

import ProbabilityBar from '../../../components/features/MarketDemo/ProbabilityBar'
import BuyYesNoPanel from '../../../components/features/MarketDemo/BuyYesNoPanel'
import ResolvePanel from '../../../components/features/MarketDemo/ResolvePanel'

const MarketDemoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const address = useWalletStore(s => s.address)

  const marketAddress = useMemo(() => {
    // Demo: use env-configured market address
    return (
      (import.meta.env.VITE_DEMO_MARKET_ADDRESS as `0x${string}`) ||
      '0x0000000000000000000000000000000000000000'
    )
  }, [id])

  const resolverAddress =
    (import.meta.env.VITE_DEMO_RESOLVER as `0x${string}`) ||
    '0x0000000000000000000000000000000000000000'

  const isResolver =
    !!address &&
    !!resolverAddress &&
    address.toLowerCase() === resolverAddress.toLowerCase()

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900'>
      <div className='bg-white border-b border-gray-200 sticky top-0 z-40'>
        <div className='max-w-5xl mx-auto px-4 py-3 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='flex items-center gap-2 text-sm font-bold text-stripe-600 hover:text-stripe-900'
          >
            <ArrowLeft className='w-4 h-4' />
            返回
          </button>

          <div className='text-sm font-black'>
            Market Demo <span className='text-stripe-500'>#{id}</span>
          </div>

          <div className='text-xs font-bold px-2 py-1 rounded-full border bg-gray-50 text-gray-700'>
            Base Mainnet
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <div className='lg:col-span-2'>
          <div className='card p-5'>
            <div className='text-lg font-black mb-2'>概率</div>
            <ProbabilityBar marketAddress={marketAddress} />
            <div className='mt-4 text-sm text-stripe-600'>
              这个 Demo 是「买入推动概率，占比即市场共识」。结算后赢家按比例分 pot。
            </div>
          </div>

          <div className='card p-5 mt-4'>
            <div className='text-lg font-black mb-3'>下单</div>
            <BuyYesNoPanel marketAddress={marketAddress} />
          </div>

          {isResolver && (
            <div className='card p-5 mt-4 border border-yellow-200 bg-yellow-50'>
              <div className='text-lg font-black mb-3'>Resolver 控制台</div>
              <ResolvePanel marketAddress={marketAddress} />
            </div>
          )}
        </div>

        <div className='lg:col-span-1'>
          <div className='card p-5'>
            <div className='text-sm font-black mb-2'>Demo 提示</div>
            <ul className='text-sm text-stripe-700 space-y-2'>
              <li>• 先小额：1/5/10 USDC</li>
              <li>• 结算：Resolver 手动点 Resolve</li>
              <li>• 领奖：Resolve 后点 Claim</li>
            </ul>
          </div>

          <div className='card p-5 mt-4'>
            <div className='text-sm font-black mb-2'>环境变量</div>
            <div className='text-xs text-stripe-600 space-y-1'>
              <div>VITE_DEMO_MARKET_ADDRESS</div>
              <div>VITE_DEMO_RESOLVER</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketDemoPage
