import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../env.js'
import { getPurchaseOrderById } from '../db/purchaseOrdersRepo.js'
import {
  markClaimFailed,
  upsertPlaceholderClaim
} from '../db/claimsRepo.js'
import { JpVerifyError, verify } from '../services/jpVerifyClient.js'
import { minNumericString, toNumericString } from '../utils/money.js'
import { pool } from '../db/pool.js'
import { ClaimStatus } from '../domain/claimStatus.js'

type OnchainTriggerBody = {
  purchaseOrderId: string
  claimant: string
  submitTxHash?: string
  triggeredAtSec?: number
}

function requireHeader(req: FastifyRequest, name: string): string {
  const v = req.headers[name.toLowerCase()]
  if (typeof v === 'string' && v.length > 0) return v
  return ''
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function parseBody(body: any): OnchainTriggerBody {
  if (!body || typeof body !== 'object') throw new Error('Invalid JSON body')
  if (!isNonEmptyString(body.purchaseOrderId)) throw new Error('purchaseOrderId is required')
  if (!isNonEmptyString(body.claimant)) throw new Error('claimant is required')

  const triggeredAtSec = body.triggeredAtSec
  if (triggeredAtSec !== undefined) {
    const n = typeof triggeredAtSec === 'string' ? Number(triggeredAtSec) : triggeredAtSec
    if (!Number.isFinite(n)) throw new Error('triggeredAtSec must be a number')
  }

  return {
    purchaseOrderId: body.purchaseOrderId,
    claimant: body.claimant,
    submitTxHash: isNonEmptyString(body.submitTxHash) ? body.submitTxHash : undefined,
    triggeredAtSec:
      body.triggeredAtSec === undefined
        ? undefined
        : Math.trunc(typeof body.triggeredAtSec === 'string' ? Number(body.triggeredAtSec) : body.triggeredAtSec)
  }
}

function extractOkxMeta(okxMetaJson: unknown): { ordId: string; instId: string } | null {
  if (!isRecord(okxMetaJson)) return null
  const ordId = okxMetaJson.ordId
  const instId = okxMetaJson.instId
  if (typeof ordId !== 'string' || ordId.length === 0) return null
  if (typeof instId !== 'string' || instId.length === 0) return null
  return { ordId, instId }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function getPolicyParams(policyParamsJson: unknown): { payoutFixedUsdc: string; payoutCapUsdc: string } {
  if (!isRecord(policyParamsJson)) return { payoutFixedUsdc: '0', payoutCapUsdc: '0' }
  return {
    payoutFixedUsdc: toNumericString(policyParamsJson.payout_fixed_usdc, '0'),
    payoutCapUsdc: toNumericString(policyParamsJson.payout_cap_usdc, '0')
  }
}

export async function registerInternalClaimsRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/internal/claims/onchain-trigger',
    async (req: FastifyRequest<{ Body: OnchainTriggerBody }>, reply: FastifyReply) => {
      const key = requireHeader(req, 'x-internal-key')
      if (key !== env.INTERNAL_API_KEY) return reply.code(401).send({ error: 'UNAUTHORIZED' })

      let body: OnchainTriggerBody
      try {
        body = parseBody(req.body)
      } catch (e) {
        return reply.code(400).send({ error: (e as Error).message })
      }

      const po = await getPurchaseOrderById(body.purchaseOrderId)
      if (!po) return reply.code(404).send({ error: 'PURCHASE_ORDER_NOT_FOUND' })
      if (!po.paid_at) return reply.code(409).send({ error: 'PURCHASE_ORDER_NOT_PAID' })
      if (!po.coverage_start_at || !po.coverage_end_at) {
        return reply.code(409).send({ error: 'MISSING_COVERAGE_WINDOW' })
      }

      const okx = extractOkxMeta(po.okx_meta_json)
      if (!okx) {
        const okxEventId = 'ordId:missing'
        await upsertPlaceholderClaim({
          purchaseOrderId: body.purchaseOrderId,
          claimant: body.claimant,
          submitTxHash: body.submitTxHash,
          triggeredAtSec: body.triggeredAtSec,
          okxEventId
        })
        await markClaimFailed({
          purchaseOrderId: body.purchaseOrderId,
          okxEventId,
          rejectedReason: 'MISSING_OKX_META'
        })
        return reply.code(200).send({ ok: true, status: ClaimStatus.FAILED, rejectedReason: 'MISSING_OKX_META' })
      }

      const okxEventId = `ordId:${okx.ordId}`

      // Force DB transaction wrap for the whole pipeline.
      // Any exception: rollback; then explicitly mark FAILED (or return a clear state).
      const client = await pool.connect()
      try {
        await client.query('BEGIN')

        const upsertRes = await client.query<{ id: string }>(
          `
            INSERT INTO insurance_claims (
              purchase_order_id,
              claimant,
              submit_tx_hash,
              triggered_at_sec,
              okx_event_id,
              status,
              created_at,
              updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, now(), now())
            ON CONFLICT (purchase_order_id, okx_event_id)
            DO UPDATE SET updated_at = now()
            RETURNING id
          `,
          [
            body.purchaseOrderId,
            body.claimant,
            body.submitTxHash ?? null,
            body.triggeredAtSec ?? null,
            okxEventId,
            ClaimStatus.VERIFYING
          ]
        )
        const claimId = upsertRes.rows[0].id

        const verifyResult = await verify({ ordId: okx.ordId, instId: okx.instId })

        const liquidationTimeMs = verifyResult.liquidation_time_ms
        if (!liquidationTimeMs) {
          await client.query(
            `
              UPDATE insurance_claims
              SET status = $3, rejected_reason = $4, updated_at = now()
              WHERE purchase_order_id = $1 AND okx_event_id = $2
            `,
            [body.purchaseOrderId, okxEventId, ClaimStatus.FAILED, 'MISSING_LIQUIDATION_TIME']
          )
          await client.query('COMMIT')
          return reply
            .code(200)
            .send({ ok: true, claimId, status: ClaimStatus.FAILED, rejectedReason: 'MISSING_LIQUIDATION_TIME' })
        }

        const liquidationTime = new Date(liquidationTimeMs)
        const windowStart = po.coverage_start_at
        const windowEnd = po.coverage_end_at

        // OUT_OF_COVERAGE_WINDOW is a normal rejection (not an error).
        // Evidence must still be stored.
        if (liquidationTime < windowStart || liquidationTime > windowEnd) {
          await client.query(
            `
              UPDATE insurance_claims
              SET
                status = $3,
                rejected_reason = $4,
                evidence_root = $5,
                evidence_json = $6,
                liquidation_time_ms = $7,
                coverage_window_start = $8,
                coverage_window_end = $9,
                updated_at = now()
              WHERE purchase_order_id = $1 AND okx_event_id = $2
            `,
            [
              body.purchaseOrderId,
              okxEventId,
              ClaimStatus.REJECTED,
              'OUT_OF_COVERAGE_WINDOW',
              verifyResult.evidence_root,
              verifyResult.evidence_json,
              liquidationTimeMs,
              windowStart,
              windowEnd
            ]
          )
          await client.query('COMMIT')
          return reply
            .code(200)
            .send({ ok: true, claimId, status: ClaimStatus.REJECTED, rejectedReason: 'OUT_OF_COVERAGE_WINDOW' })
        }

        const { payoutFixedUsdc: payoutFixed, payoutCapUsdc: payoutCap } = getPolicyParams(po.policy_params_json)
        const payout = minNumericString(payoutFixed, payoutCap)

        await client.query(
          `
            UPDATE insurance_claims
            SET
              status = $3,
              evidence_root = $4,
              evidence_json = $5,
              liquidation_time_ms = $6,
              coverage_window_start = $7,
              coverage_window_end = $8,
              payout_amount_usdc = $9,
              payout_cap_usdc = $10,
              rejected_reason = NULL,
              updated_at = now()
            WHERE purchase_order_id = $1 AND okx_event_id = $2
          `,
          [
            body.purchaseOrderId,
            okxEventId,
            ClaimStatus.VERIFIED_PENDING_REVIEW,
            verifyResult.evidence_root,
            verifyResult.evidence_json,
            liquidationTimeMs,
            windowStart,
            windowEnd,
            payout,
            payoutCap
          ]
        )

        await client.query('COMMIT')
        return reply.code(200).send({ ok: true, claimId, status: ClaimStatus.VERIFIED_PENDING_REVIEW })
      } catch (e) {
        await client.query('ROLLBACK')

        // Ensure we never leave a claim stuck in VERIFYING.
        const reason =
          e instanceof JpVerifyError && e.code === 'JP_VERIFY_TIMEOUT'
            ? 'JP_VERIFY_TIMEOUT'
            : 'JP_VERIFY_ERROR'

        // Persist FAILED state outside the rolled-back transaction.
        await upsertPlaceholderClaim({
          purchaseOrderId: body.purchaseOrderId,
          claimant: body.claimant,
          submitTxHash: body.submitTxHash,
          triggeredAtSec: body.triggeredAtSec,
          okxEventId
        })
        await markClaimFailed({ purchaseOrderId: body.purchaseOrderId, okxEventId, rejectedReason: reason })
        return reply.code(200).send({ ok: true, status: ClaimStatus.FAILED, rejectedReason: reason })
      } finally {
        client.release()
      }
    }
  )
}
