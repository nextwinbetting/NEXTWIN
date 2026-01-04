
import React from 'react';

export const PredictionIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="home-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
            </defs>
            <g className="group">
                {/* Data streams */}
                <path d="M50 100 C 150 150, 150 200, 220 250" stroke="#4B5563" strokeWidth="2" fill="none" className="data-stream" style={{ animationDelay: '0s' }} />
                <path d="M50 250 C 150 250, 150 250, 220 250" stroke="#4B5563" strokeWidth="2" fill="none" className="data-stream" style={{ animationDelay: '0.2s' }} />
                <path d="M50 400 C 150 350, 150 300, 220 250" stroke="#4B5563" strokeWidth="2" fill="none" className="data-stream" style={{ animationDelay: '0.4s' }} />

                {/* Central Node */}
                <circle cx="250" cy="250" r="40" fill="url(#home-grad)" className="node-pulse" />
                <circle cx="250" cy="250" r="35" fill="#110f1f" />
                <text x="250" y="258" textAnchor="middle" fontSize="18" fontWeight="bold" fill="url(#home-grad)">IA</text>

                {/* Prediction Card */}
                <g transform="translate(300, 200) rotate(10)" className="prediction-card">
                    <rect width="160" height="100" rx="10" fill="#171717" stroke="#4B5563" />
                    <path d="M10 20 H 80" stroke="#4B5563" strokeWidth="3" />
                    <path d="M10 40 H 150" stroke="url(#home-grad)" strokeWidth="4" />
                    <path d="M10 60 H 120" stroke="#4B5563" strokeWidth="3" />
                    <circle cx="140" cy="20" r="10" fill="url(#home-grad)" />
                </g>
            </g>
            <style>{`
                .data-stream { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-stream 1.5s ease-out forwards; }
                .group:hover .data-stream { animation-play-state: running; }
                @keyframes draw-stream { to { stroke-dashoffset: 0; } }
                
                .node-pulse { animation: pulse-node 3s infinite ease-in-out; }
                @keyframes pulse-node { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                
                .prediction-card { transform-origin: center; animation: float-card 4s infinite ease-in-out; }
                @keyframes float-card { 0%, 100% { transform: translate(300px, 200px) rotate(10deg) translateY(0); } 50% { transform: translate(300px, 200px) rotate(10deg) translateY(-10px); } }
            `}</style>
        </svg>
    );
};

export const AnalyzerIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <linearGradient id="home-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
            </defs>
            {/* Screen */}
            <rect x="50" y="100" width="400" height="300" rx="20" fill="#171717" stroke="#374151" />
            
            {/* Graph */}
            <path d="M100 350 L 150 250 L 200 300 L 250 200 L 300 280 L 350 180 L 400 220" stroke="url(#home-grad)" strokeWidth="3" fill="none" className="graph-line" />

            {/* Magnifying glass */}
            <g transform="translate(250, 250)">
                <circle cx="0" cy="0" r="70" stroke="white" strokeWidth="6" fill="none" />
                <line x1="50" y1="50" x2="100" y2="100" stroke="white" strokeWidth="8" strokeLinecap="round" />
                <circle cx="0" cy="0" r="60" fill="rgba(255,255,255,0.1)" />
            </g>
            <style>{`
                .graph-line { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw-graph 2s ease-out forwards; }
                @keyframes draw-graph { to { stroke-dashoffset: 0; } }
            `}</style>
        </svg>
    );
};

