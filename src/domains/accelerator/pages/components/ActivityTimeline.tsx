import React from 'react'
import { Gift, DollarSign, Trophy, Milestone, ExternalLink } from 'lucide-react'
import type { ActivityLog } from '../types'

interface ActivityTimelineProps {
    activities: ActivityLog[]
}

const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
        case 'lottery':
            return <Gift className="h-5 w-5 text-green-600" />
        case 'allocation':
            return <DollarSign className="h-5 w-5 text-blue-600" />
        case 'hackathon':
            return <Trophy className="h-5 w-5 text-yellow-600" />
        case 'milestone':
            return <Milestone className="h-5 w-5 text-purple-600" />
    }
}

const getActivityColor = (type: ActivityLog['type']) => {
    switch (type) {
        case 'lottery':
            return 'bg-green-100 border-green-300'
        case 'allocation':
            return 'bg-blue-100 border-blue-300'
        case 'hackathon':
            return 'bg-yellow-100 border-yellow-300'
        case 'milestone':
            return 'bg-purple-100 border-purple-300'
    }
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString('zh-CN', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                可验证动作 / Activity Timeline
            </h2>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div
                        key={activity.id}
                        className={`relative pl-8 pb-4 ${index !== activities.length - 1 ? 'border-l-2 border-gray-200' : ''
                            }`}
                    >
                        {/* Icon */}
                        <div className="absolute left-0 top-0 -ml-2.5">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-white ${getActivityColor(activity.type)}`}>
                                {getActivityIcon(activity.type)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="ml-4">
                            <div className="flex items-start justify-between mb-1">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {activity.description}
                                    </p>
                                    {activity.amount !== undefined && (
                                        <p className="text-lg font-bold text-green-600 mt-1">
                                            ${activity.amount}
                                        </p>
                                    )}
                                    {activity.recipient && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            → {activity.recipient}
                                        </p>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {formatDate(activity.timestamp)}
                                </span>
                            </div>

                            {/* Verification Link */}
                            {activity.verificationUrl && (
                                <a
                                    href={activity.verificationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 mt-2"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                    <span>查看验证</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Trust Note */}
            <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-700">
                    ✅ 所有关键操作均可通过区块链或 GitHub 验证，确保透明度
                </p>
            </div>
        </div>
    )
}

export default ActivityTimeline
