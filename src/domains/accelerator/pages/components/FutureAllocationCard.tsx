import React from 'react'
import { Sparkles, TrendingUp, Lock } from 'lucide-react'
import type { PoolFinances } from '../types'

interface FutureAllocationCardProps {
    finances: PoolFinances
    projectName: string
}

export const FutureAllocationCard: React.FC<FutureAllocationCardProps> = ({
    finances,
    projectName
}) => {
    // 假设黑客松奖金潜力
    const hackathonPotential = 10000
    const currentTickets = 296 // 从 finances 获取
    const estimatedPerTicket = (hackathonPotential * 0.5) / currentTickets // 50% 回馈给支持者

    return (
        <div className="card p-6 transition-smooth hover:shadow-lg">
            <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">未来分配 / Future Allocation</h2>
            </div>

            {/* Reserved Funds */}
            <div className="mb-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <Lock className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">预留资金</span>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">
                        ${finances.reserved}
                    </span>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                    用于未来奖励、回购和项目发展
                </p>
            </div>

            {/* Hackathon Potential */}
            <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">黑客松潜力 / Hackathon Potential</h3>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-700 mb-3">
                        如果 <span className="font-semibold">{projectName}</span> 获得黑客松奖金：
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">假设奖金</span>
                            <span className="font-bold text-green-600">${hackathonPotential.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">回馈支持者 (50%)</span>
                            <span className="font-semibold">${(hackathonPotential * 0.5).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-green-300">
                            <span className="text-gray-600">每张票预计可得</span>
                            <span className="font-bold text-green-700">
                                ~${estimatedPerTicket.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 text-xs text-green-800">
                        💡 按当前 {currentTickets} 张票粗略估算
                    </div>
                </div>
            </div>

            {/* 1→5x Path */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">1 → 5x 的路径</h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">①</span>
                        <span>池子内部分配（抽奖 + 盘口）：~1.5-2x</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">②</span>
                        <span>外部奖金回流（黑客松 + 赞助）：+1-2x</span>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span className="text-purple-600 font-bold">③</span>
                        <span>后续项目回购/空投：+1-2x</span>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-purple-300">
                    <p className="text-sm font-semibold text-purple-900">
                        理论最优倍数：<span className="text-gradient-green text-lg">~3-5x</span>
                    </p>
                </div>
            </div>

            {/* Commitment */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                    📋 <span className="font-semibold">承诺：</span>外部奖金将优先按持票比例回馈本期支持者
                </p>
            </div>
        </div>
    )
}

export default FutureAllocationCard
