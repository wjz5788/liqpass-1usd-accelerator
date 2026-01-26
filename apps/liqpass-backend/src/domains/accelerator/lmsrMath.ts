import Decimal from 'decimal.js';

/**
 * 所有输入输出都用"最小单位"（USDC 1e6）的整数（bigint）
 * 返回也是最小单位（向上取整）
 */
function D(x: bigint) { return new Decimal(x.toString()); }

export function lmsrCostDelta(params: {
  b: bigint;
  qYes: bigint;
  qNo: bigint;
  dq: bigint;
  addToYes: boolean;
}): bigint {
  const { b, qYes, qNo, dq, addToYes } = params;

  const before = cost({ b, qYes, qNo });
  const after = cost({
    b,
    qYes: addToYes ? (qYes + dq) : qYes,
    qNo:  addToYes ? qNo : (qNo + dq),
  });

  const delta = after.minus(before);
  if (delta.lte(0)) throw new Error('BAD_DELTA');
  return BigInt(delta.ceil().toString());
}

export function lmsrPayoutDelta(params: {
  b: bigint;
  qYes: bigint;
  qNo: bigint;
  dq: bigint;
  sellYes: boolean;
}): bigint {
  const { b, qYes, qNo, dq, sellYes } = params;

  const before = cost({ b, qYes, qNo });
  const after = cost({
    b,
    qYes: sellYes ? (qYes - dq) : qYes,
    qNo:  sellYes ? qNo : (qNo - dq),
  });

  const delta = before.minus(after);
  if (delta.lte(0)) throw new Error('BAD_PAYOUT');
  return BigInt(delta.ceil().toString());
}

function cost(input: { b: bigint; qYes: bigint; qNo: bigint }) {
  const b = D(input.b);
  const y = D(input.qYes).div(b);
  const n = D(input.qNo).div(b);

  // b * ln(exp(y) + exp(n))
  const sum = Decimal.exp(y).plus(Decimal.exp(n));
  return b.mul(Decimal.ln(sum));
}
