import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, Users, DollarSign, Zap } from 'lucide-react'

interface LiveTickerItem {
  id: string
  type: 'lucky' | 'prediction' | 'pool'
  content: string
  timestamp: string
}

interface ProjectCard {
  id: string
  name: string
  code: string
  logo: string
  status: 'hot' | 'active' | 'normal'
  lootPool: number
  predictionPool: number
  participants: number
  progress: number
}

interface WinnerItem {
  id: string
  avatar: string
  username: string
  type: 'lucky' | 'prediction'
  project: string
  amount: number
  timestamp: string
}

const RewardHallPage: React.FC = () => {
  const [liveTicker, setLiveTicker] = useState<LiveTickerItem[]>([
    {
      id: '1',
      type: 'lucky',
      content: '🎉 用户 0x...A12 在 [Doge2] 抽中 $50',
      timestamp: '刚刚',
    },
    {
      id: '2',
      type: 'prediction',
      content: '🏆 用户 0x...B99 预测 [SpaceX] 成功，赢取 $1,200',
      timestamp: '3分钟前',
    },
    {
      id: '3',
      type: 'pool',
      content: '🚀 [PepeAI] 盘口奖池已累积至 $45,000',
      timestamp: '5分钟前',
    },
    {
      id: '4',
      type: 'lucky',
      content: '🎉 用户 0x...C88 在 [CatWifHat] 抽中 $100',
      timestamp: '10分钟前',
    },
  ])

  const [projects] = useState<ProjectCard[]>([
    {
      id: '1',
      name: 'CatWifHat',
      code: 'CWIF',
      logo: '🐱',
      status: 'hot',
      lootPool: 2500,
      predictionPool: 45000,
      participants: 2340,
      progress: 80,
    },
    {
      id: '2',
      name: 'Doge2',
      code: 'DOGE2',
      logo: '🐶',
      status: 'active',
      lootPool: 500,
      predictionPool: 10000,
      participants: 890,
      progress: 60,
    },
    {
      id: '3',
      name: 'PepeAI',
      code: 'PEPEAI',
      logo: '🤖',
      status: 'hot',
      lootPool: 1800,
      predictionPool: 32000,
      participants: 1560,
      progress: 45,
    },
    {
      id: '4',
      name: 'SpaceX',
      code: 'SPACEX',
      logo: '🚀',
      status: 'normal',
      lootPool: 1200,
      predictionPool: 28000,
      participants: 1120,
      progress: 30,
    },
  ])

  const [winners, setWinners] = useState<WinnerItem[]>([
    {
      id: '1',
      avatar: '😎',
      username: 'User88',
      type: 'lucky',
      project: 'CatWifHat',
      amount: 50,
      timestamp: '刚刚',
    },
    {
      id: '2',
      avatar: '😎',
      username: 'User99',
      type: 'lucky',
      project: 'Doge2',
      amount: 10,
      timestamp: '2分钟前',
    },
    {
      id: '3',
      avatar: '🤓',
      username: 'Predictor77',
      type: 'prediction',
      project: 'SpaceX',
      amount: 1200,
      timestamp: '5分钟前',
    },
    {
      id: '4',
      avatar: '😎',
      username: 'User66',
      type: 'lucky',
      project: 'PepeAI',
      amount: 25,
      timestamp: '8分钟前',
    },
  ])

  const [activeWinnersTab, setActiveWinnersTab] = useState<
    'lucky' | 'predictors'
  >('lucky')

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTicker(prev => {
        const newItem: LiveTickerItem = {
          id: Date.now().toString(),
          type: Math.random() > 0.5 ? 'lucky' : 'prediction',
          content:
            Math.random() > 0.5
              ? `🎉 用户 0x...${Math.random().toString(36).substr(2, 4).toUpperCase()} 在 [${projects[Math.floor(Math.random() * projects.length)].name}] 抽中 $${Math.floor(Math.random() * 200) + 10}`
              : `🏆 用户 0x...${Math.random().toString(36).substr(2, 4).toUpperCase()} 预测 [${projects[Math.floor(Math.random() * projects.length)].name}] 成功，赢取 $${Math.floor(Math.random() * 1500) + 100}`,
          timestamp: '刚刚',
        }
        return [newItem, ...prev.slice(0, 3)]
      })

      setWinners(prev => {
        const newWinner: WinnerItem = {
          id: Date.now().toString(),
          avatar: '😎',
          username: `User${Math.floor(Math.random() * 100)}`,
          type: Math.random() > 0.5 ? 'lucky' : 'prediction',
          project: projects[Math.floor(Math.random() * projects.length)].name,
          amount: Math.floor(Math.random() * 200) + 10,
          timestamp: '刚刚',
        }
        return [newWinner, ...prev.slice(0, 3)]
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [projects])

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'hot':
        return (
          <span className='bg-red-50 text-red-600 px-2 py-1 text-xs rounded-full border border-red-200'>
            🔥 热度高
          </span>
        )
      case 'active':
        return (
          <span className='bg-green-50 text-green-600 px-2 py-1 text-xs rounded-full border border-green-200'>
            🟢 正在抽奖
          </span>
        )
      default:
        return (
          <span className='bg-stripe-100 text-stripe-600 px-2 py-1 text-xs rounded-full'>
            ⚪ 正常
          </span>
        )
    }
  }

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900'>
      <div className='bg-white border-b border-stripe-200 py-2 overflow-hidden'>
        <div className='flex space-x-8 animate-marquee whitespace-nowrap'>
          {liveTicker.map(item => (
            <div key={item.id} className='flex items-center space-x-4'>
              <span className='text-brand-600 font-semibold'>
                {item.content}
              </span>
              <span className='text-stripe-400 text-sm'>{item.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      <div className='py-8 px-4'>
        <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white border border-stripe-200 rounded-xl p-6 text-center shadow-stripe group hover:border-brand-400 transition-colors'>
            <DollarSign className='h-8 w-8 text-brand-500 mx-auto mb-2' />
            <div className='text-3xl font-bold text-brand-600 mb-1'>
              ${formatNumber(2140500)}
            </div>
            <div className='text-stripe-500'>累计发放奖金</div>
          </div>

          <div className='bg-white border border-stripe-200 rounded-xl p-6 text-center shadow-stripe group hover:border-green-400 transition-colors'>
            <Trophy className='h-8 w-8 text-green-500 mx-auto mb-2' />
            <div className='text-3xl font-bold text-green-600 mb-1'>
              ${formatNumber(358000)}
            </div>
            <div className='text-stripe-500'>当前总奖池</div>
          </div>

          <div className='bg-white border border-stripe-200 rounded-xl p-6 text-center shadow-stripe group hover:border-accent-500 transition-colors'>
            <Users className='h-8 w-8 text-accent-500 mx-auto mb-2' />
            <div className='text-3xl font-bold text-accent-600 mb-1'>
              {formatNumber(15420)}
            </div>
            <div className='text-stripe-500'>今日参与人次</div>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-4'>
            <h2 className='text-2xl font-bold text-stripe-900 mb-4'>
              🔥 热门项目
            </h2>

            {projects.map(project => (
              <div
                key={project.id}
                className='bg-white border border-stripe-200 rounded-xl p-4 hover:border-stripe-300 transition-all duration-300 shadow-stripe'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='text-3xl'>{project.logo}</div>
                    <div>
                      <div className='flex items-center space-x-2'>
                        <h3 className='text-lg font-bold text-stripe-900'>
                          {project.name}
                        </h3>
                        <span className='text-stripe-400'>{project.code}</span>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 my-4'>
                  <div className='bg-brand-50 border border-brand-200 rounded-lg p-3'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <span className='text-brand-500'>🎁</span>
                      <span className='text-brand-900 font-semibold'>
                        短期·抽奖池
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-brand-600'>
                      ${formatNumber(project.lootPool)}
                    </div>
                    <div className='text-brand-700 text-sm'>
                      每1U对应1次机会
                    </div>
                  </div>

                  <div className='bg-purple-50 border border-purple-200 rounded-lg p-3'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <span className='text-purple-500'>🔮</span>
                      <span className='text-purple-900 font-semibold'>
                        未来·盘口池
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-purple-600'>
                      ${formatNumber(project.predictionPool)}
                    </div>
                    <div className='text-purple-700 text-sm'>
                      预测胜败瓜分大奖
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='text-stripe-500'>
                    👥 参与人数: {formatNumber(project.participants)}人 (1U/人)
                  </div>
                  <button className='bg-gradient-to-r from-brand-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-brand-600 hover:to-orange-600 transition-all duration-300 flex items-center space-x-2 shadow-sm'>
                    <Zap className='h-4 w-4' />
                    <span>⚡️ 1U 加速</span>
                  </button>
                </div>

                <div className='mt-3'>
                  <div className='w-full bg-stripe-100 rounded-full h-2'>
                    <div
                      className='bg-gradient-to-r from-brand-500 to-orange-500 h-2 rounded-full transition-all duration-500'
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-white border border-stripe-200 rounded-xl p-4 shadow-stripe'>
            <div className='flex space-x-2 mb-4'>
              <button
                onClick={() => setActiveWinnersTab('lucky')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeWinnersTab === 'lucky'
                    ? 'bg-brand-500 text-white'
                    : 'bg-stripe-100 text-stripe-500 hover:bg-stripe-200'
                }`}
              >
                幸运榜
              </button>
              <button
                onClick={() => setActiveWinnersTab('predictors')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  activeWinnersTab === 'predictors'
                    ? 'bg-purple-600 text-white'
                    : 'bg-stripe-100 text-stripe-500 hover:bg-stripe-200'
                }`}
              >
                预测大神
              </button>
            </div>

            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {winners
                .filter(winner =>
                  activeWinnersTab === 'lucky'
                    ? winner.type === 'lucky'
                    : winner.type === 'prediction'
                )
                .map(winner => (
                  <div
                    key={winner.id}
                    className='bg-stripe-50 rounded-lg p-3 hover:bg-stripe-100 transition-all duration-300 border border-stripe-100'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <span className='text-2xl'>{winner.avatar}</span>
                        <div>
                          <div className='font-semibold text-stripe-900'>
                            {winner.username}
                          </div>
                          <div className='text-stripe-400 text-sm'>
                            {winner.type === 'lucky'
                              ? `在 [${winner.project}] 抽中`
                              : `预测 [${winner.project}] 成功`}
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div
                          className={`text-lg font-bold ${
                            winner.type === 'lucky'
                              ? 'text-brand-600'
                              : 'text-purple-600'
                          }`}
                        >
                          ${formatNumber(winner.amount)}
                        </div>
                        <div className='text-stripe-400 text-sm'>
                          {winner.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className='border-t border-stripe-200 py-4'>
        <div className='max-w-7xl mx-auto px-4 flex justify-center'>
          <Link
            to='/'
            className='text-stripe-400 hover:text-stripe-900 transition-colors duration-300'
          >
            ← 返回首页
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}
      </style>
    </div>
  )
}

export default RewardHallPage
