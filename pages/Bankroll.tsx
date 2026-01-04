
import React from 'react';
import { Language, Page } from '../types';
import { translations } from '../translations';

interface BankrollProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gray-800 text-orange-400">
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-brand-light-gray">{description}</p>
        </div>
    </div>
);

const Bankroll: React.FC<BankrollProps> = ({ language, onNavigate }) => {
    const t = translations[language];

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">
                        {t.bankroll_page_title1} <span className="text-transparent bg-clip-text bg-gradient-brand">{t.bankroll_page_title2}</span>
                    </h1>
                    <p className="mt-4 text-lg text-brand-light-gray">
                        {t.bankroll_page_subtitle}
                    </p>
                </div>

                <div className="mt-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">{t.bankroll_risk_title}</h2>
                        <p className="text-brand-light-gray leading-relaxed">{t.bankroll_risk_desc1}</p>
                        <p className="text-brand-light-gray leading-relaxed">{t.bankroll_risk_desc2}</p>
                        <div className="bg-brand-card border border-gray-800 rounded-xl p-6">
                            <FeatureCard 
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M250 100 L 100 150 L 100 300 C 100 350 250 400 250 400 C 250 400 400 350 400 300 L 400 150 Z" /><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                                title={t.bankroll_feature1_title}
                                description={t.bankroll_feature1_desc}
                            />
                        </div>
                    </div>
                     <div className="space-y-6">
                        <div className="bg-brand-card border border-gray-800 rounded-xl p-6 shadow-2xl shadow-black/30">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Aperçu de l'outil membre</h3>
                             <div className="mt-4 bg-gray-900/50 border border-yellow-500/30 p-4 rounded-lg text-center">
                                <p className="text-xs font-semibold text-yellow-400">MISE SUGGÉRÉE (RISK MANAGEMENT 5%)</p>
                                <p className="text-4xl font-bold text-white mt-2">50.00€</p>
                                <p className="text-xs text-gray-500 mt-1">Basé sur une bankroll de 1000€</p>
                            </div>
                        </div>
                        <div className="bg-brand-card border border-gray-800 rounded-xl p-6 shadow-2xl shadow-black/30 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-brand-light-gray">BANKROLL ACTUELLE</p>
                                <p className="text-3xl font-bold text-white">1075.50€</p>
                            </div>
                            <div>
                                <p className="text-sm text-brand-light-gray">PROFIT/PERTE</p>
                                <p className="text-3xl font-bold text-green-400">+75.50€</p>
                            </div>
                             <div>
                                <p className="text-sm text-brand-light-gray">YIELD</p>
                                <p className="text-3xl font-bold text-green-400">+12.8%</p>
                            </div>
                             <div>
                                <p className="text-sm text-brand-light-gray">RÉUSSITE</p>
                                <p className="text-3xl font-bold text-white">72%</p>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="mt-20 text-center">
                     <h2 className="text-3xl font-bold text-white">{t.bankroll_features_title}</h2>
                     <p className="mt-4 text-lg text-brand-light-gray max-w-2xl mx-auto">{t.bankroll_features_subtitle}</p>
                     <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
                        <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>}
                            title={t.bankroll_feature2_title}
                            description={t.bankroll_feature2_desc}
                        />
                         <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>}
                            title={t.bankroll_feature3_title}
                            description={t.bankroll_feature3_desc}
                        />
                         <FeatureCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>}
                            title={t.bankroll_feature4_title}
                            description={t.bankroll_feature4_desc}
                        />
                     </div>
                 </div>

            </div>
             <div className="bg-brand-dark py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{t.bankroll_cta_title}</h2>
                    <p className="mt-4 text-lg text-brand-light-gray max-w-2xl mx-auto">{t.bankroll_cta_subtitle}</p>
                    <div className="mt-8">
                        <button
                            onClick={() => onNavigate(Page.JoinUs)}
                            className="rounded-md bg-gradient-brand px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                        >
                            {t.bankroll_cta_button}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Bankroll;