import type { ProjectData } from './projectData'

export type HeatProject = {
  id: string
  name: string
  tagline: string
  tags: string[]
  createdAt: string
  watchers: number
  watchersDelta24h: number
  events: ProjectData['events']
}

export const mockHeatProjects: HeatProject[] = [
  {
    id: 'liqpass',
    name: 'LiqPass Accelerator',
    tagline: '阶段事件 + 证据 + LMSR 做市 的项目发现OS',
    tags: ['DeFi', 'Prediction', 'Accelerator'],
    createdAt: '2026-01-10',
    watchers: 2840,
    watchersDelta24h: 210,
    events: [
      {
        id: 'e1',
        title: 'Win ETHGlobal Hackathon',
        topic: 'Hackathon',
        claim: 'Project wins a major prize at ETHGlobal London',
        phase: 'P2',
        status: 'HOT',
        priceYes: 0.32,
        change24h: 12.5,
        volume24h: '$45K',
        depth: 'OK',
        evidenceCount: 3,
        lastEvidenceTime: '2h ago',
        deadline: '2d 14h',
      },
      {
        id: 'e2',
        title: 'Reach 1000 Paid Users',
        topic: 'Growth',
        claim: 'Active paid users on-chain > 1000',
        phase: 'P3',
        status: 'OPEN',
        priceYes: 0.58,
        change24h: -1.1,
        volume24h: '$120K',
        depth: 'Thin',
        evidenceCount: 12,
        lastEvidenceTime: '5m ago',
        deadline: '15d',
      },
    ],
  },
  {
    id: 'zk-social',
    name: 'ZK Social Graph',
    tagline: '零知识社交关系图, 让数据归用户',
    tags: ['SocialFi', 'ZK'],
    createdAt: '2026-01-12',
    watchers: 1510,
    watchersDelta24h: 320,
    events: [
      {
        id: 'e1',
        title: 'Ship Alpha on Base',
        topic: 'Shipping',
        claim: 'Alpha app deployed to Base with login & feed',
        phase: 'P1',
        status: 'HOT',
        priceYes: 0.41,
        change24h: 18.8,
        volume24h: '$19K',
        depth: 'OK',
        evidenceCount: 2,
        lastEvidenceTime: '1h ago',
        deadline: '3d',
      },
      {
        id: 'e2',
        title: '100 Paid Creators',
        topic: 'PaidUsers',
        claim: 'At least 100 creators pay subscription',
        phase: 'P2',
        status: 'OPEN',
        priceYes: 0.27,
        change24h: 3.6,
        volume24h: '$11K',
        depth: 'Thin',
        evidenceCount: 4,
        lastEvidenceTime: '8h ago',
        deadline: '21d',
      },
    ],
  },
  {
    id: 'cross-liq',
    name: 'Cross-chain Liquidity Router',
    tagline: '一键路由多链流动性, 便宜又快',
    tags: ['DeFi', 'Infra'],
    createdAt: '2025-12-28',
    watchers: 980,
    watchersDelta24h: -20,
    events: [
      {
        id: 'e1',
        title: 'Integrate 3 DEXs',
        topic: 'DerivCnt',
        claim: 'Aggregates at least 3 DEX venues',
        phase: 'P3',
        status: 'OPEN',
        priceYes: 0.66,
        change24h: 1.4,
        volume24h: '$240K',
        depth: 'Deep',
        evidenceCount: 6,
        lastEvidenceTime: '1d ago',
        deadline: '10d',
      },
      {
        id: 'e2',
        title: 'TVL > $1M',
        topic: 'Growth',
        claim: 'TVL exceeds $1,000,000',
        phase: 'P3',
        status: 'OPEN',
        priceYes: 0.53,
        change24h: -0.4,
        volume24h: '$180K',
        depth: 'Deep',
        evidenceCount: 1,
        lastEvidenceTime: '3d ago',
        deadline: '30d',
      },
    ],
  },
]
