
import React from 'react';

const Football = () => (
    <g>
        <defs>
             <radialGradient id="football-heatmap" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
        </defs>
        {/* Field */}
        <rect x="50" y="100" width="400" height="300" rx="20" fill="transparent" stroke="#10B981" strokeOpacity="0.2" />
        <circle cx="250" cy="250" r="70" stroke="#10B981" strokeOpacity="0.2" strokeWidth="2" fill="none" />
        <line x1="250" y1="100" x2="250" y2="400" stroke="#10B981" strokeOpacity="0.2" strokeWidth="2" />
        <rect x="50" y="180" width="50" height="140" stroke="#10B981" strokeOpacity="0.2" strokeWidth="2" fill="none" />
        <rect x="400" y="180" width="50" height="140" stroke="#10B981" strokeOpacity="0.2" strokeWidth="2" fill="none" />

        {/* Data overlay */}
        <circle cx="180" cy="300" r="100" fill="url(#football-heatmap)">
             <animate attributeName="r" values="80;120;80" dur="4s" repeatCount="indefinite" />
        </circle>
        
        <path d="M150 200 Q 220 150 300 180" stroke="url(#illustration-grad)" strokeWidth="2.5" fill="none" className="path-flow" />
        <path d="M150 200 L 200 300 L 350 280" stroke="url(#illustration-grad)" strokeWidth="2.5" fill="none" />
        
        <circle cx="150" cy="200" r="6" fill="white" className="pulse-dot" />
        <circle cx="300" cy="180" r="6" fill="white" className="pulse-dot" style={{ animationDelay: '0.5s' }} />
        <circle cx="200" cy="300" r="6" fill="white" className="pulse-dot" style={{ animationDelay: '1s' }}/>
        <circle cx="350" cy="280" r="6" fill="white" className="pulse-dot" style={{ animationDelay: '1.5s' }} />
        <style>{`
            .pulse-dot { animation: pulse 2s infinite ease-in-out; }
            @keyframes pulse { 0%, 100% { r: 6; opacity: 1; } 50% { r: 9; opacity: 0.6; } }
            .path-flow { stroke-dasharray: 10; animation: dash 3s linear infinite; }
            @keyframes dash { to { stroke-dashoffset: 100; } }
        `}</style>
    </g>
);

const Basketball = () => (
    <g>
        {/* Court */}
        <path d="M50 400 L 150 100 L 350 100 L 450 400 Z" fill="transparent" stroke="#F97316" strokeOpacity="0.2" strokeWidth="2" />
        <path d="M180 100 A 70 20 0 0 0 320 100" stroke="#F97316" strokeOpacity="0.2" strokeWidth="2" fill="none" />
        <ellipse cx="250" cy="100" rx="40" ry="10" stroke="#F97316" strokeOpacity="0.2" strokeWidth="2" fill="none" />

        {/* Data overlay */}
        <path d="M250 110 C 200 200, 300 200, 250 380" stroke="url(#illustration-grad)" strokeWidth="2.5" fill="none" className="path-flow" style={{ animationDuration: '4s' }} />
        <circle cx="200" cy="180" r="5" fill="white" className="pulse-dot" />
        <circle cx="300" cy="180" r="5" fill="white" className="pulse-dot" style={{ animationDelay: '0.5s' }} />
        <circle cx="180" cy="320" r="5" fill="white" className="pulse-dot" style={{ animationDelay: '1s' }} />
        <circle cx="320" cy="320" r="5" fill="white" className="pulse-dot" style={{ animationDelay: '1.5s' }} />
         <g className="shot-chart">
            <path d="M250 110 L 220 180" stroke="#D946EF" strokeOpacity="0.7" strokeWidth="2" fill="none" />
            <path d="M250 110 L 280 180" stroke="#D946EF" strokeOpacity="0.7" strokeWidth="2" fill="none" />
            <path d="M250 110 L 200 250" stroke="#D946EF" strokeOpacity="0.7" strokeWidth="2" fill="none" />
        </g>
         <style>{`
            .pulse-dot { animation: pulse 2s infinite ease-in-out; }
            @keyframes pulse { 0%, 100% { r: 5; opacity: 1; } 50% { r: 8; opacity: 0.6; } }
            .path-flow { stroke-dasharray: 10; animation: dash 3s linear infinite; }
            @keyframes dash { to { stroke-dashoffset: 100; } }
            .shot-chart { animation: fade-in 3s infinite alternate; }
            @keyframes fade-in { from { opacity: 0.3; } to { opacity: 1; } }
        `}</style>
    </g>
);

const Tennis = () => (
    <g>
        {/* Court */}
        <rect x="50" y="100" width="400" height="300" fill="transparent" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="2" />
        <line x1="50" y1="250" x2="450" y2="250" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="2" />
        <line x1="150" y1="100" x2="150" y2="400" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="2" />
        <line x1="350" y1="100" x2="350" y2="400" stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="2" />
        {/* Data overlay */}
        <path d="M100 150 C 250 350, 250 150, 400 350" stroke="url(#illustration-grad)" strokeWidth="2.5" fill="none" className="path-flow" style={{ animationDirection: 'alternate' }}/>
        <circle cx="100" cy="150" r="8" fill="white" className="pulse-dot" />
        <circle cx="400" cy="350" r="8" fill="white" className="pulse-dot" style={{ animationDelay: '1.5s' }} />

        <circle cx="180" cy="320" r="30" fill="#FBBF24" fillOpacity="0.2" className="impact-zone" />
        <circle cx="380" cy="180" r="25" fill="#FBBF24" fillOpacity="0.2" className="impact-zone" style={{ animationDelay: '1s' }} />

        <style>{`
            .pulse-dot { animation: pulse 1.5s infinite ease-in-out; }
            @keyframes pulse { 0%, 100% { r: 8; opacity: 1; } 50% { r: 11; opacity: 0.6; } }
            .path-flow { stroke-dasharray: 10; animation: dash 2.5s linear infinite; }
            @keyframes dash { to { stroke-dashoffset: 100; } }
            .impact-zone { animation: pulse-zone 3s infinite ease-in-out; }
            @keyframes pulse-zone { 0%, 100% { opacity: 0.1; transform: scale(0.95); } 50% { opacity: 0.4; transform: scale(1.05); } }
        `}</style>
    </g>
);


export const SportMarketIllustration: React.FC<{ sport: 'Football' | 'Basketball' | 'Tennis', className?: string }> = ({ sport, className }) => {
    const illustrations = {
        Football: <Football />,
        Basketball: <Basketball />,
        Tennis: <Tennis />,
    };

    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="illustration-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
            </defs>
            {illustrations[sport]}
        </svg>
    );
};
