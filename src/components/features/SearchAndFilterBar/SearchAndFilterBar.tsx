import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  LayoutGrid,
  List,
  Zap,
  Flame,
  Star,
  DollarSign,
  TrendingUp,
  Clock,
  MessageCircle,
  Plus,
  Radar,
} from 'lucide-react'

export interface FilterOption {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

interface SearchAndFilterBarProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  tabs?: FilterOption[]
  searchQuery?: string
  onSearchChange?: (query: string) => void
  placeholder?: string
  createPath?: string
}

export const DEFAULT_FILTERS: FilterOption[] = [
  { id: 'heat', label: '热度榜', icon: Radar, color: 'text-indigo-400' },
  { id: 'movers', label: '热门波动', icon: Zap, color: 'text-yellow-400' },
  {
    id: 'live',
    label: '进行中',
    icon: Flame,
    color: 'text-red-500 animate-pulse',
  },
  { id: 'new', label: '新项目', icon: Star, color: 'text-emerald-400' },
  {
    id: 'market-cap',
    label: '高筹集',
    icon: DollarSign,
    color: 'text-blue-400',
  },
  { id: 'mayhem', label: '最疯涨', icon: TrendingUp, color: 'text-purple-500' },
  { id: 'oldest', label: '经典', icon: Clock, color: 'text-gray-400' },
  {
    id: 'last-reply',
    label: '热议',
    icon: MessageCircle,
    color: 'text-pink-400',
  },
]

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  activeFilter,
  setActiveFilter,
  viewMode,
  setViewMode,
  tabs = DEFAULT_FILTERS,
  searchQuery,
  onSearchChange,
  placeholder = 'Search tokens...',
  createPath = '/accelerator/submit',
}) => {
  const navigate = useNavigate()

  return (
    <div className='sticky top-[60px] z-40 bg-white/95 backdrop-blur-xl py-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:bg-transparent lg:static lg:backdrop-filter-none transition-all'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* 标题 */}
        <div>
          <h2 className='text-xl font-bold flex items-center gap-2 text-stripe-900'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500'>
              10亿美金
            </span>
            候选池
          </h2>
          <p className='text-xs text-stripe-500 mt-1'>
            用 <span className='text-stripe-900 font-bold'>$1</span>{' '}
            押注下一个独角兽
          </p>
        </div>

        {/* 搜索框 */}
        <div className='flex items-center gap-3 flex-1 md:justify-end'>
          <div className='relative group w-full md:w-64'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-500' />
            <div className='relative flex items-center bg-white border border-gray-200 rounded-lg'>
              <Search className='w-4 h-4 text-stripe-400 absolute left-3' />
              <input
                type='text'
                {...(typeof searchQuery === 'string' &&
                typeof onSearchChange === 'function'
                  ? {
                      value: searchQuery,
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        onSearchChange(e.target.value),
                    }
                  : {})}
                placeholder={placeholder}
                className='w-full bg-transparent border-none text-sm text-stripe-900 placeholder-stripe-400 pl-9 pr-4 py-2 focus:ring-0 rounded-lg'
              />
            </div>
          </div>

          <button
            onClick={() => navigate(createPath)}
            className='flex-shrink-0 inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 hover:bg-indigo-700 transition-colors shadow-md'
          >
            <Plus className='w-4 h-4' />
            <span>创建项目</span>
          </button>
        </div>
      </div>

      {/* 筛选 Tabs */}
      <div className='mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4'>
        <div className='flex flex-wrap gap-2'>
          {tabs.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'text-stripe-900 shadow-sm'
                  : 'text-stripe-500 hover:text-stripe-700'
              }`}
            >
              {activeFilter === filter.id && (
                <span className='absolute inset-0 bg-stripe-100 rounded-full' />
              )}
              <filter.icon
                className={`w-3.5 h-3.5 ${filter.color} transition-transform group-hover:scale-110`}
              />
              {filter.label}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200'>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${
              viewMode === 'grid'
                ? 'bg-stripe-100 text-stripe-900 shadow-sm'
                : 'text-stripe-400 hover:text-stripe-600'
            }`}
          >
            <LayoutGrid className='w-4 h-4' />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${
              viewMode === 'list'
                ? 'bg-stripe-100 text-stripe-900 shadow-sm'
                : 'text-stripe-400 hover:text-stripe-600'
            }`}
          >
            <List className='w-4 h-4' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchAndFilterBar
