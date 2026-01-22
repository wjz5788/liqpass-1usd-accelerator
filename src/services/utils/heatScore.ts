import { MemeToken } from '../../domain/meme'

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))

/**
 * Heat is a heuristic signal for discovery.
 * Keep it simple and monotonic: more engagement + more capital + healthier progress + non-crazy volatility.
 */
export function calcHeat(token: MemeToken) {
  // ... create defensible defaults
  const vol = Math.max(0, token.raisedUsd ?? token.marketCapValue ?? 0)
  const participants = Math.max(0, token.participants ?? 0)
  const replies = Math.max(0, token.replies ?? 0)
  const progress = clamp((token.progress ?? 0) / 100, 0, 1)
  const change = Math.abs(token.change ?? 0)

  // normalize
  const volN = Math.log10(1 + vol) / 6 // 1e6 => ~1
  const pN = Math.log10(1 + participants) / 4
  const rN = Math.log10(1 + replies) / 3

  const evidence = progress
  const attention = clamp(0.55 * volN + 0.25 * pN + 0.2 * rN, 0, 1)

  // volatility penalty: too spiky => reduce
  const spikePenalty = clamp(change / 30, 0, 1) // 30%+ change => heavy penalty

  const score01 = clamp(0.55 * attention + 0.35 * evidence - 0.25 * spikePenalty, 0, 1)
  const score = Math.round(score01 * 1000) / 10 // 0..100 with 0.1 granularity

  // very rough delta proxy
  const delta24h = Math.round(((token.change ?? 0) / 100) * 1000) / 10

  return { score, delta24h }
}

export function inferPhase(token: MemeToken): 'P1' | 'P2' | 'P3' {
  const prog = token.progress ?? 0
  if (prog < 35) return 'P1'
  if (prog < 80) return 'P2'
  return 'P3'
}
