import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Share2,
  Star,
  ChevronDown,
  ChevronUp,
  Rocket,
  Globe,
  Github,
  Play,
  MessageSquare,
  AlertCircle,
  Clock,
  ExternalLink,
  Target
} from 'lucide-react'

import type { Project, ProjectStage, UserEarnings, PoolFinances, ActivityLog } from './types'
import { VideoModal } from './components/VideoModal'
import { UserEarningsCard } from './components/UserEarningsCard'
import { ActivityTimeline } from './components/ActivityTimeline'
import { DiscussionPreview } from './components/DiscussionPreview'

// -------------------- Mock data --------------------

type MilestoneKey = 'HAC' | 'PAI' | 'DER' | 'GOV'

type MilestoneMarket = {
  key: MilestoneKey
  title: string
  desc: string
  probYes: number // 0-1
  change24h: number // +/-
  yesPriceCents: number
  noPriceCents: number
  evidence?: { label: string; href: string }[]
}

const mockProjectById = (id: string): Project | null => {
  if (id === 'liqpass') {
    return {
      id: 'liqpass',
      name: 'LiqPass 爆仓保',
      tagline: '面向高杠杆散户的链上清算保护产品',
      stage: 'mvp' as ProjectStage,
      chain: 'Base',
      supporters: 98,
      raisedUsd: 296,
      poolTarget: 1000,
      totalTickets: 296,
      hasVideo: true,
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoType: 'external',
      roundGoal:
        '完成 MVP 版本开发并上线 Base 主网，实现基础的清算保护功能，获取首批 100 名测试用户',
      milestones: [
        '第1周：完成智能合约开发和测试',
        '第2周：前端界面开发与集成',
        '第3-4周：上线测试网并获取用户反馈',
      ],
      fundingPlan: '主要用于服务器费用、智能合约部署费用和测试奖励',
      website: 'https://liqpass.com',
      github: 'https://github.com/liqpass',
      twitter: 'https://x.com/liqpass',
      telegram: 'https://t.me/liqpass',
      email: 'hello@liqpass.com',
      createdAt: '2024-01-15',
    }
  }
  return null
}

const mockMilestoneMarkets = (): MilestoneMarket[] => [
  {
    key: 'HAC',
    title: 'Hackathon',
    desc: '是否在公开场合/黑客松中曝光',
    probYes: 0.36,
    change24h: -0.14,
    yesPriceCents: 36.0,
    noPriceCents: 64.0,
    evidence: [
      { label: '提交记录', href: 'https://github.com/liqpass/hackathon-submission' },
      { label: '项目仓库', href: 'https://github.com/liqpass' },
    ],
  },
  {
    key: 'PAI',
    title: 'Paid Users',
    desc: '是否出现真实付费用户（可验证证据）',
    probYes: 0.29,
    change24h: -0.21,
    yesPriceCents: 28.7,
    noPriceCents: 71.3,
  },
  {
    key: 'DER',
    title: 'Derivative Count',
    desc: '是否被其他项目复用/衍生（引用/借鉴数量增长）',
    probYes: 0.26,
    change24h: -0.24,
    yesPriceCents: 25.7,
    noPriceCents: 74.3,
  },
  {
    key: 'GOV',
    title: 'Governance / Risk',
    desc: '是否存在黑幕/操纵/安全事故等风险信号',
    probYes: 0.23,
    change24h: -0.27,
    yesPriceCents: 22.7,
    noPriceCents: 77.3,
  },
]

const mockUserEarnings = (): UserEarnings => ({
  invested: 12,
  tickets: 12,
  realized: 5.2,
  estimated: 11.8,
  pnl: 5.0,
  multiplier: 1.42,
  poolAvgMultiplier: 1.12,
  topMultiplier: 3.4,
})

const mockPoolFinances = (): PoolFinances => ({
  currentPool: 296,
  targetPool: 1000,
  moneyIn: {
    supportTickets: 296,
    rake: 45,
    sponsorship: 100,
    hackathonPrize: 0,
  },
  moneyOut: {
    lottery: 120,
    settlement: 85,
    operations: 36,
  },
  reserved: 200,
})

