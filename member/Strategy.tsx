
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

const MethodPilier: React.FC<{
    num: string;
    title: string;
    desc: string;
    items: string[];
    icon: React.ReactNode;
}> = ({ num, title, desc, items, icon }) => (
    <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 lg:p-12 relative overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="text-8xl font-black italic tracking-tighter text-white">{num}</span>
        </div>
        
        <div className="relative z-10">
            <div className="h-16 w-16 bg-gray-900 border border-white/10 rounded-2xl flex items-center justify-center text-orange-500 mb-8 shadow-2xl group-hover:bg-gradient-brand group-hover:text-white transition-all duration-500">
                {icon}
            </div>
            
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8 max-w-md">{desc}</p>
            
            <div className="space-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const ProtocolCard: React.FC<{
    title: string;
    odd: string;
    action: string;
    desc: string;
    type: 'success' | 'warning';
}> = ({ title, odd, action, desc, type }) => (
    <div className={`relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 hover:scale-[1.01] backdrop-blur-md ${
        type === 'success' 
            ? 'bg-green-500/[0.03] border-green-500/20 hover:border-green-500/40' 
            : 'bg-orange-500/[0.03] border-orange-500/20 hover:border-orange-500/40'
    }`}>
        <div className="flex justify-between items-start mb-6">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">{title}</span>
            <div className={`h-2 w-2 rounded-full ${type === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]'}`}></div>
        </div>
        <div className="mb-4">
            <p className="text-4xl font-black text-white italic tracking-tighter mb-1">{odd}</p>
            <p className={`text-xs font-black uppercase tracking-[0.1em] ${type === 'success' ? 'text-green-400' : 'text-orange-400'}`}>{action}</p>
        </div>
        <p className="text-gray-400 text-[10px] font-medium leading-relaxed uppercase tracking-widest">{desc}</p>
    </div>
);

const Strategy: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-24 px-4 sm:px-6">
            <div className="text-center mb-24">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-8">
                    <span className="text-xs font-black text-orange-500 uppercase tracking-[0.4em] italic">ORIENTATION STRATÉGIQUE</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-[1.1] mb-8">
                    {t.strategy_title}
                </h1>
                <p className="text-sm sm:text-xl font-bold text-gray-500 uppercase tracking-[0.4em] italic leading-relaxed max-w-4xl mx-auto">
                    {t.strategy_subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24">
                <MethodPilier 
                    num="01"
                    title="FILTRAGE ALGORITHMIQUE"
                    desc="L'IA NextWin ne retient que le top 5% des probabilités mondiales pour garantir un avantage mathématique."
                    items={[
                        "Indice de confiance certifié ≥ 70%",
                        "Analyse de la 'Value' temps réel",
                        "Scan massif multi-bookmakers",
                        "Zéro influence psychologique"
                    ]}
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                />
                <MethodPilier 
                    num="02"
                    title="DISCIPLINE DE MISE"
                    desc="La gestion du capital est le seul rempart contre la variance inévitable des marchés sportifs."
                    items={[
                        "Règle d'or du 5% par session",
                        "Gestion multi-bankroll",
                        "Réinvestissement composé",
                        "Tracking ROI mensuel obligatoire"
                    ]}
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/></svg>}
                />
            </div>

            <div className="bg-brand-card border border-white/5 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden shadow-2xl mb-24">
                <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                    <div className="lg:w-1/3 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">{t.strategy_s1_title}</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-loose">
                            {t.strategy_s1_desc}
                        </p>
                    </div>
                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        <ProtocolCard 
                            title="STABILITÉ"
                            odd="CÔTE ≥ 1.50"
                            action="PARI SIMPLE"
                            desc={t.strategy_s1_c1_desc}
                            type="success"
                        />
                        <ProtocolCard 
                            title="VALEUR"
                            odd="CÔTE < 1.50"
                            action="COMBINÉ X2"
                            desc={t.strategy_s1_c2_desc}
                            type="warning"
                        />
                    </div>
                </div>
            </div>

            <div className="p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] relative overflow-hidden text-center sm:text-left">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-brand opacity-[0.03] blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 border-l-4 border-orange-500 pl-8">VIGILANCE & MENTAL</h3>
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-10">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <span className="text-orange-500 font-black text-xl">A.</span>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Ne tentez jamais de 'vous refaire' après une défaite. L'IA juge sur des cycles de 100 paris, pas sur un jour.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <span className="text-orange-500 font-black text-xl">B.</span>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Une cote est 'Value' quand la probabilité réelle est supérieure à la probabilité estimée par le bookmaker.</p>
                        </div>
                    </div>
                    <div className="space-y-10">
                        <div className="flex flex-col sm:flex-row gap-6">
                            <span className="text-orange-500 font-black text-xl">C.</span>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">Le sport est incertain par nature. Nous vendons une méthode mathématique, pas une boule de cristal.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <span className="text-orange-500 font-black text-xl">D.</span>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">La patience est votre plus grand atout financier. Laissez le temps à la loi des grands nombres d'agir.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Strategy;
