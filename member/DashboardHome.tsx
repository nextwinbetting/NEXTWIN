
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
    featured?: boolean;
}> = ({ title, description, cta, icon, onClick, featured }) => (
    <div 
        onClick={onClick}
        className={`group relative overflow-hidden rounded-2xl p-8 sm:p-10 cursor-pointer transition-all duration-500 hover:scale-[1.01] border ${
            featured 
                ? 'bg-gradient-to-br from-brand-dark-blue to-purple-900/10 border-orange-500/20 hover:border-orange-500/40' 
                : 'bg-brand-card border-white/5 hover:border-orange-500/20'
        }`}
    >
        <div className="flex items-center mb-8 relative z-10">
            <div className={`flex-shrink-0 h-14 w-14 flex items-center justify-center rounded-xl bg-gray-900 border border-white/10 text-orange-500 group-hover:bg-gradient-brand group-hover:text-white transition-all duration-500 shadow-lg`}>
                {icon}
            </div>
            <h2 className="ml-5 text-xl sm:text-2xl font-bold text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">{title}</h2>
        </div>
        
        <p className="text-gray-400 text-sm sm:text-base font-medium leading-relaxed uppercase tracking-wider mb-10 group-hover:text-gray-200 transition-colors">
            {description}
        </p>

        <div className="flex items-center gap-3 relative z-10">
            <span className="text-xs sm:text-sm font-black uppercase italic tracking-widest text-orange-500 group-hover:translate-x-2 transition-transform duration-500">
                {cta}
            </span>
            <div className="h-[2px] w-8 bg-gradient-brand rounded-full group-hover:w-16 transition-all duration-500"></div>
        </div>

        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-brand opacity-[0.03] blur-3xl rounded-full"></div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-16 px-4">
            <div className="mb-14">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-5 py-2 rounded-full mb-6">
                    <span className="text-sm font-black text-orange-500 uppercase tracking-widest italic">ESPACE MEMBRE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight truncate">
                    {t.dash_home_welcome} <span className="text-transparent bg-clip-text bg-gradient-brand">{username}</span>
                </h1>
                <p className="mt-4 text-sm sm:text-lg font-bold text-gray-500 uppercase tracking-[0.4em] italic">
                    {t.dash_home_subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoCard
                    featured
                    title={t.dash_home_card1_title}
                    description={t.dash_home_card1_desc}
                    cta={t.dash_home_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                 <InfoCard
                    title={t.dash_home_card3_title}
                    description={t.dash_home_card3_desc}
                    cta={t.dash_home_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                 <InfoCard
                    title={t.dash_home_card4_title}
                    description={t.dash_home_card4_desc}
                    cta={t.dash_home_card4_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <InfoCard
                    title={t.dash_home_card5_title}
                    description={t.dash_home_card5_desc}
                    cta={t.dash_home_card5_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Support)}
                />
            </div>
        </div>
    );
};

export default DashboardHome;
