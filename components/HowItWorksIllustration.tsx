
import React from 'react';

const Step1 = () => (
    <g>
        <path d="M50 250 H 150" stroke="#4B5563" strokeWidth="2" />
        <path d="M80 150 Q 120 200 150 250" stroke="#4B5563" strokeWidth="2" fill="none" />
        <path d="M80 350 Q 120 300 150 250" stroke="#4B5563" strokeWidth="2" fill="none" />

        <circle cx="50" cy="250" r="15" fill="url(#illustration-grad-light)" />
        <circle cx="80" cy="150" r="15" fill="url(#illustration-grad-light)" />
        <circle cx="80" cy="350" r="15" fill="url(#illustration-grad-light)" />

        <circle cx="250" cy="250" r="100" fill="#171717" stroke="#374151" strokeWidth="2" />
        <text x="250" y="265" fontFamily="Poppins, sans-serif" fontSize="60" fill="url(#illustration-grad)" textAnchor="middle" fontWeight="bold">IA</text>
        
        <path d="M150 250 L 170 250" stroke="#F97316" strokeWidth="4" className="arrow" />
        <path d="M150 250 Q 160 250 170 250" stroke="#F97316" strokeWidth="4" fill="none" className="arrow-flow" />

        <style>{`
            .arrow-flow { animation: flow 2s linear infinite; stroke-dasharray: 10 20; }
            @keyframes flow { to { stroke-dashoffset: -30; } }
        `}</style>
    </g>
);

const Step2 = () => (
    <g>
        <rect x="50" y="100" width="400" height="300" rx="20" fill="#171717" stroke="#374151" strokeWidth="2" />
        <path d="M100 300 L 150 200 L 200 250 L 250 150 L 300 220" stroke="url(#illustration-grad)" strokeWidth="4" fill="none" />
        <rect x="320" y="180" width="30" height="120" fill="#4B5563" />
        <rect x="360" y="220" width="30" height="80" fill="#4B5563" />
        <rect x="400" y="150" width="30" height="150" fill="url(#illustration-grad-light)" />
        <circle cx="250" cy="250" r="150" fill="none" stroke="rgba(249, 115, 22, 0.2)" strokeWidth="50" />
    </g>
);

const Step3 = () => (
    <g>
        <circle cx="100" cy="250" r="20" fill="url(#illustration-grad)" />
        <circle cx="250" cy="150" r="20" fill="#A0A0A0" />
        <circle cx="250" cy="350" r="20" fill="#A0A0A0" />
        <circle cx="400" cy="250" r="20" fill="url(#illustration-grad)" />
        <line x1="100" y1="250" x2="250" y2="150" stroke="#4B5563" strokeWidth="2" />
        <line x1="100" y1="250" x2="250" y2="350" stroke="#4B5563" strokeWidth="2" />
        <line x1="250" y1="150" x2="400" y2="250" stroke="#4B5563" strokeWidth="2" />
        <line x1="250" y1="350" x2="400" y2="250" stroke="#4B5563" strokeWidth="2" />
        <text x="320" y="250" fontFamily="Poppins" fontSize="40" fill="#FFF" fontWeight="bold">%</text>
    </g>
);

const Step4 = () => (
    <g>
        <path d="M100 100 L 400 100 L 300 350 L 200 350 Z" fill="url(#illustration-grad-light)" opacity="0.2" />
        <path d="M100 100 L 400 100 L 300 350 L 200 350 Z" stroke="#F97316" strokeWidth="2" fill="none" />
        <line x1="150" y1="250" x2="350" y2="250" stroke="white" strokeWidth="4" />
        <text x="250" y="240" fontFamily="Poppins" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">≥ 70%</text>
        <circle cx="150" cy="150" r="10" fill="#A0A0A0" />
        <circle cx="250" cy="150" r="10" fill="#A0A0A0" />
        <circle cx="350" cy="150" r="10" fill="#A0A0A0" />
        <circle cx="200" cy="180" r="10" fill="#A0A0A0" />
        <circle cx="300" cy="180" r="10" fill="#A0A0A0" />
        <circle cx="250" cy="400" r="15" fill="url(#illustration-grad)" />
    </g>
);

const Step5 = () => (
    <g>
        <path d="M250 100 L 100 150 L 100 300 C 100 350 250 400 250 400 C 250 400 400 350 400 300 L 400 150 Z" fill="#171717" stroke="url(#illustration-grad)" strokeWidth="2" />
        <text x="250" y="260" fontFamily="Poppins" fontSize="80" fill="url(#illustration-grad)" textAnchor="middle" fontWeight="bold">5%</text>
    </g>
);

const Step6 = () => (
    <g>
        <rect x="50" y="150" width="400" height="250" rx="20" fill="#171717" stroke="#374151" strokeWidth="2" />
        <rect x="100" y="100" width="80" height="50" rx="10" fill="#171717" stroke="#374151" strokeWidth="2" />
        <path d="M150 250 L 200 300 L 250 220 L 300 280 L 350 200" stroke="url(#illustration-grad)" strokeWidth="4" fill="none" />
        <rect x="150" y="250" width="10" height="10" rx="2" fill="white" />
        <rect x="250" y="220" width="10" height="10" rx="2" fill="white" />
        <rect x="350" y="200" width="10" height="10" rx="2" fill="white" />
        <text x="250" y="360" fontFamily="Poppins" fontSize="24" fill="#A0A0A0" textAnchor="middle">TRANSPARENCE TOTALE</text>
    </g>
);


export const HowItWorksIllustration: React.FC<{ step: number, className?: string }> = ({ step, className }) => {
    const illustrations: { [key: number]: React.ReactNode } = {
        1: <Step1 />,
        2: <Step2 />,
        3: <Step3 />,
        4: <Step4 />,
        5: <Step5 />,
        6: <Step6 />,
    };

    return (
        <svg className={className} viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="illustration-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <linearGradient id="illustration-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FB923C" />
                    <stop offset="100%" stopColor="#E879F9" />
                </linearGradient>
            </defs>
            {illustrations[step] || null}
        </svg>
    );
};
