import 'dotenv/config'

const purchaseOrderId = process.argv[2]
if (!purchaseOrderId) {
  console.error('Usage: tsx scripts/mock_trigger.ts <purchaseOrderId>')
  process.exit(1)
}

const baseUrl = process.env.BACKEND_BASE_URL ?? 'http://localhost:3001'
const internalKey = process.env.INTERNAL_API_KEY
if (!internalKey) {
  console.error('Missing INTERNAL_API_KEY in env')
  process.exit(1)
}

const res = await fetch(`${baseUrl}/internal/claims/onchain-trigger`, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-internal-key': internalKey
  },
  body: JSON.stringify({
    purchaseOrderId,
    claimant: '0x0000000000000000000000000000000000000000',
    submitTxHash: '0xdeadbeef',
    triggeredAtSec: Math.floor(Date.now() / 1000)
  })
})

console.log('status', res.status)
console.log(await res.text())
