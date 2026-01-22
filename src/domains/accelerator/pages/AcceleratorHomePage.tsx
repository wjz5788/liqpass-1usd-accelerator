import React, { useState, useEffect } from 'react'
import {
  Trophy,
  Zap,
  TrendingUp,
  Clock,
  Users,
  Flame,
  Rocket,
  Star,
  Play,
  Heart,
  Share2,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'

import { WalletButton } from '../../../wallet/WalletButton'

interface PredictionCardProps {
  title: string
  prize: string
  participants: number
  timeLeft: string
  category: string
  image: string
  trend: 'up' | 'down'
  probability: number
}

interface ProjectCardProps {
  name: string
  symbol: string
  price: string
  marketCap: string
  progress: number
  holders: number
  image: string
  isHot: boolean
  isNew: boolean
}

const PredictionCard: React.FC<PredictionCardProps> = ({
  title,
  prize,
  participants,
  timeLeft,
  category,
  image,
  trend,
  probability,
}) => {
  const [isLiked, setIsLiked] = useState(false)

  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-stripe hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 group overflow-hidden'>
      <div className='relative h-40 overflow-hidden'>
        <img
          src={image}
          alt={title}
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-stripe-900 flex items-center space-x-1'>
          <span>{category}</span>
        </div>
        <div className='absolute bottom-3 left-3 text-white'>
          <div className='flex items-center space-x-1 mb-1'>
            <Users className='w-3 h-3 text-white/80' />
            <span className='text-xs font-medium'>{participants} 参与</span>
          </div>
        </div>
        <div className='absolute bottom-3 right-3'>
          <div className='bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center space-x-1'>
            <Trophy className='w-3 h-3' />
            <span>{prize}</span>
          </div>
        </div>
      </div>

      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-bold text-stripe-900 leading-tight group-hover:text-accent-600 transition-colors flex-1 mr-2'>
            {title}
          </h3>
          <div
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
          >
            {trend === 'up' ? (
              <TrendingUp className='w-3 h-3' />
            ) : (
              <TrendingUp className='w-3 h-3 rotate-180' />
            )}
            <span>{probability}%</span>
          </div>
        </div>

        <div className='flex items-center justify-between text-stripe-500 text-xs mt-4 pt-4 border-t border-gray-50'>
          <div className='flex items-center space-x-1'>
            <Clock className='w-3 h-3' />
            <span>{timeLeft} 后结束</span>
          </div>

          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-1.5 rounded-full transition-colors ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button className='p-1.5 text-gray-400 hover:text-accent-600 hover:bg-accent-50 rounded-full transition-colors'>
              <Share2 className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  symbol,
  price,
  marketCap,
  progress,
  holders,
  image,
  isHot,
  isNew,
}) => {
  return (
    <div className='bg-white rounded-xl border border-gray-100 shadow-stripe hover:shadow-lifted hover:-translate-y-1 transition-all duration-300 p-5 group relative'>
      {(isHot || isNew) && (
        <div className='absolute top-0 right-0 p-3 flex space-x-2'>
          {isHot && (
            <span className='bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center space-x-1 border border-orange-100'>
              <Flame className='w-3 h-3' />
              <span>热门</span>
            </span>
          )}
          {isNew && (
            <span className='bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold flex items-center space-x-1 border border-blue-100'>
              <Star className='w-3 h-3' />
              <span>新币</span>
            </span>
          )}
        </div>
      )}

      <div className='flex items-center space-x-4 mb-5'>
        <div className='relative'>
          <img
            src={image}
            alt={name}
            className='w-14 h-14 rounded-xl shadow-sm object-cover'
          />
          <div className='absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm'>
            <div className='w-4 h-4 bg-brand-500 rounded-full border-2 border-white'></div>
          </div>
        </div>
        <div>
          <h3 className='font-bold text-stripe-900 text-lg'>{name}</h3>
          <p className='text-stripe-500 text-sm font-medium font-mono'>
            ${symbol}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4 mb-5'>
        <div className='bg-gray-50 rounded-lg p-3'>
          <div className='text-xs text-stripe-500 mb-1'>价格</div>
          <div className='text-sm font-bold text-stripe-900 font-mono'>
            ${price}
          </div>
        </div>
        <div className='bg-gray-50 rounded-lg p-3'>
          <div className='text-xs text-stripe-500 mb-1'>市值</div>
          <div className='text-sm font-bold text-stripe-900 font-mono'>
            ${marketCap}
          </div>
        </div>
      </div>

      <div className='mb-5'>
        <div className='flex justify-between items-center mb-2'>
          <span className='text-xs font-semibold text-stripe-600'>
            募资进度
          </span>
          <span className='text-xs font-bold text-brand-600'>{progress}%</span>
        </div>
        <div className='w-full bg-gray-100 rounded-full h-2.5 overflow-hidden'>
          <div
            className='bg-gradient-to-r from-brand-400 to-brand-500 h-full rounded-full transition-all duration-500 relative'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute inset-0 bg-white/20' />
          </div>
        </div>
        <div className='mt-2 flex justify-between text-xs text-stripe-500'>
          <span>{holders} 持有者</span>
          <span>目标 100%</span>
        </div>
      </div>

      <button className='w-full btn btn-primary flex items-center justify-center space-x-2 py-2.5'>
        <Rocket className='w-4 h-4' />
        <span>立即参与</span>
      </button>
    </div>
  )
}

