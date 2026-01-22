import { pool } from "./pool";
import { decrypt } from "../security/cryptoBox";

export async function getApiAccount(apiAccountId: string) {
  const { rows } = await pool.query(
    `select id, user_id, exchange, uid, api_key, secret_enc, passphrase_enc
     from api_accounts where id = $1`,
    [apiAccountId]
  );
  if (rows.length === 0) throw new Error("API_ACCOUNT_NOT_FOUND");

  const r = rows[0];
  return {
    id: String(r.id),
    userId: r.user_id,
    exchange: r.exchange,
    uid: r.uid,
    apiKey: r.api_key,
    secret: decrypt(r.secret_enc),
    passphrase: decrypt(r.passphrase_enc),
  };
}