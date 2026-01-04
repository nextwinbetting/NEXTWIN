
import React from 'react';

export const FAQIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="faq-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <filter id="glow-faq" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Main Brain/Node Structure */}
            <g transform="translate(300, 150)">
                {/* Central Core */}
                <circle cx="0" cy="0" r="40" fill="url(#faq-grad)" filter="url(#glow-faq)" className="core-pulse" />
                <circle cx="0" cy="0" r="35" fill="#110f1f" />
                <text x="0" y="8" fontFamily="Poppins, sans-serif" fontSize="24" fill="url(#faq-grad)" textAnchor="middle" fontWeight="bold">IA</text>
                
                {/* Neurons */}
                <g className="neurons">
                    {[...Array(6)].map((_, i) => (
                        <g key={i} transform={`rotate(${i * 60})`}>
                            <circle cx="80" cy="0" r="8" fill="url(#faq-grad)" className="neuron-dot" style={{ animationDelay: `${i * 0.2}s` }} />
                            <circle cx="150" cy="0" r="6" fill="url(#faq-grad)" className="neuron-dot" style={{ animationDelay: `${(i + 0.5) * 0.2}s` }} />
                            <circle cx="220" cy="0" r="5" fill="url(#faq-grad)" className="neuron-dot" style={{ animationDelay: `${(i + 1) * 0.2}s` }} />
                        </g>
                    ))}
                </g>

                {/* Connections */}
                <g opacity="0.3" className="connections">
                    {[...Array(6)].map((_, i) => (
                        <g key={i}>
                            <path d={`M0,0 Q${80 * Math.cos((i * 60 + 30) * Math.PI / 180)}, ${80 * Math.sin((i * 60 + 30) * Math.PI / 180)} ${80 * Math.cos((i * 60 + 60) * Math.PI / 180)}, ${80 * Math.sin((i * 60 + 60) * Math.PI / 180)}`} stroke="#4B5563" strokeWidth="1" fill="none" className="path-flow-faq" style={{ animationDelay: `${i * 0.5}s` }}/>
                            <path d={`M80,0 L150,0`} transform={`rotate(${i * 60})`} stroke="#4B5563" strokeWidth="1" fill="none" className="path-flow-faq" style={{ animationDelay: `${i * 0.5 + 0.2}s` }}/>
                             <path d={`M150,0 L220,0`} transform={`rotate(${i * 60})`} stroke="#4B5563" strokeWidth="1" fill="none" className="path-flow-faq" style={{ animationDelay: `${i * 0.5 + 0.4}s` }}/>
                        </g>
                    ))}
                </g>
            </g>

            <style>{`
                .core-pulse { animation: core-pulse-faq 4s infinite ease-in-out; }
                @keyframes core-pulse-faq { 
                    0%, 100% { transform: scale(1); } 
                    50% { transform: scale(1.05); } 
                }
                .neuron-dot { animation: pulse-faq 3s infinite ease-in-out; }
                @keyframes pulse-faq { 
                    0%, 100% { opacity: 0.7; } 
                    50% { opacity: 1; } 
                }
                .neurons, .connections {
                    animation: rotate-faq 60s linear infinite;
                }
                @keyframes rotate-faq {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .path-flow-faq { 
                    stroke-dasharray: 5; 
                    animation: dash-faq 4s linear infinite;
                    opacity: 0;
                }
                @keyframes dash-faq { 
                    0% { stroke-dashoffset: 10; opacity: 0; }
                    50% { opacity: 1; }
                    100% { stroke-dashoffset: -10; opacity: 0;}
                }
            `}</style>
        </svg>
    );
};
