import React from 'react';
import { ProjectData } from '../../../services/mock/projectData';

interface ProjectRadarPanelProps {
    data: ProjectData;
}

const ProgressBar = ({ value }: { value: number }) => {
    const percent = Math.min(Math.max(value * 100, 0), 100);
    // Visualizing the ASCII bar: ▓▓▓░░
    // We'll use a CSS gradient or segments
    return (
        <div className="h-2 w-24 bg-gray-800 rounded-sm overflow-hidden flex">
            <div
                className="h-full bg-indigo-500"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};

const ProjectRadarPanel: React.FC<ProjectRadarPanelProps> = ({ data }) => {
    const statsArr = Object.values(data.stats);

    return (
        <div className="bg-[#12141a] border border-white/10 rounded-xl p-5 h-full">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                Project Radar
            </h3>
            <div className="space-y-4">
                {statsArr.map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-1 rounded transition-colors -mx-1">
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-300 font-mono text-sm w-20">{stat.label}</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-indigo-400 bg-indigo-500/10 px-1 rounded">YES</span>
                                <span className="text-white text-sm font-mono">{stat.value.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <ProgressBar value={stat.value} />
                            <span className={`text-xs font-mono w-12 text-right ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stat.change > 0 ? '+' : ''}{stat.change}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectRadarPanel;
