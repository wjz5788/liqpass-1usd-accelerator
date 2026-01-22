import { defineChain } from 'viem'

import { config } from '../config/env'

const rpcUrl = config.web3Provider || 'https://mainnet.base.org'

export const base8453 = defineChain({
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
})
