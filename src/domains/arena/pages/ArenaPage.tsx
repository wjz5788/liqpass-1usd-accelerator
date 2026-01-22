import React, { useState } from 'react'
import { Calendar, Users, Award, Shield, ArrowRight, Clock, Zap, ExternalLink } from 'lucide-react'

interface Competition {
  id: string
  title: string
  type: 'human-vs-ai' | 'official' | 'user-created'
  timeRange: string
  maxLeverage: number
  allowsInsurance: boolean
  prizePool: string
  tags: string[]
  status: 'active' | 'upcoming' | 'ended'
  // 新增字段
  currentParticipants: number
  maxParticipants?: number
  currentPrizePool: string
  signupDeadline: string
  protectionMode: 'real' | 'simulated'
  subTitle: string
}

const ArenaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'history' | 'my-stats'>('active')

  const competitions: Competition[] = [
    {
      id: '1',
      title: 'BTC 永续·7 天挑战赛',
      type: 'human-vs-ai',
      timeRange: '2024-01-15 至 2024-01-22',
      maxLeverage: 10,
      allowsInsurance: true,
      prizePool: '50,000 USDT',
      tags: ['人 vs AI', '官方赛', '高杠杆'],
      status: 'active',
      currentParticipants: 23,
      maxParticipants: 100,
      currentPrizePool: '50,000 USDT',
      signupDeadline: '2024-01-14 23:59:59',
      protectionMode: 'real',
      subTitle: '实盘 · 接入 OKX 只读 API'
    },
    {
      id: '2',
      title: 'ETH 季度合约·月度擂台',
      type: 'official',
      timeRange: '2024-02-01 至 2024-02-28',
      maxLeverage: 5,
      allowsInsurance: false,
      prizePool: '100,000 USDT',
      tags: ['官方赛', '稳健型', '团队赛'],
      status: 'upcoming',
      currentParticipants: 15,
      maxParticipants: 200,
      currentPrizePool: '100,000 USDT',
      signupDeadline: '2024-01-31 23:59:59',
      protectionMode: 'simulated',
      subTitle: '实盘 · 接入 Binance 只读 API'
    },
    {
      id: '3',
      title: '山寨币组合·周度挑战',
      type: 'user-created',
      timeRange: '2024-01-10 至 2024-01-17',
      maxLeverage: 20,
      allowsInsurance: true,
      prizePool: '10,000 USDT',
      tags: ['用户自办赛', '高风险', '高收益'],
      status: 'ended',
      currentParticipants: 45,
      maxParticipants: 50,
      currentPrizePool: '10,000 USDT',
      signupDeadline: '2024-01-09 23:59:59',
      protectionMode: 'real',
      subTitle: '实盘 · 接入 Bybit 只读 API'
    }
  ]

  const filteredCompetitions = competitions.filter(comp => {
    if (activeTab === 'active') return comp.status === 'active'
    if (activeTab === 'upcoming') return comp.status === 'upcoming'
    if (activeTab === 'history') return comp.status === 'ended'
    return true
  })

  // 计算倒计时函数
  const calculateTimeToDeadline = (deadline: string) => {
    const now = new Date().getTime()
    const deadlineTime = new Date(deadline).getTime()
    const diff = deadlineTime - now
    
    if (diff <= 0) return '已截止'
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // 页面层面聚合数据
  const activeSeason = competitions.find(comp => comp.status === 'active')
  const totalParticipants = competitions
    .filter(comp => comp.status === 'active' || comp.status === 'upcoming')
    .reduce((sum, comp) => sum + comp.currentParticipants, 0)
  
  const currentPrizePool = activeSeason ? activeSeason.currentPrizePool : '0 USDC'
  const timeToDeadline = activeSeason ? calculateTimeToDeadline(activeSeason.signupDeadline) : '--:--:--'

  const getTypeIcon = (type: Competition['type']) => {
    switch (type) {
      case 'human-vs-ai': return <Users className="h-4 w-4" />
      case 'official': return <Award className="h-4 w-4" />
      case 'user-created': return <Zap className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Competition['type']) => {
    switch (type) {
      case 'human-vs-ai': return 'bg-purple-100 text-purple-800'
      case 'official': return 'bg-blue-100 text-blue-800'
      case 'user-created': return 'bg-green-100 text-green-800'
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">比赛区 · 擂台 / 挑战</h1>
          <div className="space-y-1">
            <p className="text-xl text-gray-900">人 / AI / 队伍，用真实交易所账户，在同一张收益曲线上打擂台。</p>
            <p className="text-lg text-gray-600">所有成绩来自只读 API，可接入爆仓保护。</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1 max-w-md mx-auto">
          {[
            { key: 'active' as const, label: '进行中的赛季' },
            { key: 'upcoming' as const, label: '即将开始' },
            { key: 'history' as const, label: '历史赛季' },
            { key: 'my-stats' as const, label: '我的战绩' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 赛季概览信息条 */}
        {(activeTab === 'active' || activeTab === 'upcoming') && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="text-center text-sm text-gray-700">
              本期已报名：<span className="font-bold text-gray-900">{totalParticipants} 个账户</span> · 
              当前奖金池：<span className="font-bold text-gray-900">{currentPrizePool}</span> · 
              报名截止：<span className="font-bold text-gray-900">{timeToDeadline}</span>
            </div>
          </div>
        )}

        {/* Competitions List */}
        <div className="space-y-6">
          {filteredCompetitions.map((competition) => (
            <div key={competition.id} className="card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  {/* 标题区域 */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{competition.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(competition.type)}`}>
                      {getTypeIcon(competition.type)}
                      <span className="ml-1">
                        {competition.type === 'human-vs-ai' ? '人 vs AI' : 
                         competition.type === 'official' ? '官方赛' : '用户自办赛'}
                      </span>
                    </span>
                  </div>
                  
                  {/* 副标题 */}
                  <p className="text-sm text-gray-500 mb-4">{competition.subTitle}</p>
                  
                  {/* 信息区域 */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{competition.timeRange}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        已报名：{competition.currentParticipants}{competition.maxParticipants ? ` / ${competition.maxParticipants}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>最大杠杆: {competition.maxLeverage}x</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>奖金池: {competition.prizePool}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span className={competition.protectionMode === 'real' ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                          {competition.protectionMode === 'real' ? '内含赛季爆仓保护' : '支持爆仓保护模拟'}
                        </span>
                      </div>
                      {competition.protectionMode === 'real' ? (
                        <div className="text-xs text-gray-500 ml-6">赛季内首次清算，最高赔付 100 USDC</div>
                      ) : (
                        <div className="text-xs text-gray-500 ml-6">赛后展示「如果有保险，可挽回多少」</div>
                      )}
                    </div>
                  </div>

                  {/* 标签区域 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {competition.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 按钮区域 */}
                <div className="flex space-x-3 mt-4 lg:mt-0">
                  <button className="btn btn-secondary flex items-center space-x-2">
                    <span>查看详情</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  {competition.status === 'active' && (
                    <button className="btn btn-primary flex items-center space-x-2">
                      <span>立即报名参赛</span>
                      <Clock className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 挑战赛 · 用户自建盘（即将上线） */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">挑战赛 · 用户自建盘（即将上线）</h3>
          <div className="card p-8 bg-gray-50 border-dashed border-2 border-gray-300">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">每个交易者都能开一场自己的小比赛</h4>
              <div className="space-y-2 text-gray-600">
                <p>未来，你可以自定义规则、标的和周期，发起一场属于自己的挑战赛，让其他人来跟你打擂台。</p>
                <p>功能开发中，敬请期待。</p>
              </div>
              <div className="mt-6">
                <button className="btn btn-secondary flex items-center space-x-2 mx-auto opacity-50 cursor-not-allowed" disabled>
                  <span>功能开发中</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Modules */}
        <div className="mt-12 grid lg:grid-cols-3 gap-8">
          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">本周热门比赛</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">BTC 永续挑战赛</span>
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">热门</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">ETH 月度擂台</span>
                <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">热门</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">官方推荐赛事</h4>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">新手友好 · 低风险</div>
              <div className="text-sm text-gray-600">高收益挑战 · 专业级</div>
            </div>
          </div>

          <div className="card p-6">
            <h4 className="font-semibold text-gray-900 mb-4">比赛规则说明</h4>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              查看详细规则 →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArenaPage