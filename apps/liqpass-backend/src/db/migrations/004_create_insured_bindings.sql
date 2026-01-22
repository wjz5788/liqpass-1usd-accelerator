-- 004_create_insured_bindings.sql
create table if not exists insured_bindings (
  id bigserial primary key,
  user_id text not null,
  api_account_id bigint not null references api_accounts(id) on delete cascade,
  exchange text not null,                 -- 'OKX'
  inst_id text not null,
  mgn_mode text not null,                 -- 'isolated'|'cross'
  pos_side text not null,                 -- 'long'|'short'|'net'
  sku text not null,                      -- 'LIQPASS_8H' etc
  status text not null default 'DRAFT',   -- DRAFT|ACTIVE|EXPIRED|CANCELLED
  bound_at timestamptz not null default now(),
  coverage_start_at timestamptz,
  coverage_end_at timestamptz
);

-- 防重复：同一绑定键在 DRAFT/ACTIVE 只能有一条
create unique index if not exists uniq_binding_active
on insured_bindings(api_account_id, inst_id, mgn_mode, pos_side)
where status in ('DRAFT','ACTIVE');