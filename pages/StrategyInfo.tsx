
import React from 'react';
import { Language, Page } from '../types';
import { translations } from '../translations';

// Define the missing StrategyInfoProps interface to fix the type error
interface StrategyInfoProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const StrategyCard: React.FC<{ title: string; desc: string; slogan: string }> = ({ title, desc, slogan }) => (
    <div className="glass-panel p-12 rounded-[4rem] border-white/5 group hover:border-brand-violet/30 transition-all duration-700">
        <h3 className="text-2xl font-display font-black text-brand-violet italic uppercase tracking-tighter mb-4">{title}</h3>
        <p className="text-lg text-gray-400 font-medium italic leading-relaxed mb-8">{desc}</p>
        <p className="text-sm font-black text-white uppercase tracking-widest italic opacity-50 group-hover:opacity-100 transition-opacity">
            {slogan}
        </p>
    </div>
);

const StrategyInfo: React.FC<StrategyInfoProps> = ({ language, onNavigate }) => {
    const t = translations[language];

    return (
        <div className="pt-40 pb-40">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto mb-32">
                    <h1 className="text-5xl md:text-7xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-8">
                        {t.strategy_title}
                    </h1>
                    <p className="text-brand-orange font-black uppercase tracking-[0.5em] italic text-[12px] mb-12">
                        {t.strategy_subtitle}
                    </p>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-2xl italic text-2xl font-display font-black text-white uppercase inline-block">
                        {t.strategy_philosophy}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                    <StrategyCard 
                        title="PARIS ÉLITE"
                        desc="Les 6 Paris Élite visent une probabilité moyenne estimée autour de 70 %, favorisant la constance plutôt que le risque excessif."
                        slogan="GAGNER MOINS, MAIS PLUS SOUVENT."
                    />
                    <StrategyCard 
                        title="DIVERSIFICATION"
                        desc="Football (1N2, BTTS, Score Exact), Basket (Points, Handicap) et Tennis (Handicap, Total Jeux)."
                        slogan="UNE STRATÉGIE ADAPTÉE À CHAQUE SPORT."
                    />
                    <StrategyCard 
                        title="LA GESTION"
                        desc="NEXTWIN encourage une mise stable, réfléchie et disciplinée pour garantir la survie de votre bankroll."
                        slogan="LA RÉGULARITÉ FAIT LA DIFFÉRENCE."
                    />
                    <StrategyCard 
                        title="L'INSTINCT VS DATA"
                        desc="Nous supprimons le biais cognitif lié aux émotions du supporter pour ne garder que la rigueur algorithmique."
                        slogan="LA STRATÉGIE AVANT L’INTUITION."
                    />
                </div>
            </div>
        </div>
    );
};

export default StrategyInfo;
