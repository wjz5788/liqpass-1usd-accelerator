import React from 'react';
import { ProjectData } from '../../../services/mock/projectData';
import { ExternalLink, Hash, Database, ThumbsUp, MessageSquare } from 'lucide-react';

interface EvidenceFeedProps {
    data: ProjectData;
}

const EvidenceFeed: React.FC<EvidenceFeedProps> = ({ data }) => {
    const { evidence } = data;

    return (
        <div className="bg-[#12141a] border border-white/10 rounded-xl p-5 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-sm">Evidence Feed</h3>
                <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View All</button>
            </div>

            <div className="space-y-3">
                {evidence.map(item => (
                    <div key={item.id} className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                                {item.type === 'URL' && <ExternalLink size={14} className="text-blue-400" />}
                                {item.type === 'HASH' && <Hash size={14} className="text-purple-400" />}
                                {item.type === 'ONCHAIN' && <Database size={14} className="text-green-400" />}
                                <span className="text-xs font-mono text-gray-400">{item.submitter}</span>
                            </div>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${item.status === 'Accepted' ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                                    item.status === 'Rejected' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                        'text-yellow-400 border-yellow-500/20 bg-yellow-500/10'
                                }`}>
                                {item.status}
                            </span>
                        </div>

                        <p className="text-sm text-gray-200 mb-2 font-medium">{item.title}</p>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Target: <span className="text-indigo-400">{item.target}</span></span>
                            <span>{item.time}</span>
                        </div>

                        <div className="flex items-center space-x-4 mt-3 pt-2 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 text-xs">
                                <ThumbsUp size={12} />
                                <span>Support</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 text-xs">
                                <MessageSquare size={12} />
                                <span>Challenge</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvidenceFeed;
