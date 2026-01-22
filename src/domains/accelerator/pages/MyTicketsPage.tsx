import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'

type Ticket = {
  id: string
  projectId: string
  projectName: string
  amount: number
  price: number
  timestamp: string
  currentValue: number
}

const mockTickets: Ticket[] = [
  {
    id: 't1',
    projectId: 'liqpass',
    projectName: 'LiqPass',
    amount: 10,
    price: 1.0,
    timestamp: '2024-01-15 14:30',
    currentValue: 12.5
  },
  {
    id: 't2',
    projectId: 'ai-quant-bot',
    projectName: 'AI量化机器人',
    amount: 5,
    price: 1.0,
    timestamp: '2024-01-16 09:15',
    currentValue: 4.2
  }
]

export const MyTicketsPage: React.FC = () => {
  const navigate = useNavigate()

  const calculateProfit = (ticket: Ticket) => {
    return ticket.currentValue - ticket.amount * ticket.price
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const totalInvestment = mockTickets.reduce((sum, ticket) => sum + ticket.amount * ticket.price, 0)
  const totalCurrentValue = mockTickets.reduce((sum, ticket) => sum + ticket.currentValue, 0)
  const totalProfit = totalCurrentValue - totalInvestment

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="btn btn-secondary inline-flex items-center space-x-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              我的仓位 · My Tickets
            </h1>
            <p className="text-gray-600 mt-2">
              查看你支持的项目仓位，跟踪投资回报。
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">总投资额</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalInvestment)}
            </div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600 mb-2">当前价值</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalCurrentValue)}
            </div>
          </div>
          <div className={`card p-6 ${totalProfit >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="text-sm font-medium text-gray-600 mb-2">总收益</div>
            <div className="flex items-center space-x-2">
              {totalProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalProfit)}
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {mockTickets.map((ticket) => {
            const profit = calculateProfit(ticket)
            const profitPercentage = ((profit / (ticket.amount * ticket.price)) * 100).toFixed(1)
            
            return (
              <div key={ticket.id} className="card-hover p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {ticket.projectName}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">数量</div>
                        <div className="font-medium">{ticket.amount} 张</div>
                      </div>
                      <div>
                        <div className="text-gray-600">买入价</div>
                        <div className="font-medium">{formatCurrency(ticket.price)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">当前价值</div>
                        <div className="font-medium">{formatCurrency(ticket.currentValue)}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">收益</div>
                        <div className={`font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(profit)} ({profitPercentage}%)
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      买入时间: {ticket.timestamp}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/accelerator/projects/${ticket.projectId}`)}
                      className="btn btn-primary inline-flex items-center space-x-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      查看项目
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {mockTickets.length === 0 && (
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无仓位</h3>
            <p className="text-gray-600 mb-4">你还没有支持任何项目</p>
            <button
              onClick={() => navigate('/accelerator')}
              className="btn btn-primary"
            >
              去支持项目
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTicketsPage