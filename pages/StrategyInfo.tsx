import React from 'react';
import { Language, Page } from '../types';
import { translations } from '../translations';
import { ExclusiveAccessIllustration, StructuredCapitalIllustration, LongTermVisionIllustration } from '../components/StrategyInfoIllustrations';

interface StrategyInfoProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const InfoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-12">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <div className="space-y-4 text-brand-light-gray leading-relaxed">{children}</div>
    </div>
);

const BenefitCard: React.FC<{ illustration: React.ReactNode; title: string; description: string }> = ({ illustration, title, description }) => (
    <div className="bg-brand-card border border-gray-800 rounded-2xl p-6 text-center flex flex-col items-center">
        <div className="h-48 w-48 flex items-center justify-center">{illustration}</div>
        <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-brand-light-gray">{description}</p>
    </div>
);


const StrategyInfo: React.FC<StrategyInfoProps> = ({ language, onNavigate }) => {
    const t = translations[language];

    const benefits = [
        t.strategy_info_s3_item1,
        t.strategy_info_s3_item2,
        t.strategy_info_s3_item3,
        t.strategy_info_s3_item4,
        t.strategy_info_s3_item5,
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.strategy_info_title}</h1>
                    <p className="mt-4 text-lg text-brand-light-gray">{t.strategy_info_subtitle}</p>
                </div>

                <div className="mt-12 bg-brand-card border border-gray-800 rounded-2xl p-8 sm:p-12">
                    <InfoSection title={t.strategy_info_s1_title}>
                        <p>{t.strategy_info_s1_desc1}</p>
                        <p>{t.strategy_info_s1_desc2}</p>
                    </InfoSection>

                    <InfoSection title={t.strategy_info_s2_title}>
                        <ul className="space-y-2">
                           {[t.strategy_info_s2_item1, t.strategy_info_s2_item2, t.strategy_info_s2_item3].map((item, i) => (
                                <li key={i} className="flex items-start p-3 bg-gray-900/50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 h-5 w-5 text-orange-400 mr-3 mt-0.5"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a2 2 0 0 0 2 2h2.54"/><path d="M4 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0Zm12.55 6.45.9.9L21 16.3"/></svg>
                                    <span>{item}</span>
                                </li>
                           ))}
                        </ul>
                    </InfoSection>

                    <InfoSection title={t.strategy_info_s3_title}>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center p-3 bg-gray-900/50 rounded-lg">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 h-5 w-5 text-green-400 mr-3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </InfoSection>

                    <InfoSection title={t.strategy_info_s4_title}>
                        <p>{t.strategy_info_s4_desc}</p>
                    </InfoSection>
                </div>

                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <BenefitCard 
                        illustration={<ExclusiveAccessIllustration className="w-full h-auto" />}
                        title={t.strategy_info_v1_title}
                        description={t.strategy_info_v1_desc}
                    />
                    <BenefitCard 
                        illustration={<StructuredCapitalIllustration className="w-full h-auto" />}
                        title={t.strategy_info_v2_title}
                        description={t.strategy_info_v2_desc}
                    />
                    <BenefitCard 
                        illustration={<LongTermVisionIllustration className="w-full h-auto" />}
                        title={t.strategy_info_v3_title}
                        description={t.strategy_info_v3_desc}
                    />
                </div>

                <div className="mt-20 text-center bg-brand-card border border-gray-800 rounded-2xl p-8 sm:p-12">
                    <h2 className="text-2xl font-bold text-white">{t.strategy_info_cta_text}</h2>
                    <div className="mt-6">
                        <button
                            onClick={() => onNavigate(Page.JoinUs)}
                            className="rounded-md bg-gradient-brand px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                        >
                           👉 {t.strategy_info_cta_button}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StrategyInfo;
