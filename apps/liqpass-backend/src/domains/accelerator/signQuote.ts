import { ethers } from 'ethers';

export const types = {
  Quote: [
    { name: 'user', type: 'address' },
    { name: 'isBuy', type: 'bool' },
    { name: 'isYes', type: 'bool' },
    { name: 'shares', type: 'uint256' }, // 最小单位
    { name: 'amount', type: 'uint256' }, // cost/payout 最小单位
    { name: 'expiry', type: 'uint64' },
    { name: 'nonce', type: 'uint256' },
  ],
};

export async function signQuote(params: {
  signer: ethers.Wallet;
  provider: ethers.Provider;
  verifyingContract: string;  // 市场合约地址
  user: string;
  isBuy: boolean;
  isYes: boolean;
  sharesSmallest: bigint;
  amountSmallest: bigint;
  expiry: number;
  nonce: bigint;
}) {
  const chainId = (await params.provider.getNetwork()).chainId;

  const domain = {
    name: 'LMSRCompleteSetMarket',
    version: '1',
    chainId,
    verifyingContract: ethers.getAddress(params.verifyingContract),
  };

  const value = {
    user: ethers.getAddress(params.user),
    isBuy: params.isBuy,
    isYes: params.isYes,
    shares: params.sharesSmallest.toString(),
    amount: params.amountSmallest.toString(),
    expiry: params.expiry,
    nonce: params.nonce.toString(),
  };

  const sig = await params.signer.signTypedData(domain, types, value);
  return { domain, value, sig };
}
