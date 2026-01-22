import React, { useMemo } from 'react'
import { EventItem } from '../../../services/mock/projectData'
import { calcEffectiveB } from '../../../services/utils/adaptiveB'

// Mock functions to replace missing exports
const lmsrMaxLossPerMarket = (baseB: number) => baseB * Math.log(2)
const adaptiveBFromEvent = (baseB: number, event: any) => {
  return calcEffectiveB({
    baseB,
    phase: 'P2',
    volume24h: parseFloat(event.volume24h.replace(/[^0-9.]/g, '')) || 0,
    traders24h: Math.max(15, Math.round((parseFloat(event.volume24h.replace(/[^0-9.]/g, '')) || 0) / 1200)),
    absChange: Math.abs(event.change24h || 0)
  })
}

interface MarketParamsPanelProps {
  baseB: number
  setBaseB: (b: number) => void
  autoB: boolean
  setAutoB: (auto: boolean) => void
  events: EventItem[]
}

export function MarketParamsPanel({
  baseB,
  setBaseB,
  autoB,
  setAutoB,
  events,
}: MarketParamsPanelProps) {
  const budgetEst = useMemo(() => {
    const maxLossPer = lmsrMaxLossPerMarket(baseB)
    const effectiveBs = events.map(e => adaptiveBFromEvent(baseB, e))
    const avgEffectiveB =
      effectiveBs.reduce((a, b) => a + b, 0) / Math.max(1, effectiveBs.length)
    const totalBudget = avgEffectiveB * Math.log(2) * events.length
    return {
      perMarket: maxLossPer,
      total: totalBudget,
      avgEffectiveB,
    }
  }, [baseB, events])

  return (
    <div className='bg-[#12141a] border border-white/10 rounded-xl p-4'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-white font-semibold text-sm flex items-center space-x-2'>
          <span>Market Params (b)</span>
        </h3>
        <div className='flex items-center space-x-2'>
          <button
            onClick={() => setAutoB(!autoB)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoB ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoB ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className='text-xs text-gray-400'>Auto</span>
        </div>
      </div>

      <div className='space-y-4'>
        <div>
          <div className='flex justify-between items-center mb-2'>
            <label className='text-xs text-gray-400'>Base b</label>
            <span className='text-xs font-mono text-white'>{baseB}</span>
          </div>
          <input
            type='range'
            min={10}
            max={200}
            step={5}
            value={baseB}
            onChange={e => setBaseB(Number(e.target.value))}
            disabled={autoB}
            className={`w-full ${autoB ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>

        <div className='grid grid-cols-2 gap-4 text-[11px]'>
          <div className='bg-white/5 rounded-lg p-3'>
            <div className='text-gray-500 mb-1'>Avg Effective b</div>
            <div className='text-white font-semibold text-sm'>
              {budgetEst.avgEffectiveB.toFixed(1)}
            </div>
          </div>
          <div className='bg-white/5 rounded-lg p-3'>
            <div className='text-gray-500 mb-1'>Per-Market Max Loss</div>
            <div className='text-white font-semibold text-sm'>
              ${budgetEst.perMarket.toFixed(2)}
            </div>
          </div>
        </div>

        <div className='bg-orange-500/10 border border-orange-500/20 rounded-lg p-3'>
          <div className='text-gray-400 text-[11px] mb-1'>
            Estimated Total Budget
          </div>
          <div className='text-orange-400 font-semibold text-sm'>
            ${budgetEst.total.toFixed(2)}
          </div>
          <div className='text-gray-500 text-[10px] mt-1'>
            Upper bound for {events.length} markets
          </div>
        </div>
      </div>
    </div>
  )
}
