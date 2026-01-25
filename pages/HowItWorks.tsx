import React from 'react';
import { Language, Page } from '../types';
import { translations } from '../translations';
import { HowItWorksIllustration } from '../components/HowItWorksIllustration';

interface HowItWorksProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const ProtocolCard: React.FC<{ num: string; title: string; desc: string; slogan: string }> = ({ num, title, desc, slogan }) => (
    <div className="glass-card p-12 rounded-[3rem] border-white/5 relative overflow-hidden group hover:border-brand-accent/30 transition-all duration-700">
        <span className="absolute -top-10 -right-10 text-[12rem] font-display font-black text-white/[0.02] italic">{num}</span>
        <div className="relative z-10">
            <h3 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter mb-6">{title}</h3>
            <p className="text-gray-400 font-medium text-lg leading-relaxed italic mb-8">{desc}</p>
            <div className="inline-block px-8 py-3 bg-brand-accent text-black font-display font-black italic text-sm uppercase tracking-widest rounded-xl">
                {slogan}
            </div>
        </div>
    </div>
);

const HowItWorks: React.FC<HowItWorksProps> = ({ language, onNavigate }) => {
    const t = translations[language];

    return (
        <div className="pt-40 pb-40">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto mb-32">
                    <h1 className="text-6xl md:text-8xl font-display font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-8">
                        {t.how_title}
                    </h1>
                    <p className="text-brand-accent font-black uppercase tracking-[0.5em] italic text-[14px] mb-12 font-display">
                        {t.how_subtitle}
                    </p>
                    <p className="text-2xl text-gray-500 font-bold italic leading-relaxed">
                        {t.how_intro}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    <ProtocolCard 
                        num="01"
                        title={t.how_step1_title}
                        desc={t.how_step1_desc}
                        slogan={t.how_step1_slogan}
                    />
                    <ProtocolCard 
                        num="02"
                        title={t.how_step2_title}
                        desc={t.how_step2_desc}
                        slogan={t.how_step2_slogan}
                    />
                    <ProtocolCard 
                        num="03"
                        title={t.how_step3_title}
                        desc={t.how_step3_desc}
                        slogan={t.how_step3_slogan}
                    />
                    <ProtocolCard 
                        num="04"
                        title={t.how_step4_title}
                        desc={t.how_step4_desc}
                        slogan={t.how_step4_slogan}
                    />
                </div>

                <div className="mt-40 p-20 glass-card rounded-[4rem] text-center border-brand-pro/20 relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-accent/5"></div>
                    <div className="relative z-10">
                        <h2 className="text-5xl font-display font-black text-white italic uppercase tracking-tighter mb-8">L'INFORMATION AVANT L'ÉMOTION.</h2>
                        <p className="text-2xl text-gray-500 font-bold italic mb-12 max-w-2xl mx-auto">
                            Notre Engine IA ne supporte aucune équipe. Elle ne supporte que la logique mathématique.
                        </p>
                        <button 
                            onClick={() => onNavigate(Page.JoinUs)}
                            className="btn-hover px-12 py-5 bg-gradient-pro text-white rounded-xl text-sm font-black uppercase tracking-[0.2em] italic shadow-2xl"
                        >
                            REJOINDRE LE FLUX
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;