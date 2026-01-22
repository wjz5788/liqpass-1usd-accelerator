import React from 'react'
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'
import type { PoolFinances } from '../types'

interface MoneyFlowCardProps {
    finances: PoolFinances
}

export const MoneyFlowCard: React.FC<MoneyFlowCardProps> = ({ finances }) => {
    const progressPercent = (finances.currentPool / finances.targetPool) * 100
    const totalMoneyIn = finances.moneyIn.supportTickets + finances.moneyIn.rake +
        finances.moneyIn.sponsorship + finances.moneyIn.hackathonPrize
    const totalMoneyOut = finances.moneyOut.lottery + finances.moneyOut.settlement +
        finances.moneyOut.operations

    return (
        <div className="card p-6 transition-smooth hover:shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
                <Wallet className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">池子资金流 / Money Flow</h2>
            </div>

            {/* Pool Progress */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">当前池子</span>
                    <span className="text-lg font-bold text-purple-600">
                        ${finances.currentPool} / ${finances.targetPool}
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    {progressPercent.toFixed(1)}% 完成
                </div>
            </div>

            {/* Money In */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                    <ArrowDownCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Money In</h3>
                    <span className="text-sm text-green-600 font-medium">
                        +${totalMoneyIn.toFixed(2)}
                    </span>
                </div>
                <div className="space-y-2 pl-7">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">1 美元支持票</span>
                        <span className="font-medium">${finances.moneyIn.supportTickets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">抽水 / Rake</span>
                        <span className="font-medium">${finances.moneyIn.rake}</span>
                    </div>
                    {finances.moneyIn.sponsorship > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">赞助 / Sponsorship</span>
                            <span className="font-medium">${finances.moneyIn.sponsorship}</span>
                        </div>
                    )}
                    {finances.moneyIn.hackathonPrize > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">黑客松奖金</span>
                            <span className="font-medium text-green-600">${finances.moneyIn.hackathonPrize}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Money Out */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Money Out</h3>
                    <span className="text-sm text-red-600 font-medium">
                        -${totalMoneyOut.toFixed(2)}
                    </span>
                </div>
                <div className="space-y-2 pl-7">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">抽奖发出</span>
                        <span className="font-medium">${finances.moneyOut.lottery}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">盘口结算</span>
                        <span className="font-medium">${finances.moneyOut.settlement}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">开发/运营支出</span>
                        <span className="font-medium">${finances.moneyOut.operations}</span>
                    </div>
                </div>
            </div>

            {/* Net Balance */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">池中余额 / Net Balance</span>
                    <span className="text-xl font-bold text-purple-600">
                        ${(totalMoneyIn - totalMoneyOut).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Transparency Note */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    🔍 所有资金流向公开透明，可在区块链上验证
                </p>
            </div>
        </div>
    )
}

export default MoneyFlowCard
