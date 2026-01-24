
import React from 'react';

const NextWinLogo: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={`flex items-center gap-4 flex-nowrap shrink-0 ${className}`}>
            <div className="h-10 w-10 flex-shrink-0">
                <svg viewBox="0 0 38 38" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#FDE047" />
                            <stop offset="30%" stopColor="#F97316" />
                            <stop offset="70%" stopColor="#D946EF" />
                            <stop offset="100%" stopColor="#6D28D9" />
                        </linearGradient>
                    </defs>
                    <path d="M0 38 V0 H14 L25 19 V0 H38 V38 H24 L13 19 V38 H0Z" fill="url(#logo-gradient)"/>
                </svg>
            </div>
            <div className="flex items-center text-4xl font-black tracking-tighter whitespace-nowrap leading-none">
                <span className="text-white">Next</span>
                <span className="text-transparent bg-clip-text bg-gradient-brand logo-win-part" style={{ paddingRight: '4px' }}>Win</span>
            </div>
        </div>
    );
};

export default NextWinLogo;
