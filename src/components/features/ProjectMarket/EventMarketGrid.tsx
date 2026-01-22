import React from 'react'
import type { EventMarket } from '../../../domain/market'
import EventMarketCard from './EventMarketCard'

export default function EventMarketGrid(props: {
  markets: EventMarket[]
  effectiveB: number
}) {
  const { markets, effectiveB } = props
  return (
    <section className='card p-4'>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='font-bold text-sm text-stripe-900'>Event Markets</h3>
        <span className='text-xs text-stripe-500'>YES/NO · LMSR preview</span>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        {markets.map(m => (
          <EventMarketCard key={m.key} market={m} effectiveB={effectiveB} />
        ))}
      </div>
    </section>
  )
}
