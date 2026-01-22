import React from 'react';
import { PieChart, DollarSign } from 'lucide-react';
import { PoolFinances } from '../types';

interface MoneyFlowCardProps {
  finances: PoolFinances;
}

export const MoneyFlowCard: React.FC<MoneyFlowCardProps> = ({ finances }) => {
  return (
    <div className="bg-white border border-slate-200 shadow-md rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-900">资金池概况</h3>
        </div>
        <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded font-bold border border-purple-100">
          Total ${finances.currentPool}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-6">
            <div className="flex justify-between text-sm mb-2 text-slate-600">
                <span>资金利用率</span>
                <span className="font-bold">{((finances.moneyOut.operations / finances.currentPool) * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: '15%' }} className="h-full bg-blue-500" title="Operations" />
                <div style={{ width: '35%' }} className="h-full bg-yellow-400" title="Lottery" />
                <div style={{ width: '20%' }} className="h-full bg-green-500" title="Settlement" />
                <div className="flex-1 h-full bg-slate-200" title="Reserved" />
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 flex-wrap">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" />运营</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-400" />抽奖</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" />结算</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200" />留存</div>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>总收入 (In)</span>
                </div>
                <span className="font-bold text-slate-900">${finances.moneyIn.supportTickets + finances.moneyIn.sponsorship}</span>
            </div>
            <div className="pl-6 text-xs space-y-1 text-slate-500 border-l-2 border-slate-100 ml-2">
                <div className="flex justify-between"><span>票务收入</span><span>${finances.moneyIn.supportTickets}</span></div>
                <div className="flex justify-between"><span>赞助/其他</span><span>${finances.moneyIn.sponsorship + finances.moneyIn.hackathonPrize}</span></div>
            </div>

            <div className="w-full bg-slate-100 h-px" />

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="w-4 h-4 text-red-400" />
                    <span>总支出 (Out)</span>
                </div>
                <span className="font-bold text-slate-900">${finances.moneyOut.lottery + finances.moneyOut.settlement + finances.moneyOut.operations}</span>
            </div>
        </div>
      </div>
    </div>
  );
};