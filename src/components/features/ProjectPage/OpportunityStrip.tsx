import React from 'react';
import { ProjectData } from '../../../services/mock/projectData';
import { TrendingUp, Scale, FileText, AlertTriangle, ArrowRight } from 'lucide-react';

interface OpportunityStripProps {
    data: ProjectData;
}

const OpportunityStrip: React.FC<OpportunityStripProps> = ({ data }) => {
    const { opportunities: opps } = data;

    return (
        <div className="bg-[#12141a] border border-white/10 rounded-xl p-1 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/5">

                {/* Highest Volatility */}
                <div className="p-3 flex items-center space-x-3 hover:bg-white/5 transition-colors cursor-pointer group rounded-l-lg">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                        <TrendingUp size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Highest Vol</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-200">
                            <span className="font-medium group-hover:text-orange-400 transition-colors">{opps.highestVol.title}</span>
                            <span className="text-green-400 text-xs font-mono">+{opps.highestVol.change}%</span>
                        </div>
                    </div>
                </div>

                {/* Thin Orderbook */}
                <div className="p-3 flex items-center space-x-3 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Scale size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Thin Book</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-200">
                            <span className="font-medium group-hover:text-blue-400 transition-colors">{opps.thinBook.title}</span>
                            <span className="text-red-400 text-xs font-bold bg-red-500/10 px-1 rounded">{opps.thinBook.side}</span>
                        </div>
                    </div>
                </div>

                {/* New Evidence */}
                <div className="p-3 flex items-center space-x-3 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <FileText size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">New Evidence</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-200">
                            <span className="font-medium group-hover:text-purple-400 transition-colors">{opps.newEvidence.title}</span>
                            <span className="text-gray-500 text-xs">{opps.newEvidence.time}</span>
                        </div>
                    </div>
                </div>

                {/* Index Mispricing */}
                <div className="p-3 flex items-center space-x-3 hover:bg-white/5 transition-colors cursor-pointer group rounded-r-lg">
                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                        <AlertTriangle size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Arb Opportunity</div>
                        <div className="flex items-center justify-between text-sm text-gray-200">
                            <span className="font-medium group-hover:text-yellow-400 transition-colors">{opps.misplay.title}</span>
                            <ArrowRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OpportunityStrip;
