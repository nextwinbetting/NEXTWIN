import React from 'react';

export const ExclusiveAccessIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="si-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
            <filter id="si-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="15" result="coloredBlur" />
            </filter>
        </defs>
        <g className="group">
            <rect x="50" y="80" width="200" height="180" rx="15" fill="none" stroke="url(#si-grad)" strokeWidth="2" filter="url(#si-glow)" opacity="0.5" />
            <rect x="50" y="80" width="200" height="180" rx="15" fill="#171717" stroke="#374151" strokeWidth="2" />

            <path d="M100 80 V 60 a 50 50 0 0 1 100 0 v 20" stroke="url(#si-grad)" strokeWidth="12" fill="none" strokeLinecap="round" className="si-shackle" />
            <circle cx="150" cy="170" r="15" fill="url(#si-grad)" />
            <path d="M150 185 V 210" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
        </g>
        <style>{`
            .si-shackle { transform-origin: center; transition: transform 0.3s ease-out; }
            .group:hover .si-shackle { transform: translateY(-5px); }
        `}</style>
    </svg>
);

export const StructuredCapitalIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="si-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
        </defs>
        <g className="group">
            <rect x="50" y="220" width="200" height="30" rx="5" fill="url(#si-grad-2)" className="si-bar" style={{animationDelay: '0s'}}/>
            <rect x="50" y="180" width="200" height="30" rx="5" fill="url(#si-grad-2)" className="si-bar" style={{animationDelay: '0.1s'}}/>
            <rect x="50" y="140" width="200" height="30" rx="5" fill="url(#si-grad-2)" className="si-bar" style={{animationDelay: '0.2s'}}/>
            <rect x="50" y="100" width="10" height="30" rx="5" fill="url(#si-grad-2)" opacity="0.3" />
            <rect x="65" y="100" width="185" height="30" rx="5" fill="#374151" />
            <text x="150" y="240" fill="#fff" fontSize="12" textAnchor="middle">CAPITAL</text>
            <text x="155" y="120" fill="#fff" fontSize="12" textAnchor="middle">MISE 5%</text>
        </g>
        <style>{`
            .si-bar { transform: scaleX(0); transform-origin: left; animation: grow-bar 0.6s ease-out forwards; }
            @keyframes grow-bar { to { transform: scaleX(1); } }
            .group:hover .si-bar { animation: none; transform: scaleX(1); }
        `}</style>
    </svg>
);

export const LongTermVisionIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="si-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
        </defs>
         <g className="group">
            <path d="M50 250 H 250 V 50" stroke="#374151" strokeWidth="2" fill="none" />
            <path d="M50 250 C 100 200, 150 220, 200 150 S 250 80, 250 50" stroke="url(#si-grad-3)" strokeWidth="4" fill="none" className="si-graph" />
            <circle cx="250" cy="50" r="8" fill="url(#si-grad-3)" className="si-dot" />
        </g>
        <style>{`
            .si-graph { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw-graph 1.5s ease-out forwards; }
            .si-dot { opacity: 0; animation: appear-dot 0.5s ease-out forwards 1.5s; }
            .group:hover .si-graph { animation: none; stroke-dashoffset: 0; }
            .group:hover .si-dot { animation: none; opacity: 1; }

            @keyframes draw-graph { to { stroke-dashoffset: 0; } }
            @keyframes appear-dot { to { opacity: 1; } }
        `}</style>
    </svg>
);
