import type { MemeToken } from '../../../../domain/meme'
import type { ActivityLog, PoolFinances, Project, UserEarnings } from '../types'

const safeNumber = (n: number | undefined, fallback: number) =>
  Number.isFinite(n ?? NaN) ? (n as number) : fallback

const shortTagline = (token: MemeToken) => {
  const raw = token.description?.trim() || `${token.ticker} meme project`
  return raw.length > 80 ? `${raw.slice(0, 77)}...` : raw
}

export function memeTokenToProject(token: MemeToken): Project {
  const raisedUsd = safeNumber(token.raisedUsd, token.marketCapValue || 0)
  const supporters = safeNumber(token.participants, Math.max(0, token.replies))

  return {
    id: token.id,
    name: token.name,
    tagline: shortTagline(token),
    stage: 'mvp',
    chain: 'Solana',
    supporters,
    raisedUsd,
    poolTarget: 1000,
    totalTickets: Math.floor(raisedUsd),

    hasVideo: Boolean(token.previewVideoUrl),
    videoUrl: token.previewVideoUrl,
    videoType: token.previewVideoUrl ? 'external' : undefined,

    roundGoal: `将 ${token.name} 从 Meme 推进到可验证交付：\n- 公开 demo\n- 可复核里程碑\n- 可追踪资金流`,
    milestones: [
      '第1周：完成 demo / landing',
      '第2周：提交黑客松或公开发布',
      '第3周：获得首批付费用户/赞助',
    ],

    website: token.website,
    github: token.github,
    twitter: token.twitter,
    telegram: token.telegram,
    email: 'hello@liqpass.com',

    createdAt: token.createdAt,
    change24h: token.change,
  }
}

export function mockUserEarningsFromToken(token: MemeToken): UserEarnings {
  const invested = 12
  const realized = Math.max(0, (token.change ?? 0) < 0 ? 2.4 : 5.2)
  const estimated = invested + realized + 6.6
  const pnl = estimated - invested

  return {
    invested,
    tickets: invested,
    realized,
    estimated,
    pnl,
    multiplier: invested > 0 ? estimated / invested : 1,
    poolAvgMultiplier: 1.12,
    topMultiplier: 3.4,
  }
}

export function mockPoolFinancesFromToken(token: MemeToken): PoolFinances {
  const currentPool = Math.max(0, Math.floor(safeNumber(token.raisedUsd, 296)))
  const targetPool = 1000

  return {
    currentPool,
    targetPool,
    moneyIn: {
      supportTickets: currentPool,
      rake: Math.floor(currentPool * 0.15),
      sponsorship: 100,
      hackathonPrize: 0,
    },
    moneyOut: {
      lottery: Math.floor(currentPool * 0.35),
      settlement: Math.floor(currentPool * 0.25),
      operations: Math.floor(currentPool * 0.12),
    },
    reserved: Math.floor(currentPool * 0.2),
  }
}

export function mockActivityLogsFromToken(_token: MemeToken): ActivityLog[] {
  return [
    {
      id: '1',
      type: 'milestone',
      timestamp: '2024-01-20T16:45:00',
      description: '完成阶段目标定义并公开验证口径',
      verificationUrl: 'https://github.com/liqpass',
    },
    {
      id: '2',
      type: 'allocation',
      timestamp: '2024-01-24T14:20:00',
      amount: 36,
      description: '划拨资金用于开发/运营',
      verificationUrl: 'https://github.com/liqpass',
    },
    {
      id: '3',
      type: 'lottery',
      timestamp: '2024-01-25T10:30:00',
      amount: 50,
      description: '每日抽奖发放',
      recipient: '尾号 ...4f2a',
      verificationUrl: 'https://etherscan.io',
    },
  ]
}
