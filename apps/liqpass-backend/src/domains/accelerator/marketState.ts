import { ethers } from 'ethers';

const ABI = [
  'function b() view returns (uint256)',
  'function qYes() view returns (uint256)',
  'function qNo() view returns (uint256)',
  'function closeTime() view returns (uint64)',
  'function outcome() view returns (uint8)'
];

export async function getMarketState(provider: ethers.Provider, market: string) {
  const addr = ethers.getAddress(market);
  const c = new ethers.Contract(addr, ABI, provider);

  const [b, qYes, qNo, closeTime, outcome] = await Promise.all([
    c.b(), c.qYes(), c.qNo(), c.closeTime(), c.outcome()
  ]);

  return {
    market: addr,
    b: BigInt(b.toString()),
    qYes: BigInt(qYes.toString()),
    qNo: BigInt(qNo.toString()),
    closeTime: Number(closeTime),
    outcome: Number(outcome),
  };
}
