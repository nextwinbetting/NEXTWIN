import React from 'react';

// FIX: Export the HeroIllustration component so it can be imported in other files.
export const HeroIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" overflow="visible">
            <defs>
                <linearGradient id="hero-orbital-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <radialGradient id="glow-orbital-radial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#D946EF" stopOpacity="0" />
                </radialGradient>
                 <filter id="glow-orbital-filter" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                 <path id="orbit-football" d="M 400 280 a 350 100 0 1 0 0.1 0" />
                 <path id="orbit-basketball" d="M 400 280 a 260 70 0 1 0 0.1 0" transform="rotate(20 400 280)"/>
                 <path id="orbit-tennis" d="M 400 280 a 190 50 0 1 0 0.1 0" transform="rotate(-20 400 280)" />
            </defs>

            {/* Background */}
            <g opacity="0.5">
                <circle cx="400" cy="280" r="250" fill="url(#glow-orbital-radial)" />
            </g>

            <g className="group">
                {/* Orbits paths */}
                <g opacity="0.2" stroke="#4B5563" strokeWidth="1" fill="none">
                    <use href="#orbit-football" />
                    <use href="#orbit-basketball" />
                    <use href="#orbit-tennis" />
                </g>

                {/* Central AI Core */}
                <g transform="translate(400 280)">
                    <circle r="50" fill="url(#hero-orbital-grad)" filter="url(#glow-orbital-filter)" className="core-pulse-orbital" />
                    <circle r="45" fill="#110f1f" stroke="#4B5563" />
                    <text x="0" y="10" textAnchor="middle" fontSize="32" fontWeight="bold" fill="url(#hero-orbital-grad)">IA</text>
                    <circle r="60" fill="none" stroke="url(#hero-orbital-grad)" strokeWidth="1.5" strokeOpacity="0.5" className="core-ring" style={{animationDelay: '0s'}} />
                    <circle r="75" fill="none" stroke="url(#hero-orbital-grad)" strokeWidth="1" strokeOpacity="0.3" className="core-ring" style={{animationDelay: '-1s'}} />
                </g>

                {/* Sports Icons */}
                <g>
                    {/* Football */}
                    <g className="sport-icon-orbital">
                        <animateMotion dur="15s" repeatCount="indefinite" path="M 400 280 a 350 100 0 1 0 0.1 0" />
                        <circle r="18" fill="#171717" stroke="#a0a0a0" strokeWidth="1"/>
                        <circle r="5" fill="#a0a0a0" cy="-8" />
                        <path d="M0 -8 L 5 2 M0 -8 L -5 2 M5 2 L -5 2" stroke="#a0a0a0" strokeWidth="1" fill="none" />
                    </g>
                     {/* Basketball */}
                    <g className="sport-icon-orbital">
                        <animateMotion dur="12s" repeatCount="indefinite" path="M 400 280 a 260 70 0 1 0 0.1 0" >
                           <mpath href="#orbit-basketball" />
                        </animateMotion>
                        <circle r="18" fill="#171717" stroke="#F97316" strokeWidth="1"/>
                        <path d="M0 -18 A 18 18 0 0 1 0 18 M0 18 A 18 18 0 0 1 0 -18 M-18 0 A 18 18 0 0 1 18 0 M18 0 A 18 18 0 0 1 -18 0" stroke="#F97316" strokeWidth="1" fill="none" transform="rotate(45)" />
                    </g>
                     {/* Tennis */}
                    <g className="sport-icon-orbital">
                        <animateMotion dur="9s" repeatCount="indefinite">
                           <mpath href="#orbit-tennis" />
                        </animateMotion>
                        <circle r="18" fill="#171717" stroke="#D946EF" strokeWidth="1"/>
                        <path d="M-12 -12 A 20 20 0 0 1 12 12 M12 -12 A 20 20 0 0 0 -12 12" stroke="#D946EF" strokeWidth="1" fill="none"/>
                    </g>
                </g>
                
                {/* Hologram */}
                <g className="hologram-orbital" transform="translate(400, 120)">
                    <polygon points="-120 -80, 120 -80, 100 80, -100 80" fill="rgba(217, 70, 239, 0.1)" stroke="url(#hero-orbital-grad)" strokeWidth="1" />
                     <text x="0" y="-55" textAnchor="middle" fill="#a0a0a0" fontSize="12" letterSpacing="1">MATCH ANALYSÉ</text>
                     <text x="0" y="0" textAnchor="middle" fill="white" fontSize="48" fontWeight="bold">78<tspan fontSize="24">%</tspan></text>
                     <text x="0" y="30" textAnchor="middle" fill="#10B981" fontSize="16" fontWeight="bold">VICTOIRE : ÉQUIPE A</text>
                     <path d="M-80 50 l 30 -10 l 30 5 l 30 -8 l 30 2 l 30 -5" stroke="#F97316" strokeWidth="2" fill="none" className="hologram-graph-orbital" />
                </g>

            </g>

            <style>{`
                .group { transition: transform 0.5s ease-out; }
                .group:hover { transform: scale(1.05); }

                @keyframes core-pulse-orbital { 0%, 100% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.08); filter: brightness(1.3); } }
                .core-pulse-orbital { transform-origin: center; animation: core-pulse-orbital 4s ease-in-out infinite; }

                @keyframes core-ring-anim { from { transform: scale(1); opacity: 0.5; } to { transform: scale(1.3); opacity: 0; } }
                .core-ring { transform-origin: center; animation: core-ring-anim 2s ease-out infinite; }

                .sport-icon-orbital { animation: float-orbital 6s ease-in-out infinite alternate; }
                @keyframes float-orbital { from { transform: translateY(-5px); } to { transform: translateY(5px); } }

                .group:hover .sport-icon-orbital { animation-duration: 4s; }
                .group:hover animateMotion { animation-duration: 8s; }
                
                .hologram-orbital {
                    opacity: 0;
                    animation: appear-hologram 1s ease-out forwards 0.5s, float-hologram 8s ease-in-out infinite 1.5s;
                    transform-origin: center;
                }
                @keyframes appear-hologram { to { opacity: 1; } }
                @keyframes float-hologram { 0%, 100% { transform: translate(400px, 120px) translateY(0); } 50% { transform: translate(400px, 120px) translateY(-10px); } }
                
                .hologram-graph-orbital { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-holo-graph-orbital 1.5s ease-out forwards 1.2s; }
                @keyframes draw-holo-graph-orbital { to { stroke-dashoffset: 0; } }
            `}</style>
        </svg>
    );
};
