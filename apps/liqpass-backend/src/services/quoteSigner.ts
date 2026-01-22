import type { TypedDataDomain, TypedDataField, Wallet } from 'ethers'

export const QUOTE_TYPES: Record<string, Array<TypedDataField>> = {
  Quote: [
    { name: 'buyer', type: 'address' },
    { name: 'instId', type: 'string' },
    { name: 'leverage', type: 'uint16' },
    { name: 'principalUSDC', type: 'uint256' },
    { name: 'payoutUSDC', type: 'uint256' },
    { name: 'premiumUSDC', type: 'uint256' },
    { name: 'expiry', type: 'uint64' },
    { name: 'orderId', type: 'bytes32' },
  ],
}

export function makeEip712Domain(params: {
  chainId: number
  verifyingContract: string
}): TypedDataDomain {
  return {
    name: 'LiqPassQuote',
    version: '1',
    chainId: params.chainId,
    verifyingContract: params.verifyingContract,
  }
}

export async function signQuote(params: {
  wallet: Wallet
  domain: TypedDataDomain
  quote: {
    buyer: string
    instId: string
    leverage: number
    principalUSDC: bigint
    payoutUSDC: bigint
    premiumUSDC: bigint
    expiry: number
    orderId: string
  }
}): Promise<string> {
  return params.wallet.signTypedData(params.domain, QUOTE_TYPES, params.quote)
}
