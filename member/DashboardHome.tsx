
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
        className={`p-8 rounded-2xl cursor-pointer transition-all duration-300 border ${
            highlight 
            ? 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40' 
            : 'bg-white/5 border-white/5 hover:border-white/20'
        } group shadow-sm`}
    >
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-6 transition-all duration-300 ${
            highlight ? 'bg-orange-500 text-white' : 'bg-white/5 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
        }`}>
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">{description}</p>
        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-orange-500 group-hover:translate-x-1 transition-transform">
            Accéder
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </div>
    </div>
);

const DashboardHome: React.FC<DashboardHomeProps> = ({ username, setActivePage, language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto py-8">
            <div className="mb-12">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Espace Personnel</p>
                <h1 className="text-3xl font-bold text-white mb-2">
                    {t.dash_home_welcome} <span className="text-orange-500">{username}</span>
                </h1>
                <p className="text-gray-400 text-sm">Bienvenue sur votre console de pilotage NextWin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <MenuCard
                    highlight
                    title="Pronostics"
                    description="Découvrez les meilleures opportunités IA sélectionnées pour vous aujourd'hui."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Predictions)}
                />
                <MenuCard
                    title="Stratégie"
                    description="Apprenez à utiliser nos outils pour maximiser vos gains sur le long terme."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                <MenuCard
                    title="Bankroll"
                    description="Suivez l'évolution de votre capital et calculez vos mises optimales."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Bankroll)}
                />
                <MenuCard
                    title="Support"
                    description="Une question technique ou stratégique ? Notre équipe vous répond."
                    icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Support)}
                />
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">Rappel : La règle des 5%</h3>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4">
                        Pour une rentabilité durable, ne misez jamais plus de 5% de votre capital total sur un seul pari. La patience est votre meilleur allié.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Discipline</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Patience</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gains</span>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-auto">
                    <button 
                        onClick={() => setActivePage(DashboardNav.Strategy)}
                        className="w-full md:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-all border border-white/5"
                    >
                        Relire la méthode
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
