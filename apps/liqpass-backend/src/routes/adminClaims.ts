import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../env.js'
import { approveClaim, listClaimsByStatus, markPaid, rejectClaim } from '../db/claimsRepo.js'

function requireHeader(req: FastifyRequest, name: string): string {
  const v = req.headers[name.toLowerCase()]
  if (typeof v === 'string' && v.length > 0) return v
  return ''
}

function parseLimit(raw: unknown): number {
  if (raw === undefined) return 50
  const n = typeof raw === 'string' ? Number(raw) : raw
  if (!Number.isFinite(n)) return 50
  return Math.max(1, Math.min(200, Math.trunc(n as number)))
}

function parseOffset(raw: unknown): number {
  if (raw === undefined) return 0
  const n = typeof raw === 'string' ? Number(raw) : raw
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.trunc(n as number))
}

export async function registerAdminClaimsRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    '/admin/claims',
    async (
      req: FastifyRequest<{ Querystring: { status?: string; limit?: string; offset?: string } }>,
      reply: FastifyReply
    ) => {
      const key = requireHeader(req, 'x-admin-key')
      if (key !== env.ADMIN_API_KEY) return reply.code(401).send({ error: 'UNAUTHORIZED' })

      const status = req.query.status
      if (!status) return reply.code(400).send({ error: 'status is required' })

      const limit = parseLimit(req.query.limit)
      const offset = parseOffset(req.query.offset)
      const rows = await listClaimsByStatus({ status, limit, offset })
      return reply.code(200).send({ items: rows, limit, offset })
    }
  )

  app.post(
    '/admin/claims/:claimId/approve',
    async (req: FastifyRequest<{ Params: { claimId: string }; Body: { approvedBy?: string } }>, reply: FastifyReply) => {
      const key = requireHeader(req, 'x-admin-key')
      if (key !== env.ADMIN_API_KEY) return reply.code(401).send({ error: 'UNAUTHORIZED' })

      const claimId = req.params.claimId
      const approvedBy = typeof req.body?.approvedBy === 'string' && req.body.approvedBy.length > 0 ? req.body.approvedBy : 'admin'
      const ok = await approveClaim({ claimId, approvedBy })
      if (!ok) return reply.code(409).send({ error: 'INVALID_STATUS_TRANSITION' })
      return reply.code(200).send({ ok: true })
    }
  )

  app.post(
    '/admin/claims/:claimId/reject',
    async (req: FastifyRequest<{ Params: { claimId: string }; Body: { reason?: string } }>, reply: FastifyReply) => {
      const key = requireHeader(req, 'x-admin-key')
      if (key !== env.ADMIN_API_KEY) return reply.code(401).send({ error: 'UNAUTHORIZED' })

      const claimId = req.params.claimId
      const reason = req.body?.reason
      if (typeof reason !== 'string' || reason.length === 0) return reply.code(400).send({ error: 'reason is required' })

      const ok = await rejectClaim({ claimId, reason })
      if (!ok) return reply.code(409).send({ error: 'INVALID_STATUS_TRANSITION' })
      return reply.code(200).send({ ok: true })
    }
  )

  app.post(
    '/admin/claims/:claimId/mark-paid',
    async (
      req: FastifyRequest<{ Params: { claimId: string }; Body: { multisigTxHash?: string; paidAtSec?: number } }>,
      reply: FastifyReply
    ) => {
      const key = requireHeader(req, 'x-admin-key')
      if (key !== env.ADMIN_API_KEY) return reply.code(401).send({ error: 'UNAUTHORIZED' })

      const claimId = req.params.claimId
      const multisigTxHash = req.body?.multisigTxHash
      const paidAtSec = req.body?.paidAtSec
      if (typeof multisigTxHash !== 'string' || multisigTxHash.length === 0) {
        return reply.code(400).send({ error: 'multisigTxHash is required' })
      }
      if (typeof paidAtSec !== 'number' || !Number.isFinite(paidAtSec) || paidAtSec <= 0) {
        return reply.code(400).send({ error: 'paidAtSec is required' })
      }

      const paidAt = new Date(paidAtSec * 1000)
      const ok = await markPaid({ claimId, multisigTxHash, paidAt })
      if (!ok) return reply.code(409).send({ error: 'INVALID_STATUS_TRANSITION' })
      return reply.code(200).send({ ok: true })
    }
  )
}
