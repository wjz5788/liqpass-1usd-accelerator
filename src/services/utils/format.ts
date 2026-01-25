// Formatting utilities for financial and probability data

/**
 * Convert a wad value (1e18) to a percentage string
 * @param wadStr - Wad value as a string
 * @returns Formatted percentage string with 1 decimal place
 */
export function wadToPct(wadStr: string): string {
  const n = Number(wadStr);
  if (!Number.isFinite(n)) return '0.0%';
  const pct = (n / 1e18) * 100;
  return `${pct.toFixed(1)}%`;
}

/**
 * Convert a percentage value to wad format (1e18)
 * @param pct - Percentage value (0-100)
 * @returns Wad value as a string
 */
export function pctToWad(pct: number): string {
  const wad = (pct / 100) * 1e18;
  return String(Math.round(wad));
}

/**
 * Format USD value with appropriate decimal places
 * @param weiStr - Wei value as a string
 * @returns Formatted USD string
 */
export function weiToUsd(weiStr: string): string {
  const n = Number(weiStr);
  if (!Number.isFinite(n)) return '$0.00';
  const usd = n / 1e18;
  return `$${usd.toFixed(2)}`;
}