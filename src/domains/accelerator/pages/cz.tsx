import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutGrid,
  List,
  MessageCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Flame,
  Zap,
  Star,
  Globe,
  Twitter,
  Github,
  Users,
  Plus,
  ArrowRight,
  Trophy,
  Wallet,
} from 'lucide-react'

import { WalletButton } from '../../../wallet/WalletButton'

// --- Types & Data (保持原有逻辑不变) ---

interface MemeToken {
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
  raisedUsd?: number
  participants?: number
}

const getCreatedDays = (createdAt: string, createdDays?: number): number => {
  if (typeof createdDays === 'number') return createdDays
  const m = createdAt.match(/(\d+)\s*(d|h)\s*ago/i)
  if (!m) return 0
  const n = parseInt(m[1], 10)
  return m[2].toLowerCase() === 'd' ? n : 0
}

type FundingTier = 'cold' | 'takeoff' | 'hot'

function getFundingTier(amount: number): FundingTier {
  if (amount < 1_000) return 'cold'
  if (amount < 10_000) return 'takeoff'
  return 'hot'
}

function getFundingPercent(amount: number): number {
  const tier = getFundingTier(amount)
  if (tier === 'cold') return Math.min(1, amount / 1_000)
  if (tier === 'takeoff') return Math.min(1, amount / 10_000)
  return Math.min(1, amount / 100_000)
}

// 优化后的进度条颜色
function getFundingBarClass(tier: FundingTier): string {
  if (tier === 'cold')
    return 'bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]'
  if (tier === 'takeoff')
    return 'bg-gradient-to-r from-orange-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
  return 'bg-gradient-to-r from-emerald-400 to-green-300 shadow-[0_0_10px_rgba(52,211,153,0.4)]'
}

