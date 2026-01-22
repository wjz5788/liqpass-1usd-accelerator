import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Wallet, isAddress, keccak256, parseUnits, toUtf8Bytes } from 'ethers'
import { env } from '../env.js'
import { priceQuote } from '../services/pricingEngine.js'
import { makeEip712Domain, signQuote } from '../services/quoteSigner.js'

type QuoteBody = {
  buyer: string
  instId: string
  leverage: number
  principalUSDC: number
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function parseNumber(v: unknown): number {
  const n = typeof v === 'string' ? Number(v) : v
  if (typeof n !== 'number' || !Number.isFinite(n))
    throw new Error('invalid number')
  return n
}

function parseBody(body: unknown): QuoteBody {
  if (!isRecord(body)) throw new Error('Invalid JSON body')

  if (!isNonEmptyString(body.buyer)) throw new Error('buyer is required')
  if (!isAddress(body.buyer)) throw new Error('buyer must be an address')
  if (!isNonEmptyString(body.instId)) throw new Error('instId is required')

  const leverage = parseNumber(body.leverage)
  const principalUSDC = parseNumber(body.principalUSDC)
  if (!Number.isInteger(leverage))
    throw new Error('leverage must be an integer')
  if (!(principalUSDC > 0)) throw new Error('principalUSDC must be > 0')

  return { buyer: body.buyer, instId: body.instId, leverage, principalUSDC }
}

function requireQuoteEnv(): { signerPk: string; verifyingContract: string } {
  const signerPk = env.QUOTE_SIGNER_PK
  const verifyingContract = env.CHECKOUT_CONTRACT
  if (!signerPk) throw new Error('Missing env var QUOTE_SIGNER_PK')
  if (!verifyingContract) throw new Error('Missing env var CHECKOUT_CONTRACT')
  return { signerPk, verifyingContract }
}

export async function registerPublicQuoteRoutes(
  app: FastifyInstance
): Promise<void> {
  app.post(
    '/api/quote',
    async (req: FastifyRequest<{ Body: QuoteBody }>, reply: FastifyReply) => {
      let body: QuoteBody
      try {
        body = parseBody(req.body)
      } catch (e) {
        return reply.code(400).send({ error: (e as Error).message })
      }

      const { signerPk, verifyingContract } = requireQuoteEnv()
      const signer = new Wallet(signerPk)

      let priced: ReturnType<typeof priceQuote>
      try {
        priced = priceQuote({
          instId: body.instId,
          leverage: body.leverage,
          principalUSDC: body.principalUSDC,
        })
      } catch (e) {
        return reply.code(400).send({ error: (e as Error).message })
      }

      const orderId = keccak256(toUtf8Bytes(`${body.buyer}:${Date.now()}`))
      const expiry = Math.floor(Date.now() / 1000) + 5 * 60

      const typedQuote = {
        buyer: body.buyer,
        instId: body.instId,
        leverage: body.leverage,
        principalUSDC: parseUnits(String(body.principalUSDC), 6),
        payoutUSDC: parseUnits(String(priced.payoutUSDC), 6),
        premiumUSDC: parseUnits(String(priced.premiumUSDC), 6),
        expiry,
        orderId,
      }

      const domain = makeEip712Domain({
        chainId: env.CHAIN_ID,
        verifyingContract,
      })
      const sig = await signQuote({ wallet: signer, domain, quote: typedQuote })

      const quote = {
        buyer: typedQuote.buyer,
        instId: typedQuote.instId,
        leverage: typedQuote.leverage,
        principalUSDC: typedQuote.principalUSDC.toString(),
        payoutUSDC: typedQuote.payoutUSDC.toString(),
        premiumUSDC: typedQuote.premiumUSDC.toString(),
        expiry: typedQuote.expiry,
        orderId: typedQuote.orderId,
      }

      return reply.code(200).send({ quote, sig, priced })
    }
  )
}
