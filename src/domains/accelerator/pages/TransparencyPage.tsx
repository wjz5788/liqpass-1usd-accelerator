import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Transaction {
  id: string
  type: 'lottery' | 'project' | 'market' | 'withdraw'
  amount: number
  from: string
  to: string
  timestamp: string
  txHash: string
  description: string
}

interface PoolInfo {
  lotteryPool: number
  projectPool: number
  totalTickets: number
  totalParticipants: number
  lastUpdate: string
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'lottery',
    amount: 50,
    from: '0x1234...5678',
    to: 'lottery_pool',
    timestamp: '2024-01-15T14:30:00Z',
    txHash: '0xabc123...',
    description: '购买 50 张彩票',
  },
  {
    id: '2',
    type: 'project',
    amount: 100,
    from: '0x8765...4321',
    to: 'project_pool',
    timestamp: '2024-01-15T13:45:00Z',
    txHash: '0xdef456...',
    description: '支持 AI 数据分析工具项目',
  },
  {
    id: '3',
    type: 'market',
    amount: 25,
    from: '0xabcd...efgh',
    to: 'market_pool',
    timestamp: '2024-01-15T12:20:00Z',
    txHash: '0xghi789...',
    description: '投注 Solana 价格预测',
  },
  {
    id: '4',
    type: 'withdraw',
    amount: 500,
    from: 'lottery_pool',
    to: '0xijkl...mnop',
    timestamp: '2024-01-15T10:15:00Z',
    txHash: '0xjkl012...',
    description: '第 41 期彩票中奖提取',
  },
]

const mockPoolInfo: PoolInfo = {
  lotteryPool: 125000,
  projectPool: 87000,
  totalTickets: 125000,
  totalParticipants: 8750,
  lastUpdate: '2024-01-15T15:00:00Z',
}

const TransparencyPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<
    'overview' | 'transactions' | 'pools' | 'contracts'
  >('overview')
  // TODO: Implement transaction selection
  // const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lottery':
        return '🎲'
      case 'project':
        return '🚀'
      case 'market':
        return '📊'
      case 'withdraw':
        return '💰'
      default:
        return '📄'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lottery':
        return 'bg-purple-100 text-purple-700'
      case 'project':
        return 'bg-blue-100 text-blue-700'
      case 'market':
        return 'bg-green-100 text-green-700'
      case 'withdraw':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatAddress = (address: string) => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4'>
            <button
              onClick={() => navigate('/accelerator')}
              className='inline-flex items-center text-sm text-gray-500 hover:text-gray-700'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              返回加速器
            </button>
          </div>

          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            🔍 透明度 · Transparency
          </h1>
          <p className='text-gray-600'>
            所有资金流动、抽奖结果、项目分配 100% 链上可查，公开透明。
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              总资金池
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              $
              {formatCurrency(
                mockPoolInfo.lotteryPool + mockPoolInfo.projectPool
              )}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              彩票池
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              ${formatCurrency(mockPoolInfo.lotteryPool)}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              项目池
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              ${formatCurrency(mockPoolInfo.projectPool)}
            </p>
          </div>
          <div className='rounded-xl bg-white p-4 border border-gray-200'>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              参与人数
            </p>
            <p className='text-lg font-semibold text-gray-900'>
              {mockPoolInfo.totalParticipants.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg'>
          {[
            { key: 'overview', label: '概览' },
            { key: 'transactions', label: '交易记录' },
            { key: 'pools', label: '资金池' },
            { key: 'contracts', label: '智能合约' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Recent Transactions */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                最近交易
              </h3>
              <div className='space-y-3'>
                {mockTransactions.slice(0, 5).map(tx => (
                  <div
                    key={tx.id}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getTypeColor(tx.type)}`}
                      >
                        {getTypeIcon(tx.type)}
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          {tx.description}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-semibold text-gray-900'>
                        ${tx.amount}
                      </p>
                      <a
                        href={`https://etherscan.io/tx/${tx.txHash}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-blue-500 hover:text-blue-700'
                      >
                        查看交易
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pool Distribution */}
            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                资金池分布
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-4 h-4 bg-purple-500 rounded'></div>
                    <span className='text-sm font-medium text-gray-900'>
                      彩票池
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-gray-900'>
                    ${formatCurrency(mockPoolInfo.lotteryPool)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-4 h-4 bg-blue-500 rounded'></div>
                    <span className='text-sm font-medium text-gray-900'>
                      项目池
                    </span>
                  </div>
                  <span className='text-sm font-semibold text-gray-900'>
                    ${formatCurrency(mockPoolInfo.projectPool)}
                  </span>
                </div>
                <div className='pt-4 border-t border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-900'>
                      总计
                    </span>
                    <span className='text-lg font-semibold text-gray-900'>
                      $
                      {formatCurrency(
                        mockPoolInfo.lotteryPool + mockPoolInfo.projectPool
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'transactions' && (
          <div className='rounded-2xl border border-gray-200 bg-white p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              所有交易记录
            </h3>
            <div className='space-y-3'>
              {mockTransactions.map(tx => (
                <div
                  key={tx.id}
                  className='flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50'
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTypeColor(tx.type)}`}
                    >
                      {getTypeIcon(tx.type)}
                    </div>
                    <div className='flex-1'>
                      <p className='font-medium text-gray-900'>
                        {tx.description}
                      </p>
                      <div className='flex items-center gap-4 text-sm text-gray-500 mt-1'>
                        <span>从: {formatAddress(tx.from)}</span>
                        <span>到: {formatAddress(tx.to)}</span>
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold text-gray-900'>${tx.amount}</p>
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-500 hover:text-blue-700'
                    >
                      查看交易
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === 'pools' && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                彩票池详情
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>当前余额</span>
                  <span className='text-sm font-semibold text-gray-900'>
                    ${formatCurrency(mockPoolInfo.lotteryPool)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>总票数</span>
                  <span className='text-sm font-semibold text-gray-900'>
                    {mockPoolInfo.totalTickets.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>参与人数</span>
                  <span className='text-sm font-semibold text-gray-900'>
                    {mockPoolInfo.totalParticipants.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>最后更新</span>
                  <span className='text-sm text-gray-900'>
                    {new Date(mockPoolInfo.lastUpdate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-white p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                项目池详情
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>当前余额</span>
                  <span className='text-sm font-semibold text-gray-900'>
                    ${formatCurrency(mockPoolInfo.projectPool)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>支持项目数</span>
                  <span className='text-sm font-semibold text-gray-900'>
                    12
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>平均分配</span>
                  <span className='text-sm font-semibold text-gray-900'>
                    ${formatCurrency(mockPoolInfo.projectPool / 12)}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-600'>最后更新</span>
                  <span className='text-sm text-gray-900'>
                    {new Date(mockPoolInfo.lastUpdate).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'contracts' && (
          <div className='rounded-2xl border border-gray-200 bg-white p-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              智能合约信息
            </h3>
            <div className='space-y-6'>
              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>彩票合约</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>合约地址</span>
                    <a
                      href='https://etherscan.io/address/0x1234567890123456789012345678901234567890'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:text-blue-700'
                    >
                      0x1234...7890
                    </a>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>状态</span>
                    <span className='text-green-600'>已验证</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>最后审计</span>
                    <span className='text-gray-900'>2024-01-01</span>
                  </div>
                </div>
              </div>

              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>项目池合约</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>合约地址</span>
                    <a
                      href='https://etherscan.io/address/0x0987654321098765432109876543210987654321'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-500 hover:text-blue-700'
                    >
                      0x0987...3210
                    </a>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>状态</span>
                    <span className='text-green-600'>已验证</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-gray-600'>最后审计</span>
                    <span className='text-gray-900'>2024-01-01</span>
                  </div>
                </div>
              </div>

              <div className='p-4 bg-gray-50 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>透明度说明</h4>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex items-start gap-2'>
                    <span className='text-green-500 mt-1'>•</span>
                    <span>所有智能合约都经过第三方安全审计</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='text-green-500 mt-1'>•</span>
                    <span>资金流动完全透明，链上可查</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='text-green-500 mt-1'>•</span>
                    <span>抽奖算法使用可验证的随机数生成</span>
                  </div>
                  <div className='flex items-start gap-2'>
                    <span className='text-green-500 mt-1'>•</span>
                    <span>项目分配规则公开透明，社区可监督</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransparencyPage
