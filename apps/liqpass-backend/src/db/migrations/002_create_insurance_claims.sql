-- Phase A: insurance_claims table + idempotency index.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id TEXT NOT NULL,
  claimant TEXT NOT NULL,
  submit_tx_hash TEXT,
  triggered_at_sec BIGINT,
  okx_event_id TEXT NOT NULL,
  status TEXT NOT NULL,
  evidence_root TEXT,
  evidence_json JSONB,
  liquidation_time_ms BIGINT,
  coverage_window_start TIMESTAMPTZ,
  coverage_window_end TIMESTAMPTZ,
  payout_amount_usdc NUMERIC(38,6),
  payout_cap_usdc NUMERIC(38,6),
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  rejected_reason TEXT,
  multisig_safe TEXT,
  multisig_tx_hash TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'insurance_claims'
      AND indexname = 'insurance_claims_purchase_order_id_okx_event_id_uniq'
  ) THEN
    CREATE UNIQUE INDEX insurance_claims_purchase_order_id_okx_event_id_uniq
      ON insurance_claims(purchase_order_id, okx_event_id);
  END IF;
END $$;
