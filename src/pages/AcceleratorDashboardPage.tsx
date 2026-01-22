import React, { useState } from 'react'
import { Users, DollarSign, Zap, Activity, Flame, Gift } from 'lucide-react'

const TICKER_ITEMS = [
  '🎉 User 0x...A12 won $50 in [Doge2] (Just now)',
  '🏆 User 0x...B99 predicted [SpaceX] success, won $1,200 (3m ago)',
  '🚀 [PepeAI] Prediction Pool reached $45,000',
  '💎 User 0x...C33 staked 500U in [MoonBase]',
  '🔥 [Solar] Loot Pool just paid out $1,000',
]

const PROJECTS = [
  {
    id: 1,
    name: 'CatWifHat',
    code: 'CWH',
    hot: true,
    lottery: true,
    lootPool: 2500,
    predictionPool: 45000,
    participants: 2340,
    progress: 80,
  },
  {
    id: 2,
    name: 'DogeMars',
    code: 'DGM',
    hot: true,
    lottery: true,
    lootPool: 500,
    predictionPool: 10000,
    participants: 1200,
    progress: 45,
  },
  {
    id: 3,
    name: 'PepeAI',
    code: 'PAI',
    hot: false,
    lottery: true,
    lootPool: 200,
    predictionPool: 5000,
    participants: 800,
    progress: 20,
  },
]

const WINNERS = [
  { user: 'User88', action: 'won in [CatWifHat]', amount: 100, type: 'loot' },
  { user: 'User99', action: 'won in [DogeMars]', amount: 5, type: 'loot' },
  {
    user: 'User77',
    action: 'predicted [PepeAI]',
    amount: 500,
    type: 'prediction',
  },
  { user: 'User66', action: 'won in [CatWifHat]', amount: 10, type: 'loot' },
  {
    user: 'User55',
    action: 'predicted [DogeMars]',
    amount: 1200,
    type: 'prediction',
  },
]

const AcceleratorDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'lucky' | 'predictors'>('lucky')

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900 font-sans'>
      <div className='bg-white border-b border-stripe-200 overflow-hidden py-2'>
        <div className='whitespace-nowrap animate-marquee flex space-x-8'>
          {TICKER_ITEMS.map((item, index) => (
            <span
              key={index}
              className='text-accent-600 font-mono text-sm inline-flex items-center'
            >
              {item}
            </span>
          ))}
          {TICKER_ITEMS.map((item, index) => (
            <span
              key={`dup-${index}`}
              className='text-accent-600 font-mono text-sm inline-flex items-center'
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white border border-stripe-200 p-6 rounded-xl relative overflow-hidden group hover:border-brand-400 transition-colors shadow-stripe'>
            <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
              <DollarSign size={64} className='text-brand-500' />
            </div>
            <h3 className='text-stripe-500 text-sm uppercase tracking-wider mb-2'>
              Total Paid Out
            </h3>
            <div className='text-4xl font-bold text-brand-600 font-mono'>
              $2,140,500
            </div>
            <p className='text-xs text-stripe-400 mt-2'>
              Real cash distributed to winners
            </p>
          </div>

          <div className='bg-white border border-stripe-200 p-6 rounded-xl relative overflow-hidden group hover:border-green-400 transition-colors shadow-stripe'>
            <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
              <Gift size={64} className='text-green-500' />
            </div>
            <h3 className='text-stripe-500 text-sm uppercase tracking-wider mb-2'>
              Live Pools
            </h3>
            <div className='text-4xl font-bold text-green-600 font-mono'>
              $358,000
            </div>
            <p className='text-xs text-stripe-400 mt-2'>
              Available to win right now
            </p>
          </div>

          <div className='bg-white border border-stripe-200 p-6 rounded-xl relative overflow-hidden group hover:border-accent-500 transition-colors shadow-stripe'>
            <div className='absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity'>
              <Users size={64} className='text-accent-500' />
            </div>
            <h3 className='text-stripe-500 text-sm uppercase tracking-wider mb-2'>
              Today's Boosters
            </h3>
            <div className='text-4xl font-bold text-stripe-900 font-mono'>
              15,420
            </div>
            <p className='text-xs text-stripe-400 mt-2'>
              Active participants today
            </p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-6'>
            <h2 className='text-xl font-bold mb-4 flex items-center text-stripe-800'>
              <Activity className='mr-2 text-accent-600' /> Live Projects
            </h2>

            {PROJECTS.map(project => (
              <div
                key={project.id}
                className='bg-white border border-stripe-200 rounded-xl p-6 hover:border-stripe-300 transition-all shadow-stripe'
              >
                <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
                  <div className='flex items-center space-x-4 w-full md:w-auto'>
                    <div className='w-16 h-16 bg-stripe-100 rounded-full flex items-center justify-center text-2xl'>
                      🚀
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-stripe-900'>
                        {project.name}{' '}
                        <span className='text-stripe-400 text-sm'>
                          ({project.code})
                        </span>
                      </h3>
                      <div className='flex space-x-2 mt-1'>
                        {project.hot && (
                          <span className='px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded border border-red-200 flex items-center'>
                            <Flame size={12} className='mr-1' /> Hot
                          </span>
                        )}
                        {project.lottery && (
                          <span className='px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded border border-green-200 flex items-center'>
                            <Gift size={12} className='mr-1' /> Lottery Live
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex-1 grid grid-cols-2 gap-4 w-full md:w-auto bg-stripe-50 p-4 rounded-lg'>
                    <div className='text-center border-r border-stripe-200'>
                      <div className='text-xs text-stripe-400 mb-1'>
                        🎁 Loot Pool
                      </div>
                      <div className='text-xl font-bold text-green-600'>
                        ${project.lootPool.toLocaleString()}
                      </div>
                      <div className='text-[10px] text-stripe-500'>
                        1U = 1 Chance
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-xs text-stripe-400 mb-1'>
                        🔮 Prediction Pool
                      </div>
                      <div className='text-xl font-bold text-brand-600'>
                        ${project.predictionPool.toLocaleString()}
                      </div>
                      <div className='text-[10px] text-stripe-500'>
                        Predict to Win
                      </div>
                    </div>
                  </div>

                  <div className='w-full md:w-auto flex flex-col items-center space-y-2'>
                    <div className='text-xs text-stripe-400 flex items-center'>
                      <Users size={12} className='mr-1' />{' '}
                      {project.participants.toLocaleString()} joined
                    </div>
                    <button className='w-full md:w-auto px-6 py-3 bg-accent-600 text-white font-bold rounded-lg hover:bg-accent-700 transition-all flex items-center justify-center shadow-lg shadow-accent-500/20'>
                      <Zap size={16} className='mr-2' /> 1U Boost
                    </button>
                    <div className='w-full h-1.5 bg-stripe-100 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-green-500 to-brand-500'
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='lg:col-span-1'>
            <div className='bg-white border border-stripe-200 rounded-xl overflow-hidden sticky top-6 shadow-stripe'>
              <div className='p-4 border-b border-stripe-200 flex'>
                <button
                  onClick={() => setActiveTab('lucky')}
                  className={`flex-1 py-2 text-sm font-bold rounded-l-lg transition-colors ${activeTab === 'lucky' ? 'bg-green-100 text-green-800' : 'bg-stripe-50 text-stripe-500 hover:bg-stripe-100'}`}
                >
                  Lucky Drops
                </button>
                <button
                  onClick={() => setActiveTab('predictors')}
                  className={`flex-1 py-2 text-sm font-bold rounded-r-lg transition-colors ${activeTab === 'predictors' ? 'bg-brand-100 text-brand-800' : 'bg-stripe-50 text-stripe-500 hover:bg-stripe-100'}`}
                >
                  Top Predictors
                </button>
              </div>

              <div className='max-h-[600px] overflow-y-auto p-4 space-y-4 custom-scrollbar'>
                {WINNERS.map((winner, idx) => (
                  <div
                    key={idx}
                    className='flex items-center space-x-3 p-3 bg-stripe-50 rounded-lg border border-stripe-100'
                  >
                    <div className='w-8 h-8 rounded-full bg-stripe-200 flex items-center justify-center text-xs'>
                      👤
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-stripe-900 truncate'>
                        {winner.user}
                      </div>
                      <div className='text-xs text-stripe-500 truncate'>
                        {winner.action}
                      </div>
                    </div>
                    <div
                      className={`text-sm font-bold font-mono ${winner.type === 'loot' ? 'text-green-600' : 'text-brand-600'}`}
                    >
                      +${winner.amount}
                    </div>
                  </div>
                ))}

                {[...Array(5)].map((_, i) => (
                  <div
                    key={`fake-${i}`}
                    className='flex items-center space-x-3 p-3 bg-stripe-50 rounded-lg border border-stripe-100 opacity-50'
                  >
                    <div className='w-8 h-8 rounded-full bg-stripe-200 flex items-center justify-center text-xs'>
                      👤
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='text-sm font-medium text-stripe-900 truncate'>
                        User{100 + i}
                      </div>
                      <div className='text-xs text-stripe-500 truncate'>
                        won in [Project X]
                      </div>
                    </div>
                    <div className='text-sm font-bold font-mono text-stripe-400'>
                      +$10
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}

export default AcceleratorDashboardPage
