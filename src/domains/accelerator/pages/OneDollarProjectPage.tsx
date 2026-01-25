import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Globe,
  Twitter,
  MessageCircle,
  Users,
  Play,
  ExternalLink,
  Share2,
  Menu,
  Search,
  Settings,
  Github,
  Heart,
  Image as ImageIcon,
  Star,
} from 'lucide-react'

import { tokens } from '../../../services/mock/memeData'
import type { MemeToken } from '../../../domain/meme'
import type { EventMarket, Phase } from '../../../domain/market'
import { calcHeat, inferPhase } from '../../../services/utils/heatScore'
import { calcEffectiveB } from '../../../services/utils/adaptiveB'
import MarketParamsPanel from '../../../components/features/ProjectMarket/MarketParamsPanel'

import { ActivityTimeline } from './components/ActivityTimeline'
import { DiscussionPreview } from './components/DiscussionPreview'
import { MoneyFlowCard } from './components/MoneyFlowCard'
import { UserEarningsCard } from './components/UserEarningsCard'
import { VideoModal } from './components/VideoModal'
import {
  memeTokenToProject,
  mockActivityLogsFromToken,
  mockPoolFinancesFromToken,
  mockUserEarningsFromToken,
} from './adapters/memeProjectAdapters'

const OneDollarProjectPageLikePump: React.FC = () => {
  const { id: _id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'video' | 'website' | 'github' | 'chart'>(
    'video'
  )
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<
    'overview' | 'milestones' | 'discussion' | 'activity'
  >('overview')
  const [isFav, setIsFav] = useState(false)

  const [selectedMilestoneKey, setSelectedMilestoneKey] =
    useState<string>('hackathon')
  const [openMilestoneKey, setOpenMilestoneKey] = useState<string | null>(null)
  const [milestoneTradeMode, setMilestoneTradeMode] = useState<'buy' | 'sell'>(
    'buy'
  )
  const [milestoneTradePick, setMilestoneTradePick] = useState<'yes' | 'no'>(
    'yes'
  )
  const [milestoneTradeAmountUsd, setMilestoneTradeAmountUsd] =
    useState<string>('20')

  const token: MemeToken = tokens.find(t => t.id === (_id ?? '')) ?? tokens[0]
  const { score: heatScore } = calcHeat(token)

  const [phase, setPhase] = useState<Phase>(inferPhase(token))
  const [baseB, setBaseB] = useState<number>(60)
  const [autoB, setAutoB] = useState<boolean>(true)

  const effectiveB = autoB
    ? calcEffectiveB({
        baseB,
        phase,
        volume24h: token.raisedUsd ?? token.marketCapValue ?? 0,
        traders24h: token.participants ?? 0,
        absChange: Math.abs(token.change ?? 0),
      })
    : baseB

  // Use the new detail layout for all meme projects.
  const useDocDetailLayout = true

  const docMarkets: EventMarket[] = [
    {
      key: 'hackathon',
      title: 'Hackathon',
      desc: '是否在公开场合/黑客松拿到里程碑或广泛曝光',
      pYes: Math.min(0.95, Math.max(0.05, 0.25 + (token.progress ?? 0) / 200)),
      stats: {
        volume24h: token.raisedUsd ?? token.marketCapValue ?? 0,
        traders24h: token.participants ?? 0,
        trades24h: Math.max(1, token.replies ?? 0),
      },
    },
    {
      key: 'shipping',
      title: 'Shipping',
      desc: '是否按期交付可用版本（Demo/Alpha/Beta/Prod）',
      pYes: Math.min(0.95, Math.max(0.05, 0.2 + (token.progress ?? 0) / 170)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.8,
        traders24h: Math.max(0, (token.participants ?? 0) - 1),
        trades24h: Math.max(1, (token.replies ?? 0) - 1),
      },
    },
    {
      key: 'paidUsers',
      title: 'Paid Users',
      desc: '是否出现真实付费用户（可验证证据）',
      pYes: Math.min(0.95, Math.max(0.05, 0.15 + (token.progress ?? 0) / 160)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.6,
        traders24h: Math.max(0, (token.participants ?? 0) - 2),
        trades24h: Math.max(1, (token.replies ?? 0) - 2),
      },
    },
    {
      key: 'derivativeCount',
      title: 'Derivative Count',
      desc: '是否被其他项目复用/衍生（引用/借鉴数量增长）',
      pYes: Math.min(0.95, Math.max(0.05, 0.1 + (token.progress ?? 0) / 140)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.5,
        traders24h: Math.max(0, (token.participants ?? 0) - 1),
        trades24h: Math.max(1, token.replies ?? 0),
      },
    },
    {
      key: 'governance',
      title: 'Governance / Risk',
      desc: '是否存在黑幕/操纵/安全事故等风险信号',
      pYes: Math.min(0.95, Math.max(0.05, 0.3 - (token.progress ?? 0) / 300)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.4,
        traders24h: Math.max(0, token.participants ?? 0),
        trades24h: Math.max(1, token.replies ?? 0),
      },
    },
  ]

  if (useDocDetailLayout) {
    const projectDoc = memeTokenToProject(token)
    const earnings = mockUserEarningsFromToken(token)
    const finances = mockPoolFinancesFromToken(token)
    const activities = mockActivityLogsFromToken(token)

    const scrollTo = (id: typeof activeSection) => {
      const el = document.getElementById(id)
      if (!el) return

      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveSection(id)
    }

    const handleShareProject = async () => {
      const shareUrl = window.location.href
      if (navigator.share) {
        try {
          await navigator.share({ title: projectDoc.name, url: shareUrl })
        } catch (error) {
          console.warn('Share failed:', error)
        }
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert('Copied to clipboard')
      }
    }

    return (
      <div className='min-h-screen bg-stripe-50 text-stripe-900 font-sans selection:bg-green-500/30 pb-20'>
        <div className='bg-white border-b border-gray-200 sticky top-0 z-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-between py-3'>
              <button
                onClick={() => navigate(-1)}
                className='flex items-center gap-2 text-stripe-500 hover:text-stripe-900 transition-colors text-sm font-medium'
              >
                <ArrowLeft className='h-4 w-4' />
                <span>返回榜单</span>
              </button>

              <div className='flex items-center gap-3'>
                <button
                  type='button'
                  onClick={() => setIsFav(v => !v)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${isFav ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-white hover:bg-gray-50 border-gray-200 text-stripe-600'}`}
                >
                  <Star
                    className={`h-3.5 w-3.5 ${isFav ? 'fill-yellow-400' : ''}`}
                  />
                  收藏
                </button>

                <button
                  onClick={handleShareProject}
                  className='flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 rounded-full text-xs font-bold transition-colors text-stripe-600 border border-gray-200'
                >
                  <Share2 className='h-3.5 w-3.5' />
                  分享
                </button>

                <div className='flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full border border-gray-200'>
                  <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                  <span className='text-xs font-bold text-stripe-700'>
                    MVP 进行中
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='card overflow-hidden mb-6'>
            <div className='flex flex-col md:flex-row'>
              <div className='flex-1 p-6 md:border-r border-gray-100'>
                <div className='mb-4'>
                  <h1 className='text-2xl font-black text-stripe-900 mb-2'>
                    {projectDoc.name}
                  </h1>
                  <p className='text-stripe-600 font-medium'>
                    {projectDoc.tagline}
                  </p>
                  <div className='mt-3 flex items-center gap-2 flex-wrap'>
                    <span className='text-xs px-2 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200'>
                      {projectDoc.chain}
                    </span>
                    <span className='text-xs px-2 py-1 rounded-full border bg-orange-50 text-orange-700 border-orange-200'>
                      Heat {heatScore}
                    </span>
                    <span className='text-xs text-stripe-400 ml-1'>
                      Created {projectDoc.createdAt}
                    </span>
                  </div>
                </div>

                <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 border-t border-gray-100 pt-4'>
                  <div>
                    <div className='text-lg font-bold text-stripe-900'>
                      {projectDoc.supporters}
                    </div>
                    <div className='text-xs text-stripe-500 uppercase'>
                      支持者
                    </div>
                  </div>
                  <div>
                    <div className='text-lg font-bold text-stripe-900'>
                      {projectDoc.chain}
                    </div>
                    <div className='text-xs text-stripe-500 uppercase'>
                      生态
                    </div>
                  </div>
                  <div>
                    <div className='text-lg font-bold text-stripe-900'>
                      {projectDoc.totalTickets ?? projectDoc.raisedUsd}
                    </div>
                    <div className='text-xs text-stripe-500 uppercase'>
                      票数
                    </div>
                  </div>
                  <div>
                    <div className='text-lg font-bold text-green-600'>
                      {Math.min(
                        (projectDoc.raisedUsd / (projectDoc.poolTarget || 1)) *
                          100,
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className='text-xs text-stripe-500 uppercase'>
                      完成度
                    </div>
                  </div>
                </div>

                <div>
                  <div className='flex justify-between text-xs text-stripe-500 mb-1 font-medium'>
                    <span>募集进度</span>
                    <span>
                      ${projectDoc.raisedUsd} / ${projectDoc.poolTarget}
                    </span>
                  </div>
                  <div className='w-full bg-gray-100 rounded-full h-2.5 overflow-hidden'>
                    <div
                      className='bg-green-500 h-2.5 rounded-full'
                      style={{
                        width: `${Math.min(
                          (projectDoc.raisedUsd /
                            (projectDoc.poolTarget || 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className='w-full md:w-80 bg-gray-50/50 p-6 flex flex-col justify-between'>
                <div>
                  <div className='text-xs font-bold text-stripe-400 uppercase tracking-wider mb-3'>
                    项目状态
                  </div>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
                    <span className='font-bold text-stripe-900'>
                      P1 Hackathon 进行中
                    </span>
                  </div>
                  <div className='text-sm text-stripe-500'>
                    截止：2024-02-15
                  </div>
                </div>

                <div className='mt-6 pt-4 border-t border-gray-200'>
                  <div className='text-xs text-stripe-400 mb-2'>快捷入口</div>
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => scrollTo('milestones')}
                      className='px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors'
                    >
                      查看证据
                    </button>
                    <button
                      onClick={() => scrollTo('discussion')}
                      className='px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors'
                    >
                      查看讨论
                    </button>
                    <button
                      onClick={() => scrollTo('activity')}
                      className='px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors'
                    >
                      查看资金
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 relative'>
            <div className='lg:col-span-2 flex flex-col gap-8'>
              <div className='sticky top-[3.75rem] z-40 bg-stripe-50/95 backdrop-blur-sm py-2 -mx-2 px-2'>
                <div className='flex items-center gap-1 bg-white/80 p-1 rounded-lg border border-gray-200 shadow-sm w-fit'>
                  {(
                    [
                      'overview',
                      'milestones',
                      'discussion',
                      'activity',
                    ] as const
                  ).map(tab => (
                    <button
                      key={tab}
                      onClick={() => scrollTo(tab)}
                      className={`px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all ${activeSection === tab ? 'bg-stripe-900 text-white shadow-sm' : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-100'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className='space-y-6'>
                <div
                  id='overview'
                  className='card overflow-hidden scroll-mt-20'
                >
                  <div className='px-4 py-3 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50'>
                    <button
                      type='button'
                      onClick={() => setActiveTab('video')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${activeTab === 'video' ? 'bg-white text-stripe-900 border-gray-300 shadow-sm' : 'text-stripe-500 border-transparent hover:bg-gray-100'}`}
                    >
                      <Play className='w-4 h-4' />
                      Video
                    </button>
                    <button
                      type='button'
                      onClick={() => setActiveTab('website')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${activeTab === 'website' ? 'bg-white text-stripe-900 border-gray-300 shadow-sm' : 'text-stripe-500 border-transparent hover:bg-gray-100'}`}
                    >
                      <Globe className='w-4 h-4' />
                      Website
                    </button>
                    <button
                      type='button'
                      onClick={() => setActiveTab('github')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${activeTab === 'github' ? 'bg-white text-stripe-900 border-gray-300 shadow-sm' : 'text-stripe-500 border-transparent hover:bg-gray-100'}`}
                    >
                      <Github className='w-4 h-4' />
                      GitHub
                    </button>
                    <button
                      type='button'
                      onClick={() => setActiveTab('chart')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${activeTab === 'chart' ? 'bg-white text-stripe-900 border-gray-300 shadow-sm' : 'text-stripe-500 border-transparent hover:bg-gray-100'}`}
                    >
                      <Star className='w-4 h-4' />
                      Chart
                    </button>
                  </div>

                  <div className='relative'>
                    {activeTab === 'video' && (
                      <button
                        type='button'
                        onClick={() => setIsVideoModalOpen(true)}
                        className='w-full text-left group'
                      >
                        <div className='h-[340px] bg-gray-900 flex items-center justify-center relative overflow-hidden'>
                          <div className='absolute inset-0 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900' />
                          <div className='relative z-10 flex flex-col items-center gap-4 transition-transform duration-300 group-hover:scale-105'>
                            <div className='w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all'>
                              <Play
                                className='w-6 h-6 text-white ml-1'
                                fill='currentColor'
                              />
                            </div>
                            <div className='text-center'>
                              <div className='text-base font-bold text-white mb-1'>
                                Watch Project Video
                              </div>
                              <div className='text-xs text-gray-400'>
                                2:15 · External
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    )}

                    {activeTab === 'website' && (
                      <div className='p-8 h-[340px] bg-gray-50 flex flex-col items-center justify-center text-center'>
                        <Globe className='w-12 h-12 text-gray-300 mb-4' />
                        <div className='text-sm text-stripe-500 mb-2'>
                          Visit Official Website
                        </div>
                        {projectDoc.website ? (
                          <a
                            href={projectDoc.website}
                            target='_blank'
                            rel='noreferrer'
                            className='text-blue-600 hover:text-blue-800 font-bold text-xl hover:underline break-all'
                          >
                            {projectDoc.website}
                          </a>
                        ) : (
                          <div className='text-stripe-400'>No website</div>
                        )}
                      </div>
                    )}

                    {activeTab === 'github' && (
                      <div className='p-8 h-[340px] bg-gray-50 flex flex-col items-center justify-center text-center'>
                        <Github className='w-12 h-12 text-gray-300 mb-4' />
                        <div className='text-sm text-stripe-500 mb-2'>
                          Browse Source Code
                        </div>
                        {projectDoc.github ? (
                          <a
                            href={projectDoc.github}
                            target='_blank'
                            rel='noreferrer'
                            className='text-stripe-900 hover:text-black font-bold text-xl hover:underline break-all'
                          >
                            {projectDoc.github}
                          </a>
                        ) : (
                          <div className='text-stripe-400'>No repo</div>
                        )}
                      </div>
                    )}

                    {activeTab === 'chart' && (
                      <div className='p-4 h-[340px] bg-white'>
                        <div className='flex justify-between items-center mb-4'>
                          <h3 className='font-bold text-stripe-900'>价格曲线</h3>
                          <span className='text-sm font-medium text-stripe-500'>b={effectiveB.toFixed(1)}</span>
                        </div>
                        <div className='w-full h-[280px] relative'>
                          {/* 价格曲线图表 */}
                          <svg viewBox='0 0 800 240' className='w-full h-full'>
                            {/* X轴 */}
                            <line x1='60' y1='220' x2='740' y2='220' stroke='#E5E7EB' strokeWidth='1' />
                            {/* Y轴 */}
                            <line x1='60' y1='20' x2='60' y2='220' stroke='#E5E7EB' strokeWidth='1' />
                            
                            {/* Y轴刻度 */}
                            {[0, 15, 30, 45, 60].map((value, index) => (
                              <g key={index}>
                                <line x1='58' y1={220 - (value / 60) * 200} x2='60' y2={220 - (value / 60) * 200} stroke='#E5E7EB' strokeWidth='1' />
                                <text x='50' y={224 - (value / 60) * 200} textAnchor='end' className='text-xs text-stripe-500'>{value}</text>
                              </g>
                            ))}
                            
                            {/* X轴刻度 */}
                            {[3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99].map((value, index) => (
                              <g key={index}>
                                <line x1={60 + (value / 100) * 680} y1='220' x2={60 + (value / 100) * 680} y2='222' stroke='#E5E7EB' strokeWidth='1' />
                                <text x={60 + (value / 100) * 680} y='236' textAnchor='middle' className='text-xs text-stripe-500'>{value}</text>
                              </g>
                            ))}
                            
                            {/* 价格曲线 */}
                            <path 
                              d={`M 60,${220 - (45 / 60) * 200} Q 300,${220 - (15 / 60) * 200} 500,${220 - (15 / 60) * 200} T 740,${220 - (45 / 60) * 200}`} 
                              fill='none' 
                              stroke='#6366F1' 
                              strokeWidth='2' 
                            />
                            
                            {/* 当前点 */}
                            <circle cx='500' cy={220 - (15 / 60) * 200} r='4' fill='#6366F1' />
                          </svg>
                          
                          {/* 底部标签 */}
                          <div className='flex justify-between items-center mt-2'>
                            <span className='text-sm font-medium text-stripe-500'>当前</span>
                            <span className='text-sm font-bold text-stripe-900'>50.00%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className='card p-6'>
                  <h3 className='font-bold text-stripe-900 mb-4 text-lg'>
                    项目目标
                  </h3>
                  <ul className='space-y-2 list-disc pl-5 text-stripe-700 text-sm leading-relaxed marker:text-stripe-400'>
                    {projectDoc.milestones.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>

                  <h3 className='font-bold text-stripe-900 mt-6 mb-4 text-lg'>
                    资金用途
                  </h3>
                  <p className='text-stripe-700 text-sm leading-relaxed'>
                    {projectDoc.fundingPlan || 'TBD'}
                  </p>
                </div>
              </div>

              <div id='milestones' className='scroll-mt-20'>
                <div className='card p-4'>
                  <div className='flex items-center justify-between mb-3'>
                    <div>
                      <h3 className='font-bold text-sm text-stripe-900'>
                        阶段目标（Milestones）
                      </h3>
                      <p className='text-xs text-stripe-500 mt-0.5'>
                        一行一个阶段，点行看详情；Buy Yes/No 会同步右侧面板
                      </p>
                    </div>
                    <div className='text-xs text-stripe-400'>
                      Buy Yes / Buy No
                    </div>
                  </div>

                  <div className='space-y-3'>
                    {docMarkets.map(m => {
                      const isOpen = openMilestoneKey === m.key
                      const prob = Math.max(0, Math.min(1, m.pYes ?? 0)) * 100
                      const yesCents = prob
                      const noCents = 100 - prob
                      const up = (m.pYes ?? 0) >= 0.5

                      return (
                        <div
                          key={m.key}
                          className={`rounded-xl transition ${isOpen ? 'ring-2 ring-green-500/10 border border-green-500/30 shadow-sm' : ''}`}
                        >
                          <div
                            role='button'
                            tabIndex={0}
                            className='relative flex flex-col w-full bg-white border border-gray-200 rounded-xl transition-all hover:border-gray-300 hover:shadow-sm overflow-hidden group text-left'
                            onClick={() => {
                              setSelectedMilestoneKey(m.key)
                              setOpenMilestoneKey(cur =>
                                cur === m.key ? null : m.key
                              )
                            }}
                            onKeyDown={e => {
                              if (e.key !== 'Enter' && e.key !== ' ') return
                              e.preventDefault()
                              setSelectedMilestoneKey(m.key)
                              setOpenMilestoneKey(cur =>
                                cur === m.key ? null : m.key
                              )
                            }}
                          >
                            <div className='flex items-center justify-between p-4 cursor-pointer select-none'>
                              <div className='flex items-center gap-4 min-w-0'>
                                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-xs font-bold text-stripe-500 border border-gray-100'>
                                  {m.key.toUpperCase().slice(0, 3)}
                                </div>
                                <div className='flex flex-col min-w-0'>
                                  <div className='truncate text-sm font-bold text-stripe-900 group-hover:text-blue-600 transition-colors'>
                                    {m.title}
                                  </div>
                                  <div className='truncate text-xs text-stripe-400 mt-0.5'>
                                    {m.desc}
                                  </div>
                                </div>
                              </div>

                              <div className='flex items-center gap-4 shrink-0'>
                                <div className='text-right'>
                                  <div className='font-mono text-lg font-bold text-stripe-900 tracking-tight'>
                                    {Math.round(prob)}%
                                  </div>
                                  <div
                                    className={`hidden sm:block font-mono text-xs font-medium ${up ? 'text-green-600' : 'text-red-600'}`}
                                  >
                                    {up ? '▲' : '▼'}{' '}
                                    {Math.abs(Math.round(prob - 50))}%
                                  </div>
                                </div>

                                <div className='hidden lg:flex items-center gap-2'>
                                  <button
                                    type='button'
                                    className='px-3 py-1.5 rounded-lg bg-green-50 text-xs font-bold text-green-700 border border-green-100 hover:bg-green-100 hover:border-green-200 transition-colors'
                                    onClick={e => {
                                      e.stopPropagation()
                                      setSelectedMilestoneKey(m.key)
                                      setMilestoneTradePick('yes')
                                    }}
                                  >
                                    Buy Yes {yesCents.toFixed(1)}¢
                                  </button>
                                  <button
                                    type='button'
                                    className='px-3 py-1.5 rounded-lg bg-red-50 text-xs font-bold text-red-700 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors'
                                    onClick={e => {
                                      e.stopPropagation()
                                      setSelectedMilestoneKey(m.key)
                                      setMilestoneTradePick('no')
                                    }}
                                  >
                                    Buy No {noCents.toFixed(1)}¢
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {isOpen ? (
                            <div className='border-t border-gray-100 bg-gray-50/50 p-4 animate-in fade-in slide-in-from-top-1 duration-200'>
                              <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <div className='p-3 rounded-lg border border-gray-200 bg-white shadow-sm'>
                                  <div className='text-[10px] uppercase tracking-wider text-stripe-400 font-semibold mb-1'>
                                    说明
                                  </div>
                                  <div className='text-sm text-stripe-700 leading-relaxed'>
                                    {m.desc}
                                  </div>
                                </div>
                                <div className='p-3 rounded-lg border border-gray-200 bg-white shadow-sm'>
                                  <div className='text-[10px] uppercase tracking-wider text-stripe-400 font-semibold mb-1'>
                                    验证方式
                                  </div>
                                  <div className='text-sm text-stripe-700 leading-relaxed'>
                                    TBD
                                  </div>
                                </div>
                                <div className='p-3 rounded-lg border border-gray-200 bg-white shadow-sm'>
                                  <div className='text-[10px] uppercase tracking-wider text-stripe-400 font-semibold mb-1'>
                                    证据链接
                                  </div>
                                  <div className='text-sm text-stripe-700 leading-relaxed'>
                                    TBD
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div id='discussion' className='scroll-mt-20'>
                <DiscussionPreview _projectId={projectDoc.id} />
              </div>

              <div id='activity' className='scroll-mt-20'>
                <ActivityTimeline activities={activities} />
              </div>
            </div>

            <div className='lg:col-span-1'>
              <div className='sticky top-24 flex flex-col gap-4'>
                <div className='card overflow-hidden'>
                  <div className='p-4 border-b border-gray-100 bg-white'>
                    <div className='text-sm font-bold text-stripe-900'>
                      Milestone Trade
                    </div>
                    <div className='text-xs text-stripe-400 mt-0.5'>
                      {
                        docMarkets.find(m => m.key === selectedMilestoneKey)
                          ?.title
                      }
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-3 p-4 pb-0'>
                    {(() => {
                      const m =
                        docMarkets.find(x => x.key === selectedMilestoneKey) ??
                        docMarkets[0]
                      const prob = Math.max(0, Math.min(1, m.pYes ?? 0)) * 100
                      const yesCents = prob
                      const noCents = 100 - prob

                      const yesActive = milestoneTradePick === 'yes'
                      const noActive = milestoneTradePick === 'no'

                      return (
                        <>
                          <button
                            type='button'
                            className={`relative flex flex-col items-start p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${yesActive ? 'border-green-500 bg-green-50/30 ring-1 ring-green-500/20' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}`}
                            onClick={() => setMilestoneTradePick('yes')}
                          >
                            <div
                              className={`text-xs font-bold mb-1 uppercase tracking-wide ${yesActive ? 'text-green-700' : 'text-stripe-500'}`}
                            >
                              YES
                            </div>
                            <div className='font-mono text-lg font-bold text-stripe-900'>
                              {yesCents.toFixed(1)}¢
                            </div>
                          </button>

                          <button
                            type='button'
                            className={`relative flex flex-col items-start p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${noActive ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500/20' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}`}
                            onClick={() => setMilestoneTradePick('no')}
                          >
                            <div
                              className={`text-xs font-bold mb-1 uppercase tracking-wide ${noActive ? 'text-red-700' : 'text-stripe-500'}`}
                            >
                              NO
                            </div>
                            <div className='font-mono text-lg font-bold text-stripe-900'>
                              {noCents.toFixed(1)}¢
                            </div>
                          </button>
                        </>
                      )
                    })()}
                  </div>

                  <div className='flex border-b border-gray-100 mt-4'>
                    <button
                      onClick={() => setMilestoneTradeMode('buy')}
                      className={`flex-1 py-3 text-sm font-bold transition-colors ${milestoneTradeMode === 'buy' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-stripe-400 hover:text-stripe-600'}`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setMilestoneTradeMode('sell')}
                      className={`flex-1 py-3 text-sm font-bold transition-colors ${milestoneTradeMode === 'sell' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-stripe-400 hover:text-stripe-600'}`}
                    >
                      Sell
                    </button>
                  </div>

                  <div className='p-4 space-y-4'>
                    <div className='relative'>
                      <input
                        type='number'
                        value={milestoneTradeAmountUsd}
                        onChange={e =>
                          setMilestoneTradeAmountUsd(e.target.value)
                        }
                        placeholder='0'
                        className='w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-right text-lg font-mono focus:border-gray-300 outline-none transition-colors text-stripe-900'
                      />
                      <span className='absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stripe-500'>
                        USD
                      </span>
                    </div>

                    <button
                      className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] ${milestoneTradePick === 'yes' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
                    >
                      {milestoneTradeMode === 'buy' ? 'Buy' : 'Sell'}{' '}
                      {milestoneTradePick.toUpperCase()}
                    </button>
                  </div>
                </div>

                <UserEarningsCard earnings={earnings} />
                <MoneyFlowCard finances={finances} />

                {projectDoc.hasVideo && projectDoc.videoUrl ? (
                  <VideoModal
                    videoUrl={projectDoc.videoUrl}
                    isOpen={isVideoModalOpen}
                    onClose={() => setIsVideoModalOpen(false)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const markets: EventMarket[] = docMarkets

  const marketsLegacy: EventMarket[] = markets

  const marketsLegacyUnused: EventMarket[] = [
    {
      key: 'hackathon',
      title: 'Hackathon',
      desc: '是否在公开场合/黑客松拿到里程碑或广泛曝光',
      pYes: Math.min(0.95, Math.max(0.05, 0.25 + (token.progress ?? 0) / 200)),
      stats: {
        volume24h: token.raisedUsd ?? token.marketCapValue ?? 0,
        traders24h: token.participants ?? 0,
        trades24h: Math.max(1, token.replies ?? 0),
      },
    },
    {
      key: 'shipping',
      title: 'Shipping',
      desc: '是否按期交付可用版本（Demo/Alpha/Beta/Prod）',
      pYes: Math.min(0.95, Math.max(0.05, 0.2 + (token.progress ?? 0) / 170)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.8,
        traders24h: Math.max(0, (token.participants ?? 0) - 1),
        trades24h: Math.max(1, (token.replies ?? 0) - 1),
      },
    },
    {
      key: 'paidUsers',
      title: 'Paid Users',
      desc: '是否出现真实付费用户（可验证证据）',
      pYes: Math.min(0.95, Math.max(0.05, 0.15 + (token.progress ?? 0) / 160)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.6,
        traders24h: Math.max(0, (token.participants ?? 0) - 2),
        trades24h: Math.max(1, (token.replies ?? 0) - 2),
      },
    },
    {
      key: 'derivativeCount',
      title: 'Derivative Count',
      desc: '是否被其他项目复用/衍生（引用/借鉴数量增长）',
      pYes: Math.min(0.95, Math.max(0.05, 0.1 + (token.progress ?? 0) / 140)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.5,
        traders24h: Math.max(0, (token.participants ?? 0) - 1),
        trades24h: Math.max(1, token.replies ?? 0),
      },
    },
    {
      key: 'governance',
      title: 'Governance / Risk',
      desc: '是否存在黑幕/操纵/安全事故等风险信号',
      pYes: Math.min(0.95, Math.max(0.05, 0.3 - (token.progress ?? 0) / 300)),
      stats: {
        volume24h: (token.raisedUsd ?? token.marketCapValue ?? 0) * 0.4,
        traders24h: Math.max(0, token.participants ?? 0),
        trades24h: Math.max(1, token.replies ?? 0),
      },
    },
  ]

  const project = {
    name: token.name,
    ticker: token.ticker,
    creator: token.creator,
    creatorAddress: token.creator,
    createdAt: token.createdAt,
    marketCap: token.marketCap,
    marketCapValue: token.marketCapValue,
    replies: token.replies,
    description: token.description,
    image: token.image,
    website: token.website,
    twitter: token.twitter,
    telegram: token.telegram,
    github: token.github,
    bondingCurveProgress: token.progress ?? 0,
    kingOfTheHillProgress: 100,
  }

  const holders = [
    { address: '9C...80bc (Dev)', percent: '4.20%' },
    { address: '7A...12cd', percent: '2.10%' },
    { address: '3B...99ef', percent: '1.50%' },
    { address: '1D...44aa', percent: '1.20%' },
    { address: '5E...66bb', percent: '0.90%' },
  ]

  const trades = [
    {
      type: 'buy',
      user: 'User1',
      amount: '0.5 SOL',
      time: '2s ago',
      tx: 'Tx1',
    },
    {
      type: 'sell',
      user: 'User2',
      amount: '0.2 SOL',
      time: '5s ago',
      tx: 'Tx2',
    },
    {
      type: 'buy',
      user: 'User3',
      amount: '1.0 SOL',
      time: '12s ago',
      tx: 'Tx3',
    },
  ]

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900 font-sans selection:bg-green-500/30'>
      <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 h-14 flex items-center justify-between px-4'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden text-stripe-500 hover:text-stripe-900'
          >
            <Menu className='w-6 h-6' />
          </button>
          <nav className='hidden md:flex items-center gap-6 text-sm font-medium text-stripe-500 ml-6'>
            <button
              onClick={() => navigate('/')}
              className='hover:text-stripe-900 transition-colors'
            >
              Board
            </button>
            <button className='hover:text-stripe-900 transition-colors'>
              Advanced
            </button>
          </nav>
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-1.5 border border-gray-200'>
            <Search className='w-4 h-4 text-stripe-400 mr-2' />
            <input
              type='text'
              placeholder='Search coin...'
              className='bg-transparent border-none outline-none text-sm w-32 md:w-48 placeholder-stripe-400 text-stripe-900'
            />
          </div>
          <button className='text-sm font-medium hover:text-green-600 transition-colors text-stripe-900'>
            [connect wallet]
          </button>
        </div>
      </header>

      <main className='max-w-[1600px] mx-auto p-4 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-4'>
        <div className='space-y-4 min-w-0'>
          <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4'>
            <div className='flex gap-4'>
              <img
                src={project.image}
                alt={project.name}
                className='w-20 h-20 rounded-xl object-cover bg-gray-100'
              />
              <div>
                <h1 className='text-xl font-bold flex items-center gap-2 text-stripe-900'>
                  {project.name}{' '}
                  <span className='text-stripe-500 text-sm font-normal'>
                    ({project.ticker})
                  </span>
                </h1>
                <div className='flex items-center gap-2 text-xs text-green-600 mt-1 flex-wrap'>
                  <span>Market Cap: {project.marketCap}</span>
                  <span className='text-stripe-400'>•</span>
                  <span className='text-accent-600'>
                    Heat:{' '}
                    <span className='font-mono text-stripe-700'>
                      {heatScore}
                    </span>
                  </span>
                  <span className='text-stripe-400'>•</span>
                  <span className='text-stripe-700'>
                    Phase: <span className='font-mono'>{phase}</span>
                  </span>
                  <span className='text-stripe-400'>•</span>
                  <span className='text-stripe-500'>
                    Created by{' '}
                    <span className='text-blue-600 hover:underline cursor-pointer'>
                      {project.creator}
                    </span>{' '}
                    {project.createdAt}
                  </span>
                </div>
                <div className='flex items-center gap-3 mt-3 text-stripe-400'>
                  {project.website && (
                    <a
                      href={project.website}
                      target='_blank'
                      rel='noreferrer'
                      className='hover:text-stripe-900'
                    >
                      <Globe className='w-4 h-4' />
                    </a>
                  )}
                  {project.twitter && (
                    <a
                      href={project.twitter}
                      target='_blank'
                      rel='noreferrer'
                      className='hover:text-blue-500'
                    >
                      <Twitter className='w-4 h-4' />
                    </a>
                  )}
                  {project.telegram && (
                    <a
                      href={project.telegram}
                      target='_blank'
                      rel='noreferrer'
                      className='hover:text-blue-600'
                    >
                      <MessageCircle className='w-4 h-4' />
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <button className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors text-stripe-900'>
                <Star className='w-3.5 h-3.5' />
                Favorite
              </button>
              <button className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors text-stripe-900'>
                <Share2 className='w-3.5 h-3.5' />
                Share
              </button>
            </div>
          </div>

          <div className='h-[500px] card relative overflow-hidden flex flex-col'>
            <div className='p-3 border-b border-gray-100 flex items-center gap-2'>
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${activeTab === 'video' ? 'bg-gray-100 text-stripe-900' : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'}`}
              >
                <Play className='w-3.5 h-3.5' />
                Video
              </button>
              <button
                onClick={() => setActiveTab('website')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${activeTab === 'website' ? 'bg-gray-100 text-stripe-900' : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'}`}
              >
                <Globe className='w-3.5 h-3.5' />
                Website
              </button>
              <button
                onClick={() => setActiveTab('github')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${activeTab === 'github' ? 'bg-gray-100 text-stripe-900' : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'}`}
              >
                <Github className='w-3.5 h-3.5' />
                GitHub
              </button>
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-colors ${activeTab === 'chart' ? 'bg-gray-100 text-stripe-900' : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'}`}
              >
                <Star className='w-3.5 h-3.5' />
                Chart
              </button>
            </div>

            <div className='flex-1 bg-gray-50 relative'>
              {activeTab === 'video' && (
                <div className='w-full h-full flex items-center justify-center bg-gray-900 group cursor-pointer'>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60' />
                  <img
                    src='https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop'
                    alt='Video Thumbnail'
                    className='w-full h-full object-cover opacity-50'
                  />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform border border-white/30'>
                      <Play className='w-6 h-6 text-white fill-white ml-1' />
                    </div>
                  </div>
                  <div className='absolute bottom-4 left-4 right-4'>
                    <h3 className='text-lg font-bold mb-1 text-white'>
                      Project Introduction
                    </h3>
                    <p className='text-sm text-gray-300 line-clamp-2'>
                      {project.description}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'website' && (
                <div className='w-full h-full bg-white'>
                  <iframe
                    src={project.website}
                    title='Project Website'
                    className='w-full h-full border-none'
                  />
                  <div className='absolute bottom-4 right-4'>
                    <a
                      href={project.website}
                      target='_blank'
                      rel='noreferrer'
                      className='flex items-center gap-2 px-4 py-2 bg-white/90 text-stripe-900 rounded-lg text-xs font-medium hover:bg-white transition-colors backdrop-blur-sm border border-gray-200 shadow-stripe'
                    >
                      Open in New Tab
                      <ExternalLink className='w-3 h-3' />
                    </a>
                  </div>
                </div>
              )}

              {activeTab === 'github' && (
                <div className='w-full h-full p-6 overflow-y-auto bg-white'>
                  <div className='max-w-2xl mx-auto space-y-6'>
                    <div className='flex items-center justify-between pb-6 border-b border-gray-100'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center'>
                          <Github className='w-6 h-6 text-stripe-900' />
                        </div>
                        <div>
                          <h3 className='font-bold text-lg text-stripe-900'>
                            project-core-v1
                          </h3>
                          <div className='flex items-center gap-4 text-xs text-stripe-500 mt-1'>
                            <span className='flex items-center gap-1'>
                              <Users className='w-3 h-3' /> 12 Contributors
                            </span>
                            <span className='flex items-center gap-1'>
                              <Share2 className='w-3 h-3' /> 45 Forks
                            </span>
                            <span className='flex items-center gap-1'>
                              ⭐ 128 Stars
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className='px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium transition-colors text-stripe-900'>
                        View Repo
                      </button>
                    </div>

                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium text-stripe-500'>
                        Contribution Activity
                      </h4>
                      <div className='flex gap-1 h-24 items-end pt-4'>
                        {Array.from({ length: 40 }).map((_, i) => {
                          const height = Math.max(20, Math.random() * 100)
                          const opacity = Math.max(0.3, Math.random())
                          return (
                            <div
                              key={i}
                              className='flex-1 bg-green-500 rounded-t-sm hover:bg-green-600 transition-colors'
                              style={{
                                height: `${height}%`,
                                opacity: opacity,
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chart' && (
                <div className='w-full h-full p-4 bg-white'>
                  <div className='flex justify-between items-center mb-4 px-2'>
                    <h3 className='font-bold text-stripe-900'>价格曲线</h3>
                    <span className='text-sm font-medium text-stripe-500'>b={effectiveB.toFixed(1)}</span>
                  </div>
                  <div className='w-full h-[400px] relative px-2'>
                    {/* 价格曲线图表 */}
                    <svg viewBox='0 0 800 300' className='w-full h-full'>
                      {/* X轴 */}
                      <line x1='60' y1='280' x2='740' y2='280' stroke='#E5E7EB' strokeWidth='1' />
                      {/* Y轴 */}
                      <line x1='60' y1='20' x2='60' y2='280' stroke='#E5E7EB' strokeWidth='1' />
                       
                      {/* Y轴刻度 */}
                      {[0, 15, 30, 45, 60].map((value, index) => (
                        <g key={index}>
                          <line x1='58' y1={280 - (value / 60) * 260} x2='60' y2={280 - (value / 60) * 260} stroke='#E5E7EB' strokeWidth='1' />
                          <text x='50' y={284 - (value / 60) * 260} textAnchor='end' className='text-xs text-stripe-500'>{value}</text>
                        </g>
                      ))}
                      
                      {/* X轴刻度 */}
                      {[3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99].map((value, index) => (
                        <g key={index}>
                          <line x1={60 + (value / 100) * 680} y1='280' x2={60 + (value / 100) * 680} y2='282' stroke='#E5E7EB' strokeWidth='1' />
                          <text x={60 + (value / 100) * 680} y='296' textAnchor='middle' className='text-xs text-stripe-500'>{value}</text>
                        </g>
                      ))}
                      
                      {/* 价格曲线 */}
                      <path 
                        d={`M 60,${280 - (45 / 60) * 260} Q 300,${280 - (15 / 60) * 260} 500,${280 - (15 / 60) * 260} T 740,${280 - (45 / 60) * 260}`} 
                        fill='none' 
                        stroke='#6366F1' 
                        strokeWidth='2' 
                      />
                      
                      {/* 当前点 */}
                      <circle cx='500' cy={280 - (15 / 60) * 260} r='4' fill='#6366F1' />
                    </svg>
                    
                    {/* 底部标签 */}
                    <div className='flex justify-between items-center mt-2 px-2'>
                      <span className='text-sm font-medium text-stripe-500'>当前</span>
                      <span className='text-sm font-bold text-stripe-900'>50.00%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {useDocDetailLayout ? (
            <div className='card p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div>
                  <h3 className='font-bold text-sm text-stripe-900'>
                    阶段目标（Milestones）
                  </h3>
                  <p className='text-xs text-stripe-500 mt-0.5'>
                    一行一个阶段，点行看详情；Buy Yes/No 会同步右侧面板
                  </p>
                </div>
                <div className='text-xs text-stripe-400'>Buy Yes / Buy No</div>
              </div>

              <div className='space-y-3'>
                {markets.map(m => {
                  const isOpen = openMilestoneKey === m.key
                  const prob = Math.max(0, Math.min(1, m.pYes)) * 100
                  const yesCents = prob
                  const noCents = 100 - prob
                  const up = (m.pYes ?? 0) >= 0.5

                  return (
                    <div
                      key={m.key}
                      className={`rounded-xl transition ${isOpen ? 'ring-2 ring-green-500/10 border border-green-500/30 shadow-sm' : ''}`}
                    >
                      <div
                        role='button'
                        tabIndex={0}
                        className='relative flex flex-col w-full bg-white border border-gray-200 rounded-xl transition-all hover:border-gray-300 hover:shadow-sm overflow-hidden group text-left'
                        onClick={() => {
                          setSelectedMilestoneKey(m.key)
                          setOpenMilestoneKey(cur =>
                            cur === m.key ? null : m.key
                          )
                        }}
                        onKeyDown={e => {
                          if (e.key !== 'Enter' && e.key !== ' ') return
                          e.preventDefault()
                          setSelectedMilestoneKey(m.key)
                          setOpenMilestoneKey(cur =>
                            cur === m.key ? null : m.key
                          )
                        }}
                      >
                        <div className='flex items-center justify-between p-4 cursor-pointer select-none'>
                          <div className='flex items-center gap-4 min-w-0'>
                            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-xs font-bold text-stripe-500 border border-gray-100'>
                              {m.key.toUpperCase().slice(0, 3)}
                            </div>
                            <div className='flex flex-col min-w-0'>
                              <div className='truncate text-sm font-bold text-stripe-900 group-hover:text-blue-600 transition-colors'>
                                {m.title}
                              </div>
                              <div className='truncate text-xs text-stripe-400 mt-0.5'>
                                {m.desc}
                              </div>
                            </div>
                          </div>

                          <div className='flex items-center gap-4 shrink-0'>
                            <div className='text-right'>
                              <div className='font-mono text-lg font-bold text-stripe-900 tracking-tight'>
                                {Math.round(prob)}%
                              </div>
                              <div
                                className={`hidden sm:block font-mono text-xs font-medium ${up ? 'text-green-600' : 'text-red-600'}`}
                              >
                                {up ? '▲' : '▼'}{' '}
                                {Math.abs(Math.round(prob - 50))}%
                              </div>
                            </div>

                            <div className='hidden lg:flex items-center gap-2'>
                              <button
                                type='button'
                                className='px-3 py-1.5 rounded-lg bg-green-50 text-xs font-bold text-green-700 border border-green-100 hover:bg-green-100 hover:border-green-200 transition-colors'
                                onClick={e => {
                                  e.stopPropagation()
                                  setSelectedMilestoneKey(m.key)
                                  setMilestoneTradePick('yes')
                                }}
                              >
                                Buy Yes {yesCents.toFixed(1)}¢
                              </button>
                              <button
                                type='button'
                                className='px-3 py-1.5 rounded-lg bg-red-50 text-xs font-bold text-red-700 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-colors'
                                onClick={e => {
                                  e.stopPropagation()
                                  setSelectedMilestoneKey(m.key)
                                  setMilestoneTradePick('no')
                                }}
                              >
                                Buy No {noCents.toFixed(1)}¢
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isOpen ? (
                        <div className='border-t border-gray-100 bg-gray-50/50 p-4 animate-in fade-in slide-in-from-top-1 duration-200'>
                          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                            <div className='p-3 rounded-lg border border-gray-200 bg-white shadow-sm'>
                              <div className='text-[10px] uppercase tracking-wider text-stripe-400 font-semibold mb-1'>
                                说明
                              </div>
                              <div className='text-sm text-stripe-700 leading-relaxed'>
                                {m.desc}
                              </div>
                            </div>
                            <div className='p-3 rounded-lg border border-gray-200 bg-white shadow-sm'>
                              <div className='text-[10px] uppercase tracking-wider text-stripe-400 font-semibold mb-1'>
                                验证方式
                              </div>
                              <div className='text-sm text-stripe-700 leading-relaxed'>
                                TBD
                              </div>
                            </div>
                            <div className='p-3 rounded-lg border border-gray-200 bg-white shadow-sm'>
                              <div className='text-[10px] uppercase tracking-wider text-stripe-400 font-semibold mb-1'>
                                证据链接
                              </div>
                              <div className='text-sm text-stripe-700 leading-relaxed'>
                                TBD
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}

          <div className='card p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-bold text-sm text-stripe-900'>Thread</h3>
              <span className='text-xs text-stripe-500'>
                {project.replies} replies
              </span>
            </div>

            <div className='mb-6 p-3 bg-gray-50 rounded-lg border border-gray-100'>
              <textarea
                placeholder='Post a reply...'
                className='w-full bg-transparent border-none outline-none text-sm text-stripe-900 placeholder-stripe-400 resize-none h-20'
              />
              <div className='flex items-center justify-between mt-2 pt-2 border-t border-gray-200'>
                <button className='text-stripe-400 hover:text-stripe-900 transition-colors'>
                  <ImageIcon className='w-4 h-4' />
                </button>
                <button className='px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded transition-colors shadow-sm'>
                  Post Reply
                </button>
              </div>
            </div>

            <div className='space-y-6'>
              {[1, 2, 3].map(i => (
                <div key={i} className='flex gap-3 group'>
                  <div className='w-10 h-10 rounded bg-gray-100 flex-shrink-0 overflow-hidden'>
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt='Avatar'
                      className='w-full h-full object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 text-xs mb-1'>
                      <span className='font-bold text-stripe-700 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]'>
                        ID: {123456 + i}
                      </span>
                      <span className='text-stripe-400'>5m ago</span>
                    </div>
                    <p className='text-sm text-stripe-800 leading-relaxed mb-2'>
                      This is a bullish comment about the project. The dev is
                      based and the community is strong. LFG! 🚀
                    </p>
                    <div className='flex items-center gap-4'>
                      <button className='flex items-center gap-1.5 text-xs text-stripe-400 hover:text-green-600 transition-colors'>
                        <Heart className='w-3 h-3' />
                        <span>12</span>
                      </button>
                      <button className='flex items-center gap-1.5 text-xs text-stripe-400 hover:text-blue-600 transition-colors'>
                        <MessageCircle className='w-3 h-3' />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-4 w-full lg:w-[350px] flex-shrink-0'>
          <MarketParamsPanel
            baseB={baseB}
            setBaseB={setBaseB}
            autoB={autoB}
            setAutoB={setAutoB}
            phase={phase}
            setPhase={setPhase}
            effectiveB={effectiveB}
          />
          {useDocDetailLayout ? (
            <div className='card overflow-hidden'>
              <div className='p-4 border-b border-gray-100 bg-white'>
                <div className='text-sm font-bold text-stripe-900'>
                  Milestone Trade
                </div>
                <div className='text-xs text-stripe-400 mt-0.5'>
                  {markets.find(m => m.key === selectedMilestoneKey)?.title}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 p-4 pb-0'>
                {(() => {
                  const m =
                    markets.find(x => x.key === selectedMilestoneKey) ??
                    markets[0]
                  const prob = Math.max(0, Math.min(1, m.pYes)) * 100
                  const yesCents = prob
                  const noCents = 100 - prob

                  const yesActive = milestoneTradePick === 'yes'
                  const noActive = milestoneTradePick === 'no'

                  return (
                    <>
                      <button
                        type='button'
                        className={`relative flex flex-col items-start p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${yesActive ? 'border-green-500 bg-green-50/30 ring-1 ring-green-500/20' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}`}
                        onClick={() => setMilestoneTradePick('yes')}
                      >
                        <div
                          className={`text-xs font-bold mb-1 uppercase tracking-wide ${yesActive ? 'text-green-700' : 'text-stripe-500'}`}
                        >
                          YES
                        </div>
                        <div className='font-mono text-lg font-bold text-stripe-900'>
                          {yesCents.toFixed(1)}¢
                        </div>
                      </button>

                      <button
                        type='button'
                        className={`relative flex flex-col items-start p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${noActive ? 'border-red-500 bg-red-50/30 ring-1 ring-red-500/20' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}`}
                        onClick={() => setMilestoneTradePick('no')}
                      >
                        <div
                          className={`text-xs font-bold mb-1 uppercase tracking-wide ${noActive ? 'text-red-700' : 'text-stripe-500'}`}
                        >
                          NO
                        </div>
                        <div className='font-mono text-lg font-bold text-stripe-900'>
                          {noCents.toFixed(1)}¢
                        </div>
                      </button>
                    </>
                  )
                })()}
              </div>

              <div className='flex border-b border-gray-100 mt-4'>
                <button
                  onClick={() => setMilestoneTradeMode('buy')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${milestoneTradeMode === 'buy' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-stripe-400 hover:text-stripe-600'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setMilestoneTradeMode('sell')}
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${milestoneTradeMode === 'sell' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-stripe-400 hover:text-stripe-600'}`}
                >
                  Sell
                </button>
              </div>

              <div className='p-4 space-y-4'>
                <div className='relative'>
                  <input
                    type='number'
                    value={milestoneTradeAmountUsd}
                    onChange={e => setMilestoneTradeAmountUsd(e.target.value)}
                    placeholder='0'
                    className='w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-right text-lg font-mono focus:border-gray-300 outline-none transition-colors text-stripe-900'
                  />
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stripe-500'>
                    USD
                  </span>
                </div>

                <div className='bg-gray-50 rounded-lg p-3 border border-gray-100'>
                  <div className='flex justify-between items-center text-xs mb-1'>
                    <span className='text-stripe-400'>Selected</span>
                    <span className='font-mono font-medium text-stripe-900'>
                      {milestoneTradePick.toUpperCase()}
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-xs'>
                    <span className='text-stripe-400'>Mode</span>
                    <span className='font-mono font-medium text-stripe-900'>
                      {milestoneTradeMode.toUpperCase()}
                    </span>
                  </div>
                </div>

                <button
                  className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] ${milestoneTradePick === 'yes' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' : 'bg-red-500 hover:bg-red-600 shadow-red-500/20'}`}
                >
                  {milestoneTradeMode === 'buy' ? 'Buy' : 'Sell'}{' '}
                  {milestoneTradePick.toUpperCase()}
                </button>
              </div>
            </div>
          ) : (
            <div className='card overflow-hidden'>
              <div className='flex border-b border-gray-100'>
                <button
                  onClick={() =>
                    useDocDetailLayout
                      ? setMilestoneTradeMode('buy')
                      : setTradeType('buy')
                  }
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${(useDocDetailLayout ? milestoneTradeMode : tradeType) === 'buy' ? 'bg-green-50 text-green-600 border-b-2 border-green-500' : 'text-stripe-400 hover:text-stripe-600'}`}
                >
                  Buy
                </button>
                <button
                  onClick={() =>
                    useDocDetailLayout
                      ? setMilestoneTradeMode('sell')
                      : setTradeType('sell')
                  }
                  className={`flex-1 py-3 text-sm font-bold transition-colors ${(useDocDetailLayout ? milestoneTradeMode : tradeType) === 'sell' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-stripe-400 hover:text-stripe-600'}`}
                >
                  Sell
                </button>
              </div>
              <div className='p-4 space-y-4'>
                <div className='flex items-center justify-between text-xs text-stripe-400'>
                  <button className='hover:text-stripe-900 transition-colors'>
                    switch to{' '}
                    {(useDocDetailLayout ? milestoneTradeMode : tradeType) ===
                    'buy'
                      ? 'Baby'
                      : 'SOL'}
                  </button>
                  <button className='flex items-center gap-1 hover:text-stripe-900 transition-colors'>
                    <Settings className='w-3 h-3' /> Set max slippage
                  </button>
                </div>

                <div className='relative'>
                  <input
                    type='number'
                    value={
                      useDocDetailLayout ? milestoneTradeAmountUsd : amount
                    }
                    onChange={e =>
                      useDocDetailLayout
                        ? setMilestoneTradeAmountUsd(e.target.value)
                        : setAmount(e.target.value)
                    }
                    placeholder='0.0'
                    className='w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-right text-lg font-mono focus:border-gray-300 outline-none transition-colors text-stripe-900'
                  />
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stripe-500'>
                    {(useDocDetailLayout ? milestoneTradeMode : tradeType) ===
                    'buy'
                      ? 'SOL'
                      : 'Baby'}
                  </span>
                </div>

                <div className='grid grid-cols-4 gap-2'>
                  {['reset', '1 SOL', '5 SOL', '10 SOL'].map(val => (
                    <button
                      key={val}
                      className='py-1.5 bg-gray-50 hover:bg-gray-100 rounded text-xs font-medium transition-colors text-stripe-600'
                    >
                      {val}
                    </button>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-lg font-bold text-white transition-transform active:scale-95 shadow-md ${(useDocDetailLayout ? milestoneTradeMode : tradeType) === 'buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                >
                  {(useDocDetailLayout ? milestoneTradeMode : tradeType) ===
                  'buy'
                    ? 'Place trade'
                    : 'Sell'}
                </button>
              </div>
            </div>
          )}

          <div className='card p-4 space-y-3'>
            <div className='flex items-center justify-between text-xs font-bold text-stripe-500'>
              <span>Bonding Curve Progress</span>
              <span className='text-green-600'>
                {project.bondingCurveProgress}%
              </span>
            </div>
            <div className='w-full bg-gray-100 rounded-full h-3 overflow-hidden'>
              <div className='bg-green-500 h-full rounded-full w-full animate-pulse' />
            </div>
            <p className='text-xs text-stripe-400 leading-relaxed'>
              When the market cap reaches $69,420 all the liquidity from the
              bonding curve will be deposited into Raydium and burned.
            </p>
          </div>

          <div className='card p-4'>
            <h3 className='font-bold text-sm mb-3 text-stripe-900'>
              Holder distribution
            </h3>
            <div className='space-y-2'>
              {holders.map((h, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between text-xs'
                >
                  <span className='text-stripe-500 font-mono'>{h.address}</span>
                  <span className='text-stripe-900'>{h.percent}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='card p-4'>
            <h3 className='font-bold text-sm mb-3 text-stripe-900'>
              Recent Trades
            </h3>
            <div className='space-y-2'>
              {trades.map((t, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between text-xs'
                >
                  <div className='flex items-center gap-2'>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${t.type === 'buy' ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                    <span className='text-stripe-700'>{t.user}</span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span className='text-stripe-900'>{t.amount}</span>
                    <span className='text-stripe-400'>{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default OneDollarProjectPageLikePump
