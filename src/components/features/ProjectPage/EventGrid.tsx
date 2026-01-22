import React, { useState } from 'react';
import { EventItem } from '../../../services/mock/projectData';
import EventCard from './EventCard';
import { Filter } from 'lucide-react';

interface EventGridProps {
    events: EventItem[];
}

const EventGrid: React.FC<EventGridProps> = ({ events }) => {
    const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'HOT' | 'ENDING' | 'RESOLVED'>('ALL');

    const filteredEvents = filter === 'ALL'
        ? events
        : events.filter(e => e.status === filter || (filter === 'OPEN' && e.status !== 'RESOLVED')); // Simplified logic

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg flex items-center space-x-2">
                    <span>Event Market</span>
                    <span className="text-xs text-gray-500 font-normal bg-white/5 px-2 py-0.5 rounded-full">{events.length}</span>
                </h2>

                <div className="flex items-center space-x-1 bg-white/5 p-1 rounded-lg">
                    {['ALL', 'OPEN', 'HOT', 'ENDING'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === f
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
                {/* Placeholder for "Add New Event" or purely empty state */}
                {filteredEvents.length === 0 && (
                    <div className="col-span-full h-32 flex items-center justify-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                        No events match this filter.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventGrid;
