
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
        className={`group relative overflow-hidden rounded-[2.5rem] p-10 cursor-pointer transition-all duration-500 hover:scale-[1.02] border ${
            featured 
                ? 'bg-gradient-to-br from-brand-dark-blue to-purple-900/20 border-orange-500/30 hover:border-orange-500' 
                : 'bg-brand-card border-white/5 hover:border-orange-500/30 shadow-2xl'
        }`}
    >
        <div className="flex items-center mb-8 relative z-10">
            <div className={`flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-2xl bg-gray-900 border border-white/10 text-orange-500 group-hover:bg-gradient-brand group-hover:text-white transition-all duration-500`}>
                {icon}
            </div>
            <h2 className="ml-6 text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">{title}</h2>
        </div>
        
        <p className="text-gray-500 text-xs font-black leading-relaxed flex-grow uppercase tracking-[0.2em] mb-10 group-hover:text-gray-300 transition-colors">
            {description}
        </p>

        <div className="flex items-center gap-3 relative z-10">
            <span className="text-[11px] font-black uppercase italic tracking-[0.3em] text-orange-500 group-hover:translate-x-2 transition-transform duration-500">
                {cta}
            </span>
            <div className="h-[2px] w-8 bg-gradient-brand rounded-full group-hover:w-16 transition-all duration-500"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-brand opacity-[0.03] blur-[60px] rounded-full translate-x-16 -translate-y-16 group-hover:opacity-[0.1] transition-opacity"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 opacity-[0.02] blur-[80px] rounded-full group-hover:opacity-[0.05] transition-opacity"></div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 px-4">
            <div className="mb-16">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em] italic">ESPACE MEMBRE PRO V19</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
                    {t.dash_home_welcome} <span className="text-transparent bg-clip-text bg-gradient-brand">{username}</span>
                </h1>
                <p className="mt-6 text-[10px] font-black text-gray-600 uppercase tracking-[1em] italic">
                    {t.dash_home_subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <InfoCard
                    featured
                    title={t.dash_home_card1_title}
                    description={t.dash_home_card1_desc}
                    cta={t.dash_home_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                 <InfoCard
                    title={t.dash_home_card3_title}
                    description={t.dash_home_card3_desc}
                    cta={t.dash_home_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                 <InfoCard
                    title={t.dash_home_card4_title}
                    description={t.dash_home_card4_desc}
                    cta={t.dash_home_card4_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00-.75-.75h-.75m7.5-1.5V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0h3.75m-3.75 0a2.25 2.25 0 01-2.25 2.25V15m1.5 0v.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-.75" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <InfoCard
                    title={t.dash_home_card5_title}
                    description={t.dash_home_card5_desc}
                    cta={t.dash_home_card5_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Support)}
                />
            </div>
        </div>
    );
};

export default DashboardHome;
