
import React from 'react';
import { Language, Page } from '../App';
import { translations } from '../translations';
import { SportMarketIllustration } from '../components/SportMarketIllustration';

interface MarketsProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const MarketTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-gray-800/60 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-brand-light-gray transition-all duration-200 hover:border-orange-500/50 hover:text-white hover:scale-105 cursor-default">
        {children}
    </div>
);

const SportSection: React.FC<{ sport: 'Football' | 'Basketball' | 'Tennis'; title: string; description: string; markets: string[]; isReversed?: boolean; }> = ({ sport, title, description, markets, isReversed }) => (
    <div className="bg-brand-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
        <div className="grid lg:grid-cols-2 items-center">
            <div className={`flex justify-center items-center p-8 lg:p-12 bg-gray-900/40 ${isReversed ? 'lg:order-2' : ''}`}>
                <SportMarketIllustration sport={sport} className="w-full max-w-md h-auto" />
            </div>
            <div className={`p-8 lg:p-12 ${isReversed ? 'lg:order-1' : ''}`}>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">{title}</h2>
                <p className="mt-4 text-lg text-brand-light-gray leading-relaxed">{description}</p>
                <div className="mt-8">
                     <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Marchés Analysés</h3>
                    <div className="mt-4 flex flex-wrap gap-3">
                        {markets.map(market => <MarketTag key={market}>{market}</MarketTag>)}
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const Markets: React.FC<MarketsProps> = ({ language, onNavigate }) => {
    const t = translations[language];

    return (
        <>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                    {t.markets_title1} <span className="text-transparent bg-clip-text bg-gradient-brand">{t.markets_title2}</span>
                </h1>
                <p className="mt-4 text-lg text-brand-light-gray">
                    {t.markets_subtitle}
                </p>
            </div>

            <div className="mt-20 space-y-12 max-w-6xl mx-auto">
                <SportSection 
                    sport="Football"
                    title={t.markets_football_title}
                    description={t.markets_football_desc}
                    markets={t.bet_types_football}
                />
                <SportSection 
                    sport="Basketball"
                    title={t.markets_basketball_title}
                    description={t.markets_basketball_desc}
                    markets={t.bet_types_basketball}
                    isReversed
                />
                <SportSection 
                    sport="Tennis"
                    title={t.markets_tennis_title}
                    description={t.markets_tennis_desc}
                    markets={t.bet_types_tennis}
                />
            </div>
        </div>
        <div className="bg-brand-dark py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">{t.markets_cta_title}</h2>
                <p className="mt-4 text-lg text-brand-light-gray max-w-2xl mx-auto">{t.markets_cta_subtitle}</p>
                <div className="mt-8">
                    <button
                        onClick={() => onNavigate(Page.JoinUs)}
                        className="rounded-md bg-gradient-brand px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                    >
                        {t.markets_cta_button}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default Markets;
