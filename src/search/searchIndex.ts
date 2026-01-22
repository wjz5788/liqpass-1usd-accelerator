export type SearchType = 'project' | 'market' | 'evidence' | 'page'

export type SearchItem = {
  id: string
  type: SearchType
  title: string
  subtitle?: string
  tags?: string[]
  href: string
  meta?: Record<string, string | number>
}

export const SEARCH_INDEX: SearchItem[] = [
  {
    id: 'p_meme_5',
    type: 'project',
    title: 'Coomer',
    subtitle: 'COOMER · Heat 26.4 · Phase P1',
    tags: ['meme', 'accelerator', 'p1'],
    href: '/accelerator/meme-project/5',
  },
  {
    id: 'p_meme_1',
    type: 'project',
    title: 'Meme Project #1',
    subtitle: 'Accelerator · Meme',
    tags: ['meme', 'accelerator'],
    href: '/accelerator/meme-project/1',
  },
  {
    id: 'm_meme_5_hackathon',
    type: 'market',
    title: 'Hackathon',
    subtitle: 'Coomer · YES/NO market',
    tags: ['milestone', 'trade'],
    href: '/accelerator/meme-project/5?market=hackathon',
  },
  {
    id: 'm_meme_5_shipping',
    type: 'market',
    title: 'Shipping',
    subtitle: 'Coomer · YES/NO market',
    tags: ['milestone', 'trade'],
    href: '/accelerator/meme-project/5?market=shipping',
  },
  {
    id: 'e_demo_link',
    type: 'evidence',
    title: '提交证据：Demo 链接',
    subtitle: 'by User 9C...80bc · 10m ago',
    tags: ['evidence'],
    href: '/accelerator/meme-project/5?tab=evidence',
  },
  {
    id: 'e_multisig_2of5',
    type: 'evidence',
    title: '多签签名进度：2/5',
    subtitle: 'by Resolver · 5m ago',
    tags: ['resolver'],
    href: '/accelerator/meme-project/5?tab=evidence',
  },
  {
    id: 'pg_heat',
    type: 'page',
    title: '热度榜',
    subtitle: '发现热项目',
    href: '/accelerator/heat-rank',
  },
  {
    id: 'pg_1usd',
    type: 'page',
    title: '$1',
    subtitle: 'Meme Board',
    href: '/accelerator/meme-board',
  },
  {
    id: 'pg_arena',
    type: 'page',
    title: '比赛区',
    subtitle: '挑战/任务/对赌',
    href: '/arena',
  },
  {
    id: 'pg_insurance',
    type: 'page',
    title: '保险区',
    subtitle: '爆仓保 / LiqPass',
    href: '/insurance',
  },
]

export function typeLabel(t: SearchType) {
  if (t === 'project') return 'PROJECT'
  if (t === 'market') return 'MARKET'
  if (t === 'evidence') return 'EVIDENCE'
  return 'PAGE'
}
