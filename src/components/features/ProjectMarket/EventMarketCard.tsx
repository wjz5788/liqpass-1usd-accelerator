import React, { useMemo, useState } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { EventMarket } from '../../../domain/market'
import { lmsrBinaryQuote } from '../../../domain/lmsr'

const pct = (p: number) => `${(p * 100).toFixed(1)}%`

export default function EventMarketCard(props: {
  market: EventMarket
  effectiveB: number
}) {
  const { market, effectiveB } = props
  const [delta, setDelta] = useState<number>(0)

  const quote = useMemo(() => {
    return lmsrBinaryQuote({
      pYes: market.pYes,
      b: effectiveB,
      deltaYes: delta,
    })
  }, [market.pYes, effectiveB, delta])

  const up = market.pYes >= 0.5

  return (
    <div className='group bg-gray-50 rounded-xl border border-gray-100 p-4 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-bold text-stripe-900 truncate group-hover:text-accent-600 transition-colors'>
              {market.title}
            </span>
            <span className='text-[10px] font-mono text-stripe-500 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-stripe-sm'>
              {market.key}
            </span>
          </div>
          <p className='text-xs text-stripe-500 mt-1 line-clamp-2'>
            {market.desc}
          </p>
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-bold ${up ? 'text-green-600' : 'text-red-600'}`}
        >
          {up ? (
            <ArrowUpRight className='w-4 h-4' />
          ) : (
            <ArrowDownRight className='w-4 h-4' />
          )}
          <span className='font-mono'>{pct(market.pYes)}</span>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-3 gap-2 text-[11px]'>
        <div className='bg-white rounded-lg p-2 border border-gray-100'>
          <div className='text-[10px] text-stripe-400 uppercase tracking-wider font-semibold'>
            Cost
          </div>
          <div className='font-mono text-stripe-700 mt-0.5'>
            {quote.cost.toFixed(4)}
          </div>
        </div>
        <div className='bg-white rounded-lg p-2 border border-gray-100'>
          <div className='text-[10px] text-stripe-400 uppercase tracking-wider font-semibold'>
            Avg
          </div>
          <div className='font-mono text-stripe-700 mt-0.5'>
            {quote.avgPrice.toFixed(4)}
          </div>
        </div>
        <div className='bg-white rounded-lg p-2 border border-gray-100'>
          <div className='text-[10px] text-stripe-400 uppercase tracking-wider font-semibold'>
            New p
          </div>
          <div className='font-mono text-stripe-700 mt-0.5'>
            {pct(quote.pYesAfter)}
          </div>
        </div>
      </div>

      <div className='mt-4 space-y-2'>
        <div className='flex items-center justify-between text-xs'>
          <span className='text-stripe-500'>Buy YES Δ</span>
          <div className='flex items-center gap-2'>
            <span className='text-stripe-400'>b</span>
            <span className='font-mono text-stripe-700'>
              {effectiveB.toFixed(2)}
            </span>
            <span className='text-stripe-400'>•</span>
            <span className='font-mono text-stripe-700'>
              {delta.toFixed(0)}
            </span>
          </div>
        </div>

        <input
          type='range'
          min={0}
          max={200}
          value={delta}
          onChange={e => setDelta(Number(e.target.value))}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent-600'
        />

        <div className='flex items-center justify-between text-[11px] text-stripe-400'>
          <span>volume24h {market.stats.volume24h.toFixed(0)}</span>
          <span>
            traders {market.stats.traders24h} · trades {market.stats.trades24h}
          </span>
        </div>
      </div>
    </div>
  )
}