const AcceleratorHomePage: React.FC = () => {
  const [todayPrize, setTodayPrize] = useState(125000)
  const [liveBattles, setLiveBattles] = useState(42)

  const predictions = [
    {
      title: 'BTC将在24小时内突破100K？',
      prize: '$50,000',
      participants: 2847,
      timeLeft: '18:45:23',
      category: '加密货币',
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
      trend: 'up' as const,
      probability: 68,
    },
    {
      title: 'ETH会涨到5000美元吗？',
      prize: '$25,000',
      participants: 1923,
      timeLeft: '12:30:15',
      category: 'DeFi',
      image:
        'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=300&h=200&fit=crop',
      trend: 'down' as const,
      probability: 45,
    },
    {
      title: 'SOL生态系统爆发？',
      prize: '$30,000',
      participants: 3456,
      timeLeft: '08:15:42',
      category: 'Layer1',
      image:
        'https://images.unsplash.com/photo-1642104704074-907c0698cbd9?w=300&h=200&fit=crop',
      trend: 'up' as const,
      probability: 82,
    },
    {
      title: 'NFT市场会复苏吗？',
      prize: '$20,000',
      participants: 1567,
      timeLeft: '06:20:18',
      category: 'NFT',
      image:
        'https://images.unsplash.com/photo-1634973357973-f2ed9657db6c?w=300&h=200&fit=crop',
      trend: 'up' as const,
      probability: 73,
    },
  ]

  const projects = [
    {
      name: 'DogeCoin 2.0',
      symbol: 'DOGE2',
      price: '0.000045',
      marketCap: '4.5M',
      progress: 87,
      holders: 12543,
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=face',
      isHot: true,
      isNew: false,
    },
    {
      name: 'SpaceX Token',
      symbol: 'SPACEX',
      price: '0.000123',
      marketCap: '12.3M',
      progress: 64,
      holders: 8921,
      image:
        'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=100&h=100&fit=crop&crop=face',
      isHot: true,
      isNew: true,
    },
    {
      name: 'AI Meme Coin',
      symbol: 'AIMEME',
      price: '0.000078',
      marketCap: '7.8M',
      progress: 92,
      holders: 15672,
      image:
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=face',
      isHot: false,
      isNew: true,
    },
    {
      name: 'Quantum Cash',
      symbol: 'QMC',
      price: '0.000156',
      marketCap: '15.6M',
      progress: 45,
      holders: 6234,
      image:
        'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=100&h=100&fit=crop&crop=face',
      isHot: false,
      isNew: false,
    },
    {
      name: 'Neural Network',
      symbol: 'NEURAL',
      price: '0.000089',
      marketCap: '8.9M',
      progress: 78,
      holders: 11234,
      image:
        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop&crop=face',
      isHot: true,
      isNew: false,
    },
    {
      name: 'Crypto Kitty',
      symbol: 'KITTY',
      price: '0.000034',
      marketCap: '3.4M',
      progress: 56,
      holders: 4567,
      image:
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop&crop=face',
      isHot: false,
      isNew: true,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTodayPrize(prev => prev + Math.floor(Math.random() * 1000))
      setLiveBattles(prev => prev + Math.floor(Math.random() * 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='min-h-screen bg-stripe-50'>
      {/* Navbar - Sticky */}
      <nav className='sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center text-white shadow-md'>
                <Zap className='w-5 h-5' />
              </div>
              <span className='text-lg font-bold text-stripe-900 tracking-tight'>
                Pump.fun Arena
              </span>
            </div>
            <div className='flex items-center space-x-4'>
              <button className='text-stripe-500 hover:text-stripe-900 transition-colors'>
                <Trophy className='w-5 h-5' />
              </button>
              <button className='text-stripe-500 hover:text-stripe-900 transition-colors'>
                <MessageCircle className='w-5 h-5' />
              </button>
              <WalletButton
                connectClassName='btn btn-primary text-sm px-4 py-2 shadow-md'
                wrongNetworkClassName='btn btn-outline text-sm px-4 py-2'
                chainClassName='btn btn-secondary text-sm px-4 py-2'
                accountClassName='btn btn-secondary text-sm px-4 py-2'
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent opacity-70'></div>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='inline-flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100 mb-8'>
            <span className='flex h-2 w-2 rounded-full bg-green-500 animate-pulse'></span>
            <span className='text-xs font-medium text-stripe-600'>
              实时竞技场已开启
            </span>
          </div>
          <h1 className='text-5xl md:text-7xl font-bold mb-6 tracking-tight text-stripe-900'>
            预测竞技场
            <span className='text-brand-500'> & </span>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-brand-600'>
              项目发射台
            </span>
          </h1>
          <p className='text-xl text-stripe-500 mb-10 max-w-3xl mx-auto leading-relaxed'>
            在 Pump.fun Arena，用 1U 门票参与预测竞技，发现下一个百倍项目。
            <br className='hidden md:block' />
            简单、公平、高收益。
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='btn btn-primary px-8 py-3 text-lg shadow-lg shadow-brand-500/30 hover:-translate-y-1 transition-transform'>
              开始预测
            </button>
            <button className='btn btn-secondary px-8 py-3 text-lg flex items-center justify-center space-x-2'>
              <span>发射项目</span>
              <ArrowRight className='w-4 h-4' />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-stripe text-center group hover:border-brand-200 transition-colors'>
              <div className='text-3xl md:text-4xl font-bold text-stripe-900 mb-1 group-hover:text-brand-600 transition-colors'>
                ${todayPrize.toLocaleString()}
              </div>
              <div className='text-sm font-medium text-stripe-500'>
                今日奖池
              </div>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-stripe text-center group hover:border-green-200 transition-colors'>
              <div className='text-3xl md:text-4xl font-bold text-stripe-900 mb-1 group-hover:text-green-600 transition-colors'>
                {liveBattles}
              </div>
              <div className='text-sm font-medium text-stripe-500'>
                实时战报
              </div>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-stripe text-center group hover:border-blue-200 transition-colors'>
              <div className='text-3xl md:text-4xl font-bold text-stripe-900 mb-1 group-hover:text-blue-600 transition-colors'>
                12.5K
              </div>
              <div className='text-sm font-medium text-stripe-500'>
                活跃用户
              </div>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-100 shadow-stripe text-center group hover:border-purple-200 transition-colors'>
              <div className='text-3xl md:text-4xl font-bold text-stripe-900 mb-1 group-hover:text-purple-600 transition-colors'>
                $2.4M
              </div>
              <div className='text-sm font-medium text-stripe-500'>
                总交易量
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Predictions Arena */}
      <section className='py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-end mb-10'>
            <div>
              <h2 className='text-3xl font-bold text-stripe-900 mb-2 flex items-center space-x-2'>
                <span className='p-2 bg-brand-100 rounded-lg text-brand-600'>
                  <Trophy className='w-6 h-6' />
                </span>
                <span>预测竞技场</span>
              </h2>
              <p className='text-stripe-500'>
                用 1U 门票参与预测，赢取丰厚奖金
              </p>
            </div>
            <button className='btn btn-secondary text-sm'>查看全部</button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {predictions.map((pred, idx) => (
              <PredictionCard key={idx} {...pred} />
            ))}
          </div>
        </div>
      </section>

      {/* Launchpad */}
      <section className='py-16 px-4 sm:px-6 lg:px-8 bg-stripe-50 border-t border-gray-200'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-end mb-10'>
            <div>
              <h2 className='text-3xl font-bold text-stripe-900 mb-2 flex items-center space-x-2'>
                <span className='p-2 bg-accent-100 rounded-lg text-accent-600'>
                  <Rocket className='w-6 h-6' />
                </span>
                <span>项目发射台</span>
              </h2>
              <p className='text-stripe-500'>发现早期优质项目，抓住百倍机会</p>
            </div>
            <button className='btn btn-secondary text-sm'>查看全部</button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((proj, idx) => (
              <ProjectCard key={idx} {...proj} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AcceleratorHomePage
