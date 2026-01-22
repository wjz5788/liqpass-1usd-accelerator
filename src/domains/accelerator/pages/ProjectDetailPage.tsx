import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Share2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Zap,
  Rocket,
  Flame,
  AlertCircle,
} from 'lucide-react'
import type {
  Project,
  ProjectStage,
  UserEarnings,
  PoolFinances,
  ActivityLog,
} from './types'
import { VideoModal } from './components/VideoModal'
import { UserEarningsCard } from './components/UserEarningsCard'
import { MoneyFlowCard } from './components/MoneyFlowCard'
import { ActivityTimeline } from './components/ActivityTimeline'
import { DiscussionPreview } from './components/DiscussionPreview'

// Mock data functions
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
    verificationUrl:
      'https://github.com/liqpass/expenses/blob/main/jan-2024.md',
  },
  {
    id: '3',
    type: 'hackathon',
    timestamp: '2024-01-23T09:15:00',
    description: '已提交 ETHDenver 黑客松申请',
    verificationUrl: 'https://github.com/liqpass/hackathon-submission',
  },
  {
    id: '4',
    type: 'milestone',
    timestamp: '2024-01-20T16:45:00',
    description: '完成智能合约开发和测试',
    verificationUrl: 'https://github.com/liqpass/contracts',
  },
]

const stageLabel: Record<ProjectStage, string> = {
  idea: '想法期 · Idea',
  mvp: 'MVP 进行中',
  live: '已上线 · Live',
}

