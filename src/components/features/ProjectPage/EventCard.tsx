import React from 'react';
import { EventItem } from '../../../services/mock/projectData';
import { Clock, TrendingUp, AlertCircle, CheckCircle, ChevronRight, BarChart2 } from 'lucide-react';

interface EventCardProps {
    event: EventItem;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <div className="bg-[#12141a] border border-white/10 rounded-xl p-4 hover:border-indigo-500/50 transition-colors group flex flex-col h-full relative overflow-hidden">
            {/* Decorative gradient blob */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center space-x-2">
                    <span className="p-1.5 bg-white/5 rounded-lg text-gray-400">
                        <BarChart2 size={16} />
                    </span>
                    <div>
                        <h3 className="text-white font-medium text-sm leading-tight line-clamp-1">{event.title}</h3>
                        <span className="text-xs text-gray-500">{event.topic}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${event.status === 'HOT' ? 'text-orange-400 border-orange-500/20 bg-orange-500/10' :
                            event.status === 'ENDING' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                'text-green-400 border-green-500/20 bg-green-500/10'
                        }`}>
                        {event.status}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">{event.phase}</span>
                </div>
            </div>

            {/* Price Section */}
            <div className="bg-white/5 rounded-lg p-3 mb-3 border border-white/5">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-gray-400 text-xs">Price (YES)</span>
                    <div className="flex items-center space-x-2">
                        <span className={`text-xs font-mono font-medium ${event.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {event.change24h > 0 ? '+' : ''}{event.change24h}%
                        </span>
                    </div>
                </div>
                <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-white tracking-tight">${event.priceYes.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 font-mono">/ share</span>
                </div>
                <div className="mt-2 flex justify-between items-center text-[10px] text-gray-500">
                    <span>Vol: {event.volume24h}</span>
                    <span className={`px-1 rounded ${event.depth === 'Thin' ? 'text-red-400 bg-red-500/10' :
                            event.depth === 'OK' ? 'text-yellow-400 bg-yellow-500/10' :
                                'text-green-400 bg-green-500/10'
                        }`}>
                        Depth: {event.depth}
                    </span>
                </div>
            </div>

            {/* Evidence Section */}
            <div className="mb-3 space-y-1">
                <div className="flex justify-between text-xs text-gray-400">
                    <span className="flex items-center space-x-1">
                        <CheckCircle size={10} />
                        <span>Evidence</span>
                    </span>
                    <span>{event.evidenceCount} submitted</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-1/3 rounded-full"></div>
                </div>
                <button className="w-full mt-2 py-1.5 text-xs text-indigo-400 border border-indigo-500/20 rounded hover:bg-indigo-500/10 transition-colors">
                    Submit Evidence
                </button>
            </div>

            {/* Footer Info */}
            <div className="mt-auto flex justify-between items-center text-xs text-gray-500 border-t border-white/5 pt-3">
                <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{event.deadline} left</span>
                </div>
            </div>

            {/* Actions Overlay (Hover) - Optional simple buttons for now */}
            <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs font-bold py-2 rounded transition-colors border border-green-500/20">
                    Buy YES
                </button>
                <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold py-2 rounded transition-colors border border-red-500/20">
                    Buy NO
                </button>
            </div>

        </div>
    );
};

export default EventCard;
