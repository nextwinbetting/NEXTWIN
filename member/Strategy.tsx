
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
    <div className={`relative overflow-hidden rounded-3xl p-8 border transition-all duration-500 hover:scale-[1.01] backdrop-blur-md ${
        type === 'success' 
            ? 'bg-green-500/[0.03] border-green-500/20 hover:border-green-500/40' 
            : 'bg-orange-500/[0.03] border-orange-500/20 hover:border-orange-500/40'
    }`}>
        <div className="flex justify-between items-start mb-6">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${type === 'success' ? 'bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.2)]'}`}>
                {icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 italic">{title}</span>
        </div>
        <div className="mb-4">
            <p className="text-3xl font-black text-white italic tracking-tighter mb-1">{odd}</p>
            <p className={`text-xs font-black uppercase tracking-[0.1em] ${type === 'success' ? 'text-green-400' : 'text-orange-400'}`}>{action}</p>
        </div>
        <p className="text-gray-400 text-[10px] font-medium leading-relaxed uppercase tracking-wider">{desc}</p>
        <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-[60px] ${type === 'success' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}></div>
    </div>
);

const RuleBadge: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
    <div className={`px-4 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.1em] italic flex items-center gap-2 transition-all duration-300 ${
        active 
            ? 'bg-gradient-brand text-white border-transparent' 
            : 'bg-white/[0.03] text-gray-600 border-white/5'
    }`}>
        {active ? (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
        ) : (
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12"/></svg>
        )}
        {label}
    </div>
);

const Strategy: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-24 px-4 sm:px-6">
            {/* Header épuré */}
            <div className="text-center mb-20">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.4em] italic">MÉTHODOLOGIE OFFICIELLE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white italic tracking-tighter uppercase leading-[1.1] mb-6">
                    {t.strategy_title}
                </h1>
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.8em] italic leading-loose max-w-2xl mx-auto">
                    {t.strategy_subtitle}
                </p>
            </div>

            {/* Protocole des Cotes */}
            <div className="mb-24">
                <div className="flex items-center gap-6 mb-10 px-4">
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter border-l-2 border-orange-500 pl-6">{t.strategy_s1_title}</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-800 to-transparent"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProtocolCard 
                        title="STABILITÉ"
                        odd="CÔTE ≥ 1.50"
                        action="PARI SIMPLE"
                        desc={t.strategy_s1_c1_desc}
                        type="success"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                    <ProtocolCard 
                        title="VALEUR"
                        odd="CÔTE < 1.50"
                        action="COMBINÉ X2"
                        desc={t.strategy_s1_c2_desc}
                        type="warning"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>}
                    />
                </div>
            </div>

            {/* Mono-Sport & IA */}
            <div className="grid lg:grid-cols-2 gap-8 mb-24 items-stretch">
                <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col justify-center">
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter mb-8">{t.strategy_s2_title}</h2>
                    <div className="space-y-6 relative z-10">
                        <div className="flex flex-wrap gap-2.5">
                            <RuleBadge label="FOOT + FOOT" active />
                            <RuleBadge label="BASKET + BASKET" active />
                            <RuleBadge label="TENNIS + TENNIS" active />
                            <RuleBadge label="FOOT + BASKET" />
                            <RuleBadge label="BASKET + TENNIS" />
                        </div>
                        <p className="text-gray-500 text-[9px] font-bold leading-relaxed uppercase tracking-[0.1em] italic pt-6 border-t border-white/5">
                            {t.strategy_s2_item1}
                        </p>
                    </div>
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-brand opacity-[0.02] blur-[80px] rounded-full"></div>
                </div>

                <div className="flex flex-col justify-center space-y-6">
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter border-l-2 border-purple-500 pl-6">{t.strategy_s3_title}</h2>
                    <div className="space-y-3">
                        {[t.strategy_s3_item1, t.strategy_s3_item2].map((item, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex gap-6 items-center group hover:bg-white/[0.04] transition-all duration-300">
                                <div className="h-2 w-2 rounded-full bg-purple-500 group-hover:scale-125 transition-transform"></div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed italic">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Simulation de Session */}
            <div className="bg-brand-card border border-white/5 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-brand opacity-50"></div>
                <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                    <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/5 pb-10 lg:pb-0 lg:pr-10 flex flex-col justify-center">
                        <h2 className="text-lg font-black text-white uppercase italic tracking-tighter mb-8">{t.strategy_s4_title}</h2>
                        <div className="space-y-8">
                            <div>
                                <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em] mb-2">{t.strategy_s4_start_bk}</p>
                                <p className="text-3xl font-black text-white tracking-tighter italic">1000.00€</p>
                            </div>
                            <div>
                                <p className="text-orange-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">{t.strategy_s4_stake_calc}</p>
                                <p className="text-3xl font-black text-orange-500 tracking-tighter italic">50.00€</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-black/30 border border-white/5 rounded-2xl p-8 mb-8">
                            <h3 className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em] mb-8 text-center italic">{t.strategy_s4_scenario}</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                                    <span className="text-[10px] font-bold text-white uppercase italic tracking-[0.1em]">{t.strategy_s4_s_item1}</span>
                                    <span className="text-green-400 font-black tracking-tighter">+32.50€</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                                    <span className="text-[10px] font-bold text-white uppercase italic tracking-[0.1em]">{t.strategy_s4_s_item2}</span>
                                    <span className="text-green-400 font-black tracking-tighter">+26.00€</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                                    <span className="text-[10px] font-bold text-white uppercase italic tracking-[0.1em]">{t.strategy_s4_s_item3}</span>
                                    <span className="text-red-400 font-black tracking-tighter">-50.00€</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800/50 p-8 rounded-2xl border border-white/5">
                            <div className="mb-6 sm:mb-0 text-center sm:text-left">
                                <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{t.strategy_s4_profit}</p>
                                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-brand tracking-tighter italic">{t.strategy_s4_profit_value}</p>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] italic max-w-[200px] text-center sm:text-left leading-relaxed">
                                {t.strategy_s4_conclusion}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warning discret */}
            <div className="mt-24 p-10 bg-red-500/[0.02] border border-red-500/10 rounded-3xl text-center relative overflow-hidden group">
                <h3 className="text-red-500/60 font-black text-sm uppercase italic tracking-widest mb-4">{t.strategy_s6_title}</h3>
                <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest leading-loose max-w-2xl mx-auto italic">
                    {t.strategy_s6_desc}
                </p>
            </div>
        </div>
    );
};

export default Strategy;
