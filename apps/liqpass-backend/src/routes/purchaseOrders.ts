import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { env } from '../env.js'
import {
    bindOkxMeta,
    getPurchaseOrderByIdExtended,
    markPurchaseOrderPaid
} from '../db/purchaseOrdersRepo.js'

function requireHeader(req: FastifyRequest, name: string): string {
    const v = req.headers[name.toLowerCase()]
    if (typeof v === 'string' && v.length > 0) return v
    return ''
}

export async function registerPurchaseOrdersRoutes(app: FastifyInstance): Promise<void> {
    /**
     * Bind OKX order metadata to a purchase order
     * POST /api/purchase-orders/:id/bind-okx
     */
    app.post(
        '/api/purchase-orders/:id/bind-okx',
        async (
            req: FastifyRequest<{ Params: { id: string }; Body: { ordId: string; instId: string } }>,
            reply: FastifyReply
        ) => {
            try {
                const { id } = req.params
                const { ordId, instId } = req.body

                if (!ordId || typeof ordId !== 'string' || ordId.trim().length === 0) {
                    return reply.code(400).send({ error: 'ordId is required' })
                }
                if (!instId || typeof instId !== 'string' || instId.trim().length === 0) {
                    return reply.code(400).send({ error: 'instId is required' })
                }

                const result = await bindOkxMeta(id, { ordId, instId })
                return reply.code(200).send(result)
            } catch (e) {
                const err = e as Error
                if (err.message === 'ORDER_NOT_FOUND') {
                    return reply.code(404).send({ error: 'ORDER_NOT_FOUND' })
                }
                if (err.message === 'ALREADY_PAID_CANNOT_BIND') {
                    return reply.code(409).send({ error: 'ALREADY_PAID_CANNOT_BIND' })
                }
                return reply.code(500).send({ error: err.message })
            }
        }
    )

    /**
     * Mark a purchase order as paid (internal use only)
     * POST /internal/purchase-orders/:id/mark-paid
     */
    app.post(
        '/internal/purchase-orders/:id/mark-paid',
        async (
            req: FastifyRequest<{ Params: { id: string }; Body: { paidAt?: string } }>,
            reply: FastifyReply
        ) => {
            const key = requireHeader(req, 'x-internal-key')
            if (key !== env.INTERNAL_API_KEY) {
                return reply.code(401).send({ error: 'UNAUTHORIZED' })
            }

            try {
                const { id } = req.params
                const paidAtStr = req.body?.paidAt
                const paidAt = paidAtStr ? new Date(paidAtStr) : undefined

                const result = await markPurchaseOrderPaid(id, paidAt)
                return reply.code(200).send({
                    ok: result.ok,
                    paidAt: result.paidAt.toISOString()
                })
            } catch (e) {
                const err = e as Error
                if (err.message === 'ORDER_NOT_FOUND') {
                    return reply.code(404).send({ error: 'ORDER_NOT_FOUND' })
                }
                return reply.code(500).send({ error: err.message })
            }
        }
    )

    /**
     * Get purchase order details
     * GET /api/purchase-orders/:id
     */
    app.get(
        '/api/purchase-orders/:id',
        async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
            try {
                const { id } = req.params
                const order = await getPurchaseOrderByIdExtended(id)

                if (!order) {
                    return reply.code(404).send({ error: 'ORDER_NOT_FOUND' })
                }

                return reply.code(200).send({
                    id: order.id,
                    purchaseOrderId: order.purchaseOrderId,
                    paidAt: order.paidAt ? order.paidAt.toISOString() : null,
                    coverageStartAt: order.coverageStartAt ? order.coverageStartAt.toISOString() : null,
                    coverageEndAt: order.coverageEndAt ? order.coverageEndAt.toISOString() : null,
                    okxMeta: order.okxMeta,
                    policyParams: order.policyParams,
                    premiumUsd: order.premiumUsd,
                    status: order.status,
                    createdAt: order.createdAt ? order.createdAt.toISOString() : null
                })
            } catch (e) {
                const err = e as Error
                return reply.code(500).send({ error: err.message })
            }
        }
    )
}
