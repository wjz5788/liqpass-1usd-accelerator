// Mock API for quote functionality
export type QuoteResponse = {
  pNow: string;      // Current probability in wad format (1e18)
  pAfter: string;    // After probability in wad format (1e18)
  expectedCost: string; // Expected cost in wei (1e18)
  maxCost: string;    // Max cost in wei (1e18)
  marketId: `0x${string}`;
  trader: `0x${string}`;
  targetPct: number;
  timestamp: number;
};

// Mock fetchQuote function
export async function fetchQuote(
  marketId: `0x${string}`,
  trader: `0x${string}`,
  targetPct: number
): Promise<QuoteResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Calculate mock values
  const currentProb = 0.5; // 50% current probability
  const pNow = String(Math.round(currentProb * 1e18));
  const pAfter = String(Math.round((targetPct / 100) * 1e18));
  
  // Calculate mock costs based on probability difference
  const probDiff = Math.abs(targetPct / 100 - currentProb);
  const baseCost = probDiff * 10000; // Mock cost calculation
  const expectedCost = String(Math.round(baseCost * 1e18));
  const maxCost = String(Math.round((baseCost * 1.2) * 1e18));
  
  return {
    pNow,
    pAfter,
    expectedCost,
    maxCost,
    marketId,
    trader,
    targetPct,
    timestamp: Date.now(),
  };
}