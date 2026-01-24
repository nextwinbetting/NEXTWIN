
import React from 'react';
import { DashboardNav, Language } from '../types';
import { translations } from '../translations';

interface DashboardHomeProps {
    username: string;
    setActivePage: (page: DashboardNav) => void;
    language: Language;
}

const InfoCard: React.FC<{
    title: string;
    description: string;
    cta: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, cta, icon, onClick }) => (
    <div className="bg-brand-card border border-gray-800/50 rounded-[2rem] p-8 flex flex-col group hover:border-orange-500/50 transition-all duration-300 relative overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="flex items-center mb-6">
            <div className="flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-2xl bg-gray-900 border border-gray-800 text-orange-500 group-hover:bg-orange-500/10 transition-colors">
                {icon}
            </div>
            <h2 className="ml-5 text-lg font-black text-white uppercase italic tracking-tighter">{title}</h2>
        </div>
        <p className="text-brand-light-gray text-xs font-medium leading-relaxed flex-grow uppercase tracking-wider">{description}</p>
        <button
            onClick={onClick}
            className="mt-8 text-[10px] font-black uppercase italic tracking-[0.2em] text-orange-500 hover:text-white transition-colors self-start py-2 border-b-2 border-orange-500/30 hover:border-orange-500"
        >
            {cta} →
        </button>
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-black text-white italic tracking-tighter uppercase">{t.dash_home_welcome} <span className="text-orange-500">{username}</span></h1>
                <p className="mt-4 text-xs font-black text-gray-500 uppercase tracking-[0.6em]">
                    {t.dash_home_subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoCard
                    title={t.dash_home_card1_title}
                    description={t.dash_home_card1_desc}
                    cta={t.dash_home_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 0-10 10c0 .5-.1 1-.2 1.5M2.5 15.2l.7-1.4.7 1.4m2.7-1.2.7-1.4.7 1.4M2.5 19h2.8m2.7 0h2.8m-5.5-2.2h2.5m12.7-1.5c-.1-.5-.2-1-.2-1.5a10 10 0 0 0-10-10M21.5 8.8l-.7 1.4-.7-1.4m-2.7.2.7 1.4.7-1.4m2.7 4h-2.8m-2.7 0h-2.8m5.5-2.2h-2.5" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                 <InfoCard
                    title={t.dash_home_card3_title}
                    description={t.dash_home_card3_desc}
                    cta={t.dash_home_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                 <InfoCard
                    title={t.dash_home_card4_title}
                    description={t.dash_home_card4_desc}
                    cta={t.dash_home_card4_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00-.75-.75h-.75m7.5-1.5V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0h3.75m-3.75 0a2.25 2.25 0 01-2.25 2.25V15m1.5 0v.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-.75" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <InfoCard
                    title={t.dash_home_card5_title}
                    description={t.dash_home_card5_desc}
                    cta={t.dash_home_card5_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 00-5.84-2.56m0 0a14.95 14.95 0 00-5.84 2.56m5.84-2.56V4.72a.75.75 0 011.5 0v4.82m-1.5 0a6 6 0 005.84 7.38m-5.84-7.38a6 6 0 00-5.84 7.38m5.84-7.38L15.59 14.37" /></svg>}
                    onClick={() => window.open('https://www.livescore.in/fr/', '_blank', 'noopener,noreferrer')}
                />
            </div>
        </div>
    );
};

export default DashboardHome;
