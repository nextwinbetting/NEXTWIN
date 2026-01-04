
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface LockedFeatureProps {
    onNavigate: () => void;
    language: Language;
}

const LockedFeature: React.FC<LockedFeatureProps> = ({ onNavigate, language }) => {
    const t = translations[language];

    return (
        <div className="text-center bg-brand-card border border-gray-800 rounded-xl p-8 max-w-2xl mx-auto my-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            </div>
            <h1 className="mt-6 text-3xl sm:text-4xl font-bold text-white">{t.locked_title}</h1>
            <p className="mt-4 text-lg text-brand-light-gray">
                {t.locked_subtitle}
            </p>
            <div className="mt-8">
                 <button
                    onClick={onNavigate}
                    className="rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                >
                    {t.locked_cta}
                </button>
            </div>
        </div>
    );
};

export default LockedFeature;