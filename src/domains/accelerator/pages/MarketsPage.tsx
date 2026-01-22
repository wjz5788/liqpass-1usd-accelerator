import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Market {
  id: string
  title: string
  description: string
  category: string
  endTime: string
  totalVolume: number
  options: {
    id: string
    name: string
    odds: number
    volume: number
  }[]
  status: 'active' | 'resolved' | 'upcoming'
}

const mockMarkets: Market[] = [
  {
    id: '1',
    title: 'Solana 价格会在 1 月 20 日前突破 $200 吗？',
    description: '预测 Solana 代币价格在指定时间前是否突破 $200 美元',
    category: '价格预测',
    endTime: '2024-01-20T00:00:00Z',
    totalVolume: 45000,
    status: 'active',
    options: [
      { id: '1a', name: '会突破', odds: 65, volume: 29250 },
      { id: '1b', name: '不会突破', odds: 35, volume: 15750 },
    ],
  },
  {
    id: '2',
    title: '哪个项目会赢得本次黑客松冠军？',
    description: '预测本次区块链黑客松的冠军项目',
    category: '比赛结果',
    endTime: '2024-01-25T18:00:00Z',
    totalVolume: 32000,
    status: 'active',
    options: [
      { id: '2a', name: 'AI 数据分析工具', odds: 40, volume: 12800 },
      { id: '2b', name: '跨链流动性协议', odds: 30, volume: 9600 },
      { id: '2c', name: '社交协议', odds: 20, volume: 6400 },
      { id: '2d', name: '其他项目', odds: 10, volume: 3200 },
    ],
  },
  {
    id: '3',
    title: 'ETH 2 月平均 Gas 费会低于 30 gwei 吗？',
    description: '预测以太坊网络 2 月份平均 Gas 费用',
    category: '网络指标',
    endTime: '2024-02-01T00:00:00Z',
    totalVolume: 28000,
    status: 'upcoming',
    options: [
      { id: '3a', name: '会低于', odds: 55, volume: 15400 },
      { id: '3b', name: '不会低于', odds: 45, volume: 12600 },
    ],
  },
  {
    id: '4',
    title: '某 DeFi 协议 TVL 会在月底前达到 10 亿吗？',
    description: '预测指定 DeFi 协议的总锁仓价值',
    category: 'DeFi 指标',
    endTime: '2024-01-31T23:59:59Z',
    totalVolume: 18000,
    status: 'resolved',
    options: [
      { id: '4a', name: '会达到', odds: 25, volume: 4500 },
      { id: '4b', name: '不会达到', odds: 75, volume: 13500 },
    ],
  },
]

const categories = ['全部', '价格预测', '比赛结果', '网络指标', 'DeFi 指标']

const MarketsPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  // TODO: Implement market selection
  // const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [_, setSelectedMarket] = useState<string | null>(null)

  const filteredMarkets =
    selectedCategory === '全部'
      ? mockMarkets
      : mockMarkets.filter(market => market.category === selectedCategory)

  const handleMarketClick = (marketId: string) => {
    setSelectedMarket(marketId)
  }

  const handlePlaceBet = (_marketId: string, _optionId: string) => {
    // TODO: Implement betting logic
  }

  const formatTimeLeft = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return '已结束'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}天`
    return `${hours}小时`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'resolved':
        return 'bg-blue-100 text-blue-700'
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={() => navigate('/accelerator')}
              className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              返回加速器
            </button>
          </div>

          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            📊 盘口区 · Markets
          </h1>
          <p className='text-gray-600'>
            围绕项目、黑客松结果、策略表现开各种盘口，用流量和情绪为项目试水。
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              总盘口数
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockMarkets.length}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              活跃盘口
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockMarkets.filter(m => m.status === 'active').length}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              总投注额
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              $
              {mockMarkets
                .reduce((sum, m) => sum + m.totalVolume, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              已解决盘口
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockMarkets.filter(m => m.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className='flex flex-wrap gap-2 mb-6'>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Markets Grid */}
        <div className='grid gap-6 md:grid-cols-2'>
          {filteredMarkets.map(market => (
            <div
              key={market.id}
              className='rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-shadow duration-200'
            >
              <div className='flex items-center justify-between mb-4'>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(market.status)}`}
                >
                  {market.status === 'active' && '进行中'}
                  {market.status === 'resolved' && '已结束'}
                  {market.status === 'upcoming' && '即将开始'}
                </span>
                <span className='text-xs text-gray-500'>{market.category}</span>
              </div>

              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                {market.title}
              </h3>
              <p className='text-sm text-gray-600 mb-4'>{market.description}</p>

              <div className='mb-4'>
                <div className='flex items-center justify-between text-sm text-gray-500 mb-2'>
                  <span>总投注额: ${market.totalVolume.toLocaleString()}</span>
                  <span>结束: {formatTimeLeft(market.endTime)}</span>
                </div>
              </div>

              {/* Options */}
              <div className='space-y-3 mb-4'>
                {market.options.map(option => (
                  <div
                    key={option.id}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900'>
                        {option.name}
                      </p>
                      <p className='text-xs text-gray-500'>
                        投注额: ${option.volume.toLocaleString()} ({option.odds}
                        %)
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-gray-900'>
                        {option.odds}%
                      </p>
                      <p className='text-xs text-gray-500'>胜率</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex gap-2'>
                <button
                  onClick={() => handleMarketClick(market.id)}
                  className='flex-1 inline-flex items-center justify-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200'
                >
                  查看详情
                </button>
                {market.status === 'active' && (
                  <button
                    onClick={() =>
                      handlePlaceBet(market.id, market.options[0].id)
                    }
                    className='flex-1 inline-flex items-center justify-center rounded-xl bg-blue-500 text-white px-4 py-2 text-sm font-medium hover:bg-blue-600'
                  >
                    立即投注
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Create Market */}
          <div className='rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col justify-between'>
            <div>
              <p className='text-lg font-semibold text-gray-900 mb-2'>
                想自己开一个盘口？
              </p>
              <p className='text-sm text-gray-500 mb-4'>
                选择标的、结果条件、结算时间，系统自动帮你算赔率和资金分配。
              </p>
              <div className='space-y-2 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <span className='text-green-500'>•</span>
                  <span>自定义预测话题</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-green-500'>•</span>
                  <span>灵活设置结算条件</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-green-500'>•</span>
                  <span>自动计算赔率</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/accelerator/create-market')}
              className='mt-4 inline-flex items-center justify-center rounded-xl border border-gray-400 px-4 py-2 text-sm font-medium hover:bg-gray-100'
            >
              创建盘口
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketsPage
