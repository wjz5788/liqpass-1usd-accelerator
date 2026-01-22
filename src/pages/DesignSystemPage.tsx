import React, { useState } from 'react'
import {
  Type,
  Palette,
  Layout,
  Box,
  AlertCircle,
  Search,
  Bell,
  Settings,
  TrendingUp,
  Shield,
  Zap,
  MoreHorizontal,
} from 'lucide-react'

const DesignSystemPage = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const stripeColors = [
    { label: '50', value: '#f6f9fc', className: 'bg-stripe-50' },
    { label: '100', value: '#e3e8ee', className: 'bg-stripe-100' },
    { label: '200', value: '#cdd5df', className: 'bg-stripe-200' },
    { label: '300', value: '#9aa5b1', className: 'bg-stripe-300' },
    { label: '400', value: '#697386', className: 'bg-stripe-400' },
    { label: '500', value: '#4f566b', className: 'bg-stripe-500' },
    { label: '600', value: '#3c4257', className: 'bg-stripe-600' },
    { label: '700', value: '#2a2f45', className: 'bg-stripe-700' },
    { label: '800', value: '#1a1f36', className: 'bg-stripe-800' },
    { label: '900', value: '#0a2540', className: 'bg-stripe-900' },
  ]

  const accentColors = [
    { label: '50', value: '#eff6ff', className: 'bg-accent-50' },
    { label: '100', value: '#dbeafe', className: 'bg-accent-100' },
    { label: '200', value: '#bfdbfe', className: 'bg-accent-200' },
    { label: '300', value: '#93c5fd', className: 'bg-accent-300' },
    { label: '400', value: '#60a5fa', className: 'bg-accent-400' },
    { label: '500', value: '#3B82F6', className: 'bg-accent-500' },
    { label: '600', value: '#2563EB', className: 'bg-accent-600' },
    { label: '700', value: '#1d4ed8', className: 'bg-accent-700' },
    { label: '800', value: '#1e40af', className: 'bg-accent-800' },
    { label: '900', value: '#1e3a8a', className: 'bg-accent-900' },
  ]

  const brandColors = [
    { label: '50', value: '#fffbeb', className: 'bg-brand-50' },
    { label: '100', value: '#fef3c7', className: 'bg-brand-100' },
    { label: '500', value: '#F59E0B', className: 'bg-brand-500' },
    { label: '600', value: '#D97706', className: 'bg-brand-600' },
    { label: '900', value: '#78350F', className: 'bg-brand-900' },
  ]

  return (
    <div className='min-h-screen bg-stripe-50 font-sans text-stripe-900'>
      <div className='bg-white border-b border-stripe-100 sticky top-0 z-30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center text-white font-bold'>
              L
            </div>
            <span className='font-bold text-lg tracking-tight'>
              LiqPass<span className='text-stripe-400 font-normal'>DS</span>
            </span>
          </div>
          <div className='flex items-center gap-6'>
            <nav className='hidden md:flex gap-6 text-sm font-medium text-stripe-600'>
              <button
                onClick={() => setActiveTab('overview')}
                className={`${activeTab === 'overview' ? 'text-accent-600' : 'hover:text-stripe-900'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('foundations')}
                className={`${activeTab === 'foundations' ? 'text-accent-600' : 'hover:text-stripe-900'}`}
              >
                Foundations
              </button>
              <button
                onClick={() => setActiveTab('components')}
                className={`${activeTab === 'components' ? 'text-accent-600' : 'hover:text-stripe-900'}`}
              >
                Components
              </button>
            </nav>
            <div className='w-px h-6 bg-stripe-200 hidden md:block'></div>
            <button className='btn-primary text-sm px-4 py-1.5'>
              Download Assets
            </button>
          </div>
        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <section className='mb-20'>
          <div className='max-w-3xl'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-50 text-accent-700 text-xs font-semibold mb-6 border border-accent-100'>
              <span className='w-2 h-2 rounded-full bg-accent-500'></span>
              v2.0 Design System
            </div>
            <h1 className='text-5xl font-bold tracking-tight text-stripe-900 mb-6'>
              Restrained precision for{' '}
              <span className='text-accent-600'>financial clarity</span>.
            </h1>
            <p className='text-xl text-stripe-600 leading-relaxed'>
              A blue-forward, light-optimized design system inspired by modern
              fintech interfaces. Built with utility classes, focusing on
              hierarchy, whitespace, and subtle depth.
            </p>
          </div>
        </section>

        <div className='grid grid-cols-1 md:grid-cols-12 gap-12'>
          <aside className='md:col-span-3 space-y-8 hidden md:block'>
            <div className='sticky top-24'>
              <h3 className='text-xs font-bold text-stripe-400 uppercase tracking-wider mb-4'>
                Contents
              </h3>
              <ul className='space-y-3 text-sm font-medium text-stripe-600'>
                <li className='flex items-center gap-2 text-accent-600'>
                  <Palette className='w-4 h-4' /> Color Palette
                </li>
                <li className='flex items-center gap-2 hover:text-stripe-900 cursor-pointer'>
                  <Type className='w-4 h-4' /> Typography
                </li>
                <li className='flex items-center gap-2 hover:text-stripe-900 cursor-pointer'>
                  <Box className='w-4 h-4' /> Components
                </li>
                <li className='flex items-center gap-2 hover:text-stripe-900 cursor-pointer'>
                  <Layout className='w-4 h-4' /> Layout & Grid
                </li>
              </ul>
            </div>
          </aside>

          <div className='md:col-span-9 space-y-24'>
            <section id='colors'>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-stripe-900 mb-2'>
                  Color Palette
                </h2>
                <p className='text-stripe-500'>
                  Functional neutrals and purposeful accents.
                </p>
              </div>

              <div className='space-y-8'>
                <div>
                  <h4 className='text-sm font-semibold text-stripe-700 mb-4 flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-stripe-500'></span>{' '}
                    Neutrals (Stripe)
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2'>
                    {stripeColors.map(c => (
                      <div key={c.label} className='space-y-2'>
                        <div
                          className={`h-12 w-full rounded-md shadow-sm border border-black/5 ${c.className}`}
                        ></div>
                        <div className='text-xs'>
                          <div className='font-semibold text-stripe-900'>
                            {c.label}
                          </div>
                          <div className='text-stripe-400 font-mono text-[10px]'>
                            {c.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-sm font-semibold text-stripe-700 mb-4 flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-accent-500'></span>{' '}
                    Primary (Accent)
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2'>
                    {accentColors.map(c => (
                      <div key={c.label} className='space-y-2'>
                        <div
                          className={`h-12 w-full rounded-md shadow-sm border border-black/5 ${c.className}`}
                        ></div>
                        <div className='text-xs'>
                          <div className='font-semibold text-stripe-900'>
                            {c.label}
                          </div>
                          <div className='text-stripe-400 font-mono text-[10px]'>
                            {c.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className='text-sm font-semibold text-stripe-700 mb-4 flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-brand-500'></span>{' '}
                    Highlights (Brand)
                  </h4>
                  <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
                    {brandColors.map(c => (
                      <div key={c.label} className='space-y-2'>
                        <div
                          className={`h-12 w-full rounded-md shadow-sm border border-black/5 ${c.className}`}
                        ></div>
                        <div className='text-xs'>
                          <div className='font-semibold text-stripe-900'>
                            {c.label}
                          </div>
                          <div className='text-stripe-400 font-mono text-[10px]'>
                            {c.value}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id='typography'>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-stripe-900 mb-2'>
                  Typography
                </h2>
                <p className='text-stripe-500'>
                  Inter for UI clarity. System font fallback.
                </p>
              </div>

              <div className='card p-8 space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stripe-100'>
                  <div className='text-stripe-400 text-sm font-mono'>
                    Headings
                  </div>
                  <div className='md:col-span-2 space-y-6'>
                    <div>
                      <h1 className='text-4xl font-bold text-stripe-900 tracking-tight'>
                        Financial Infrastructure
                      </h1>
                      <div className='text-xs text-stripe-400 mt-1 font-mono'>
                        text-4xl font-bold tracking-tight
                      </div>
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-stripe-900 tracking-tight'>
                        Payments for the internet
                      </h2>
                      <div className='text-xs text-stripe-400 mt-1 font-mono'>
                        text-2xl font-bold tracking-tight
                      </div>
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-stripe-900'>
                        Global reach, local feeling
                      </h3>
                      <div className='text-xs text-stripe-400 mt-1 font-mono'>
                        text-lg font-semibold
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                  <div className='text-stripe-400 text-sm font-mono'>Body</div>
                  <div className='md:col-span-2 space-y-6'>
                    <div>
                      <p className='text-base text-stripe-600 leading-relaxed'>
                        LiqPass is a technology company that builds economic
                        infrastructure for the internet. Businesses of every
                        size—from new startups to public companies—use our
                        software to accept payments and manage their businesses
                        online.
                      </p>
                      <div className='text-xs text-stripe-400 mt-2 font-mono'>
                        text-base text-stripe-600 leading-relaxed
                      </div>
                    </div>
                    <div>
                      <p className='text-sm text-stripe-500'>
                        Millions of companies of all sizes use Stripe online and
                        in person to accept payments, send payouts, automate
                        financial processes, and ultimately grow revenue.
                      </p>
                      <div className='text-xs text-stripe-400 mt-2 font-mono'>
                        text-sm text-stripe-500
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id='buttons'>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-stripe-900 mb-2'>
                  Interactive Elements
                </h2>
                <p className='text-stripe-500'>Buttons, inputs, and states.</p>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='card p-6 space-y-6'>
                  <h3 className='text-sm font-semibold text-stripe-900'>
                    Button Hierarchy
                  </h3>
                  <div className='flex flex-wrap gap-4 items-center'>
                    <button className='btn-primary'>Primary Action</button>
                    <button className='btn-secondary'>Secondary</button>
                    <button className='btn-outline'>Outline</button>
                    <button className='text-accent-600 font-medium hover:text-accent-700 text-sm'>
                      Text Link
                    </button>
                  </div>
                  <div className='pt-6 border-t border-stripe-100'>
                    <h3 className='text-sm font-semibold text-stripe-900 mb-4'>
                      Button Sizes
                    </h3>
                    <div className='flex flex-wrap items-center gap-4'>
                      <button className='btn-secondary text-xs px-3 py-1'>
                        Small
                      </button>
                      <button className='btn-secondary'>Default</button>
                      <button className='btn-secondary text-lg px-6 py-3'>
                        Large
                      </button>
                    </div>
                  </div>
                </div>

                <div className='card p-6 space-y-6'>
                  <h3 className='text-sm font-semibold text-stripe-900'>
                    Form Controls
                  </h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-stripe-700 mb-1.5'>
                        Email Address
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stripe-400'>
                          <Search className='h-4 w-4' />
                        </div>
                        <input
                          type='text'
                          className='block w-full pl-10 pr-3 py-2 border border-stripe-200 rounded-lg bg-white text-stripe-900 placeholder-stripe-400 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all text-sm shadow-sm'
                          placeholder='name@example.com'
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-stripe-700 mb-1.5'>
                        Select Option
                      </label>
                      <select className='block w-full pl-3 pr-10 py-2 text-base border border-stripe-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 sm:text-sm shadow-sm bg-white text-stripe-900'>
                        <option>Standard Plan</option>
                        <option>Pro Plan</option>
                      </select>
                    </div>
                    <div className='flex items-center gap-2'>
                      <input
                        type='checkbox'
                        className='h-4 w-4 text-accent-600 focus:ring-accent-500 border-stripe-300 rounded'
                        checked
                        readOnly
                      />
                      <label className='text-sm text-stripe-600'>
                        I agree to the{' '}
                        <span className='text-accent-600'>
                          Terms of Service
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id='components'>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-stripe-900 mb-2'>
                  Micro Components
                </h2>
                <p className='text-stripe-500'>
                  Badges, alerts, and indicators.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='card p-6 space-y-4'>
                  <h3 className='text-sm font-semibold text-stripe-900'>
                    Badges
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stripe-100 text-stripe-800'>
                      Neutral
                    </span>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-100 text-accent-800'>
                      Primary
                    </span>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                      Success
                    </span>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800'>
                      Premium
                    </span>
                  </div>
                </div>

                <div className='card p-6 space-y-4'>
                  <h3 className='text-sm font-semibold text-stripe-900'>
                    Alerts
                  </h3>
                  <div className='bg-accent-50 border-l-4 border-accent-500 p-3 rounded-r-md'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <AlertCircle className='h-4 w-4 text-accent-500' />
                      </div>
                      <div className='ml-3'>
                        <p className='text-xs text-accent-700'>
                          Your account has been updated successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='bg-brand-50 border-l-4 border-brand-500 p-3 rounded-r-md'>
                    <div className='flex'>
                      <div className='flex-shrink-0'>
                        <Zap className='h-4 w-4 text-brand-500' />
                      </div>
                      <div className='ml-3'>
                        <p className='text-xs text-brand-800'>
                          Premium features unlocked.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='card p-6 space-y-4'>
                  <h3 className='text-sm font-semibold text-stripe-900'>
                    Cards
                  </h3>
                  <div className='card-hover p-4 cursor-pointer'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='p-2 bg-accent-100 rounded-lg text-accent-600'>
                        <Shield className='w-4 h-4' />
                      </div>
                      <span className='text-xs font-medium text-green-600'>
                        +12%
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-stripe-900'>
                      98.5%
                    </div>
                    <div className='text-xs text-stripe-500'>System Uptime</div>
                  </div>
                </div>
              </div>
            </section>

            <section id='layout'>
              <div className='mb-8'>
                <h2 className='text-2xl font-bold text-stripe-900 mb-2'>
                  Interface Mockup
                </h2>
                <p className='text-stripe-500'>
                  Putting it all together in a dense dashboard view.
                </p>
              </div>

              <div className='bg-stripe-100 p-8 rounded-xl overflow-hidden border border-stripe-200'>
                <div className='bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-stripe-200/60'>
                  <div className='h-14 border-b border-stripe-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm'>
                    <div className='flex items-center gap-4'>
                      <div className='w-6 h-6 bg-accent-600 rounded-md'></div>
                      <nav className='flex gap-4 text-sm font-medium text-stripe-500'>
                        <span className='text-stripe-900'>Dashboard</span>
                        <span>Analytics</span>
                        <span>Settings</span>
                      </nav>
                    </div>
                    <div className='flex items-center gap-3 text-stripe-400'>
                      <Search className='w-4 h-4' />
                      <Bell className='w-4 h-4' />
                      <div className='w-8 h-8 rounded-full bg-stripe-100 border border-stripe-200'></div>
                    </div>
                  </div>

                  <div className='flex h-[500px]'>
                    <div className='w-56 border-r border-stripe-100 bg-stripe-50/50 p-4 hidden sm:block'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-accent-700 bg-accent-50 rounded-lg'>
                          <Layout className='w-4 h-4' /> Overview
                        </div>
                        <div className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-stripe-600 hover:bg-white rounded-lg transition-colors'>
                          <TrendingUp className='w-4 h-4' /> Performance
                        </div>
                        <div className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-stripe-600 hover:bg-white rounded-lg transition-colors'>
                          <Box className='w-4 h-4' /> Products
                        </div>
                        <div className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-stripe-600 hover:bg-white rounded-lg transition-colors'>
                          <Settings className='w-4 h-4' /> Settings
                        </div>
                      </div>

                      <div className='mt-8'>
                        <div className='text-xs font-semibold text-stripe-400 uppercase tracking-wider px-3 mb-2'>
                          Teams
                        </div>
                        <div className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-stripe-600'>
                          <div className='w-2 h-2 rounded-full bg-brand-500'></div>
                          Alpha Team
                        </div>
                        <div className='flex items-center gap-3 px-3 py-2 text-sm font-medium text-stripe-600'>
                          <div className='w-2 h-2 rounded-full bg-accent-500'></div>
                          Beta Squad
                        </div>
                      </div>
                    </div>

                    <div className='flex-1 bg-white p-6 overflow-auto'>
                      <div className='flex items-center justify-between mb-6'>
                        <h2 className='text-lg font-bold text-stripe-900'>
                          Overview
                        </h2>
                        <div className='flex gap-2'>
                          <button className='btn-secondary text-xs py-1.5 h-8'>
                            Export
                          </button>
                          <button className='btn-primary text-xs py-1.5 h-8'>
                            Create Report
                          </button>
                        </div>
                      </div>

                      <div className='grid grid-cols-3 gap-4 mb-8'>
                        <div className='p-4 rounded-xl border border-stripe-100 shadow-stripe-sm'>
                          <div className='text-stripe-500 text-xs font-medium mb-1'>
                            Total Revenue
                          </div>
                          <div className='text-2xl font-bold text-stripe-900'>
                            $124,592
                          </div>
                          <div className='text-green-600 text-xs font-medium mt-1 flex items-center gap-1'>
                            <TrendingUp className='w-3 h-3' /> +12.5%
                          </div>
                        </div>
                        <div className='p-4 rounded-xl border border-stripe-100 shadow-stripe-sm'>
                          <div className='text-stripe-500 text-xs font-medium mb-1'>
                            Active Users
                          </div>
                          <div className='text-2xl font-bold text-stripe-900'>
                            8,142
                          </div>
                          <div className='text-stripe-400 text-xs font-medium mt-1'>
                            Last 30 days
                          </div>
                        </div>
                        <div className='p-4 rounded-xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 shadow-stripe-sm'>
                          <div className='text-brand-700 text-xs font-medium mb-1'>
                            Premium Members
                          </div>
                          <div className='text-2xl font-bold text-brand-900'>
                            492
                          </div>
                          <div className='text-brand-600 text-xs font-medium mt-1'>
                            All time high
                          </div>
                        </div>
                      </div>

                      <div className='border border-stripe-100 rounded-xl overflow-hidden shadow-stripe-sm'>
                        <div className='bg-stripe-50/50 px-4 py-3 border-b border-stripe-100 flex items-center justify-between'>
                          <h3 className='text-sm font-semibold text-stripe-800'>
                            Recent Transactions
                          </h3>
                          <MoreHorizontal className='w-4 h-4 text-stripe-400' />
                        </div>
                        <table className='w-full text-sm text-left'>
                          <thead>
                            <tr className='text-stripe-500 border-b border-stripe-100'>
                              <th className='px-4 py-3 font-medium'>
                                Transaction
                              </th>
                              <th className='px-4 py-3 font-medium'>Date</th>
                              <th className='px-4 py-3 font-medium'>Status</th>
                              <th className='px-4 py-3 font-medium text-right'>
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-stripe-50'>
                            {[1, 2, 3, 4].map(i => (
                              <tr
                                key={i}
                                className='hover:bg-stripe-50/50 transition-colors'
                              >
                                <td className='px-4 py-3 font-medium text-stripe-900'>
                                  Payment to Stripe #{1000 + i}
                                </td>
                                <td className='px-4 py-3 text-stripe-500'>
                                  Oct 24, 2023
                                </td>
                                <td className='px-4 py-3'>
                                  <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700'>
                                    Completed
                                  </span>
                                </td>
                                <td className='px-4 py-3 text-right font-medium text-stripe-900'>
                                  $350.00
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DesignSystemPage
