import { pool } from "./pool";

export async function createOrGetBinding(input: {
  userId: string;
  apiAccountId: string;
  exchange: "OKX";
  instId: string;
  mgnMode: string;
  posSide: string;
  sku: string;
}) {
  const { userId, apiAccountId, exchange, instId, mgnMode, posSide, sku } = input;

  // 先插入，冲突则不插，随后 select 拿回
  await pool.query(
    `insert into insured_bindings(user_id, api_account_id, exchange, inst_id, mgn_mode, pos_side, sku, status)
     values($1,$2,$3,$4,$5,$6,$7,'DRAFT')
     on conflict on constraint uniq_binding_active do nothing`,
    [userId, apiAccountId, exchange, instId, mgnMode, posSide, sku]
  );

  const { rows } = await pool.query(
    `select id, status from insured_bindings
     where api_account_id=$1 and inst_id=$2 and mgn_mode=$3 and pos_side=$4
       and status in ('DRAFT','ACTIVE')
     limit 1`,
    [apiAccountId, instId, mgnMode, posSide]
  );
  if (rows.length === 0) throw new Error("BIND_CREATE_FAILED");

  return { bindId: String(rows[0].id), status: rows[0].status };
}