export const BankrollIllustration: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <linearGradient id="home-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                 <linearGradient id="green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
            </defs>
            {/* Grid */}
            <g stroke="#374151" strokeOpacity="0.5">
                <path d="M100 100 V 400" />
                <path d="M100 400 H 400" />
            </g>

            {/* Growth Graph */}
            <path d="M100 400 Q 150 300, 200 280 T 300 200 T 400 150" stroke="url(#green-grad)" strokeWidth="6" fill="none" className="growth-line" />

            {/* Shield */}
            <g transform="translate(180 200)">
                <path d="M90 0 L 180 30 L 180 90 C 180 150, 90 180, 90 180 C 90 180, 0 150, 0 90 L 0 30 Z" fill="url(#home-grad)" fillOpacity="0.3" stroke="url(#home-grad)" strokeWidth="2" className="shield" />
                <text x="90" y="100" textAnchor="middle" fontSize="32" fontWeight="bold" fill="white">5%</text>
            </g>

            <style>{`
                .growth-line { stroke-dasharray: 500; stroke-dashoffset: 500; animation: draw-growth 2.5s ease-out forwards; }
                @keyframes draw-growth { to { stroke-dashoffset: 0; } }
                
                .shield { transform-origin: center; animation: shield-pop 1s 1s ease-out forwards; opacity: 0; transform: scale(0.5); }
                @keyframes shield-pop { 
                    0% { opacity: 0; transform: scale(0.5); }
                    80% { transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </svg>
    );
};

export const ArticleEngineIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="article-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
        </defs>
        <g className="group">
            <path d="M50 100 L 120 100" stroke="#4B5563" strokeWidth="2" className="article-line" style={{animationDelay: '0s'}} />
            <path d="M180 100 L 250 100" stroke="#4B5563" strokeWidth="2" className="article-line" style={{animationDelay: '0.2s'}} />
            <circle cx="150" cy="100" r="30" fill="url(#article-grad)" className="article-node" />
            <circle cx="150" cy="100" r="25" fill="#171717" />
            <path d="M140 105 L 150 95 L 160 105" stroke="url(#article-grad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <style>{`
            .article-line { stroke-dasharray: 70; stroke-dashoffset: 70; animation: draw-article-line 1s ease-out forwards; }
            .group:hover .article-line { animation: draw-article-line 1s ease-out forwards; }
            @keyframes draw-article-line { to { stroke-dashoffset: 0; } }
            .article-node { transition: transform 0.3s ease-in-out; }
            .group:hover .article-node { transform: scale(1.1); }
        `}</style>
    </svg>
);

export const ArticleBankrollIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
             <linearGradient id="article-green-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
        </defs>
        <g className="group">
            <path d="M50 150 Q 100 120, 150 80 T 250 50" stroke="url(#article-green-grad)" strokeWidth="4" fill="none" className="article-graph" />
            <circle cx="250" cy="50" r="8" fill="url(#article-green-grad)" className="article-dot" />
        </g>
         <style>{`
            .article-graph { stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw-article-graph 1.5s ease-out forwards; }
            .group:hover .article-graph { animation: draw-article-graph 1.5s ease-out forwards; }
            @keyframes draw-article-graph { to { stroke-dashoffset: 0; } }
            .article-dot { animation: pulse-article-dot 2s infinite ease-in-out 1.5s; opacity: 0;}
            @keyframes pulse-article-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        `}</style>
    </svg>
);

export const ArticleMarketsIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
         <defs>
            <linearGradient id="article-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
        </defs>
        <g className="group">
            <circle cx="150" cy="100" r="70" fill="none" stroke="#4B5563" strokeWidth="1" />
            <path d="M150 30 A 70 70 0 0 1 220 100" fill="none" stroke="url(#article-grad)" strokeWidth="3" className="article-radar" />
            <line x1="150" y1="100" x2="220" y2="100" stroke="url(#article-grad)" strokeWidth="2" className="article-radar-line" />
        </g>
        <style>{`
            .article-radar-line { transform-origin: 150px 100px; animation: radar-sweep 4s linear infinite; }
            @keyframes radar-sweep { to { transform: rotate(360deg); } }
            .article-radar { opacity: 0; animation: radar-ping 4s linear infinite; }
            @keyframes radar-ping { 
                0% { opacity: 0.8; stroke-dasharray: 0 220; } 
                50% { opacity: 0.8; stroke-dasharray: 220 0; }
                100% { opacity: 0; }
            }
        `}</style>
    </svg>
);
