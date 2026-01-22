export type Phase = 'P1' | 'P2' | 'P3'

export type EventKey =
  | 'hackathon'
  | 'shipping'
  | 'paidUsers'
  | 'derivativeCount'
  | 'governance'

export interface EventMarket {
  key: EventKey
  title: string
  desc: string
  pYes: number // 0..1
  stats: {
    volume24h: number
    traders24h: number
    trades24h: number
  }
}
