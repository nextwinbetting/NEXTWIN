
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Language } from '../types';
import { translations } from '../translations';
import { PredictionIllustration, AnalyzerIllustration, BankrollIllustration, ArticleEngineIllustration, ArticleBankrollIllustration, ArticleMarketsIllustration } from '../components/HomeIllustrations';
import { HeroIllustration } from '../components/HeroIllustration';

interface HomeProps {
    onNavigate: (page: Page) => void;
    language: Language;
}

const FeatureSection: React.FC<{
    illustration: React.ReactNode;
    title: string;
    description: string;
    items: string[];
    isReversed?: boolean;
}> = ({ illustration, title, description, items, isReversed }) => (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className={`flex justify-center items-center ${isReversed ? 'lg:order-2' : ''}`}>
            {illustration}
        </div>
        <div className={`text-center lg:text-left ${isReversed ? 'lg:order-1' : ''}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">{title}</h2>
            <p className="mt-4 text-lg text-brand-light-gray leading-relaxed">{description}</p>
            <ul className="mt-6 space-y-4">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center justify-center lg:justify-start">
                        <svg className="h-6 w-6 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        <span className="ml-3 text-lg text-brand-light-gray">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const ArticleCard: React.FC<{
    illustration: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ illustration, title, description, onClick }) => (
    <div 
        onClick={onClick}
        className="bg-brand-card border border-gray-800 rounded-2xl p-8 text-left cursor-pointer transition-all duration-300 hover:border-orange-500/50 hover:bg-gray-800/50 transform hover:-translate-y-2 group"
    >
        <div className="h-44 flex items-center justify-center mb-6">{illustration}</div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="mt-3 text-base text-brand-light-gray h-24 overflow-hidden">{description}</p>
        <span className="mt-6 inline-block font-bold text-lg text-transparent bg-clip-text bg-gradient-brand group-hover:brightness-125 transition-all">
            Lire la suite →
        </span>
    </div>
);

const UserAvatar: React.FC = () => (
  <svg className="w-14 h-14 rounded-full bg-gray-800 border-2 border-gray-700 flex-shrink-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="avatar-grad-home" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#D946EF" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="16" r="8" fill="url(#avatar-grad-home)" opacity="0.5"/>
    <path d="M12 30 C12 24, 28 24, 28 30" stroke="url(#avatar-grad-home)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CTAIllustration: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#D946EF" />
            </linearGradient>
            <filter id="glow-cta" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g className="group">
            <circle cx="150" cy="150" r="100" fill="url(#cta-grad)" opacity="0.1" />
            <circle cx="150" cy="150" r="80" fill="url(#cta-grad)" filter="url(#glow-cta)" className="cta-pulse" />
            <circle cx="150" cy="150" r="70" fill="#171717" stroke="#374151" />
            <path d="M135 170 L165 150 L135 130" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow" />
        </g>
         <style>{`
            .cta-pulse { animation: pulse-cta 3s infinite ease-in-out; }
            @keyframes pulse-cta { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
            .cta-arrow { transition: transform 0.3s ease-out; }
            .group:hover .cta-arrow { transform: translateX(5px); }
        `}</style>
    </svg>
);


const Home: React.FC<HomeProps> = ({ onNavigate, language }) => {
    const t = translations[language];
    const testimonials = t.home_testimonials || [];
    const allTestimonials = testimonials.length > 0 ? [...testimonials, ...testimonials] : [];

    return (
        <>
            <style>{`
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 40s linear infinite;
                    width: max-content;
                }
            `}</style>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16 sm:pt-32 sm:pb-20">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white">
                        {t.home_title1}<span className="text-transparent bg-clip-text bg-gradient-brand">{t.home_title2}</span>
                    </h1>
                    <p className="mt-8 text-xl text-brand-light-gray max-w-2xl mx-auto leading-relaxed">
                        {t.home_subtitle}
                    </p>
                    <p className="mt-6 text-base font-bold text-yellow-300/80 max-w-2xl mx-auto border border-yellow-300/30 bg-yellow-900/20 rounded-xl p-4 shadow-lg">
                        {t.home_strategy_intro}
                    </p>
                    <div className="mt-12 flex items-center justify-center gap-x-6">
                        <button
                            onClick={() => onNavigate(Page.Dashboard)}
                            className="rounded-xl bg-gradient-brand px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                        >
                            {t.home_cta_main}
                        </button>
                        <button
                            onClick={() => onNavigate(Page.HowItWorks)}
                            className="rounded-xl bg-gray-800/80 border border-gray-700 px-8 py-4 text-lg font-bold leading-6 text-white hover:bg-gray-700/80 transition-colors"
                        >
                            {t.home_cta_secondary} <span aria-hidden="true">→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* HERO ILLUSTRATION SECTION */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12 md:my-20">
                <HeroIllustration className="w-full h-auto max-w-5xl mx-auto" />
            </div>

            {/* Feature sections */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
                <FeatureSection
                    illustration={<PredictionIllustration className="w-full h-auto max-w-lg" />}
                    title={t.home_feature1_title}
                    description={t.home_feature1_desc}
                    items={t.home_feature1_items}
                />
                <FeatureSection
                    illustration={<AnalyzerIllustration className="w-full h-auto max-w-lg" />}
                    title={t.home_feature2_title}
                    description={t.home_feature2_desc}
                    items={t.home_feature2_items}
                    isReversed
                />
                <FeatureSection
                    illustration={<BankrollIllustration className="w-full h-auto max-w-lg" />}
                    title={t.home_feature3_title}
                    description={t.home_feature3_desc}
                    items={t.home_feature3_items}
                />
            </div>
            
            {/* Articles Section */}
            <div className="py-24 bg-brand-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white">{t.home_articles_title}</h2>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                        <ArticleCard 
                            illustration={<ArticleEngineIllustration className="w-full h-auto max-w-xs" />}
                            title={t.home_article1_title}
                            description={t.home_article1_desc}
                            onClick={() => onNavigate(Page.HowItWorks)}
                        />
                         <ArticleCard 
                            illustration={<ArticleBankrollIllustration className="w-full h-auto max-w-xs" />}
                            title={t.home_article2_title}
                            description={t.home_article2_desc}
                            onClick={() => onNavigate(Page.Bankroll)}
                        />
                         <ArticleCard 
                            illustration={<ArticleMarketsIllustration className="w-full h-auto max-w-xs" />}
                            title={t.home_article3_title}
                            description={t.home_article3_desc}
                            onClick={() => onNavigate(Page.Markets)}
                        />
                    </div>
                </div>
            </div>

            {/* Testimonials section */}
            <div className="py-24 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white">{t.home_testimonials_title}</h2>
                    <p className="mt-6 text-xl text-brand-light-gray max-w-2xl mx-auto">{t.join_testimonials_subtitle}</p>
                </div>
                
                {allTestimonials.length > 0 && (
                    <div className="flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_48px,_black_calc(100%-48px),transparent_100%)]">
                        <ul className="flex items-center animate-infinite-scroll">
                            {allTestimonials.map((testimonial, index) => (
                            <li key={index} className="w-[400px] mx-6 flex-shrink-0">
                                    <div className="bg-brand-card border border-gray-800 rounded-3xl p-10 h-full flex flex-col justify-between shadow-2xl">
                                        <p className="text-white italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                                        <div className="mt-10 flex items-center border-t border-gray-800 pt-8">
                                            <UserAvatar />
                                            <div className="ml-5 text-left">
                                                <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-brand">{testimonial.name}</p>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest font-black">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
             {/* CTA Section */}
            <div className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-brand-card border border-gray-800 rounded-[3rem] p-10 lg:p-16 relative overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-orange-900/50 to-purple-900/50 rounded-full blur-[130px] opacity-30"></div>
                        <div className="relative z-10 grid lg:grid-cols-5 gap-12 items-center">
                            <div className="lg:col-span-2 flex justify-center lg:justify-start">
                                <CTAIllustration className="w-full max-w-xs h-auto" />
                            </div>
                            <div className="lg:col-span-3 text-center lg:text-left">
                                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">{t.join_final_cta_title}</h2>
                                <p className="mt-6 text-xl text-brand-light-gray max-w-2xl mx-auto lg:mx-0">{t.join_final_cta_subtitle}</p>
                                <div className="mt-10">
                                    <button 
                                        onClick={() => onNavigate(Page.JoinUs)}
                                        className="rounded-xl bg-gradient-brand px-10 py-5 text-xl font-bold text-white shadow-xl hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105"
                                    >
                                        {t.join_final_cta_button}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