const mockActivityLogs = (): ActivityLog[] => [
  {
    id: '1',
    type: 'lottery',
    timestamp: '2024-01-25T10:30:00',
    amount: 50,
    description: '第 5 次每日抽奖',
    recipient: '尾号 ...4f2a',
    verificationUrl: 'https://etherscan.io/tx/0x123',
  },
  {
    id: '2',
    type: 'allocation',
    timestamp: '2024-01-24T14:20:00',
    amount: 36,
    description: '划拨资金用于服务器和开发',
    verificationUrl: 'https://github.com/liqpass/expenses/blob/main/jan-2024.md',
  },
  {
    id: '3',
    type: 'hackathon',
    timestamp: '2024-01-23T09:15:00',
    description: '已提交 ETHDenver 黑客松申请',
    verificationUrl: 'https://github.com/liqpass/hackathon-submission',
  },
]

const stageLabel: Record<ProjectStage, string> = {
  idea: '想法期 · Idea',
  mvp: 'MVP 进行中',
  live: '已上线 · Live',
}

type TradeSide = 'YES' | 'NO'

// -------------------- Small UI helpers --------------------

function cn(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(' ')
}

const Pill: React.FC<{ children: React.ReactNode; tone?: 'gray' | 'green' | 'orange' | 'blue' }> = ({
  children,
  tone = 'gray',
}) => {
  const map = {
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  } as const
  return <span className={cn('text-xs px-2 py-1 rounded-full border', map[tone])}>{children}</span>
}

// -------------------- Components --------------------

