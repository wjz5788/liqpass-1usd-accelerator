-- Phase A: Ensure purchase_orders has required fields.
-- NOTE: This migration assumes purchase_orders table already exists.

ALTER TABLE purchase_orders
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS coverage_start_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS coverage_end_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS quote_hash TEXT,
  ADD COLUMN IF NOT EXISTS premium_amount_usdc NUMERIC(38,6),
  ADD COLUMN IF NOT EXISTS chain_id INT,
  ADD COLUMN IF NOT EXISTS policy_type TEXT,
  ADD COLUMN IF NOT EXISTS policy_params_json JSONB,
  ADD COLUMN IF NOT EXISTS okx_meta_json JSONB;
