import React from 'react'

const DataOverview: React.FC = () => {
  return (
    <aside className='bg-[#13141b] border border-white/5 rounded-3xl p-6 flex flex-col gap-5 shadow-xl h-full min-h-[220px] justify-between'>
      <div>
        <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-3'>
          今日实时数据
        </div>
        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-white/5 rounded-xl p-3 border border-white/5'>
            <div className='text-[10px] text-gray-400'>总奖池累计</div>
            <div className='text-lg font-bold text-indigo-400'>8,540</div>
          </div>
          <div className='bg-white/5 rounded-xl p-3 border border-white/5'>
            <div className='text-[10px] text-gray-400'>参与人数</div>
            <div className='text-lg font-bold text-emerald-400'>842</div>
          </div>
        </div>
      </div>

      <div className='flex-1 min-h-0 flex flex-col'>
        <div className='text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center'>
          <span>最新中奖</span>
          <span className='text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded animate-pulse'>
            Live
          </span>
        </div>
        <div className='space-y-2 overflow-hidden relative'>
          {[80, 15, 120].map((amt, idx) => (
            <div
              key={idx}
              className='flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors rounded-lg px-3 py-2 border border-transparent hover:border-white/5'
            >
              <div className='flex items-center gap-3'>
                <div
                  className={`w-6 h-6 rounded-md bg-gradient-to-br ${
                    idx === 0
                      ? 'from-orange-400 to-red-500'
                      : idx === 1
                        ? 'from-blue-400 to-indigo-500'
                        : 'from-purple-400 to-pink-500'
                  } flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                >
                  {idx + 1}
                </div>
                <span className='text-xs text-gray-300 font-mono'>
                  0x9C...{['80bc', 'f121', '0d3a'][idx]}
                </span>
              </div>
              <span className='text-xs font-bold text-emerald-400'>
                +{amt} USDC
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default DataOverview
