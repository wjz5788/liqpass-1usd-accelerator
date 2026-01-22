import 'dotenv/config'

type Env = {
  DATABASE_URL: string
  JP_VERIFY_BASE_URL: string
  INTERNAL_API_KEY: string
  ADMIN_API_KEY: string
  PORT: number
  QUOTE_SIGNER_PK?: string
  CHECKOUT_CONTRACT?: string
  CHAIN_ID: number
}

function requireString(name: keyof Omit<Env, 'PORT'>): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var ${name}`)
  return v
}

function parsePort(raw: string | undefined): number {
  if (!raw) return 3001
  const n = Number(raw)
  if (!Number.isInteger(n) || n <= 0) throw new Error(`Invalid PORT: ${raw}`)
  return n
}

function parseChainId(raw: string | undefined): number {
  if (!raw) return 8453
  const n = Number(raw)
  if (!Number.isInteger(n) || n <= 0)
    throw new Error(`Invalid CHAIN_ID: ${raw}`)
  return n
}

function optionalString(name: string): string | undefined {
  const v = process.env[name]
  if (!v) return undefined
  if (v.trim().length === 0) return undefined
  return v
}

export const env: Env = {
  DATABASE_URL: requireString('DATABASE_URL'),
  JP_VERIFY_BASE_URL: requireString('JP_VERIFY_BASE_URL'),
  INTERNAL_API_KEY: requireString('INTERNAL_API_KEY'),
  ADMIN_API_KEY: requireString('ADMIN_API_KEY'),
  PORT: parsePort(process.env.PORT),
  QUOTE_SIGNER_PK: optionalString('QUOTE_SIGNER_PK'),
  CHECKOUT_CONTRACT: optionalString('CHECKOUT_CONTRACT'),
  CHAIN_ID: parseChainId(process.env.CHAIN_ID),
}
