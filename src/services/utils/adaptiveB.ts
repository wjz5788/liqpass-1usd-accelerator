import type { Phase } from '../../domain/market'

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))

/**
 * Heuristic adaptive-b:
 * - P1 lower b => more sensitive (cold start)
 * - P3 higher b => more stable (mature)
 * - more volume/participants => higher b
 * - huge volatility => higher b (harder to move)
 */
export function calcEffectiveB(params: {
  baseB: number
  phase: Phase
  volume24h: number
  traders24h: number
  absChange: number
}) {
  const base = Math.max(1, params.baseB)
  const phaseMul = params.phase === 'P1' ? 0.75 : params.phase === 'P2' ? 1.0 : 1.25

  const volN = clamp(Math.log10(1 + Math.max(0, params.volume24h)) / 6, 0, 1)
  const tradersN = clamp(Math.log10(1 + Math.max(0, params.traders24h)) / 3, 0, 1)
  const spike = clamp(params.absChange / 30, 0, 1)

  // lift b as market gets deeper, and also when volatility is extreme
  const depthLift = 1 + 0.5 * volN + 0.35 * tradersN
  const spikeLift = 1 + 0.6 * spike

  const effective = base * phaseMul * depthLift * spikeLift
  return Math.round(effective * 100) / 100
}
