import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { okxGetPositions } from '../services/okxClient.js'
import { getApiAccount as getApiAccountFromRepo } from '../db/apiAccountsRepo.js'
import { createOrGetBinding as createOrGetBindingFromRepo } from '../db/bindingsRepo.js'
import { createPurchaseOrder as createPurchaseOrderFromRepo, markOrderPaid as markOrderPaidFromRepo } from '../db/purchaseOrdersRepo.js'

// 移除空接口声明，使用现有类型

// 类型定义
interface ApiAccount {
  id: string
  uid: string
  apiKey: string
  secret: string
  passphrase: string
  exchange: string
}

interface BindingResult {
  bindId: string
}

interface PurchaseOrder {
  purchaseOrderId: string
  premiumAmount: string
  coverageStartAt: string
  coverageEndAt: string
}

// SKU 到 durationSec 的映射
const skuToDurationMap: Record<string, number> = {
  'LIQPASS_8H': 8 * 3600,
  'LIQPASS_24H': 24 * 3600,
  'LIQPASS_30D': 30 * 24 * 3600
};

// 从DB取API账户并解密
async function getApiAccount(apiAccountId: string): Promise<ApiAccount> {
  return getApiAccountFromRepo(apiAccountId);
}

// 创建或获取绑定
async function createOrGetBinding(input: {
  apiAccountId: string
  instId: string
  mgnMode: string
  posSide: string
  sku: string
}): Promise<BindingResult> {
  // 假设userId是钱包地址，这里暂时硬编码，实际应从请求中获取
  const userId = "dummy_wallet_address"; // TODO: 从请求中获取实际的userId
  const result = await createOrGetBindingFromRepo({
    userId,
    apiAccountId: input.apiAccountId,
    exchange: "OKX",
    instId: input.instId,
    mgnMode: input.mgnMode,
    posSide: input.posSide,
    sku: input.sku
  });
  return { bindId: result.bindId };
}

// 创建投保订单
async function createPurchaseOrder(input: {
  bindId: string
  premiumUsd: string     // e.g. "3.5"
  premiumAmount: string  // USDC 最小单位字符串，6位： "3500000"
  coverageDelaySec: number
}): Promise<PurchaseOrder> {
  // 假设userId是钱包地址，这里暂时硬编码，实际应从请求中获取
  const userId = "dummy_wallet_address"; // TODO: 从请求中获取实际的userId
  // 假设sku是LIQPASS_8H，实际应从binding中获取
  const sku = "LIQPASS_8H"; // TODO: 从binding中获取实际的sku
  const durationSec = skuToDurationMap[sku] || 8 * 3600;
  
  const result = await createPurchaseOrderFromRepo({
    userId,
    bindId: input.bindId,
    premiumUsd: input.premiumUsd,
    premiumAmount: input.premiumAmount,
    coverageDelaySec: input.coverageDelaySec,
    durationSec
  });
  
  return {
    purchaseOrderId: result.purchaseOrderId,
    premiumAmount: result.premiumAmount,
    coverageStartAt: result.coverageStartAt.toISOString(),
    coverageEndAt: result.coverageEndAt.toISOString()
  };
}

// 标记订单已支付
async function markOrderPaid(input: {
  purchaseOrderId: string
  payTxHash: string
  payer?: string
}): Promise<void> {
  await markOrderPaidFromRepo(input);
}

export async function registerInsuranceRoutes(app: FastifyInstance) {
  // 获取 OKX 仓位
  app.get('/api/okx/positions', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { apiAccountId, instId } = request.query as {
        apiAccountId: string
        instId?: string
      }
      
      if (!apiAccountId) {
        return reply.status(400).send('MISSING_apiAccountId')
      }

      const acct = await getApiAccount(apiAccountId)

      const raw = await okxGetPositions({
        apiKey: acct.apiKey,
        secret: acct.secret,
        passphrase: acct.passphrase,
        instId,
      })

      // 标准化（前端用）
      const positions = raw.map((p: any) => ({
        instId: p.instId,
        mgnMode: p.mgnMode,
        posSide: p.posSide || 'net',
        ccy: p.ccy,
        lever: Number(p.lever || 0),
        pos: p.pos,
        avgPx: p.avgPx,
        markPx: p.markPx,
        liqPx: p.liqPx,
        uplRatio: p.uplRatio,
      }))

      return reply.send({ positions })
    } catch (e: any) {
      return reply.status(400).send(e?.message ?? 'POS_FAILED')
    }
  })

  // 绑定仓位
  app.post('/api/insurance/bind-position', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { apiAccountId, instId, mgnMode, posSide, sku } = request.body as {
        apiAccountId: string
        instId: string
        mgnMode: string
        posSide: string
        sku: string
      }
      
      if (!apiAccountId || !instId || !mgnMode || !posSide || !sku) {
        return reply.status(400).send('MISSING_FIELDS')
      }

      // 最关键：绑定键冻结
      const out = await createOrGetBinding({ apiAccountId, instId, mgnMode, posSide, sku })
      return reply.send({ bindId: out.bindId })
    } catch (e: any) {
      return reply.status(400).send(e?.message ?? 'BIND_FAILED')
    }
  })

  // 创建投保订单
  app.post('/api/insurance/create-order', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { bindId } = request.body as { bindId: string }
      
      if (!bindId) {
        return reply.status(400).send('MISSING_bindId')
      }

      // TODO: 根据 bindId 读取 sku、仓位、杠杆等，算保费
      // 这里先给最小可跑：前期你也说“半自动”，可以先写死或后端简单定价
      const premiumUsd = "3.00"
      const premiumAmount = "3000000" // 3 USDC (6 decimals)
      const coverageDelaySec = 600

      const out = await createPurchaseOrder({ bindId, premiumUsd, premiumAmount, coverageDelaySec })
      return reply.send(out)
    } catch (e: any) {
      return reply.status(400).send(e?.message ?? 'CREATE_ORDER_FAILED')
    }
  })

  // 提交支付信息
  app.post('/api/insurance/submit-payment', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { purchaseOrderId, payTxHash, payer } = request.body as {
        purchaseOrderId: string
        payTxHash: string
        payer?: string
      }
      
      if (!purchaseOrderId || !payTxHash) {
        return reply.status(400).send('MISSING_FIELDS')
      }
      
      await markOrderPaid({ purchaseOrderId, payTxHash, payer })
      return reply.send({ ok: true })
    } catch (e: any) {
      return reply.status(400).send(e?.message ?? 'SUBMIT_PAYMENT_FAILED')
    }
  })
}
