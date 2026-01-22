import React from 'react'
import { Link } from 'react-router-dom'
import { Trophy, TrendingUp, Shield, ArrowRight, Star } from 'lucide-react'

const HomePage: React.FC = () => {
  const features = [
    {
      title: '比赛区',
      description: '人 / AI / 队伍，在同一张收益曲线上打擂台',
      icon: Trophy,
      path: '/arena',
      buttonText: '进入比赛',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      title: '策略区',
      description: '官方套餐 + 用户自建盘，统一在这里管理',
      icon: TrendingUp,
      path: '/strategies',
      buttonText: '查看策略',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: '保险区',
      description: '为高杠杆仓位加一层简单、透明的保护',
      icon: Shield,
      path: '/insurance',
      buttonText: '购买保险',
      color: 'from-blue-500 to-cyan-500',
    },
  ]

  return (
    <div className='min-h-screen bg-stripe-50'>
      {/* Hero Banner */}
      <section className='bg-gradient-to-br from-stripe-50 via-white to-accent-50 py-24 relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-5xl md:text-7xl font-bold text-stripe-900 mb-8 tracking-tight'>
              AI 量化时代 · <span className='text-accent-600'>交易风险 OS</span>
            </h1>
            <p className='text-xl text-stripe-500 mb-10 max-w-3xl mx-auto leading-relaxed'>
              一站式爆仓保护、量化比赛、策略管理平台，让交易更安全、更智能
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className='card-hover p-8 text-center bg-white border border-gray-100 rounded-2xl shadow-stripe group'
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='text-2xl font-bold text-stripe-900 mb-4'>
                    {feature.title}
                  </h3>
                  <p className='text-stripe-500 mb-8 leading-relaxed'>
                    {feature.description}
                  </p>
                  <Link
                    to={feature.path}
                    className='btn btn-primary inline-flex items-center space-x-2'
                  >
                    <span>{feature.buttonText}</span>
                    <ArrowRight className='h-4 w-4' />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className='py-20 bg-stripe-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-stripe-900 mb-4'>
              为什么选择 LiqPass？
            </h2>
          </div>
          <div className='grid md:grid-cols-2 gap-12 max-w-4xl mx-auto'>
            <div className='space-y-8'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-stripe flex items-center justify-center text-accent-500'>
                  <Star className='h-6 w-6' />
                </div>
                <div>
                  <h4 className='text-lg font-bold text-stripe-900 mb-2'>
                    一体化解决方案
                  </h4>
                  <p className='text-stripe-500 leading-relaxed'>
                    爆仓保护、量化比赛、策略管理，一站式满足您的交易需求
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-stripe flex items-center justify-center text-accent-500'>
                  <Star className='h-6 w-6' />
                </div>
                <div>
                  <h4 className='text-lg font-bold text-stripe-900 mb-2'>
                    AI智能风控
                  </h4>
                  <p className='text-stripe-500 leading-relaxed'>
                    基于AI算法的实时风险监控和预警系统
                  </p>
                </div>
              </div>
            </div>
            <div className='space-y-8'>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-stripe flex items-center justify-center text-accent-500'>
                  <Star className='h-6 w-6' />
                </div>
                <div>
                  <h4 className='text-lg font-bold text-stripe-900 mb-2'>
                    透明公正
                  </h4>
                  <p className='text-stripe-500 leading-relaxed'>
                    所有比赛规则、保险条款、策略收益完全透明
                  </p>
                </div>
              </div>
              <div className='flex items-start space-x-4'>
                <div className='flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-stripe flex items-center justify-center text-accent-500'>
                  <Star className='h-6 w-6' />
                </div>
                <div>
                  <h4 className='text-lg font-bold text-stripe-900 mb-2'>
                    社区驱动
                  </h4>
                  <p className='text-stripe-500 leading-relaxed'>
                    活跃的交易社区，共享策略，共同成长
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='text-center mt-16'>
            <Link
              to='/strategies'
              className='btn btn-secondary inline-flex items-center space-x-2 px-8 py-3'
            >
              <span>了解更多</span>
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
