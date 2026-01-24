
import React from 'react';
// Import DashboardNav to fix the missing name error
import { Language, DashboardNav } from '../types';
import { translations } from '../translations';

interface SupportProps {
    language: Language;
    // Add setActivePage to props so it can be used for internal dashboard navigation
    setActivePage: (page: DashboardNav) => void;
    onNavigateToFaq: () => void;
    onNavigateToContact: () => void;
}

const SupportCard: React.FC<{
    title: string;
    description: string;
    cta: string;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ title, description, cta, icon, onClick }) => (
    <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 flex flex-col group text-center items-center transition-all duration-500 hover:border-orange-500/30 hover:scale-[1.02] shadow-2xl">
        <div className="flex-shrink-0 h-20 w-20 flex items-center justify-center rounded-2xl bg-gray-900 border border-white/10 text-orange-500 mb-8 group-hover:bg-gradient-brand group-hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
            {icon}
        </div>
        <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-4">{title}</h2>
        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] leading-relaxed flex-grow mb-10 group-hover:text-gray-300 transition-colors">{description}</p>
        <button
            onClick={onClick}
            className="w-full text-[11px] font-black uppercase italic tracking-[0.3em] text-white bg-gray-800 hover:bg-gradient-brand rounded-xl px-6 py-4 transition-all duration-500 shadow-xl"
        >
            {cta}
        </button>
    </div>
);

// Destructure setActivePage from props
const Support: React.FC<SupportProps> = ({ language, setActivePage, onNavigateToFaq, onNavigateToContact }) => {
    const t = translations[language];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 pb-20">
            <div className="mb-20 text-center lg:text-left">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em] italic">CENTRE D'AIDE & ORIENTATION</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">{t.support_title}</h1>
                <p className="mt-6 text-[10px] font-black text-gray-600 uppercase tracking-[1em] italic leading-relaxed max-w-3xl">
                    {t.support_subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <SupportCard
                    title={t.support_card1_title}
                    description={t.support_card1_desc}
                    cta={t.support_card1_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
                    onClick={() => setActivePage(DashboardNav.Strategy)}
                />
                 <SupportCard
                    title={t.support_card2_title}
                    description={t.support_card2_desc}
                    cta={t.support_card2_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                    onClick={onNavigateToContact}
                />
                 <SupportCard
                    title={t.support_card3_title}
                    description={t.support_card3_desc}
                    cta={t.support_card3_cta}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>}
                    onClick={onNavigateToFaq}
                />
            </div>

            <div className="mt-32 p-12 bg-white/5 border border-white/5 rounded-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8 border-l-4 border-orange-500 pl-6">CHARTE DE BONNE CONDUITE</h3>
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black">01.</span>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Utilisez toujours l'IA comme un outil d'aide à la décision, complétez par votre propre jugement.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black">02.</span>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Appliquez strictement la règle des 5% de mise pour préserver votre capital sur le long terme.</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black">03.</span>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Suivez vos résultats dans l'onglet GESTION DE BANKROLL pour ajuster votre stratégie.</p>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-orange-500 font-black">04.</span>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Ne pariez jamais sous le coup de l'émotion ou après une perte pour tenter de vous "refaire".</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Support;