const ProjectHeader: React.FC<{ project: Project; onScrollTo: (id: string) => void }> = ({ project, onScrollTo }) => {
  const progressPercent = Math.min((project.raisedUsd / (project.poolTarget || 1)) * 100, 100)
  
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Left: Info */}
        <div className="flex-1 p-6 md:border-r border-slate-100">
          <div className="mb-4">
            <h1 className="text-2xl font-black text-slate-900 mb-2">{project.name}</h1>
            <p className="text-slate-600 font-medium">{project.tagline}</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <Pill tone="blue">{project.chain}</Pill>
              <Pill tone="orange">Heat {Math.round(Math.random() * 30 + 10)}</Pill>
              <span className="text-xs text-slate-400 ml-1">Created {project.createdAt}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-5 border-t border-slate-100 pt-4">
            <div>
              <div className="text-lg font-bold text-slate-900">{project.supporters}</div>
              <div className="text-xs text-slate-500 uppercase">支持者</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{project.chain}</div>
              <div className="text-xs text-slate-500 uppercase">生态</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{project.totalTickets}</div>
              <div className="text-xs text-slate-500 uppercase">票数</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{progressPercent.toFixed(1)}%</div>
              <div className="text-xs text-slate-500 uppercase">完成度</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1 font-medium">
              <span>募集进度</span>
              <span>${project.raisedUsd} / ${project.poolTarget}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Status & Shortcuts */}
        <div className="w-full md:w-80 bg-slate-50/50 p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">项目状态</div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-bold text-slate-900">P1 Hackathon 进行中</span>
            </div>
            <div className="text-sm text-slate-500 flex items-center gap-1 mb-4">
              <Clock className="w-3.5 h-3.5" />
              截止：2024-02-15
            </div>
            <div className="flex items-center gap-3 text-sm bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex-1 text-center border-r border-slate-100">
                <div className="text-xs text-slate-400">YES (24h)</div>
                <div className="text-red-600 font-bold">▼ 14%</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-xs text-slate-400">NO (24h)</div>
                <div className="text-green-600 font-bold">▲ 14%</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
             <div className="text-xs text-slate-400 mb-2">快捷入口</div>
             <div className="flex flex-wrap gap-2">
               <button onClick={() => onScrollTo('milestones')} className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors">查看证据</button>
               <button onClick={() => onScrollTo('discussion')} className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors">查看讨论</button>
               <button onClick={() => onScrollTo('activity')} className="px-2 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-100 transition-colors">查看资金</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MilestonesPanel: React.FC<{
  items: MilestoneMarket[]
  selectedKey: MilestoneKey
  onSelect: (key: MilestoneKey) => void
  expandedKey: MilestoneKey | null
  onToggleExpand: (key: MilestoneKey) => void
  onQuickTrade: (key: MilestoneKey, side: TradeSide) => void
}> = ({ items, selectedKey, onSelect, expandedKey, onToggleExpand, onQuickTrade }) => {
  return (
    <div id="milestones" className='bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden scroll-mt-20'>
      <div className='px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50'>
        <div className='flex items-center gap-2'>
          <Target className='w-5 h-5 text-slate-600' />
          <h3 className='text-lg font-bold text-slate-900'>里程碑 (可交易任务)</h3>
        </div>
        <div className="text-xs text-slate-500">点击列表交易</div>
      </div>

      <div className='divide-y divide-slate-100'>
        {items.map(m => {
          const isSelected = selectedKey === m.key
          const isExpanded = expandedKey === m.key
          const changeIsUp = m.change24h >= 0
          return (
            <div key={m.key} className={cn('px-6 py-4 transition-colors group', isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50')}>
              <button
                type='button'
                onClick={() => {
                  onSelect(m.key)
                  onToggleExpand(m.key)
                }}
                className='w-full text-left'
              >
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-4 min-w-0'>
                    <div className={cn(
                      'w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center font-black text-slate-700 transition-colors',
                      isSelected ? 'bg-blue-100 border-blue-200 text-blue-800' : 'bg-slate-50 border-slate-200'
                    )}>
                      {m.key}
                    </div>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <div className='font-bold text-slate-900 truncate text-base'>{m.title}</div>
                        {isSelected && <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Selected</span>}
                      </div>
                      <div className='text-sm text-slate-500 truncate mt-0.5'>{m.desc}</div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 shrink-0'>
                    <div className='text-right hidden sm:block'>
                      <div className='text-sm font-bold text-slate-900'>{Math.round(m.probYes * 100)}%</div>
                      <div className={cn('text-xs font-medium', changeIsUp ? 'text-green-600' : 'text-red-600')}>
                        {changeIsUp ? '▲' : '▼'} {Math.abs(Math.round(m.change24h * 100))}%
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuickTrade(m.key, 'YES')
                        }}
                        className='text-xs px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 font-bold hover:bg-green-100 transition-colors shadow-sm'
                      >
                        Buy YES {m.yesPriceCents.toFixed(1)}¢
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuickTrade(m.key, 'NO')
                        }}
                        className='text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-bold hover:bg-red-100 transition-colors shadow-sm'
                      >
                        Buy NO {m.noPriceCents.toFixed(1)}¢
                      </button>
                    </div>

                    <div className='ml-1 text-slate-300 group-hover:text-slate-500 transition-colors'>
                        {isExpanded ? <ChevronUp className='w-5 h-5' /> : <ChevronDown className='w-5 h-5' />}
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className='mt-4 pt-4 border-t border-slate-100 pl-[4.5rem] animate-in fade-in duration-200'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='md:col-span-2 space-y-3'>
                      <div>
                        <div className='text-xs font-bold text-slate-400 uppercase mb-1'>说明</div>
                        <p className='text-sm text-slate-600 leading-relaxed'>
                          该里程碑用于追踪项目是否在 2024 Q1 期间获得主流黑客松奖项或公开路演曝光。需提供官方链接或照片证明。
                        </p>
                      </div>
                      <div className='flex gap-4 text-xs text-slate-500'>
                          <div>截止: 2024-02-28</div>
                          <div>结算源: Oracle / DAO Vote</div>
                      </div>
                    </div>
                    <div>
                      <div className='text-xs font-bold text-slate-400 uppercase mb-1'>Evidence</div>
                      <div className='space-y-1'>
                        {(m.evidence || []).length === 0 ? (
                          <div className='text-sm text-slate-400 italic'>暂无提交证据</div>
                        ) : (
                          m.evidence!.map((e, idx) => (
                            <a
                              key={idx}
                              href={e.href}
                              target='_blank'
                              rel='noreferrer'
                              className='flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline'
                            >
                              <ExternalLink className="w-3 h-3" />
                              {e.label}
                            </a>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MilestoneTradeCard: React.FC<{
  milestone: MilestoneMarket
  side: TradeSide
  onSideChange: (s: TradeSide) => void
}> = ({ milestone, side, onSideChange }) => {
  const [amount, setAmount] = useState<number>(20)

  const price = side === 'YES' ? milestone.yesPriceCents : milestone.noPriceCents
  const shares = useMemo(() => {
    const dollars = Number.isFinite(amount) ? Math.max(amount, 0) : 0
    const p = Math.max(price, 0.0001)
    return (dollars / (p / 100)).toFixed(2)
  }, [amount, price])

  return (
    <div className='bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden'>
      <div className='px-5 py-4 border-b border-slate-200 bg-slate-50/50'>
        <div className='text-xs text-slate-500 font-bold uppercase tracking-wide mb-1'>Milestone Trade</div>
        <div className='flex items-center justify-between'>
            <div className='font-black text-slate-900 text-lg'>{milestone.title}</div>
            <Pill tone='blue'>P1</Pill>
        </div>
      </div>

      <div className='p-5 space-y-5'>
        {/* Prices Grid */}
        <div className="grid grid-cols-2 gap-3">
            <div className={cn(
                "border rounded-xl p-3 text-center transition-all cursor-pointer relative overflow-hidden",
                side === 'YES' ? "bg-green-50 border-green-300 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"
            )} onClick={() => onSideChange('YES')}>
                <div className="text-xs font-bold text-slate-400 mb-1">YES</div>
                <div className="text-xl font-black text-slate-900">{milestone.yesPriceCents.toFixed(1)}¢</div>
                <div className="text-xs text-slate-500 mt-1">Market {Math.round(milestone.probYes * 100)}%</div>
                {side === 'YES' && <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none" />}
            </div>
            <div className={cn(
                "border rounded-xl p-3 text-center transition-all cursor-pointer relative overflow-hidden",
                side === 'NO' ? "bg-red-50 border-red-300 shadow-sm" : "bg-white border-slate-200 hover:border-slate-300"
            )} onClick={() => onSideChange('NO')}>
                <div className="text-xs font-bold text-slate-400 mb-1">NO</div>
                <div className="text-xl font-black text-slate-900">{milestone.noPriceCents.toFixed(1)}¢</div>
                <div className="text-xs text-slate-500 mt-1">Market {Math.round((1 - milestone.probYes) * 100)}%</div>
                {side === 'NO' && <div className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none" />}
            </div>
        </div>

        {/* Action Tabs */}
        <div className="bg-slate-100 p-1 rounded-lg flex">
            <button className="flex-1 py-1.5 text-sm font-bold text-slate-900 bg-white shadow-sm rounded-md">Buy</button>
            <button className="flex-1 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700">Sell</button>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label className='font-medium text-slate-700'>金额 (USD)</label>
            <div className="flex gap-2">
                {[5, 20, 100].map(val => (
                    <button key={val} onClick={() => setAmount(val)} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 transition-colors">
                        ${val}
                    </button>
                ))}
            </div>
          </div>
          <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
             <input
                type='number'
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className='w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-4 py-3 text-slate-900 font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
                min='1'
                step='1'
             />
          </div>
          <div className='mt-3 space-y-1'>
            <div className='flex justify-between text-xs'>
                <span className="text-slate-500">≈ You get</span>
                <span className='font-bold text-slate-900'>{shares} {side} shares</span>
            </div>
            <div className='flex justify-between text-xs'>
                <span className="text-slate-500">Max loss</span>
                <span className='font-bold text-slate-900'>${Number.isFinite(amount) ? amount : 0}</span>
            </div>
          </div>
        </div>

        {/* Main Button */}
        <button
          type='button'
          className={cn(
            'w-full font-black py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] text-lg flex items-center justify-center gap-2',
            side === 'YES'
              ? 'bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white shadow-green-200'
              : 'bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-red-200'
          )}
          onClick={() => {
            alert(`Mock: Buy ${side} $${amount} @ ${price.toFixed(1)}¢`) 
          }}
        >
          Buy {side}
        </button>

        <div className="text-center">
             <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                Selected: {milestone.key} · {side}
             </span>
        </div>
      </div>
    </div>
  )
}

const HeroMediaCard: React.FC<{
  project: Project
  tab: HeroTab
  onTab: (t: HeroTab) => void
  onOpenVideo: () => void
}> = ({ project, tab, onTab, onOpenVideo }) => {
  return (
    <div id="overview" className='bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden scroll-mt-20'>
      <div className='px-4 py-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50'>
        <button
          type='button'
          onClick={() => onTab('video')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2',
            tab === 'video' ? 'bg-white text-slate-900 border-slate-300 shadow-sm' : 'text-slate-500 border-transparent hover:bg-slate-100'
          )}
        >
          <Play className='w-4 h-4' /> Video
        </button>
        <button
          type='button'
          onClick={() => onTab('website')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2',
            tab === 'website' ? 'bg-white text-slate-900 border-slate-300 shadow-sm' : 'text-slate-500 border-transparent hover:bg-slate-100'
          )}
        >
          <Globe className='w-4 h-4' /> Website
        </button>
        <button
          type='button'
          onClick={() => onTab('github')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2',
            tab === 'github' ? 'bg-white text-slate-900 border-slate-300 shadow-sm' : 'text-slate-500 border-transparent hover:bg-slate-100'
          )}
        >
          <Github className='w-4 h-4' /> GitHub
        </button>
      </div>

      <div className='relative'>
        {tab === 'video' && (
          <button
            type='button'
            onClick={onOpenVideo}
            className='w-full text-left group'
          >
            <div className='h-[340px] bg-slate-900 flex items-center justify-center relative overflow-hidden'>
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900" />
               <div className='relative z-10 flex flex-col items-center gap-4 transition-transform duration-300 group-hover:scale-105'>
                <div className='w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all'>
                  <Play className='w-6 h-6 text-white ml-1' fill='currentColor' />
                </div>
                <div className="text-center">
                    <div className='text-base font-bold text-white mb-1'>Watch Project Video</div>
                    <div className='text-xs text-slate-400'>2:15 · External</div>
                </div>
              </div>
            </div>
          </button>
        )}

        {tab === 'website' && (
          <div className='p-8 h-[340px] bg-slate-50 flex flex-col items-center justify-center text-center'>
            <Globe className="w-12 h-12 text-slate-300 mb-4" />
            <div className='text-sm text-slate-500 mb-2'>Visit Official Website</div>
            <a href={project.website} target='_blank' rel='noreferrer' className='text-blue-600 hover:text-blue-800 font-bold text-xl hover:underline break-all'>
              {project.website}
            </a>
          </div>
        )}

        {tab === 'github' && (
          <div className='p-8 h-[340px] bg-slate-50 flex flex-col items-center justify-center text-center'>
            <Github className="w-12 h-12 text-slate-300 mb-4" />
            <div className='text-sm text-slate-500 mb-2'>Browse Source Code</div>
            <a href={project.github} target='_blank' rel='noreferrer' className='text-slate-900 hover:text-black font-bold text-xl hover:underline break-all'>
              {project.github}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

type HeroTab = 'video' | 'website' | 'github'

// -------------------- Page --------------------

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')

  const [isFav, setIsFav] = useState(false)
  const [heroTab, setHeroTab] = useState<HeroTab>('video')
  const milestoneMarkets = useMemo(() => mockMilestoneMarkets(), [])
  
  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneKey>(milestoneMarkets[0]?.key || 'HAC')
  const [expandedMilestone, setExpandedMilestone] = useState<MilestoneKey | null>(null) // Default collapsed
  const [tradeSide, setTradeSide] = useState<TradeSide>('YES')

  if (!id) return <div className='min-h-screen flex items-center justify-center'>Loading...</div>

  const project = mockProjectById(id)
  if (!project) return <div className='min-h-screen flex items-center justify-center'>Product not found</div>

  const userEarnings = mockUserEarnings()
  const activityLogs = mockActivityLogs()

  const handleShareProject = async () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: project.name, url: shareUrl }) } catch (error) { console.error('Share failed:', error) }
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Copied to clipboard')
    }
  }

  const handleQuickTrade = (key: MilestoneKey, side: TradeSide) => {
    setSelectedMilestone(key)
    setTradeSide(side)
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
        const offset = 80 // sticky header offset
        const bodyRect = document.body.getBoundingClientRect().top
        const elementRect = el.getBoundingClientRect().top
        const elementPosition = elementRect - bodyRect
        const offsetPosition = elementPosition - offset

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        })
        setActiveSection(id)
    }
  }

  const selectedMarket = milestoneMarkets.find(m => m.key === selectedMilestone) || milestoneMarkets[0]

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 pb-20'>
      {/* Top Bar */}
      <div className='bg-white border-b border-slate-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-3'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>返回榜单</span>
            </button>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={() => setIsFav(v => !v)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors border',
                  isFav ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                )}
              >
                <Star className={cn('h-3.5 w-3.5', isFav && 'fill-yellow-400')} />
                收藏
              </button>

              <button
                onClick={handleShareProject}
                className='flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 rounded-full text-xs font-bold transition-colors text-slate-600 border border-slate-200'
              >
                <Share2 className='h-3.5 w-3.5' />
                分享
              </button>

              <div className='flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200'>
                <div className='w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse' />
                <span className='text-xs font-bold text-slate-700'>MVP 进行中</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        
        {/* Project Header */}
        <ProjectHeader project={project} onScrollTo={scrollTo} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 relative'>
          
          {/* LEFT COLUMN: Main Content */}
          <div className='lg:col-span-2 flex flex-col gap-8'>
            
            {/* Sticky Tabs for Content */}
            <div className="sticky top-[3.75rem] z-40 bg-slate-50/95 backdrop-blur-sm py-2 -mx-2 px-2 border-b border-transparent">
                <div className="flex items-center gap-1 bg-white/80 p-1 rounded-lg border border-slate-200 shadow-sm w-fit">
                    {['overview', 'milestones', 'discussion', 'activity'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => scrollTo(tab)}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-sm font-bold capitalize transition-all",
                                activeSection === tab 
                                    ? "bg-slate-900 text-white shadow-sm" 
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Section */}
            <div className="space-y-6">
                <HeroMediaCard project={project} tab={heroTab} onTab={setHeroTab} onOpenVideo={() => setIsVideoModalOpen(true)} />
                
                <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4 text-lg">项目目标</h3>
                    <ul className="space-y-2 list-disc pl-5 text-slate-700 text-sm leading-relaxed marker:text-slate-400">
                        <li>完成 MVP 版本开发并上线 Base 主网。</li>
                        <li>实现基础的清算保护功能，打通 Chainlink 预言机。</li>
                        <li>获取首批 100 名测试用户并收集反馈。</li>
                    </ul>

                    <h3 className="font-bold text-slate-900 mt-6 mb-4 text-lg">资金用途</h3>
                    <ul className="space-y-2 list-disc pl-5 text-slate-700 text-sm leading-relaxed marker:text-slate-400">
                        <li>40% 服务器与 RPC 节点费用</li>
                        <li>30% 智能合约审计与部署</li>
                        <li>30% 早期测试用户激励与空投</li>
                    </ul>
                </div>
            </div>

            {/* Milestones Section */}
            <MilestonesPanel
              items={milestoneMarkets}
              selectedKey={selectedMilestone}
              onSelect={setSelectedMilestone}
              expandedKey={expandedMilestone}
              onToggleExpand={key => setExpandedMilestone(prev => (prev === key ? null : key))}
              onQuickTrade={handleQuickTrade}
            />

            {/* Discussion Section */}
            <div id="discussion" className="scroll-mt-20">
               <DiscussionPreview _projectId={project.id} />
            </div>

            {/* Activity Section */}
            <div id="activity" className="scroll-mt-20">
               <ActivityTimeline activities={activityLogs} />
            </div>

          </div>

          {/* RIGHT COLUMN: Sticky Action */}
          <div className='lg:col-span-1'>
            <div className="sticky top-24 flex flex-col gap-4">
                
                {/* 1. Trade Card (Main Action) */}
                {selectedMarket && (
                    <MilestoneTradeCard 
                        milestone={selectedMarket} 
                        side={tradeSide} 
                        onSideChange={setTradeSide} 
                    />
                )}

                {/* 2. Earnings (Collapsible) */}
                <UserEarningsCard earnings={userEarnings} defaultCollapsed={true} />

                {/* Unconnected Wallet Tip (Mock) */}
                <div className="text-center text-xs text-slate-400 mt-2">
                    Connect wallet to see real-time positions
                </div>
            </div>
          </div>

        </div>
      </div>

      {/* Video Modal */}
      {project.hasVideo && project.videoUrl && (
        <VideoModal videoUrl={project.videoUrl} isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      )}
    </div>
  )
}

export default ProjectDetailPage