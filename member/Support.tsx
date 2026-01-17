import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface SupportProps {
    language: Language;
    onNavigateToFaq: () => void;
    onNavigateToContact: () => void;
}

const SupportCard: React.FC<{
    title: string;
    description: string;
    cta: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, cta, icon, onClick }) => (
    <div className="bg-brand-card border border-gray-800 rounded-xl p-6 flex flex-col group text-center items-center">
        <div className="flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-full bg-gray-800 text-orange-400 mb-4">
            {icon}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="mt-2 text-brand-light-gray text-sm flex-grow">{description}</p>
        <button
            onClick={onClick}
            className="mt-6 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 transition-colors"
        >
            {cta}
        </button>
    </div>
);

const Support: React.FC<SupportProps> = ({ language, onNavigateToFaq, onNavigateToContact }) => {
    const t = translations[language];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.support_title}</h1>
                <p className="mt-2 text-lg text-brand-light-gray">
                    {t.support_subtitle}
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <SupportCard
                    title={t.support_card1_title}
                    description={t.support_card1_desc}
                    cta={t.support_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
                    onClick={onNavigateToFaq}
                />
                 <SupportCard
                    title={t.support_card2_title}
                    description={t.support_card2_desc}
                    cta={t.support_card2_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                    onClick={() => window.location.href = `mailto:${t.contact_info_email}`}
                />
                 <SupportCard
                    title={t.support_card3_title}
                    description={t.support_card3_desc}
                    cta={t.support_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    onClick={onNavigateToContact}
                />
            </div>
        </div>
    );
};

export default Support;