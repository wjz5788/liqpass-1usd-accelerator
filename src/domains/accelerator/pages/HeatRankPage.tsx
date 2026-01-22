import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Zap, Star, ArrowLeft } from 'lucide-react'
import Header from '../../../components/layout/Header'
import SearchAndFilterBar, {
  FilterOption,
} from '../../../components/features/SearchAndFilterBar/SearchAndFilterBar'
import MemeCard from '../../../components/features/MemeCard/MemeCard'
import { mockHeatProjects } from '../../../services/mock/heatProjects'
import { calcHeat, inferPhase } from '../../../services/utils/heatScore'
import { MemeToken } from '../../../domain/meme'

const HeatRankPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<'live' | 'movers' | 'new'>(
    'live'
  )
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Define tabs configuration
  const heatTabs: FilterOption[] = [
    {
      id: 'live',
      label: 'Live',
      icon: Flame,
      color: 'text-red-500 animate-pulse',
    },
    { id: 'movers', label: 'Movers', icon: Zap, color: 'text-yellow-400' },
    { id: 'new', label: 'New', icon: Star, color: 'text-emerald-400' },
  ]

  // Map mock data to MemeToken domain model
  const tokens: MemeToken[] = useMemo(() => {
    return mockHeatProjects.map((p, idx) => {
      // Mock/Derive missing fields
      const funds = p.events.reduce((sum, e) => {
        // Simple heuristic to extract funds from volume strings like "$45K"
        const val = parseFloat(e.volume24h.replace(/[^0-9.]/g, ''))
        return sum + (e.volume24h.includes('K') ? val * 1000 : val)
      }, 0)

      const token: MemeToken = {
        id: p.id,
        name: p.name,
        ticker: p.name.slice(0, 4).toUpperCase(),
        description: p.tagline,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${p.id}`, // Placeholder image
        createdAt: p.createdAt,
        createdDays: Math.floor(
          (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        ),
        replies: p.watchers,
        participants: p.watchers,
        marketCap: '0', // calculated below
        marketCapValue: funds * 10,
        raisedUsd: funds,
        creator: 'Anonymous',
        creatorAvatar: '',
        progress: (funds / 1000000) * 100, // Mock progress
        isLive: true,
        change: p.events[0]?.change24h || 0,

        // Heat specific
        heatDelta24h: p.watchersDelta24h / 10, // Mock scale
      }

      const { score } = calcHeat(token)
      token.heatScore = score
      token.phase = inferPhase(token)

      return token
    })
  }, [])

  // Filter logic
  const filteredTokens = useMemo(() => {
    let result = [...tokens]

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        t =>
          t.name.toLowerCase().includes(q) ||
          t.ticker.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    }

    // Tabs
    switch (activeFilter) {
      case 'live':
        return result.sort((a, b) => Number(!!b.isLive) - Number(!!a.isLive))
      case 'movers':
        return result.sort(
          (a, b) => Math.abs(b.change ?? 0) - Math.abs(a.change ?? 0)
        )
      case 'new':
        return result.sort(
          (a, b) => (a.createdDays ?? 0) - (b.createdDays ?? 0)
        ) // Ascending days (newest first)
      default:
        return result
    }
  }, [tokens, activeFilter, searchQuery])

  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      : 'grid grid-cols-1 gap-3'

  return (
    <div className='min-h-screen bg-stripe-50 text-stripe-900 font-sans selection:bg-accent-500/30'>
      <Header />

      <main className='max-w-7xl mx-auto px-4 lg:px-6 py-8'>
        <div className='mb-6 flex items-center justify-between'>
          <button
            onClick={() => navigate('/accelerator')}
            className='group inline-flex items-center text-sm text-stripe-500 hover:text-accent-600 transition-colors'
          >
            <ArrowLeft className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform' />
            Back to Accelerator
          </button>
        </div>

        <div className='mb-8'>
          <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 mb-2'>
            🔥 Heat Rank
          </h1>
          <p className='text-stripe-500 max-w-2xl'>
            Real-time discovery engine. Heat is calculated based on traction,
            capital flow, and social signals.
          </p>
        </div>

        <SearchAndFilterBar
          activeFilter={activeFilter}
          setActiveFilter={id => {
            if (id === 'live' || id === 'movers' || id === 'new')
              setActiveFilter(id)
          }}
          viewMode={viewMode}
          setViewMode={setViewMode}
          tabs={heatTabs}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Filter by name, tag or signal...'
        />

        <div className={`mt-6 ${gridClass}`}>
          {filteredTokens.map(token => (
            <MemeCard key={token.id} token={token} />
          ))}

          {filteredTokens.length === 0 && (
            <div className='col-span-full py-20 text-center border border-dashed border-gray-200 rounded-2xl bg-white shadow-stripe-sm'>
              <p className='text-stripe-500'>
                No projects found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HeatRankPage
