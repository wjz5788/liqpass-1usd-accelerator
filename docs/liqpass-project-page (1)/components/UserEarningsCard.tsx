import React, { useState } from 'react';
import { TrendingUp, Wallet, Ticket, ChevronDown, ChevronUp } from 'lucide-react';
import { UserEarnings } from '../types';

interface UserEarningsCardProps {
  earnings: UserEarnings;
  defaultCollapsed?: boolean;
}

export const UserEarningsCard: React.FC<UserEarningsCardProps> = ({ earnings, defaultCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const isProfitable = earnings.pnl >= 0;

  return (
    <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900">我的收益</h3>
        </div>
        <div className="flex items-center gap-3">
            <div className={`text-sm font-bold ${isProfitable ? 'text-green-600' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}{earnings.pnl > 0 ? `$${earnings.pnl.toFixed(2)}` : '-'}
            </div>
            {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {!isCollapsed && (
        <div className="p-5 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
              <div className="text-xs text-slate-500 mb-1">已投入</div>
              <div className="text-lg font-bold text-slate-900">${earnings.invested}</div>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <Ticket className="w-3 h-3" />
                <span>{earnings.tickets} 票</span>
              </div>
            </div>
            <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
              <div className="text-xs text-slate-500 mb-1">预估价值</div>
              <div className="text-lg font-bold text-green-700">${earnings.estimated}</div>
              <div className="flex items-center gap-1 mt-1 text-xs text-green-600 font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>{earnings.multiplier}x</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">已提取 (Realized)</span>
              <span className="font-medium text-slate-900">${earnings.realized}</span>
            </div>
            <div className="w-full bg-slate-100 h-px" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">池平均回报率</span>
              <span className="font-medium text-slate-700">{earnings.poolAvgMultiplier}x</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">最高回报率 (Top)</span>
              <span className="font-medium text-yellow-600">{earnings.topMultiplier}x</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};