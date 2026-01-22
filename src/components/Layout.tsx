import React from 'react'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className='min-h-screen bg-stripe-50'>
      <Navbar />
      <main className='flex-1'>{children}</main>
      <footer className='bg-white border-t border-gray-200 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center text-gray-600'>
            <p>&copy; 2024 LiqPass. AI量化时代 · 交易风险OS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
