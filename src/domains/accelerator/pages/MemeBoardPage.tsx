import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Header from '../../../components/layout/Header'
import HeroCarousel from '../../../components/features/HeroCarousel/HeroCarousel'
import DataOverview from '../../../components/features/DataOverview/DataOverview'
import SearchAndFilterBar from '../../../components/features/SearchAndFilterBar/SearchAndFilterBar'
import MemeCard from '../../../components/features/MemeCard/MemeCard'
import { heroSlides, tokens } from '../../../services/mock/memeData'
import { MemeToken } from '../../../domain/meme'
import { calcHeat, inferPhase } from '../../../services/utils/heatScore'

const MemeBoardPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeFilter, setActiveFilter] = useState('movers')

  const enriched: MemeToken[] = tokens.map(t => {
    const { score, delta24h } = calcHeat(t)
    return {
      ...t,
      heatScore: score,
      heatDelta24h: delta24h,
      phase: inferPhase(t),
    }
  })

  const filteredSorted: MemeToken[] = (() => {
    const list = [...enriched]
    switch (activeFilter) {
      case 'heat':
        return list.sort((a, b) => (b.heatScore ?? 0) - (a.heatScore ?? 0))
      case 'new':
        return list.sort((a, b) => (a.createdDays ?? 0) - (b.createdDays ?? 0))
      case 'market-cap':
        return list.sort(
          (a, b) => (b.marketCapValue ?? 0) - (a.marketCapValue ?? 0)
        )
      case 'last-reply':
        return list.sort((a, b) => (b.replies ?? 0) - (a.replies ?? 0))
      case 'mayhem':
        return list.sort(
          (a, b) => Math.abs(b.change ?? 0) - Math.abs(a.change ?? 0)
        )
      case 'live':
        return list.sort((a, b) => Number(!!b.isLive) - Number(!!a.isLive))
      case 'movers':
      default:
        return list.sort(
          (a, b) => Math.abs(b.change ?? 0) - Math.abs(a.change ?? 0)
        )
    }
  })()

  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      : 'grid grid-cols-1 gap-3'

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] font-sans selection:bg-accent-500/30'>
      {/* 顶部导航 */}
      <Header />

      <main className='max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8'>
        {/* 顶部 Hero 区域：左侧轮播卡片 + 右侧数据区 */}
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-6 items-stretch'>
          {/* 左侧大卡片：轮播 */}
          <div className='min-w-0'>
            <HeroCarousel slides={heroSlides} />
          </div>

          {/* 右侧：数据概览 + 中奖名单 */}
          <DataOverview />
        </div>

        {/* 搜索与工具栏 */}
        <SearchAndFilterBar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* 项目列表 */}
        <section className='pb-12 min-h-[500px]'>
          <div className={gridClass}>
            {filteredSorted.map((token: MemeToken) => (
              <MemeCard key={token.id} token={token} />
            ))}

            {/* View More Card */}
            <div className='flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl p-6 text-stripe-500 hover:text-stripe-700 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer group shadow-sm'>
              <div className='w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-stripe-sm border border-gray-100'>
                <ArrowRight className='w-5 h-5 text-accent-500' />
              </div>
              <span className='text-sm font-medium'>查看更多项目</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MemeBoardPage
