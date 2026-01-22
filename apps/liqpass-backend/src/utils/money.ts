export function minNumericString(a: string, b: string): string {
  const na = Number(a)
  const nb = Number(b)
  if (!Number.isFinite(na) || !Number.isFinite(nb)) {
    throw new Error(`Invalid numeric strings: a=${a}, b=${b}`)
  }
  return na <= nb ? a : b
}

export function toNumericString(v: unknown, fallback: string): string {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return fallback
    return String(v)
  }
  if (typeof v === 'string') return v
  return fallback
}
