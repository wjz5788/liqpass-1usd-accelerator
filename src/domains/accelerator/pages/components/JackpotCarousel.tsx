import React, { useState, useEffect } from 'react';
import { Clock, DollarSign } from 'lucide-react';

interface JackpotData {
    id: string;
    amount: number;
    currency: string;
    endTime: string; // HH:mm
    ticketPrice: number;
    status: 'live' | 'ended' | 'upcoming';
    backgroundImage?: string;
}

const mockJackpots: JackpotData[] = [
    {
        id: '1',
        amount: 1284.50,
        currency: 'USDC',
        endTime: '23:15',
        ticketPrice: 1,
        status: 'live',
        backgroundImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop' // Abstract dark crypto/tech
    },
    {
        id: '2',
        amount: 5430.00,
        currency: 'USDC',
        endTime: '12:00',
        ticketPrice: 5,
        status: 'upcoming',
        backgroundImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop' // Abstract dark purple
    },
    {
        id: '3',
        amount: 890.25,
        currency: 'USDC',
        endTime: '08:00',
        ticketPrice: 0.5,
        status: 'live',
        backgroundImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2832&auto=format&fit=crop' // Abstract blue/pink
    }
];

const JackpotCard: React.FC<{ data: JackpotData }> = ({ data }) => {
    return (
        <div className="w-full h-64 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between bg-[#1a1b26] border border-white/5 shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
            {/* Background Image */}
            {data.backgroundImage && (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                        style={{ backgroundImage: `url(${data.backgroundImage})` }}
                    />
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                </>
            )}

            {/* Fallback Gradient if no image */}
            {!data.backgroundImage && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2a2d55] to-[#1a1b26]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                </>
            )}

            <div className="relative z-10">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <DollarSign className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium tracking-wide drop-shadow-md">当前质押奖池 ({data.currency})</span>
                </div>

                <div className="text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
                    {data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium drop-shadow-md">
                    <Clock className="w-4 h-4" />
                    <span>{data.endTime} 自动开奖</span>
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span>今日累积所有入场</span>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-4">
                <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/5">
                    立即参与抽奖
                </button>
                <div className="text-gray-300 text-sm font-medium drop-shadow-md">
                    单张门票: {data.ticketPrice} {data.currency} · 无上限
                </div>
            </div>
        </div>
    );
};

const JackpotCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % mockJackpots.length);
        }, 5000); // Auto-rotate every 5 seconds

        return () => clearInterval(timer);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="w-full mb-8 relative group">
            <div className="overflow-hidden rounded-3xl">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {mockJackpots.map((jackpot) => (
                        <div key={jackpot.id} className="w-full flex-shrink-0">
                            <JackpotCard data={jackpot} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 right-8 flex gap-2 z-20">
                {mockJackpots.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index
                            ? 'bg-white w-6'
                            : 'bg-white/30 hover:bg-white/50'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default JackpotCarousel;
