
import React from 'react';

const ContactIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="illustration-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <filter id="glow-contact" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Globe Background */}
            <circle cx="250" cy="250" r="200" fill="none" stroke="#374151" strokeWidth="1" />
            <circle cx="250" cy="250" r="150" fill="none" stroke="#374151" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="250" cy="250" r="200" fill="url(#illustration-grad)" opacity="0.05" />

            {/* Central Logo */}
            <g transform="translate(212 212) scale(2)">
                <path d="M12.42 0H0V38H12.42V12.602L25.58 38H38V0H25.58V25.398L12.42 0Z" fill="url(#illustration-grad)" filter="url(#glow-contact)"/>
            </g>
            
            {/* Data points */}
            <g>
                <circle cx="120" cy="150" r="8" fill="url(#illustration-grad)" className="pulse-dot" />
                <circle cx="380" cy="180" r="6" fill="url(#illustration-grad)" className="pulse-dot" style={{ animationDelay: '0.5s' }} />
                <circle cx="100" cy="300" r="7" fill="url(#illustration-grad)" className="pulse-dot" style={{ animationDelay: '1s' }} />
                <circle cx="400" cy="350" r="9" fill="url(#illustration-grad)" className="pulse-dot" style={{ animationDelay: '1.5s' }} />
                <circle cx="250" cy="440" r="5" fill="url(#illustration-grad)" className="pulse-dot" style={{ animationDelay: '0.2s' }} />
                <circle cx="250" cy="60" r="6" fill="url(#illustration-grad)" className="pulse-dot" style={{ animationDelay: '0.7s' }} />
            </g>

            {/* Connections */}
            <g opacity="0.4">
                <path d="M120 150 C 200 100, 300 120, 380 180" stroke="#4B5563" strokeWidth="1.5" fill="none" className="path-flow" />
                <path d="M100 300 C 150 380, 200 400, 250 440" stroke="#4B5563" strokeWidth="1.5" fill="none" className="path-flow" style={{ animationDelay: '1s' }} />
                <path d="M380 180 Q 420 250 400 350" stroke="#4B5563" strokeWidth="1.5" fill="none" className="path-flow" style={{ animationDelay: '2s' }} />
                <path d="M250 60 C 150 100, 100 200, 100 300" stroke="#4B5563" strokeWidth="1.5" fill="none" className="path-flow" style={{ animationDelay: '3s' }} />
            </g>
             <style>{`
                .pulse-dot { animation: pulse-contact 3s infinite ease-in-out; }
                @keyframes pulse-contact { 
                    0%, 100% { opacity: 0.8; transform: scale(0.9); } 
                    50% { opacity: 1; transform: scale(1.1); } 
                }
                .path-flow { stroke-dasharray: 10; animation: dash-contact 6s linear infinite; }
                @keyframes dash-contact { to { stroke-dashoffset: 200; } }
            `}</style>
        </svg>
    );
};

export default ContactIllustration;
