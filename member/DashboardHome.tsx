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
    <div className="bg-brand-card border border-gray-800 rounded-xl p-6 flex flex-col group">
        <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gray-800 text-orange-400">
                {icon}
            </div>
            <h2 className="ml-4 text-xl font-bold text-white">{title}</h2>
        </div>
        <p className="mt-4 text-brand-light-gray text-sm flex-grow">{description}</p>
        <button
            onClick={onClick}
            className="mt-6 text-sm font-semibold text-transparent bg-clip-text bg-gradient-brand self-start group-hover:brightness-125 transition-all"
        >
            {cta} →
        </button>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.dash_home_welcome} {username}</h1>
            <p className="mt-2 text-lg text-brand-light-gray">
                {t.dash_home_subtitle}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoCard
                    title={t.dash_home_card1_title}
                    description={t.dash_home_card1_desc}
                    cta={t.dash_home_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 0 0-10 10c0 .5-.1 1-.2 1.5M2.5 15.2l.7-1.4.7 1.4m2.7-1.2.7-1.4.7 1.4M2.5 19h2.8m2.7 0h2.8m-5.5-2.2h2.5m12.7-1.5c-.1-.5-.2-1-.2-1.5a10 10 0 0 0-10-10M21.5 8.8l-.7 1.4-.7-1.4m-2.7.2.7 1.4.7-1.4m2.7 4h-2.8m-2.7 0h-2.8m5.5-2.2h-2.5" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                 <InfoCard
                    title={t.dash_home_card2_title}
                    description={t.dash_home_card2_desc}
                    cta={t.dash_home_card2_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Analyzer)}
                />
                 <InfoCard
                    title={t.dash_home_card3_title}
                    description={t.dash_home_card3_desc}
                    cta={t.dash_home_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                 <InfoCard
                    title={t.dash_home_card4_title}
                    description={t.dash_home_card4_desc}
                    cta={t.dash_home_card4_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00-.75-.75h-.75m7.5-1.5V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0h3.75m-3.75 0a2.25 2.25 0 01-2.25 2.25V15m1.5 0v.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-.75" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <InfoCard
                    title={t.dash_home_card5_title}
                    description={t.dash_home_card5_desc}
                    cta={t.dash_home_card5_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.95 14.95 0 00-5.84-2.56m0 0a14.95 14.95 0 00-5.84 2.56m5.84-2.56V4.72a.75.75 0 011.5 0v4.82m-1.5 0a6 6 0 005.84 7.38m-5.84-7.38a6 6 0 00-5.84 7.38m5.84-7.38L15.59 14.37" /></svg>}
                    onClick={() => window.open('https://www.flashscore.fr/', '_blank', 'noopener,noreferrer')}
                />
            </div>
        </div>
    );
};

export default DashboardHome;