import { pool } from './pool.js'
import crypto from "crypto";

export type PurchaseOrderRow = {
  id: string
  paid_at: Date | null
  coverage_start_at: Date | null
  coverage_end_at: Date | null
  policy_params_json: unknown | null
  okx_meta_json: unknown | null
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrderRow | null> {
  const res = await pool.query<PurchaseOrderRow>(
    `
      SELECT
        id,
        paid_at,
        coverage_start_at,
        coverage_end_at,
        policy_params_json,
        okx_meta_json
      FROM purchase_orders
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  )
  return res.rows[0] ?? null
}

function genPurchaseOrderIdHex() {
  // 32 bytes -> 0x...
  return "0x" + crypto.randomBytes(32).toString("hex");
}

export async function createPurchaseOrder(input: {
  userId: string;
  bindId: string;
  premiumUsd: string;
  premiumAmount: string;     // USDC 最小单位
  coverageDelaySec: number;  // 600
  durationSec: number;       // 8h/24h/30d
}) {
  const purchaseOrderId = genPurchaseOrderIdHex();
  const now = new Date();
  const start = new Date(now.getTime() + input.coverageDelaySec * 1000);
  const end = new Date(start.getTime() + input.durationSec * 1000);

  const { rows } = await pool.query(
    `insert into purchase_orders(
        user_id, binding_id, purchase_order_id,
        premium_amount, premium_usd,
        coverage_delay_sec, coverage_start_at, coverage_end_at, status
     )
     values($1,$2,$3,$4,$5,$6,$7,$8,'DRAFT')
     returning id, purchase_order_id, premium_amount, premium_usd, coverage_delay_sec, coverage_start_at, coverage_end_at`,
    [input.userId, input.bindId, purchaseOrderId, input.premiumAmount, input.premiumUsd, input.coverageDelaySec, start, end]
  );

  const r = rows[0];
  return {
    purchaseOrderDbId: String(r.id),
    purchaseOrderId: r.purchase_order_id,
    premiumAmount: r.premium_amount,
    premiumUsd: r.premium_usd,
    coverageDelaySec: r.coverage_delay_sec,
    coverageStartAt: r.coverage_start_at,
    coverageEndAt: r.coverage_end_at,
  };
}

export async function markOrderPaid(input: {
  purchaseOrderId: string;  // 0x...
  payTxHash: string;        // 0x...
  payer?: string;
}) {
  // 幂等：同一个 purchaseOrderId 已有 payTxHash 直接返回 ok
  const { rows: cur } = await pool.query(
    `select status, pay_tx_hash from purchase_orders where purchase_order_id=$1`,
    [input.purchaseOrderId]
  );
  if (cur.length === 0) throw new Error("ORDER_NOT_FOUND");
  if (cur[0].pay_tx_hash) {
    if (cur[0].pay_tx_hash === input.payTxHash) return { ok: true, status: cur[0].status };
    throw new Error("ORDER_ALREADY_HAS_DIFFERENT_TX");
  }

  // 更新：利用 uniq_pay_tx_hash 防重复 tx
  const { rows } = await pool.query(
    `update purchase_orders
     set pay_tx_hash=$2,
         payer=coalesce($3,payer),
         status='PAID_PENDING_CONFIRM'
     where purchase_order_id=$1 and pay_tx_hash is null
     returning status`,
    [input.purchaseOrderId, input.payTxHash, input.payer ?? null]
  );

  if (rows.length === 0) throw new Error("ORDER_PAY_UPDATE_FAILED");
  return { ok: true, status: rows[0].status };
}

/**
 * Bind OKX order metadata (ordId + instId) to a purchase order
 * Security: Only allows binding when paid_at IS NULL (prevents post-payment tampering)
 */
export async function bindOkxMeta(
  purchaseOrderId: string,
  okxMeta: { ordId: string; instId: string }
): Promise<{ ok: boolean }> {
  // Check if order exists and is not yet paid
  const { rows: cur } = await pool.query(
    `SELECT id, paid_at, okx_meta_json FROM purchase_orders WHERE id = $1`,
    [purchaseOrderId]
  );
  
  if (cur.length === 0) throw new Error("ORDER_NOT_FOUND");
  
  // Security: prevent binding after payment
  if (cur[0].paid_at) {
    throw new Error("ALREADY_PAID_CANNOT_BIND");
  }

  // Update okx_meta_json
  await pool.query(
    `UPDATE purchase_orders 
     SET okx_meta_json = $2 
     WHERE id = $1`,
    [purchaseOrderId, JSON.stringify(okxMeta)]
  );

  return { ok: true };
}

/**
 * Mark a purchase order as paid (internal/semi-automated use)
 * Idempotent: if already paid, returns success
 */
export async function markPurchaseOrderPaid(
  purchaseOrderId: string,
  paidAt?: Date
): Promise<{ ok: boolean; paidAt: Date }> {
  const paidAtValue = paidAt ?? new Date();

  // Check current state
  const { rows: cur } = await pool.query(
    `SELECT id, paid_at FROM purchase_orders WHERE id = $1`,
    [purchaseOrderId]
  );

  if (cur.length === 0) throw new Error("ORDER_NOT_FOUND");

  // Idempotent: if already paid, return existing paid_at
  if (cur[0].paid_at) {
    return { ok: true, paidAt: cur[0].paid_at };
  }

  // Update paid_at
  const { rows } = await pool.query(
    `UPDATE purchase_orders 
     SET paid_at = $2 
     WHERE id = $1 
     RETURNING paid_at`,
    [purchaseOrderId, paidAtValue]
  );

  return { ok: true, paidAt: rows[0].paid_at };
}

/**
 * Extended query for purchase order with all fields needed for frontend display
 */
export async function getPurchaseOrderByIdExtended(id: string) {
  const res = await pool.query(
    `SELECT
       id,
       purchase_order_id,
       paid_at,
       coverage_start_at,
       coverage_end_at,
       okx_meta_json,
       policy_params_json,
       premium_usd,
       status,
       created_at
     FROM purchase_orders
     WHERE id = $1
     LIMIT 1`,
    [id]
  );

  if (res.rows.length === 0) return null;

  const row = res.rows[0];
  return {
    id: row.id,
    purchaseOrderId: row.purchase_order_id,
    paidAt: row.paid_at,
    coverageStartAt: row.coverage_start_at,
    coverageEndAt: row.coverage_end_at,
    okxMeta: row.okx_meta_json,
    policyParams: row.policy_params_json,
    premiumUsd: row.premium_usd,
    status: row.status,
    createdAt: row.created_at
  };
}