const formatUSD = (amount: number): string => {
  if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`
  return `$${Math.round(amount)}`
}

const getFundsAmount = (token: MemeToken): number =>
  typeof token.raisedUsd === 'number' ? token.raisedUsd : token.marketCapValue
const getParticipants = (token: MemeToken): number =>
  typeof token.participants === 'number' ? token.participants : token.replies

const tokens: MemeToken[] = [
  {
    id: '1',
    name: 'Bobo The Bear',
    ticker: 'BOBO',
    creator: 'BcvKyq',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BcvKyq',
    createdAt: '1d ago',
    marketCap: '$11.3K',
    marketCapValue: 11300,
    description: 'Bobo the Bear is the patron saint of bearish markets.',
    image:
      'https://images.unsplash.com/photo-1585435465945-bef5a93f88a9?w=300&h=300&fit=crop',
    replies: 12,
    progress: 25,
    website: 'https://bobotoken.com',
    twitter: 'https://twitter.com/bobotoken',
    github: 'https://github.com/bobotoken',
  },
  {
    id: '2',
    name: 'Started From the Bottom',
    ticker: 'GRIND',
    creator: 'QQLR28',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QQLR28',
    createdAt: '1d ago',
    marketCap: '$13.9K',
    marketCapValue: 13900,
    description: 'Started from the bottom now we here.',
    image:
      'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=300&h=300&fit=crop',
    replies: 5,
    change: 0.0,
    progress: 30,
    createdDays: 547,
    twitter: 'https://twitter.com/liqpass',
    website: 'https://liqpass.com',
    github: 'https://github.com/liqpass',
    raisedUsd: 13900,
    participants: 5,
  },
  {
    id: '10',
    name: 'Galaxy Mind',
    ticker: 'GALAXY',
    creator: 'C1rcJJ',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=C1rcJJ',
    createdAt: '2d ago',
    marketCap: '$73.8K',
    marketCapValue: 73800,
    description: 'Expanding consciousness into the digital void.',
    image:
      'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=300&fit=crop',
    replies: 45,
    isLive: true,
    change: -1.3,
    progress: 85,
    website: 'https://galaxymind.com',
    twitter: 'https://twitter.com/galaxymind',
    github: 'https://github.com/galaxymind',
  },
  {
    id: '3',
    name: 'Will',
    ticker: 'WILL',
    creator: 'AmtWdC',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AmtWdC',
    createdAt: '8h ago',
    marketCap: '$4.0K',
    marketCapValue: 4000,
    description: 'will come on top will be him will succeed.',
    image:
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop',
    replies: 2,
    change: -0.27,
    progress: 10,
    website: 'https://willtoken.com',
    twitter: 'https://twitter.com/willtoken',
    github: 'https://github.com/willtoken',
  },
  {
    id: '5',
    name: 'Coomer',
    ticker: 'COOMER',
    creator: '2te3Ce',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2te3Ce',
    createdAt: '22h ago',
    marketCap: '$9.7K',
    marketCapValue: 9700,
    description: '$COOMER a legendary archetype representing every degen...',
    image:
      'https://images.unsplash.com/photo-1566576912902-1d6190a3d4d8?w=300&h=300&fit=crop',
    replies: 15,
    change: -7.02,
    progress: 22,
    website: 'https://coomertoken.com',
    twitter: 'https://twitter.com/coomertoken',
    github: 'https://github.com/coomertoken',
  },
  {
    id: '4',
    name: 'Galactica',
    ticker: 'GALA',
    creator: 'HdfWEE',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HdfWEE',
    createdAt: '2d ago',
    marketCap: '$8.1K',
    marketCapValue: 8100,
    description: 'The future of space travel and exploration.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop',
    replies: 8,
    progress: 18,
    website: 'https://galacticatoken.com',
    twitter: 'https://twitter.com/galacticatoken',
    github: 'https://github.com/galacticatoken',
  },
  {
    id: '8',
    name: 'Kabutops',
    ticker: 'KABU',
    creator: 'GG1NgQ',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GG1NgQ',
    createdAt: '21h ago',
    marketCap: '$15.9K',
    marketCapValue: 15900,
    description: 'Ancient power rising from the fossils.',
    image:
      'https://images.unsplash.com/photo-1613771404721-3c5b425876d90?w=300&h=300&fit=crop',
    replies: 20,
    progress: 35,
    website: 'https://kabutops.com',
    twitter: 'https://twitter.com/kabutops',
    github: 'https://github.com/kabutops',
  },
  {
    id: '9',
    name: 'POKELIQUID',
    ticker: 'POKE',
    creator: 'CpLEA5',
    creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CpLEA5',
    createdAt: '9h ago',
    marketCap: '$8.9K',
    marketCapValue: 8900,
    description: 'Liquid assets flowing through the ecosystem.',
    image:
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&h=300&fit=crop',
    replies: 4,
    progress: 19,
    website: 'https://pokeliquid.com',
    twitter: 'https://twitter.com/pokeliquid',
    github: 'https://github.com/pokeliquid',
  },
]

// --- Components ---

const FundingBar: React.FC<{ amount: number }> = ({ amount }) => {
  const tier = getFundingTier(amount)
  const percent = getFundingPercent(amount)
  const barClass = getFundingBarClass(tier)

  return (
    <div className='w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-3'>
      <div
        className={`h-full transition-all duration-500 ease-out ${barClass}`}
        style={{ width: `${percent * 100}%` }}
      />
    </div>
  )
}

const MemeCard: React.FC<{ token: MemeToken }> = ({ token }) => {
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/accelerator/meme-project/${token.id}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className='group relative bg-[#13141b]/80 backdrop-blur-sm hover:bg-[#181924] transition-all duration-300 rounded-xl p-3 border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(79,70,229,0.1)] cursor-pointer hover:-translate-y-1'
    >
      <div className='flex gap-3'>
        {/* Image Section */}
        <div className='relative flex-shrink-0'>
          <img
            src={token.image}
            alt={token.name}
            className='w-24 h-24 md:w-26 md:h-26 object-cover rounded-lg shadow-md group-hover:shadow-indigo-500/20 transition-shadow'
          />
          {token.isLive && (
            <div className='absolute -top-1.5 -left-1.5 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse'>
              LIVE
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className='flex flex-col flex-1 min-w-0 justify-between'>
          <div>
            <div className='flex items-start justify-between'>
              <h3 className='text-gray-100 font-bold text-sm leading-tight truncate pr-2 group-hover:text-indigo-400 transition-colors'>
                {token.name}
              </h3>
              <span className='text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded'>
                {token.ticker}
              </span>
            </div>

            <div className='mt-1.5 flex items-center gap-2 text-[11px] text-gray-400'>
              <span className='text-pink-400 font-semibold bg-pink-500/10 px-1.5 rounded-sm'>
                {getCreatedDays(token.createdAt, token.createdDays)}d
              </span>
              <div
                className='flex gap-1.5 ml-auto opacity-60 hover:opacity-100 transition-opacity'
                onClick={e => e.stopPropagation()}
              >
                {token.website && (
                  <a
                    href={token.website}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Globe className='w-3 h-3 hover:text-white' />
                  </a>
                )}
                {token.twitter && (
                  <a
                    href={token.twitter}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Twitter className='w-3 h-3 hover:text-blue-400' />
                  </a>
                )}
                {token.github && (
                  <a
                    href={token.github}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Github className='w-3 h-3 hover:text-gray-200' />
                  </a>
                )}
              </div>
            </div>

            <p className='mt-1.5 text-[11px] text-gray-400/80 line-clamp-2 leading-relaxed h-[34px]'>
              {token.description}
            </p>
          </div>

          <div className='mt-2'>
            {/* Stats Row */}
            <div className='flex items-center justify-between text-xs mb-1'>
              <span className='text-gray-400 text-[10px]'>Raised</span>
              <div className='flex items-center gap-3'>
                <span className='font-semibold text-gray-200'>
                  {formatUSD(getFundsAmount(token))}
                </span>
                <div className='flex items-center gap-1 text-gray-500'>
                  <Users className='w-3 h-3' />
                  <span className='text-[10px]'>{getParticipants(token)}</span>
                </div>
              </div>
            </div>
            <FundingBar amount={getFundsAmount(token)} />
          </div>
        </div>
      </div>
    </div>
  )
}

const LotteryProjectBoardPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeFilter, setActiveFilter] = useState('movers')

  const filters = [
    { id: 'movers', label: '热门波动', icon: Zap, color: 'text-yellow-400' },
    {
      id: 'live',
      label: '进行中',
      icon: Flame,
      color: 'text-red-500 animate-pulse',
    },
    { id: 'new', label: '新项目', icon: Star, color: 'text-emerald-400' },
    {
      id: 'market-cap',
      label: '高筹集',
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      id: 'mayhem',
      label: '最疯涨',
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    { id: 'oldest', label: '经典', icon: Clock, color: 'text-gray-400' },
    {
      id: 'last-reply',
      label: '热议',
      icon: MessageCircle,
      color: 'text-pink-400',
    },
  ]

  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      : 'grid grid-cols-1 gap-3'

  return (
    // 添加了顶部光晕背景
    <div className='min-h-screen bg-stripe-50 text-stripe-900 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] font-sans selection:bg-accent-500/30'>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
          display: flex;
          gap: 16px;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        .mask-gradient-b {
          mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }
      `}</style>

      {/* 顶部导航：磨砂效果 */}
      <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md'>
        <div className='max-w-7xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between text-sm'>
          <div className='flex items-center gap-8'>
            <div className='flex items-center gap-2 font-bold text-lg tracking-tight'>
              <div className='w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-accent-500/20'>
                <Trophy className='w-4 h-4' />
              </div>
              <span className='text-stripe-900'>
                DEGEN<span className='text-accent-500'>POOL</span>
              </span>
            </div>
            <nav className='hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-full border border-gray-200'>
              {['首页', '比赛区', '竞猜区', '1美元'].map(item => (
                <button
                  key={item}
                  className='px-4 py-1.5 rounded-full text-xs font-medium text-stripe-500 hover:text-stripe-900 hover:bg-white transition-colors shadow-sm'
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-2'>
              <Wallet className='w-3.5 h-3.5 text-stripe-500' />
              <WalletButton
                connectClassName='flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 hover:border-accent-500/50 hover:text-accent-600 transition-all shadow-sm text-stripe-900'
                wrongNetworkClassName='flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-amber-300 hover:border-amber-400 hover:text-amber-700 transition-all shadow-sm text-amber-700'
                chainClassName='flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 hover:border-accent-500/50 hover:text-accent-600 transition-all shadow-sm text-stripe-900'
                accountClassName='flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 hover:border-accent-500/50 hover:text-accent-600 transition-all shadow-sm text-stripe-900'
              />
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8'>
        {/* 顶部 Hero 区域：更丰富的渐变和布局 */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch'>
          {/* 左侧大卡片：奖池 */}
          <section className='relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between min-h-[220px] h-full group'>
            {/* 背景层 */}
            <div className='absolute inset-0 bg-gradient-to-br from-indigo-600 via-accent-600 to-purple-700 z-0'></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay"></div>
            <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-16 -mt-16 z-0'></div>

            <div className='relative z-10 flex flex-col h-full justify-between'>
              <div>
                <div className='flex items-center gap-2 text-indigo-100 mb-2'>
                  <span className='flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-white ring-1 ring-white/30'>
                    <DollarSign className='w-3 h-3' />
                  </span>
                  <span className='text-xs font-semibold tracking-wide uppercase'>
                    当前质押奖池 (USDC)
                  </span>
                </div>
                <div className='text-5xl font-black tracking-tighter text-white drop-shadow-sm'>
                  1,284.50
                </div>
                <div className='mt-3 text-sm text-indigo-100/90 flex items-center gap-2'>
                  <Clock className='w-3.5 h-3.5' />
                  <span>23:15 自动开奖</span>
                  <span className='w-1 h-1 rounded-full bg-white'></span>
                  <span>今日累积所有入场</span>
                </div>
              </div>

              <div className='mt-6 flex items-center gap-4'>
                <button className='relative overflow-hidden px-6 py-2.5 rounded-xl bg-white text-accent-700 text-sm font-bold shadow-lg hover:scale-105 transition-transform'>
                  <span className='relative z-10'>立即参与抽奖</span>
                  <div className='absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700'></div>
                </button>
                <div className='text-xs text-indigo-100/80 font-medium'>
                  单张门票：1 USDC <span className='mx-1'>·</span> 无上限
                </div>
              </div>
            </div>
          </section>

          {/* 右侧：数据概览 + 中奖名单 */}
          <aside className='card p-4 flex flex-col gap-3 shadow-stripe-lg border-gray-100 h-full'>
            <div>
              <div className='text-xs font-bold text-stripe-500 uppercase tracking-wider mb-2'>
                今日实时数据
              </div>
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-gray-50 rounded-xl p-2.5 border border-gray-100'>
                  <div className='text-[10px] text-stripe-500'>总奖池累计</div>
                  <div className='text-lg font-bold text-accent-600'>8,540</div>
                </div>
                <div className='bg-gray-50 rounded-xl p-2.5 border border-gray-100'>
                  <div className='text-[10px] text-stripe-500'>参与人数</div>
                  <div className='text-lg font-bold text-green-600'>842</div>
                </div>
              </div>
            </div>

            <div className='flex-1 min-h-0 flex flex-col'>
              <div className='text-xs font-bold text-stripe-500 uppercase tracking-wider mb-2 flex justify-between items-center'>
                <span>最新中奖</span>
                <span className='text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded animate-pulse'>
                  Live
                </span>
              </div>
              <div className='relative h-[90px] overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100'>
                {/* 轮播图背景装饰 */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400'></div>

                {/* 轮播内容 */}
                <div className='relative h-full overflow-x-hidden'>
                  <div className='animate-scroll p-3'>
                    {[
                      { amount: 80, address: '0x9C...80bc', time: '刚刚' },
                      { amount: 15, address: '0x9C...f121', time: '2分钟前' },
                      { amount: 120, address: '0x9C...0d3a', time: '5分钟前' },
                      { amount: 45, address: '0x9C...a2b1', time: '8分钟前' },
                      { amount: 90, address: '0x9C...c3d2', time: '12分钟前' },
                      { amount: 60, address: '0x9C...e4f3', time: '15分钟前' },
                    ].map((winner, idx) => (
                      <div
                        key={idx}
                        className='flex-shrink-0 w-48 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-300 rounded-lg px-3 py-2 border border-gray-100 hover:border-purple-200 hover:shadow-md'
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={`w-6 h-6 rounded-md bg-gradient-to-br ${idx % 3 === 0 ? 'from-orange-400 to-red-500' : idx % 3 === 1 ? 'from-blue-400 to-indigo-500' : 'from-purple-400 to-pink-500'} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                          >
                            {idx + 1}
                          </div>
                          <div className='flex flex-col'>
                            <span className='text-xs text-stripe-900 font-mono'>
                              {winner.address}
                            </span>
                            <span className='text-[10px] text-stripe-400'>
                              {winner.time}
                            </span>
                          </div>
                        </div>
                        <div className='flex flex-col items-end'>
                          <span className='text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded'>
                            +{winner.amount} USDC
                          </span>
                          <span className='text-[10px] text-stripe-400 mt-1'>
                            中奖
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 搜索与工具栏 */}
        <div className='sticky top-[60px] z-40 bg-white/90 backdrop-blur-xl py-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:bg-transparent lg:static lg:backdrop-filter-none transition-all'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            {/* 标题 */}
            <div>
              <h2 className='text-xl font-bold flex items-center gap-2 text-stripe-900'>
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500'>
                  10亿美金
                </span>{' '}
                候选池
              </h2>
              <p className='text-xs text-stripe-500 mt-1'>
                用 <span className='text-stripe-900 font-bold'>$1</span>{' '}
                押注下一个独角兽
              </p>
            </div>

            {/* 搜索框 */}
            <div className='flex items-center gap-3 flex-1 md:justify-end'>
              <div className='relative group w-full md:w-64'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500'></div>
                <div className='relative flex items-center bg-white rounded-lg border border-gray-200'>
                  <Search className='w-4 h-4 text-stripe-400 absolute left-3' />
                  <input
                    type='text'
                    placeholder='Search tokens...'
                    className='w-full bg-transparent border-none text-sm text-stripe-900 placeholder-stripe-400 pl-9 pr-4 py-2 focus:ring-0 rounded-lg'
                  />
                </div>
              </div>

              <button onClick={() => navigate('/accelerator/submit')} className='flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-stripe-900 text-white text-xs font-bold px-4 py-2.5 hover:bg-stripe-800 transition-colors shadow-lg shadow-stripe-sm'>
                <Plus className='w-4 h-4' />
                <span>创建项目</span>
              </button>
            </div>
          </div>

          {/* 筛选 Tabs */}
          <div className='mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4'>
            <div className='flex flex-wrap gap-2'>
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'text-white bg-stripe-900 shadow-md'
                      : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-100'
                  }`}
                >
                  <filter.icon
                    className={`w-3.5 h-3.5 ${activeFilter === filter.id ? 'text-white' : filter.color} transition-transform group-hover:scale-110`}
                  />
                  {filter.label}
                </button>
              ))}
            </div>

            <div className='flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200'>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white text-stripe-900 shadow-sm border border-gray-100' : 'text-stripe-400 hover:text-stripe-600'}`}
              >
                <LayoutGrid className='w-4 h-4' />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white text-stripe-900 shadow-sm border border-gray-100' : 'text-stripe-400 hover:text-stripe-600'}`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>
          </div>
        </div>

        {/* 项目列表 */}
        <section className='pb-12 min-h-[500px]'>
          <div className={gridClass}>
            {tokens.map(token => (
              <MemeCard key={token.id} token={token} />
            ))}

            {/* View More Card */}
            <div className='flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-6 text-stripe-500 hover:text-stripe-700 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group shadow-sm'>
              <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-stripe-sm border border-gray-100'>
                <ArrowRight className='w-5 h-5 text-accent-500' />
              </div>
              <span className='text-sm font-medium'>查看更多项目</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LotteryProjectBoardPage
