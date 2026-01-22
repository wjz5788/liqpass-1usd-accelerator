import React from 'react'
import { SlidersHorizontal, Sparkles } from 'lucide-react'
import type { Phase } from '../../../domain/market'

export interface MarketParamsPanelProps {
  baseB: number
  setBaseB: (v: number) => void
  autoB: boolean
  setAutoB: (v: boolean) => void
  phase: Phase
  setPhase: (p: Phase) => void
  effectiveB: number
}

const MarketParamsPanel: React.FC<MarketParamsPanelProps> = ({
  baseB,
  setBaseB,
  autoB,
  setAutoB,
  phase,
  setPhase,
  effectiveB,
}) => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <div className='px-4 py-3 border-b border-gray-100 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <SlidersHorizontal className='w-4 h-4 text-stripe-500' />
          <span className='text-sm font-bold text-stripe-900'>Market Params</span>
        </div>
        <div className='text-xs text-stripe-500'>effective b: <span className='text-stripe-900 font-mono'>{effectiveB.toFixed(2)}</span></div>
      </div>

      <div className='p-4 space-y-4'>
        {/* phase */}
        <div className='flex items-center justify-between'>
          <span className='text-xs text-stripe-500'>Phase</span>
          <div className='flex items-center gap-2'>
            {(['P1','P2','P3'] as Phase[]).map(p => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${phase === p ? 'bg-accent-100 border-accent-300 text-accent-700' : 'bg-gray-50 border-gray-200 text-stripe-500 hover:text-stripe-700'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* base b */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-stripe-500'>Base b</span>
            <span className='text-xs font-mono text-stripe-700'>{baseB.toFixed(0)}</span>
          </div>
          <input
            type='range'
            min={5}
            max={300}
            value={baseB}
            onChange={e => setBaseB(Number(e.target.value))}
            className='w-full'
          />
          <p className='text-[11px] text-stripe-400 leading-relaxed'>b 越小越灵敏，越大越稳。P1 默认更敏感，P3 默认更稳。</p>
        </div>

        {/* auto b */}
        <button
          onClick={() => setAutoB(!autoB)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${autoB ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-stripe-500 hover:text-stripe-700'}`}
        >
          <div className='flex items-center gap-2 text-xs font-bold'>
            <Sparkles className='w-4 h-4' />
            Auto-b
          </div>
          <span className='text-xs font-mono'>{autoB ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  )
}

export default MarketParamsPanel
