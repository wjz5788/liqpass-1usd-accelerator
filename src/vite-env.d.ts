/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WEB3_PROVIDER: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_DEMO_MARKET_ADDRESS: string;
  readonly VITE_DEMO_RESOLVER: string;
  readonly VITE_APP_ENV: string;
  // 其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
