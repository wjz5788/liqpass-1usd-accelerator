import { getDefaultConfig } from '@rainbow-me/rainbowkit'

import { base8453 } from './chains'

const walletConnectProjectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'liqpass-demo'

export const wagmiConfig = getDefaultConfig({
  appName: 'LiqPass / 1USD Accelerator',
  // RainbowKit requires a non-empty string. If you later enable WalletConnect,
  // replace this with a real WalletConnect Cloud projectId.
  projectId: walletConnectProjectId,
  chains: [base8453],
  ssr: false,
})
