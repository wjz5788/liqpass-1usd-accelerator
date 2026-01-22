export const ALLOWED_INST_IDS = new Set(['BTC-USDT-SWAP', 'BTC-USDC-SWAP'])

export const ALLOWED_LEVERAGES = new Set([40, 50, 60, 70, 80, 90, 100])

// 24h liquidation probability (BTC-only)
export const P_LIQ_24H: Record<number, number> = {
  40: 0.02,
  50: 0.025,
  60: 0.032,
  70: 0.04,
  80: 0.05,
  90: 0.062,
  100: 0.075,
}

// Risk + ops params
export const LOAD = 0.35
export const OPS_FEE_USDC = 0.5

// Hard caps
export const PRINCIPAL_MAX = 1000
export const PAYOUT_MAX = 500
export const PREMIUM_MIN = 0.5

export function payoutRatio(leverage: number): number {
  return Math.min(0.5, 0.25 + (leverage - 50) * 0.005)
}

function round6(n: number): number {
  return Number(n.toFixed(6))
}

export function priceQuote(params: {
  instId: string
  leverage: number
  principalUSDC: number
}): {
  instId: string
  leverage: number
  principalUSDC: number
  payoutUSDC: number
  premiumUSDC: number
  p_liq_24h: number
  ratio: number
} {
  const { instId, leverage, principalUSDC } = params

  if (!ALLOWED_INST_IDS.has(instId)) throw new Error('INST_NOT_ALLOWED')
  if (!ALLOWED_LEVERAGES.has(leverage)) throw new Error('LEV_NOT_ALLOWED')
  if (!(principalUSDC > 0) || principalUSDC > PRINCIPAL_MAX)
    throw new Error('PRINCIPAL_OUT_OF_RANGE')

  const ratio = payoutRatio(leverage)
  let payout = principalUSDC * ratio
  payout = Math.min(payout, PAYOUT_MAX)

  const p = P_LIQ_24H[leverage]
  if (typeof p !== 'number') throw new Error('LEV_NOT_ALLOWED')

  let premium = payout * p * (1 + LOAD) + OPS_FEE_USDC
  premium = Math.max(premium, PREMIUM_MIN)

  return {
    instId,
    leverage,
    principalUSDC,
    payoutUSDC: round6(payout),
    premiumUSDC: round6(premium),
    p_liq_24h: p,
    ratio,
  }
}
