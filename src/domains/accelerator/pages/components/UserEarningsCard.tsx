import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, Trophy } from 'lucide-react'
import type { UserEarnings } from '../types'

interface UserEarningsCardProps {
    earnings: UserEarnings
}

export const UserEarningsCard: React.FC<UserEarningsCardProps> = ({ earnings }) => {
    const pnlClass = earnings.pnl > 0 ? 'pnl-positive' : earnings.pnl < 0 ? 'pnl-negative' : 'pnl-neutral'
    const multiplierClass = earnings.multiplier >= 1 ? 'multiplier-badge' : 'multiplier-badge negative'
    const PnlIcon = earnings.pnl >= 0 ? TrendingUp : TrendingDown

    return (
        <div className="card-gradient p-6 md:p-8 transition-smooth">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">我的收益 / My Earnings</h2>
                <div className={multiplierClass}>
                    {earnings.multiplier.toFixed(2)}x
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* 投入 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">本期投入 / Invested</div>
                    <div className="text-2xl font-bold text-gray-900">${earnings.invested}</div>
                    <div className="text-xs text-gray-500 mt-1">{earnings.tickets} 票</div>
                </div>

                {/* 已拿到手 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">已拿到手 / Realized</div>
                    <div className="text-2xl font-bold text-green-600">${earnings.realized.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">真实落袋</div>
                </div>

                {/* 当前估算权益 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">当前估算权益 / Estimated</div>
                    <div className="text-2xl font-bold text-purple-600">${earnings.estimated.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">含未实现</div>
                </div>
            </div>

            {/* PnL Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <PnlIcon className={`h-5 w-5 ${pnlClass}`} />
                        <span className="text-sm text-gray-600">总体结果 PnL</span>
                    </div>
                    <div className={`text-xl font-bold ${pnlClass}`}>
                        {earnings.pnl >= 0 ? '+' : ''}${earnings.pnl.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Comparison Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-gray-600">本期平均倍数</span>
                    </div>
                    <div className="text-lg font-semibold text-gray-700">
                        {earnings.poolAvgMultiplier.toFixed(2)}x
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-xs text-gray-600">当前最高倍数</span>
                    </div>
                    <div className="text-lg font-semibold text-yellow-600">
                        {earnings.topMultiplier.toFixed(2)}x
                    </div>
                </div>
            </div>

            {/* Insight */}
            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-800">
                    💡 {earnings.multiplier > earnings.poolAvgMultiplier
                        ? '你的表现超过平均水平！'
                        : '继续参与，有机会获得更高回报。'}
                </p>
            </div>
        </div>
    )
}

export default UserEarningsCard
