const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))

/**
 * Binary LMSR using cost function:
 *  C(qYes,qNo)=b*ln(exp(qYes/b)+exp(qNo/b))
 */
export function lmsrBinaryQuote(params: {
  pYes: number
  b: number
  deltaYes: number // "shares" to buy of YES
}) {
  const b = Math.max(1e-6, params.b)
  const p = clamp(params.pYes, 1e-6, 1 - 1e-6)
  const delta = params.deltaYes

  // Reconstruct an equivalent inventory point from current p
  // We can set qNo=0, and pick qYes such that priceYes matches.
  // priceYes = exp(qYes/b) / (exp(qYes/b)+exp(qNo/b)) = exp(qYes/b)/(exp(qYes/b)+1)
  // => qYes = b * ln(p/(1-p))
  const qNo0 = 0
  const qYes0 = b * Math.log(p / (1 - p))

  const C = (qYes: number, qNo: number) =>
    b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b))

  const cost0 = C(qYes0, qNo0)
  const cost1 = C(qYes0 + delta, qNo0)
  const cost = cost1 - cost0

  const qYes1 = qYes0 + delta
  const priceYes1 = Math.exp(qYes1 / b) / (Math.exp(qYes1 / b) + Math.exp(qNo0 / b))

  const avgPrice = delta === 0 ? 0 : cost / delta

  return {
    cost,
    avgPrice,
    pYesAfter: clamp(priceYes1, 0, 1),
  }
}
