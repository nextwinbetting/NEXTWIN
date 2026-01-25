import React from 'react';
import { DashboardNav, Language } from '../types';
import { translations } from '../translations';

interface DashboardHomeProps {
    username: string;
    setActivePage: (page: DashboardNav) => void;
    language: Language;
}

const MenuCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    highlight?: boolean;
}> = ({ title, description, icon, onClick, highlight }) => (
    <div 
        onClick={onClick}
        className={`group relative p-8 rounded-[2rem] cursor-pointer transition-all duration-500 border glass-panel ${
            highlight ? 'border-brand-orange/30' : 'border-white/5'
        } hover:border-brand-orange/50 hover:-translate-y-2 shadow-2xl`}
    >
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl mb-8 transition-all duration-500 ${
            highlight ? 'bg-gradient-to-r from-brand-orange to-brand-violet text-white shadow-xl shadow-brand-orange/20' : 'bg-white/5 text-white/20 group-hover:bg-gradient-to-r group-hover:from-brand-orange group-hover:to-brand-violet group-hover:text-white group-hover:shadow-xl group-hover:shadow-brand-orange/20'
        }`}>
            {icon}
        </div>
        <h3 className="text-xl font-display font-black text-white italic tracking-tighter uppercase mb-2">{title}</h3>
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-[0.15em] leading-relaxed mb-6 italic">{description}</p>
        <div className="flex items-center text-[9px] font-black uppercase tracking-[0.2em] text-brand-orange opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
            ACCÉDER AU FLUX
            <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
        </div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div className="max-w-6xl mx-auto py-2 animate-fade-up">
            <header className="mb-20">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-500/5 border border-orange-500/10 mb-8">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] italic">Access Authorized — NextWin Cockpit Elite</span>
                </div>
                <h1 className="mb-6 font-display font-black text-white tracking-tighter uppercase italic leading-[0.9]">
                    SALUT, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-violet">{username}</span>
                </h1>
                <p className="text-white text-sm font-bold uppercase tracking-[0.3em] italic opacity-40">LE NEURAL ENGINE EST ACTIF. 8 SIGNAUX DISPONIBLES.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <MenuCard
                    highlight
                    title="Signaux Flux"
                    description="Les 8 opportunités NextWin du jour."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                <MenuCard
                    title="Protocole"
                    description="Règles d'investissement Elite."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                <MenuCard
                    title="Capital"
                    description="Suivi du ROI et pilotage."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <MenuCard
                    title="Archives"
                    description="Historique des scans Engine."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Archives)}
                />
            </div>

            <div className="relative glass-panel rounded-[3rem] p-12 md:p-16 overflow-hidden border border-white/10 shadow-3xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-r from-brand-orange to-brand-violet opacity-[0.05] blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="flex flex-col md:flex-row items-center gap-16 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-display font-black text-white italic uppercase tracking-tighter mb-4 leading-none">LA RIGUEUR DE 12H00.</h3>
                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xl italic">
                            LE SUCCÈS N'EST PAS UN HASARD. EN EXÉCUTANT VOS 8 SIGNAUX CHAQUE MATIN, VOUS CRÉEZ UN AVANTAGE MATHÉMATIQUE IRRÉVERSIBLE.
                        </p>
                    </div>
                    <button 
                        onClick={() => setActivePage(DashboardNav.Strategy)}
                        className="px-12 py-6 bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-brand-orange hover:to-brand-violet rounded-xl text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all italic"
                    >
                        NOTRE PROTOCOLE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;