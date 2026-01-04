
import React from 'react';

export const LegalIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="legal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <filter id="glow-legal" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            {/* Shield shape with glow */}
            <path 
                d="M250 50 L 450 150 L 450 300 C 450 380, 250 450, 250 450 C 250 450, 50 380, 50 300 L 50 150 Z" 
                fill="url(#legal-grad)" 
                opacity="0.1" 
                filter="url(#glow-legal)"
            />
            <path 
                d="M250 50 L 450 150 L 450 300 C 450 380, 250 450, 250 450 C 250 450, 50 380, 50 300 L 50 150 Z" 
                stroke="url(#legal-grad)" 
                strokeWidth="2" 
                fill="none"
            />

            {/* Gavel icon inside */}
            <g transform="translate(180, 180) scale(0.3)">
                <path d="M123.64,162.36,108,178a24,24,0,0,1-33.94,0L69.37,173.28,211.5,31.15l4.69,4.69L123.64,162.36Z" fill="#a0a0a0" />
                <path d="M381.38,131.78,252.6,2.22a23.89,23.89,0,0,0-33.81,0L208.6,12.41,371.18,175l10.19-10.19a23.9,23.9,0,0,0,0-33.81Z" fill="#a0a0a0" />
                <path d="M208.6,12.41,69.37,173.28a16,16,0,0,0,0,22.63l4.69,4.68,22.62-22.62,112-112,22.63-22.63L208.6,12.41Z" fill="#a0a0a0" />
            </g>

            {/* Circuit lines */}
            <g opacity="0.2" className="circuit-lines">
                 <path d="M100 200 H 180 V 250 H 220" stroke="#4B5563" fill="none" strokeWidth="1.5" />
                 <path d="M400 200 H 320 V 250 H 280" stroke="#4B5563" fill="none" strokeWidth="1.5" />
                 <path d="M150 350 H 220 V 300" stroke="#4B5563" fill="none" strokeWidth="1.5" />
                 <path d="M350 350 H 280 V 300" stroke="#4B5563" fill="none" strokeWidth="1.5" />
            </g>

            <style>{`
                .circuit-lines {
                    animation: dash-legal 8s linear infinite;
                    stroke-dasharray: 20;
                }
                @keyframes dash-legal {
                    to {
                        stroke-dashoffset: 200;
                    }
                }
            `}</style>
        </svg>
    );
};
