-- 003_create_api_accounts.sql
create table if not exists api_accounts (
  id bigserial primary key,
  user_id text not null,
  exchange text not null,                 -- 'OKX'
  uid text,                               -- OKX UID (可选但推荐)
  api_key text not null,
  secret_enc text not null,
  passphrase_enc text not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_api_accounts_user on api_accounts(user_id);
create unique index if not exists uniq_api_accounts_user_exchange_key
  on api_accounts(user_id, exchange, api_key);