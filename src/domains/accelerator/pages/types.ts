export type ProjectStage = 'idea' | 'mvp' | 'live'

export interface Project {
  id: string
  name: string
  tagline: string
  stage: ProjectStage
  chain: string
  supporters: number
  raisedUsd: number
  hasVideo: boolean
  videoUrl?: string
  videoType?: 'external' | 'hosted'

  heatScore?: number
  change24h?: number
  signals?: string[]

  // 详情页用
  roundGoal: string
  milestones: string[] // 3 条为主
  fundingPlan?: string

  website?: string
  github?: string
  twitter?: string
  telegram?: string
  email: string

  createdAt: string

  // 新增：池子和收益数据
  poolTarget?: number
  totalTickets?: number
}

// 用户收益数据
export interface UserEarnings {
  invested: number // 本期投入
  tickets: number // 票数
  realized: number // 已拿到手（真实落袋）
  estimated: number // 当前估算权益（含未实现）
  pnl: number // 总体结果 PnL
  multiplier: number // 当前倍数
  poolAvgMultiplier: number // 本期平均倍数
  topMultiplier: number // 当前最高倍数
}

// 池子财务数据
export interface PoolFinances {
  currentPool: number
  targetPool: number
  moneyIn: {
    supportTickets: number // 1美元支持票
    rake: number // 抽水
    sponsorship: number // 赞助
    hackathonPrize: number // 黑客松奖金
  }
  moneyOut: {
    lottery: number // 抽奖发出
    settlement: number // 盘口结算
    operations: number // 开发/运营支出
  }
  reserved: number // 预留资金
}

// 活动日志
export interface ActivityLog {
  id: string
  type: 'lottery' | 'allocation' | 'hackathon' | 'milestone'
  timestamp: string
  amount?: number
  description: string
  verificationUrl?: string
  recipient?: string
}

export interface ProjectShort {
  projectId: string
  projectName: string
  stage: ProjectStage
  chain: string
  thumbnailUrl: string
  videoUrl: string
}

export interface SubmitForm {
  // Step 1
  name: string
  tagline: string
  stage: ProjectStage
  category: string[]
  chain: string

  // Step 2
  roundGoal: string
  milestones: string[]
  fundingPlan?: string

  // Step 3
  website?: string
  github: string
  twitter?: string
  telegram?: string
  email: string

  // Step 4
  videoType?: 'external' | 'hosted'
  videoUrl?: string
  videoFile?: File
}
