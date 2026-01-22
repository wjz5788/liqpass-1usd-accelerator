import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '../../../domain/meme';

interface HeroCarouselProps {
    slides: HeroSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
    const [activeHeroIndex, setActiveHeroIndex] = useState(0);

    const currentSlide = slides[activeHeroIndex];

    const goPrevSlide = () => {
        setActiveHeroIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goNextSlide = () => {
        setActiveHeroIndex((prev) => (prev + 1) % slides.length);
    };

    // 自动轮播（模仿小米官网那种缓缓切换的感觉）
    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveHeroIndex((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => window.clearInterval(timer);
    }, [slides.length]);

    return (
        <section className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between min-h-[220px] group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-black z-0" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -mr-16 -mt-16 z-0" />

            {/* 主要内容 */}
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-2 text-indigo-200 mb-2">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40">
                            <DollarSign className="w-3 h-3" />
                        </span>
                        <span className="text-xs font-semibold tracking-wide uppercase">
                            {currentSlide.label}
                        </span>
                    </div>
                    <div className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-indigo-300 drop-shadow-sm">
                        {currentSlide.poolAmount}
                    </div>
                    <div className="mt-3 text-sm text-indigo-200/70 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{currentSlide.timeLabel}</span>
                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span>{currentSlide.desc}</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-4">
                    <button className="relative overflow-hidden px-6 py-2.5 rounded-xl bg-white text-indigo-950 text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                        <span className="relative z-10">{currentSlide.buttonText}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                    <div className="text-xs text-indigo-200/60 font-medium">
                        {currentSlide.ticketText}
                    </div>
                </div>
            </div>

            {/* 左右箭头控制（模仿小米左右切换） */}
            <div className="absolute inset-y-0 left-3 flex items-center">
                <button
                    type="button"
                    onClick={goPrevSlide}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                    type="button"
                    onClick={goNextSlide}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-white/70 hover:text-white transition-colors backdrop-blur-sm"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* 底部圆点指示器（小米式） */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {slides.map((slide, index) => (
                    <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveHeroIndex(index)}
                        className="group focus:outline-none"
                    >
                        <span
                            className={`block w-2.5 h-2.5 rounded-full border transition-all duration-300 ${activeHeroIndex === index
                                ? "bg-white border-white shadow-[0_0_8px_rgba(255,255,255,0.7)] scale-110"
                                : "border-white/60 bg-transparent group-hover:border-white/90"
                                }`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;
