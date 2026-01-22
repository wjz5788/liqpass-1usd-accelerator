import { pool } from './pool.js'
import { ClaimStatus, type ClaimStatus as ClaimStatusType } from '../domain/claimStatus.js'

export type InsuranceClaimRow = {
  id: string
  purchase_order_id: string
  okx_event_id: string
  status: ClaimStatusType
  rejected_reason: string | null
  approved_by: string | null
  approved_at: Date | null
  multisig_tx_hash: string | null
  paid_at: Date | null
  created_at: Date
  updated_at: Date
}

export async function upsertPlaceholderClaim(args: {
  purchaseOrderId: string
  claimant: string
  submitTxHash?: string
  triggeredAtSec?: number
  okxEventId: string
}): Promise<{ id: string }> {
  const res = await pool.query<{ id: string }>(
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
      args.purchaseOrderId,
      args.claimant,
      args.submitTxHash ?? null,
      args.triggeredAtSec ?? null,
      args.okxEventId,
      ClaimStatus.VERIFYING
    ]
  )
  return res.rows[0]
}

export async function markClaimFailed(args: {
  purchaseOrderId: string
  okxEventId: string
  rejectedReason: string
}): Promise<void> {
  await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $4,
        rejected_reason = $3,
        updated_at = now()
      WHERE purchase_order_id = $1
        AND okx_event_id = $2
    `,
    [args.purchaseOrderId, args.okxEventId, args.rejectedReason, ClaimStatus.FAILED]
  )
}

export async function markClaimRejected(args: {
  purchaseOrderId: string
  okxEventId: string
  rejectedReason: string
}): Promise<void> {
  await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $4,
        rejected_reason = $3,
        updated_at = now()
      WHERE purchase_order_id = $1
        AND okx_event_id = $2
    `,
    [args.purchaseOrderId, args.okxEventId, args.rejectedReason, ClaimStatus.REJECTED]
  )
}

export async function markClaimRejectedWithEvidence(args: {
  purchaseOrderId: string
  okxEventId: string
  rejectedReason: string
  evidenceRoot: string | null
  evidenceJson: unknown
  liquidationTimeMs: number | null
  coverageWindowStart: Date
  coverageWindowEnd: Date
}): Promise<void> {
  await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $4,
        rejected_reason = $3,
        evidence_root = $5,
        evidence_json = $6,
        liquidation_time_ms = $7,
        coverage_window_start = $8,
        coverage_window_end = $9,
        updated_at = now()
      WHERE purchase_order_id = $1
        AND okx_event_id = $2
    `,
    [
      args.purchaseOrderId,
      args.okxEventId,
      args.rejectedReason,
      ClaimStatus.REJECTED,
      args.evidenceRoot,
      args.evidenceJson,
      args.liquidationTimeMs,
      args.coverageWindowStart,
      args.coverageWindowEnd
    ]
  )
}

export async function markClaimVerifiedPendingReview(args: {
  purchaseOrderId: string
  okxEventId: string
  evidenceRoot: string | null
  evidenceJson: unknown
  liquidationTimeMs: number | null
  coverageWindowStart: Date
  coverageWindowEnd: Date
  payoutAmountUsdc: string
  payoutCapUsdc: string
}): Promise<void> {
  await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $10,
        evidence_root = $3,
        evidence_json = $4,
        liquidation_time_ms = $5,
        coverage_window_start = $6,
        coverage_window_end = $7,
        payout_amount_usdc = $8,
        payout_cap_usdc = $9,
        updated_at = now(),
        rejected_reason = NULL
      WHERE purchase_order_id = $1
        AND okx_event_id = $2
    `,
    [
      args.purchaseOrderId,
      args.okxEventId,
      args.evidenceRoot,
      args.evidenceJson,
      args.liquidationTimeMs,
      args.coverageWindowStart,
      args.coverageWindowEnd,
      args.payoutAmountUsdc,
      args.payoutCapUsdc,
      ClaimStatus.VERIFIED_PENDING_REVIEW
    ]
  )
}

export async function listClaimsByStatus(args: {
  status: string
  limit: number
  offset: number
}): Promise<InsuranceClaimRow[]> {
  const res = await pool.query<InsuranceClaimRow>(
    `
      SELECT
        id,
        purchase_order_id,
        okx_event_id,
        status,
        rejected_reason,
        approved_by,
        approved_at,
        multisig_tx_hash,
        paid_at,
        created_at,
        updated_at
      FROM insurance_claims
      WHERE status = $1
      ORDER BY updated_at DESC
      LIMIT $2 OFFSET $3
    `,
    [args.status, args.limit, args.offset]
  )
  return res.rows
}

export async function approveClaim(args: { claimId: string; approvedBy: string }): Promise<boolean> {
  const res = await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $3,
        approved_by = $2,
        approved_at = now(),
        updated_at = now()
      WHERE id = $1
        AND status = $4
    `,
    [args.claimId, args.approvedBy, ClaimStatus.APPROVED_PENDING_MULTISIG, ClaimStatus.VERIFIED_PENDING_REVIEW]
  )
  return res.rowCount === 1
}

export async function rejectClaim(args: { claimId: string; reason: string }): Promise<boolean> {
  const res = await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $3,
        rejected_reason = $2,
        updated_at = now()
      WHERE id = $1
        AND status IN ($4, $5)
    `,
    [args.claimId, args.reason, ClaimStatus.REJECTED, ClaimStatus.VERIFIED_PENDING_REVIEW, ClaimStatus.APPROVED_PENDING_MULTISIG]
  )
  return res.rowCount === 1
}

export async function markPaid(args: {
  claimId: string
  multisigTxHash: string
  paidAt: Date
}): Promise<boolean> {
  const res = await pool.query(
    `
      UPDATE insurance_claims
      SET
        status = $4,
        multisig_tx_hash = $2,
        paid_at = $3,
        updated_at = now()
      WHERE id = $1
        AND status = $5
    `,
    [args.claimId, args.multisigTxHash, args.paidAt, ClaimStatus.PAID, ClaimStatus.APPROVED_PENDING_MULTISIG]
  )
  return res.rowCount === 1
}
