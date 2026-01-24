
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

const ProtocolCard: React.FC<{
    title: string;
    odd: string;
    action: string;
    desc: string;
    type: 'success' | 'warning';
    icon: React.ReactNode;
}> = ({ title, odd, action, desc, type, icon }) => (
    <div className={`relative overflow-hidden rounded-[2.5rem] p-10 border-2 transition-all duration-500 hover:scale-[1.02] shadow-2xl backdrop-blur-md ${
        type === 'success' 
            ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/50' 
            : 'bg-orange-500/5 border-orange-500/20 hover:border-orange-500/50'
    }`}>
        <div className="flex justify-between items-start mb-8">
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${type === 'success' ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 italic">{title}</span>
        </div>
        <div className="mb-6">
            <p className="text-4xl font-black text-white italic tracking-tighter mb-2">{odd}</p>
            <p className={`text-sm font-black uppercase tracking-[0.2em] ${type === 'success' ? 'text-green-400' : 'text-orange-400'}`}>{action}</p>
        </div>
        <p className="text-gray-500 text-[11px] font-black leading-relaxed uppercase tracking-[0.15em]">{desc}</p>
        <div className={`absolute -bottom-6 -right-6 w-32 h-32 rounded-full blur-[80px] ${type === 'success' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}></div>
    </div>
);

const RuleBadge: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
    <div className={`px-5 py-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] italic flex items-center gap-3 transition-all duration-300 ${
        active 
            ? 'bg-gradient-brand text-white border-transparent shadow-lg' 
            : 'bg-white/5 text-gray-500 border-white/5'
    }`}>
        {active ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
        ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"/></svg>
        )}
        {label}
    </div>
);

const Strategy: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-32 px-4">
            {/* Header */}
            <div className="text-center mb-24">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-full mb-8">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.8em] italic">NEXTWIN ALGORITHM V20</span>
                </div>
                <h1 className="text-6xl sm:text-7xl font-black text-white italic tracking-tighter uppercase leading-none mb-8">
                    {t.strategy_title}
                </h1>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[1.2em] italic leading-relaxed max-w-4xl mx-auto">
                    {t.strategy_subtitle}
                </p>
            </div>

            {/* Section 1: Protocole des Cotes */}
            <div className="mb-32">
                <div className="flex items-center gap-8 mb-12 px-6">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter border-l-4 border-orange-500 pl-8">{t.strategy_s1_title}</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <ProtocolCard 
                        title="SÉCURITÉ ALGORITHMIQUE"
                        odd="CÔTE ≥ 1.50"
                        action="PARI SIMPLE"
                        desc={t.strategy_s1_c1_desc}
                        type="success"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <ProtocolCard 
                        title="COUPLE DE VALEUR"
                        odd="CÔTE < 1.50"
                        action="COMBINÉ X2"
                        desc={t.strategy_s1_c2_desc}
                        type="warning"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                    />
                </div>
            </div>

            {/* Section 2: Mono-Sport & IA */}
            <div className="grid lg:grid-cols-2 gap-16 mb-32 items-center">
                <div className="bg-brand-card border border-white/5 rounded-[4rem] p-16 relative overflow-hidden shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10">{t.strategy_s2_title}</h2>
                    <div className="space-y-8 relative z-10">
                        <div className="flex flex-wrap gap-4">
                            <RuleBadge label="FOOT + FOOT" active />
                            <RuleBadge label="BASKET + BASKET" active />
                            <RuleBadge label="TENNIS + TENNIS" active />
                            <RuleBadge label="FOOT + BASKET" />
                            <RuleBadge label="BASKET + TENNIS" />
                        </div>
                        <p className="text-gray-500 text-[10px] font-black leading-loose uppercase tracking-[0.2em] italic pt-10 border-t border-white/5">
                            {t.strategy_s2_item1}
                        </p>
                    </div>
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-brand opacity-[0.03] blur-[100px] rounded-full"></div>
                </div>

                <div className="space-y-12">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter border-l-4 border-purple-500 pl-8">{t.strategy_s3_title}</h2>
                    <div className="space-y-6">
                        {[t.strategy_s3_item1, t.strategy_s3_item2].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-8 rounded-3xl flex gap-8 items-center group hover:bg-white/10 transition-all duration-500 border-l-4 border-l-purple-500/20 hover:border-l-purple-500">
                                <div className="h-4 w-4 rounded-full bg-purple-500 group-hover:scale-150 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed italic">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3: Simulation de Session */}
            <div className="bg-brand-card border border-orange-500/30 rounded-[5rem] p-16 lg:p-24 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-brand"></div>
                <div className="grid lg:grid-cols-3 gap-20 relative z-10">
                    <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 pb-16 lg:pb-0 lg:pr-16">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-12">{t.strategy_s4_title}</h2>
                        <div className="space-y-12">
                            <div>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">{t.strategy_s4_start_bk}</p>
                                <p className="text-5xl font-black text-white tracking-tighter italic">1000.00€</p>
                            </div>
                            <div>
                                <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4">{t.strategy_s4_stake_calc}</p>
                                <p className="text-5xl font-black text-orange-500 tracking-tighter italic">50.00€</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-black/40 border border-white/5 rounded-[3rem] p-12 mb-12">
                            <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.6em] mb-10 text-center italic">{t.strategy_s4_scenario}</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20 group hover:border-green-500/50 transition-colors">
                                    <span className="text-xs font-black text-white uppercase italic tracking-[0.2em]">{t.strategy_s4_s_item1}</span>
                                    <span className="text-green-400 font-black tracking-tighter text-lg">+32.50€</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-green-500/10 rounded-2xl border border-green-500/20 group hover:border-green-500/50 transition-colors">
                                    <span className="text-xs font-black text-white uppercase italic tracking-[0.2em]">{t.strategy_s4_s_item2}</span>
                                    <span className="text-green-400 font-black tracking-tighter text-lg">+26.00€</span>
                                </div>
                                <div className="flex justify-between items-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20 group hover:border-red-500/50 transition-colors">
                                    <span className="text-xs font-black text-white uppercase italic tracking-[0.2em]">{t.strategy_s4_s_item3}</span>
                                    <span className="text-red-400 font-black tracking-tighter text-lg">-50.00€</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-brand p-12 rounded-[3rem] shadow-2xl transform hover:scale-[1.02] transition-transform">
                            <div className="mb-8 sm:mb-0">
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.6em] mb-3">{t.strategy_s4_profit}</p>
                                <p className="text-4xl font-black text-white tracking-tighter italic">{t.strategy_s4_profit_value}</p>
                            </div>
                            <div className="h-16 w-[1px] bg-white/20 hidden sm:block"></div>
                            <p className="text-white text-[12px] font-black uppercase tracking-[0.3em] italic max-w-[250px] text-center sm:text-left leading-relaxed">
                                {t.strategy_s4_conclusion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warning */}
            <div className="mt-32 p-16 bg-red-500/5 border border-red-500/20 rounded-[4rem] text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700"></div>
                <h3 className="text-red-500 font-black text-2xl uppercase italic tracking-tighter mb-6">{t.strategy_s6_title}</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] leading-loose max-w-3xl mx-auto italic">
                    {t.strategy_s6_desc}
                </p>
            </div>
        </div>
    );
};

export default Strategy;
