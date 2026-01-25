import React from 'react';

const NextWinLogo: React.FC<{ className?: string; onClick?: () => void }> = ({ className, onClick }) => {
    return (
        <div onClick={onClick} className={`flex items-center gap-6 group cursor-pointer ${className}`}>
            <div className="relative h-16 w-14 flex-shrink-0">
                {/* 3D Ribbon 'N' */}
                <svg viewBox="0 0 100 140" className="h-full w-full drop-shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform group-hover:scale-110 duration-500">
                    <defs>
                        <linearGradient id="n-ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#F97316" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                    </defs>
                    <path d="M0 5 L35 0 L35 140 L0 135 Z" fill="#F97316" />
                    <path d="M65 0 L100 5 L100 135 L65 140 Z" fill="#8B5CF6" />
                    <path d="M0 5 L35 0 L100 140 L65 140 Z" fill="url(#n-ribbon-grad)" className="drop-shadow-lg" />
                </svg>
            </div>
            <div className="flex flex-col leading-none">
                <div className="flex items-baseline">
                    <span className="text-4xl font-sans font-black text-white tracking-tighter uppercase">NEXT</span>
                    <span className="text-4xl font-sans font-black tracking-tighter uppercase italic ml-1 bg-clip-text text-transparent bg-gradient-to-r from-brand-violet to-brand-orange">WIN</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <div className="h-[1px] w-6 bg-brand-orange"></div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.5em] italic">Intelligence Artificielle</span>
                </div>
            </div>
        </div>
    );
};

export default NextWinLogo;