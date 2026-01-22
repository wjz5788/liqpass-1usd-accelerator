export interface MemeToken {
  id: string
  name: string
  ticker: string
  creator: string
  creatorAvatar: string
  createdAt: string
  marketCap: string
  marketCapValue: number
  description: string
  image: string
  replies: number
  isLive?: boolean
  change?: number
  progress: number
  createdDays?: number
  twitter?: string
  website?: string
  github?: string
  telegram?: string
  raisedUsd?: number
  participants?: number

  previewVideoUrl?: string
  previewVideoWebmUrl?: string
  previewPosterUrl?: string
  previewDurationSec?: number

  /** --- Discovery / Heat --- */
  heatScore?: number // computed client-side
  heatDelta24h?: number // computed client-side
  phase?: 'P1' | 'P2' | 'P3'
}

export interface HeroSlide {
  id: string
  label: string // 顶部小标题
  poolAmount: string // 大号数字
  timeLabel: string // 时刻说明
  desc: string // 补充说明
  buttonText: string // CTA 文案
  ticketText: string // 门票说明
}

export type FundingTier = 'cold' | 'takeoff' | 'hot'
