import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  TrendingUp,
  Trophy,
  Shield,
  Menu,
  X,
  Rocket,
  LayoutDashboard,
  BookOpen,
  ExternalLink,
} from 'lucide-react'

import { WalletButton } from '../wallet/WalletButton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './DropdownMenu'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: TrendingUp },
    { path: '/accelerator/meme-board', label: '$1', icon: Rocket },
    { path: '/arena', label: '比赛区', icon: Trophy },
    { path: '/strategies', label: '策略区', icon: TrendingUp },
    { path: '/insurance', label: '保险区', icon: Shield },
    { path: '/accelerator/heat-rank', label: '热度榜', icon: Trophy },
    {
      path: '/accelerator/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <nav className='bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to='/' className='flex items-center space-x-3 group'>
              <div className='w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform duration-200'>
                <TrendingUp className='h-5 w-5 text-white' />
              </div>
              <span className='text-xl font-bold text-stripe-900 tracking-tight'>
                LiqPass
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-2'>
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-accent-600 bg-accent-50'
                      : 'text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive(item.path) ? 'text-accent-500' : 'text-stripe-400 group-hover:text-stripe-600'}`}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Docs Menu */}
            <DropdownMenu
              trigger={
                <button
                  className='flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 text-stripe-500 hover:text-stripe-900 hover:bg-gray-50'
                >
                  <BookOpen className='h-4 w-4 text-stripe-400' />
                  <span>文档</span>
                </button>
              }
            >
              <DropdownMenuContent align='end' className='w-56'>
                <DropdownMenuItem asChild>
                  <Link to='/docs/intro'>项目介绍</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/docs/quickstart'>快速开始</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/docs/mechanism'>机制与公式</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to='/docs/roadmap'>路线图</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to='/docs/awards' className='flex items-center gap-2'>
                    <Trophy className='h-4 w-4' />
                    获奖 / 资助
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <a
                    href='https://github.com/wjz5788/liqpass-1usd-accelerator'
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center gap-2'
                  >
                    GitHub <ExternalLink className='h-4 w-4' />
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Awards Badge */}
            <Link
              to='/docs/awards'
              className='rounded-full border px-2 py-1 text-xs hover:bg-muted'
              title='查看获奖/资助证明'
            >
              🏆 Grants
            </Link>

            <div className='ml-2'>
              <WalletButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            >
              {isMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden border-t border-gray-100'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              <div className='px-3 py-2'>
                <WalletButton />
              </div>
              {navItems.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-accent-600 bg-accent-50'
                        : 'text-stripe-600 hover:text-stripe-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className='h-5 w-5' />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
