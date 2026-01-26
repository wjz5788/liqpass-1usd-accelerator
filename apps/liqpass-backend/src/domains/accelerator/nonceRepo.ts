import { pool } from '../../db/pool.js';
import { ethers } from 'ethers';

export async function nextNonce(user: string): Promise<bigint> {
  const u = ethers.getAddress(user);

  // 事务 + FOR UPDATE，避免并发发两次同 nonce
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cur = await client.query(
      `select next_nonce from accelerator_nonce where user_address=$1 for update`,
      [u]
    );

    let nonce: bigint;
    if (cur.rows.length === 0) {
      nonce = 1n;
      await client.query(
        `insert into accelerator_nonce(user_address, next_nonce) values($1,$2)`,
        [u, '2']
      );
    } else {
      nonce = BigInt(cur.rows[0].next_nonce);
      await client.query(
        `update accelerator_nonce set next_nonce=$2, updated_at=now() where user_address=$1`,
        [u, (nonce + 1n).toString()]
      );
    }

    await client.query('COMMIT');
    return nonce;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
