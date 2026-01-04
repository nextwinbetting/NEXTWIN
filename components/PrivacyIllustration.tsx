
import React from 'react';

export const PrivacyIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="privacy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <filter id="glow-privacy" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            
            {/* Background Glow */}
            <circle cx="250" cy="250" r="180" fill="url(#privacy-grad)" opacity="0.1" filter="url(#glow-privacy)" />

            {/* Lock Body */}
            <rect x="150" y="250" width="200" height="150" rx="20" fill="#171717" stroke="#374151" strokeWidth="2" />
            
            {/* Lock Shackle */}
            <path d="M200 250 V 180 a 50 50 0 0 1 100 0 v 70" stroke="url(#privacy-grad)" strokeWidth="20" fill="none" strokeLinecap="round" />
            
            {/* Fingerprint */}
            <g stroke="#4B5563" strokeWidth="4" fill="none" strokeLinecap="round">
                <path d="M250 290 a 10 10 0 0 1 0 20" className="fp-line" style={{animationDelay: '0s'}}/>
                <path d="M250 280 a 20 20 0 0 1 0 40" className="fp-line" style={{animationDelay: '0.2s'}}/>
                <path d="M250 270 a 30 30 0 0 1 0 60" className="fp-line" style={{animationDelay: '0.4s'}}/>
                <path d="M250 260 a 40 40 0 0 1 0 80" className="fp-line" style={{animationDelay: '0.6s'}}/>
            </g>

            <style>{`
                .fp-line {
                    stroke-dasharray: 100;
                    stroke-dashoffset: 100;
                    animation: draw-fp 2s ease-out forwards;
                }
                @keyframes draw-fp {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </svg>
    );
};