// Bonding Curve 计算器组件
const BondingCurveCalculator: React.FC<{
  currentSupply: number
  targetSupply: number
}> = ({ currentSupply, targetSupply }) => {
  const [investAmount, setInvestAmount] = useState(1)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [estimatedTokens, setEstimatedTokens] = useState(0)
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  // 简化的Bonding Curve计算 (线性曲线)
  useEffect(() => {
    const k = 0.001 // 曲线参数
    const price = k * currentSupply + 0.1 // 基础价格
    const newSupply = currentSupply + investAmount
    const newPrice = k * newSupply + 0.1
    const tokens = investAmount / ((price + newPrice) / 2) // 平均价格购买

    setCurrentPrice(price)
    setEstimatedTokens(tokens)
    setEstimatedPrice(newPrice)
  }, [investAmount, currentSupply])

  return (
    <div className='bg-white border border-gray-200 shadow-stripe rounded-xl p-6 relative overflow-hidden'>
      <div className='absolute top-0 right-0 p-3 opacity-10'>
        <TrendingUp className='w-16 h-16 text-green-500' />
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <Zap className='w-5 h-5 text-green-600' />
        <h3 className='text-lg font-bold text-stripe-900'>
          Bonding Curve 价格曲线
        </h3>
        <span className='text-xs bg-green-50 text-green-600 px-2 py-1 rounded'>
          实时更新
        </span>
      </div>

      {/* 当前价格显示 */}
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div className='bg-gray-50 rounded-lg p-4 border border-gray-100'>
          <div className='text-xs text-stripe-500 mb-1'>当前价格</div>
          <div className='text-2xl font-bold text-green-600'>
            ${currentPrice.toFixed(4)}
          </div>
          <div className='text-xs text-stripe-400 mt-1'>
            已发行: {currentSupply} 代币
          </div>
        </div>
        <div className='bg-gray-50 rounded-lg p-4 border border-gray-100'>
          <div className='text-xs text-stripe-500 mb-1'>市值</div>
          <div className='text-2xl font-bold text-stripe-900'>
            ${(currentPrice * currentSupply).toFixed(2)}
          </div>
          <div className='text-xs text-stripe-400 mt-1'>流通供应</div>
        </div>
      </div>

      {/* 投资计算器 */}
      <div className='mb-6'>
        <label className='block text-sm font-medium text-stripe-700 mb-2'>
          投资金额 (USD)
        </label>
        <div className='flex items-center gap-3'>
          <input
            type='number'
            value={investAmount}
            onChange={e => setInvestAmount(Number(e.target.value))}
            className='flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2 text-stripe-900 focus:outline-none focus:border-green-500 shadow-sm'
            min='0.1'
            step='0.1'
          />
          <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm'>
            购买
          </button>
        </div>
      </div>

      {/* 预估收益 */}
      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='text-xs text-stripe-500 mb-1'>预计获得代币</div>
            <div className='text-xl font-bold text-green-600'>
              {estimatedTokens.toFixed(2)}
            </div>
          </div>
          <div>
            <div className='text-xs text-stripe-500 mb-1'>购买后价格</div>
            <div className='text-xl font-bold text-stripe-900'>
              ${estimatedPrice.toFixed(4)}
            </div>
            <div className='text-xs text-green-600 mt-1'>
              +
              {(((estimatedPrice - currentPrice) / currentPrice) * 100).toFixed(
                2
              )}
              %
            </div>
          </div>
        </div>

        {/* 价格影响警告 */}
        {investAmount > 10 && (
          <div className='mt-3 flex items-center gap-2 text-xs text-yellow-600 bg-yellow-50 rounded p-2 border border-yellow-100'>
            <AlertCircle className='w-4 h-4' />
            大额交易将影响市场价格
          </div>
        )}
      </div>

      {/* 进度条 */}
      <div className='mt-4'>
        <div className='flex justify-between text-xs text-stripe-500 mb-2'>
          <span>进度</span>
          <span>{((currentSupply / targetSupply) * 100).toFixed(1)}%</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-300'
            style={{ width: `${(currentSupply / targetSupply) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// 价格图表组件
const PriceChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('24h')

  // 模拟价格数据
  const generatePriceData = () => {
    const data = []
    const basePrice = 0.1
    for (let i = 0; i < 24; i++) {
      const price = basePrice + Math.random() * 0.05 + i * 0.002
      data.push({
        time: i,
        price: price,
        volume: Math.random() * 1000 + 100,
      })
    }
    return data
  }

  const priceData = generatePriceData()
  const currentPrice = priceData[priceData.length - 1]?.price || 0
  const previousPrice = priceData[priceData.length - 2]?.price || 0
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100

  return (
    <div className='bg-white border border-gray-200 shadow-stripe rounded-xl p-6'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <TrendingUp className='w-5 h-5 text-green-600' />
          <h3 className='text-lg font-bold text-stripe-900'>价格走势</h3>
        </div>
        <div className='flex items-center gap-2'>
          <span
            className={`text-sm font-bold ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
          >
            {priceChange >= 0 ? '+' : ''}
            {priceChange.toFixed(2)}%
          </span>
          <div className='flex gap-1'>
            {['24h', '7d', '30d'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs rounded ${
                  timeframe === tf
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-stripe-500 hover:bg-gray-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 简化版价格图表 */}
      <div className='h-32 relative bg-gray-50 rounded-lg p-4 border border-gray-100'>
        <svg className='w-full h-full'>
          <polyline
            fill='none'
            stroke='#16a34a'
            strokeWidth='2'
            points={priceData
              .map(
                (d, i) =>
                  `${(i / (priceData.length - 1)) * 100},${100 - (d.price - 0.1) * 1000}`
              )
              .join(' ')}
          />
        </svg>
        <div className='absolute bottom-2 left-4 text-xs text-stripe-500'>
          价格: ${currentPrice.toFixed(4)}
        </div>
      </div>

      {/* 交易统计 */}
      <div className='grid grid-cols-3 gap-4 mt-4'>
        <div className='text-center'>
          <div className='text-xs text-stripe-500'>24h 交易量</div>
          <div className='text-lg font-bold text-stripe-900'>
            ${(Math.random() * 50000 + 10000).toFixed(0)}
          </div>
        </div>
        <div className='text-center'>
          <div className='text-xs text-stripe-500'>持有者</div>
          <div className='text-lg font-bold text-stripe-900'>
            {Math.floor(Math.random() * 500 + 100)}
          </div>
        </div>
        <div className='text-center'>
          <div className='text-xs text-stripe-500'>流动性</div>
          <div className='text-lg font-bold text-stripe-900'>
            ${(Math.random() * 20000 + 5000).toFixed(0)}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [currentSupply] = useState(1500) // 当前代币供应量

  if (!id)
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        产品不存在 / Product not found
      </div>
    )

  const project = mockProjectById(id)
  if (!project)
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        产品不存在 / Product not found
      </div>
    )

  const userEarnings = mockUserEarnings()
  const poolFinances = mockPoolFinances()
  const activityLogs = mockActivityLogs()

  const handleSupportOneDollar = () => {
    // TODO: Implement support logic
  }

  const handleShareProject = async () => {
    const shareUrl = window.location.href
    const shareText = `来看看这个 1 美元加速产品：${project.name} - ${project.tagline}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: shareText,
          url: shareUrl,
        })
      } catch (_err) {
        // Share cancelled or failed
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900 font-mono'>
      {/* Pump Style Header */}
      <div className='bg-white/80 border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between py-4'>
            <button
              onClick={() => navigate(-1)}
              className='flex items-center gap-2 text-stripe-500 hover:text-stripe-900 transition-colors'
            >
              <ArrowLeft className='h-4 w-4' />
              <span>返回榜单</span>
            </button>

            <div className='flex items-center gap-4'>
              <button
                onClick={handleShareProject}
                className='flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors text-stripe-900'
              >
                <Share2 className='h-4 w-4' />
                分享
              </button>
              <div className='flex items-center gap-2'>
                <div
                  className={`w-2 h-2 rounded-full ${project.stage === 'live' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}
                />
                <span className='text-sm font-medium text-stripe-900'>
                  {stageLabel[project.stage]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section with Bonding Curve */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left Column - Project Info */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Project Header Card */}
            <div className='bg-white border border-gray-200 shadow-stripe rounded-xl p-6'>
              <div className='flex items-start justify-between mb-4'>
                <div>
                  <h1 className='text-3xl font-black text-stripe-900 mb-2'>
                    {project.name}
                  </h1>
                  <p className='text-stripe-500 text-lg'>{project.tagline}</p>
                </div>
                <div className='text-right'>
                  <div className='text-2xl font-bold text-green-600'>
                    ${project.raisedUsd}
                  </div>
                  <div className='text-sm text-stripe-500'>已筹集</div>
                </div>
              </div>

              <div className='grid grid-cols-4 gap-4 mb-6'>
                <div className='text-center'>
                  <div className='text-xl font-bold text-stripe-900'>
                    {project.supporters}
                  </div>
                  <div className='text-xs text-stripe-500'>支持者</div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-stripe-900'>
                    {project.chain}
                  </div>
                  <div className='text-xs text-stripe-500'>链</div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-stripe-900'>
                    {project.totalTickets}
                  </div>
                  <div className='text-xs text-stripe-500'>票数</div>
                </div>
                <div className='text-center'>
                  <div className='text-xl font-bold text-green-600'>
                    {(
                      (project.raisedUsd / (project.poolTarget || 1)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className='text-xs text-stripe-500'>完成度</div>
                </div>
              </div>

              {/* Progress Bar with Glow Effect */}
              <div className='relative'>
                <div className='w-full bg-gray-100 rounded-full h-3 overflow-hidden'>
                  <div
                    className='bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 h-3 rounded-full relative'
                    style={{
                      width: `${Math.min((project.raisedUsd / (project.poolTarget || 1)) * 100, 100)}%`,
                    }}
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse' />
                  </div>
                </div>
                <div className='flex justify-between text-xs text-stripe-500 mt-2'>
                  <span>
                    ${project.raisedUsd} / ${project.poolTarget}
                  </span>
                  <span>目标 ${project.poolTarget}</span>
                </div>
              </div>
            </div>

            {/* Bonding Curve Calculator */}
            <BondingCurveCalculator
              currentSupply={currentSupply}
              targetSupply={5000}
            />

            {/* Price Chart */}
            <PriceChart />
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className='space-y-6'>
            {/* Quick Buy Card */}
            <div className='bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Rocket className='w-5 h-5 text-green-600' />
                <h3 className='text-lg font-bold text-stripe-900'>立即购买</h3>
              </div>

              <div className='space-y-3 mb-4'>
                <button
                  onClick={handleSupportOneDollar}
                  className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-md'
                >
                  <Zap className='w-5 h-5' fill='white' />
                  投入 1U 燃料
                </button>

                <button className='w-full bg-white hover:bg-gray-50 text-stripe-900 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-200 shadow-sm'>
                  自定义金额
                </button>
              </div>

              <div className='text-xs text-stripe-500 text-center'>
                1U = 1票 = 项目治理权
              </div>
            </div>

            {/* User Earnings Card */}
            <UserEarningsCard earnings={userEarnings} />

            {/* Pool Stats */}
            <MoneyFlowCard finances={poolFinances} />

            {/* Hot Indicator */}
            <div className='bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6'>
              <div className='flex items-center gap-2 mb-3'>
                <Flame className='w-5 h-5 text-orange-500' />
                <h3 className='text-lg font-bold text-stripe-900'>热度指标</h3>
              </div>

              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-stripe-500'>24h 增长</span>
                  <span className='text-green-600 font-bold'>
                    +{(Math.random() * 50 + 10).toFixed(1)}%
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-stripe-500'>交易活跃度</span>
                  <span className='text-orange-500 font-bold'>高</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-stripe-500'>趋势</span>
                  <span className='text-green-600 font-bold'>↗ 上升</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8'>
          {/* Discussion */}
          <div className='lg:col-span-2'>
            <DiscussionPreview _projectId={project.id} />
          </div>

          {/* Activity & Details */}
          <div className='space-y-6'>
            <ActivityTimeline activities={activityLogs} />

            {/* Collapsible Project Details */}
            <div className='bg-white border border-gray-200 shadow-stripe rounded-xl overflow-hidden'>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className='w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors'
              >
                <h3 className='font-bold text-stripe-900'>产品详情</h3>
                {showDetails ? (
                  <ChevronUp className='h-5 w-5 text-stripe-500' />
                ) : (
                  <ChevronDown className='h-5 w-5 text-stripe-500' />
                )}
              </button>

              {showDetails && (
                <div className='p-4 border-t border-gray-200 space-y-4'>
                  <div>
                    <h4 className='font-medium text-stripe-700 mb-2'>
                      项目目标
                    </h4>
                    <p className='text-stripe-500 text-sm'>
                      {project.roundGoal}
                    </p>
                  </div>

                  <div>
                    <h4 className='font-medium text-stripe-700 mb-2'>里程碑</h4>
                    <div className='space-y-2'>
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className='flex items-start gap-2'>
                          <div className='w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700 mt-0.5'>
                            {index + 1}
                          </div>
                          <p className='text-stripe-500 text-sm'>{milestone}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {project.fundingPlan && (
                    <div>
                      <h4 className='font-medium text-stripe-700 mb-2'>
                        资金用途
                      </h4>
                      <p className='text-stripe-500 text-sm'>
                        {project.fundingPlan}
                      </p>
                    </div>
                  )}

                  <div className='flex items-center gap-2 pt-2'>
                    <Mail className='h-4 w-4 text-stripe-400' />
                    <a
                      href={`mailto:${project.email}`}
                      className='text-stripe-500 hover:text-stripe-900 text-sm transition-colors'
                    >
                      {project.email}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {project.hasVideo && project.videoUrl && (
        <VideoModal
          videoUrl={project.videoUrl}
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}
    </div>
  )
}

export default ProjectDetailPage
