import Fastify from 'fastify'
import { env } from './env.js'
import { registerInternalClaimsRoutes } from './routes/internalClaims.js'
import { registerAdminClaimsRoutes } from './routes/adminClaims.js'
import { registerPublicQuoteRoutes } from './routes/publicQuote.js'
import { registerInsuranceRoutes } from './routes/insurance.js'
import { registerPurchaseOrdersRoutes } from './routes/purchaseOrders.js'
import { registerAcceleratorRoutes } from './routes/accelerator.js'

async function main(): Promise<void> {
  const app = Fastify({
    logger: true,
  })

  await registerInternalClaimsRoutes(app)
  await registerAdminClaimsRoutes(app)
  await registerPublicQuoteRoutes(app)
  await registerInsuranceRoutes(app)
  await registerPurchaseOrdersRoutes(app)
  await registerAcceleratorRoutes(app)

  await app.listen({ port: env.PORT, host: '0.0.0.0' })
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
