import React from 'react';
import { ProjectData } from '../../../services/mock/projectData';
import { Clock, Radio } from 'lucide-react';

interface WindowControlPanelProps {
    data: ProjectData;
}

const WindowControlPanel: React.FC<WindowControlPanelProps> = ({ data }) => {
    const { window } = data;

    return (
        <div className="bg-[#12141a] border border-white/10 rounded-xl p-5 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
                    <Clock size={12} />
                    <span>Window Timer</span>
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-500 font-mono font-bold">LIVE</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Next Window</span>
                    <span className="text-white font-mono">{window.nextStart} - {window.nextEnd}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Status</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs font-bold">{window.phase}</span>
                        <span className="text-gray-300">C2C</span>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">System Role</span>
                    <span className="text-orange-400 font-mono text-xs border border-orange-500/20 px-1.5 py-0.5 rounded">{window.systemRole}</span>
                </div>
            </div>

            <button className="mt-4 w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 border border-indigo-500/50 group">
                <Radio size={16} className="group-hover:animate-pulse" />
                <span>Enter Window</span>
            </button>
        </div>
    );
};

export default WindowControlPanel;
