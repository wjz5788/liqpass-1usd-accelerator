-- Create accelerator nonce table for user nonce management
create table if not exists accelerator_nonce (
  user_address text primary key,
  next_nonce bigint not null default 1,
  updated_at timestamptz not null default now()
);

-- Create accelerator quote audit table for tracking quotes
create table if not exists accelerator_quote_audit (
  id bigserial primary key,
  user_address text not null,
  market_address text not null,
  is_buy boolean not null,
  is_yes boolean not null,
  shares_amount numeric not null,   -- 最小单位（1e6）
  quote_amount numeric not null,    -- cost 或 payout，最小单位（1e6）
  expiry bigint not null,
  nonce bigint not null,
  sig text not null,
  algo text not null default 'LMSR',
  created_at timestamptz not null default now()
);

-- Create indexes for better query performance
create index if not exists idx_acc_quote_user on accelerator_quote_audit(user_address);
create index if not exists idx_acc_quote_market on accelerator_quote_audit(market_address);
