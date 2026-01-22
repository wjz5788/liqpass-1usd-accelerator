import React from 'react';
import { ProjectData } from '../../../services/mock/projectData';
import { PieChart, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface IndexBasketPanelProps {
    data: ProjectData;
}

const IndexBasketPanel: React.FC<IndexBasketPanelProps> = ({ data }) => {
    const { index } = data;

    return (
        <div className="bg-[#12141a] border border-white/10 rounded-xl p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm flex items-center space-x-2">
                    <PieChart size={16} className="text-indigo-400" />
                    <span>Project Index</span>
                </h3>
                <span className="text-xs text-gray-500">Basket Tracking</span>
            </div>

            <div className="text-center py-4 bg-white/5 rounded-lg border border-white/5 mb-4 relative overflow-hidden">
                {/* Background blur effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"></div>

                <div className="relative z-10">
                    <div className="text-sm text-gray-400 mb-1">Current Index Price</div>
                    <div className="text-3xl font-bold text-white tracking-tight">{index.price}</div>
                    <div className="text-xs text-green-400 mt-1">
                        Deviation: {index.deviation}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                    <ArrowUpRight size={20} className="text-green-400 mb-1 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-xs font-medium text-gray-300">Mint Index</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group">
                    <ArrowDownLeft size={20} className="text-red-400 mb-1 group-hover:translate-y-0.5 transition-transform" />
                    <span className="text-xs font-medium text-gray-300">Redeem</span>
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-xs text-gray-500 text-center">
                    Arbitrage window open. <span className="text-indigo-400 cursor-pointer hover:underline">Learn more</span>
                </div>
            </div>
        </div>
    );
};

export default IndexBasketPanel;
