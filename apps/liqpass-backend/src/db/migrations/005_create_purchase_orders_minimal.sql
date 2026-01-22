-- 005_create_purchase_orders_minimal.sql
-- 首先检查表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS purchase_orders (
  id bigserial primary key,
  user_id text not null,
  binding_id bigint not null references insured_bindings(id) on delete cascade,
  purchase_order_id text not null,        -- bytes32 hex string: 0x...
  premium_amount text not null,           -- USDC 最小单位字符串
  premium_usd text not null,              -- "3.00"
  status text not null default 'DRAFT',   -- DRAFT|PAID_PENDING_CONFIRM|ACTIVE|EXPIRED|CANCELLED
  coverage_delay_sec int not null default 600,
  coverage_start_at timestamptz,
  coverage_end_at timestamptz,
  pay_tx_hash text,
  payer text,
  created_at timestamptz not null default now()
);

-- 添加缺失的列（如果现有表已经存在）
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS user_id text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS binding_id bigint;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS purchase_order_id text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS premium_amount text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS premium_usd text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS status text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS coverage_delay_sec int;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS pay_tx_hash text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS payer text;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS created_at timestamptz;

-- 设置默认值
ALTER TABLE purchase_orders ALTER COLUMN status SET DEFAULT 'DRAFT';
ALTER TABLE purchase_orders ALTER COLUMN coverage_delay_sec SET DEFAULT 600;
ALTER TABLE purchase_orders ALTER COLUMN created_at SET DEFAULT now();

-- 创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS uniq_purchase_order_id ON purchase_orders(purchase_order_id);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_pay_tx_hash ON purchase_orders(pay_tx_hash) WHERE pay_tx_hash IS NOT NULL;