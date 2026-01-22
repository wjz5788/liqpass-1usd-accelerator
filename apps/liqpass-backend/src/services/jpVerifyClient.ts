import { env } from '../env.js'

type VerifyArgs = {
  ordId: string
  instId: string
}

export type VerifyResult = {
  evidence_json: unknown
  evidence_root: string | null
  liquidation_time_ms: number | null
}

export class JpVerifyError extends Error {
  readonly code: 'JP_VERIFY_TIMEOUT' | 'JP_VERIFY_ERROR'

  constructor(code: 'JP_VERIFY_TIMEOUT' | 'JP_VERIFY_ERROR', message: string) {
    super(message)
    this.code = code
  }
}

function pickLiquidationTimeMs(evidence: unknown): number | null {
  const record = isRecord(evidence) ? evidence : null
  const meta = record && isRecord(record.meta) ? record.meta : null
  const candidates = [meta?.fillTime, meta?.cTime, record?.fillTime, record?.cTime]
  for (const c of candidates) {
    const n = typeof c === 'string' ? Number(c) : typeof c === 'number' ? c : NaN
    if (Number.isFinite(n) && n > 0) return Math.trunc(n)
  }
  return null
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

export async function verify(args: VerifyArgs): Promise<VerifyResult> {
  const url = new URL('/verify', env.JP_VERIFY_BASE_URL)
  const timeoutMs = 8000
  const maxRetries = 2

  let lastErr: unknown = undefined
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ ordId: args.ordId, instId: args.instId })
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new JpVerifyError('JP_VERIFY_ERROR', `jp-verify error: ${res.status} ${text}`)
      }

      const evidenceJson: unknown = await res.json()
      const evidenceCandidate = isRecord(evidenceJson) ? evidenceJson.evidence : undefined
      const evidence = evidenceCandidate !== undefined ? evidenceCandidate : evidenceJson
      const evidenceRec = isRecord(evidence) ? evidence : null
      const evidenceRoot = typeof evidenceRec?.root === 'string' ? evidenceRec.root : null
      const liquidationTimeMs = pickLiquidationTimeMs(evidence)

      return {
        evidence_json: evidenceJson,
        evidence_root: evidenceRoot,
        liquidation_time_ms: liquidationTimeMs
      }
    } catch (e) {
      lastErr = e
      const isAbort = e instanceof Error && e.name === 'AbortError'
      const isTimeout = isAbort || (e instanceof JpVerifyError && e.code === 'JP_VERIFY_TIMEOUT')

      if (attempt >= maxRetries) {
        if (isAbort) {
          throw new JpVerifyError('JP_VERIFY_TIMEOUT', `jp-verify timeout after ${timeoutMs}ms`)
        }
        throw e instanceof Error ? e : new JpVerifyError('JP_VERIFY_ERROR', 'jp-verify unknown error')
      }

      if (isTimeout) {
        // small backoff for retries
        await new Promise(resolve => setTimeout(resolve, 150 * (attempt + 1)))
        continue
      }

      // Non-timeout error: do not retry aggressively.
      throw e
    } finally {
      clearTimeout(id)
    }
  }

  throw lastErr instanceof Error ? lastErr : new JpVerifyError('JP_VERIFY_ERROR', 'jp-verify unknown error')
}
