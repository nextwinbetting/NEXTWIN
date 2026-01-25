
import React from 'react';

export const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" overflow="visible">
            <defs>
                <linearGradient id="core-grad-final" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#FF6B00" />
                </linearGradient>
                <filter id="final-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="30" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Background Rings */}
            <g transform="translate(300, 300)">
                <circle r="250" fill="none" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="5 15" opacity="0.1" className="animate-spin-slow" />
                <circle r="200" fill="none" stroke="#FF6B00" strokeWidth="1" strokeDasharray="1 10" opacity="0.2" className="animate-spin-reverse" />
                
                {/* Orbital Paths */}
                <ellipse cx="0" cy="0" rx="280" ry="100" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" transform="rotate(30)" />
                <ellipse cx="0" cy="0" rx="280" ry="100" fill="none" stroke="white" strokeWidth="0.5" opacity="0.05" transform="rotate(-30)" />
            </g>

            {/* Central Engine Core */}
            <g transform="translate(300, 300)" filter="url(#final-glow)">
                {/* Outermost pulsing ring */}
                <circle r="110" fill="none" stroke="url(#core-grad-final)" strokeWidth="1" opacity="0.3" className="animate-pulse-final" />
                
                {/* Main Core */}
                <circle r="90" fill="url(#core-grad-final)" className="animate-float-final" />
                <circle r="85" fill="#020205" />
                
                {/* Internal Geometry */}
                <g className="animate-spin-slow" style={{ animationDuration: '10s' }}>
                    <path d="M-40 -40 L40 40 M-40 40 L40 -40" stroke="white" strokeWidth="1" opacity="0.1" />
                    <circle r="30" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
                </g>
                
                <text x="0" y="12" textAnchor="middle" fontSize="36" fontWeight="900" fill="white" className="font-display italic tracking-tighter">NW</text>
            </g>

            {/* Floating Nodes */}
            <g className="animate-float-final">
                <circle cx="100" cy="100" r="4" fill="#FF6B00" className="animate-pulse" />
                <circle cx="500" cy="200" r="3" fill="#8B5CF6" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <circle cx="150" cy="450" r="5" fill="white" opacity="0.3" className="animate-pulse" style={{ animationDelay: '2s' }} />
            </g>

            <style>{`
                @keyframes spin-slow-f { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spin-rev-f { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                @keyframes float-f { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
                @keyframes pulse-f { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }
                
                .animate-spin-slow { transform-origin: center; animation: spin-slow-f 40s linear infinite; }
                .animate-spin-reverse { transform-origin: center; animation: spin-rev-f 30s linear infinite; }
                .animate-float-final { animation: float-f 8s ease-in-out infinite; }
                .animate-pulse-final { transform-origin: center; animation: pulse-f 5s ease-in-out infinite; }
            `}</style>
        </svg>
    );
};
