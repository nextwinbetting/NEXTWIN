
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
    badge?: string;
}> = ({ title, description, cta, icon, onClick, featured, badge }) => (
    <div 
        onClick={onClick}
        className={`group relative overflow-hidden rounded-[2rem] p-8 sm:p-10 cursor-pointer transition-all duration-700 hover:scale-[1.02] border shadow-2xl ${
            featured 
                ? 'bg-gradient-to-br from-brand-dark-blue to-purple-900/20 border-orange-500/30 hover:border-orange-500/60' 
                : 'bg-brand-card border-white/5 hover:border-orange-500/30'
        }`}
    >
        {badge && (
            <div className="absolute top-6 right-8 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-20">
                {badge}
            </div>
        )}

        <div className="flex flex-col h-full relative z-10">
            <div className={`flex-shrink-0 h-16 w-16 flex items-center justify-center rounded-2xl bg-gray-900 border border-white/10 text-orange-500 group-hover:bg-gradient-brand group-hover:text-white transition-all duration-700 shadow-2xl mb-8`}>
                <div className="transform group-hover:scale-110 transition-transform duration-700">
                    {icon}
                </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors duration-500 mb-4">
                {title}
            </h2>
            
            <p className="text-gray-400 text-[11px] font-bold leading-relaxed uppercase tracking-wider mb-8 group-hover:text-gray-200 transition-colors duration-500">
                {description}
            </p>

            <div className="mt-auto flex items-center gap-3">
                <span className="text-[10px] font-black uppercase italic tracking-[0.2em] text-orange-500 group-hover:translate-x-2 transition-transform duration-700">
                    {cta}
                </span>
                <div className="h-[1px] w-8 bg-gradient-brand rounded-full group-hover:w-16 transition-all duration-700"></div>
            </div>
        </div>

        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-brand opacity-[0.02] blur-[80px] rounded-full group-hover:opacity-[0.05] transition-opacity"></div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-24 px-4 sm:px-6">
            <div className="mb-12 text-center lg:text-left">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1 rounded-full mb-4 backdrop-blur-md">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] italic">ESPACE PREMIUM</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">
                    {t.dash_home_welcome} <span className="text-transparent bg-clip-text bg-gradient-brand">{username}</span>
                </h1>
                <p className="mt-3 text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-[0.4em] italic leading-relaxed">
                    {t.dash_home_subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                <InfoCard
                    featured
                    badge="FLUX ACTIF"
                    title={t.dash_home_card1_title}
                    description={t.dash_home_card1_desc}
                    cta={t.dash_home_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                 <InfoCard
                    title={t.dash_home_card3_title}
                    description={t.dash_home_card3_desc}
                    cta={t.dash_home_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                 <InfoCard
                    title={t.dash_home_card4_title}
                    description={t.dash_home_card4_desc}
                    cta={t.dash_home_card4_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <InfoCard
                    title={t.dash_home_card5_title}
                    description={t.dash_home_card5_desc}
                    cta={t.dash_home_card5_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Support)}
                />
            </div>

            <div className="mt-16 p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative overflow-hidden text-center sm:text-left">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-brand opacity-[0.02] blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tighter mb-6 border-l-4 border-orange-500 pl-5">CHARTE DE BONNE CONDUITE MEMBRE</h3>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black text-base">01.</span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Utilisez systématiquement l'Analyseur de Match pour confirmer vos propres intuitions avant toute mise réelle.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black text-base">02.</span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Ne dérogez jamais à la règle des 5% de mise. C'est l'unique rempart contre les séries négatives.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black text-base">03.</span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">La rentabilité se juge sur un cycle de 30 jours minimum. Ne jugez pas les résultats sur un seul pack quotidien.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black text-base">04.</span>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">L'Espace Support est là pour vous. Contactez nos analystes si vous avez le moindre doute sur un marché.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
