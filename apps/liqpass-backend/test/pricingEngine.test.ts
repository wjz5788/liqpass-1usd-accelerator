import assert from 'node:assert/strict'
import test from 'node:test'

import { payoutRatio, priceQuote } from '../src/services/pricingEngine.js'

test('ratio checkpoints', () => {
  assert.ok(Math.abs(payoutRatio(40) - 0.2) < 1e-12)
  assert.ok(Math.abs(payoutRatio(50) - 0.25) < 1e-12)
  assert.ok(Math.abs(payoutRatio(100) - 0.5) < 1e-12)
})

test('pricing 50x principal=500', () => {
  const r = priceQuote({
    instId: 'BTC-USDT-SWAP',
    leverage: 50,
    principalUSDC: 500,
  })
  assert.ok(Math.abs(r.payoutUSDC - 125) < 1e-9)
})

test('pricing bounds', () => {
  assert.throws(() =>
    priceQuote({ instId: 'ETH-USDT-SWAP', leverage: 50, principalUSDC: 100 })
  )
  assert.throws(() =>
    priceQuote({ instId: 'BTC-USDT-SWAP', leverage: 30, principalUSDC: 100 })
  )
})
