import React from 'react';
import { History, ExternalLink, Gift, Wallet, Trophy } from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityTimelineProps {
  activities: ActivityLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'lottery': return <Gift className="w-4 h-4 text-pink-500" />;
      case 'allocation': return <Wallet className="w-4 h-4 text-blue-500" />;
      case 'hackathon': return <Trophy className="w-4 h-4 text-yellow-500" />;
      default: return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <History className="w-5 h-5 text-slate-500" />
        <h3 className="font-bold text-slate-900">资金动态</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {activities.map((log) => (
          <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
            <div className="mt-1 p-2 rounded-full bg-slate-50 border border-slate-100 shrink-0">
              {getIcon(log.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-sm font-bold text-slate-900">{log.description}</span>
                {log.amount && (
                  <span className="text-sm font-bold text-slate-700">-${log.amount}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                {log.verificationUrl && (
                  <a
                    href={log.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    验证 <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};