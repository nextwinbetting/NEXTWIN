import React from 'react';
import { Language, Page } from '../types';
import { translations } from '../translations';
import { HowItWorksIllustration } from '../components/HowItWorksIllustration';

interface HowItWorksProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const Step: React.FC<{ 
    number: number; 
    title: string; 
    description: string; 
    benefitTitle: string;
    benefitDesc: string;
    isReversed: boolean; 
}> = ({ number, title, description, benefitTitle, benefitDesc, isReversed }) => (
    <div className="relative py-12">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center`}>
            <div className={`flex justify-center items-center p-4 ${isReversed ? 'md:order-2' : ''}`}>
               <HowItWorksIllustration step={number} className="w-full max-w-sm h-auto" />
            </div>
            <div className={`text-center md:text-left ${isReversed ? 'md:order-1' : ''}`}>
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-brand">ÉTAPE {number}</span>
                <h3 className="mt-2 text-3xl font-bold text-white">{title}</h3>
                <p className="mt-4 text-brand-light-gray leading-relaxed">{description}</p>
                <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-lg p-5">
                    <h4 className="font-semibold text-white flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        {benefitTitle}
                    </h4>
                    <p className="text-sm text-gray-400 mt-2">{benefitDesc}</p>
                </div>
            </div>
        </div>
    </div>
);


const HowItWorks: React.FC<HowItWorksProps> = ({ language, onNavigate }) => {
    const t = translations[language];
    const steps = [
        { title: t.how_step1_title, description: t.how_step1_desc, benefitTitle: t.how_step1_benefit_title, benefitDesc: t.how_step1_benefit_desc },
        { title: t.how_step2_title, description: t.how_step2_desc, benefitTitle: t.how_step2_benefit_title, benefitDesc: t.how_step2_benefit_desc },
        { title: t.how_step3_title, description: t.how_step3_desc, benefitTitle: t.how_step3_benefit_title, benefitDesc: t.how_step3_benefit_desc },
        { title: t.how_step4_title, description: t.how_step4_desc, benefitTitle: t.how_step4_benefit_title, benefitDesc: t.how_step4_benefit_desc },
        { title: t.how_step5_title, description: t.how_step5_desc, benefitTitle: t.how_step5_benefit_title, benefitDesc: t.how_step5_benefit_desc },
        { title: t.how_step6_title, description: t.how_step6_desc, benefitTitle: t.how_step6_benefit_title, benefitDesc: t.how_step6_benefit_desc },
    ];

    return (
        <>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">{t.how_title}</h1>
                    <p className="mt-4 text-lg text-brand-light-gray">
                        {t.how_subtitle}
                    </p>
                </div>
                <div className="mt-16 max-w-6xl mx-auto">
                     <div className="relative border-l-2 border-gray-800">
                        {steps.map((step, index) => (
                             <div key={index} className="pl-8 md:pl-12">
                                <span className="absolute -left-[11px] top-[4.5rem] h-5 w-5 rounded-full bg-gray-700 border-4 border-gray-900 ring-4 ring-gray-800"></span>
                                <Step 
                                    number={index + 1} 
                                    title={step.title} 
                                    description={step.description}
                                    benefitTitle={step.benefitTitle}
                                    benefitDesc={step.benefitDesc}
                                    isReversed={index % 2 !== 0}
                                />
                             </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="bg-brand-dark py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white">{t.how_cta_title}</h2>
                    <p className="mt-4 text-lg text-brand-light-gray max-w-2xl mx-auto">{t.how_cta_subtitle}</p>
                    <div className="mt-8">
                        <button
                            onClick={() => onNavigate(Page.JoinUs)}
                            className="rounded-md bg-gradient-brand px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                        >
                            {t.how_cta_button}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HowItWorks;