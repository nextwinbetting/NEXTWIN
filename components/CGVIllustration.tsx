
import React from 'react';

export const CGVIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="cgv-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <filter id="glow-cgv" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            {/* Main Document Shape */}
            <g transform="rotate(-10 250 250)">
                <rect x="100" y="100" width="300" height="350" rx="15" fill="#171717" stroke="#374151" strokeWidth="2" />
                <path d="M120 150 H 250" stroke="#4B5563" strokeWidth="3" />
                <path d="M120 180 H 380" stroke="#4B5563" strokeWidth="3" />
                <path d="M120 210 H 380" stroke="#4B5563" strokeWidth="3" />
                <path d="M120 240 H 350" stroke="#4B5563" strokeWidth="3" />
                <path d="M120 270 H 380" stroke="#4B5563" strokeWidth="3" />
                <path d="M120 300 H 280" stroke="#4B5563" strokeWidth="3" />
            </g>

            {/* Seal */}
            <g filter="url(#glow-cgv)">
                <circle cx="350" cy="350" r="60" fill="url(#cgv-grad)" />
                <circle cx="350" cy="350" r="50" fill="#110f1f" />
                <path d="M335 340 L 345 350 L 365 330" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Circuit decorations */}
            <g opacity="0.2" className="circuit-lines-cgv">
                <path d="M100 100 L 50 50 H 450 V 100" stroke="#4B5563" fill="none" strokeWidth="1.5" />
                <path d="M400 450 L 450 500" stroke="#4B5563" fill="none" strokeWidth="1.5" />
            </g>

            <style>{`
                .circuit-lines-cgv {
                    animation: dash-cgv 10s linear infinite;
                    stroke-dasharray: 20;
                }
                @keyframes dash-cgv {
                    to {
                        stroke-dashoffset: -200;
                    }
                }
            `}</style>
        </svg>
    );
};
