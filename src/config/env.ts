export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  web3Provider: import.meta.env.VITE_WEB3_PROVIDER || '',
  appEnv: import.meta.env.VITE_APP_ENV || 'development',
}
