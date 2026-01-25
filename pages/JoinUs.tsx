import React from 'react';
import { Language, Page } from '../types';
import { translations } from '../translations';

const FeatureGridItem: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-brand-card border border-gray-800/50 rounded-xl p-6 text-center transition-all duration-300 hover:border-orange-500/30 hover:bg-gray-800/50 transform hover:-translate-y-1">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-violet text-white mb-5 shadow-lg shadow-orange-500/20">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-brand-light-gray">{description}</p>
    </div>
);

const TestimonialCard: React.FC<{ quote: string; name: string; role: string; }> = ({ quote, name, role }) => (
    <div className="bg-brand-card border border-gray-800/50 rounded-xl p-8 h-full flex flex-col">
        <div className="flex-grow">
            <svg className="h-8 w-8 text-gray-700" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4 8a2 2 0 00-2 2v10a2 2 0 002 2h4l2 4v-4h2a2 2 0 002-2V10a2 2 0 00-2-2H4zm16 0a2 2 0 00-2 2v10a2 2 0 002 2h4l2 4v-4h2a2 2 0 002-2V10a2 2 0 00-2-2h-8z" /></svg>
            <p className="mt-4 text-white italic">"{quote}"</p>
        </div>
        <div className="mt-6">
            <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-violet">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
        </div>
    </div>
);

interface JoinUsProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const JoinUs: React.FC<JoinUsProps> = ({ language, onNavigate }) => {
    const t = translations[language];
    
    const features = [
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10c0 .5-.1 1-.2 1.5"/><path d="m2.5 15.2.7-1.4.7 1.4"/><path d="m5.2 16 .7-1.4.7 1.4"/><path d="M2.5 19h2.8"/><path d="M5.2 19h2.8"/><path d="M4 16.8h2.5"/><path d="M12 22a10 10 0 0 0 10-10c0-.5.1-1 .2-1.5"/><path d="m21.5 8.8-.7 1.4-.7-1.4"/><path d="m18.8 8-.7 1.4-.7-1.4"/><path d="M21.5 5h-2.8"/><path d="M18.8 5h-2.8"/><path d="M20 7.2h-2.5"/></svg>,
            title: t.join_grid_title1,
            description: t.join_grid_desc1,
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/></svg>,
            title: t.join_grid_title2,
            description: t.join_grid_desc2,
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
            title: t.join_grid_title3,
            description: t.join_grid_desc3,
        },
         { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
            title: t.join_grid_title4,
            description: t.join_grid_desc4,
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
            title: t.join_grid_title5,
            description: t.join_grid_desc5,
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>,
            title: t.join_grid_title6,
            description: t.join_grid_desc6,
        },
        { 
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>,
            title: t.join_grid_title7,
            description: t.join_grid_desc7,
        },
    ];

    const CheckIcon: React.FC = () => (
        <svg className="h-6 w-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
    );

    const featureList = [
        t.join_feature_list_1,
        t.join_feature_list_2,
        t.join_feature_list_3,
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white uppercase italic">
                    {t.join_hero_title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-violet">{t.join_hero_title2}</span>
                </h1>
                <p className="mt-4 text-lg text-brand-light-gray italic">
                    {t.join_hero_subtitle}
                </p>
            </div>
            
            <div className="mt-20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-[600px] h-[600px] bg-gradient-to-r from-brand-orange/20 to-brand-violet/20 rounded-full blur-[150px] opacity-30"></div>
                </div>
                <div className="relative z-10 flex justify-center">
                    <div className="max-w-md w-full bg-brand-card border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                        <div className="text-center">
                            <span className="inline-block bg-gray-800 text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-violet px-4 py-1.5 rounded-full uppercase tracking-widest">{t.join_pass}</span>
                            <h2 className="mt-4 text-5xl font-black text-white italic">12,99€<span className="text-2xl text-brand-light-gray font-normal"> {t.join_price}</span></h2>
                            <p className="mt-2 text-[10px] font-black text-yellow-500 bg-yellow-900/50 inline-block px-4 py-1.5 rounded-full uppercase tracking-widest">{t.join_commitment}</p>

                            <ul className="text-left mt-10 space-y-4">
                                {featureList.map((feature, index) => (
                                     <li key={index} className="flex items-start bg-white/5 p-4 rounded-xl border border-white/5"><CheckIcon /><span className="ml-4 text-brand-light-gray text-xs font-bold uppercase tracking-widest">{feature}</span></li>
                                ))}
                            </ul>

                            <button onClick={() => onNavigate(Page.Register)} className="mt-10 w-full rounded-2xl bg-gradient-to-r from-brand-orange to-brand-violet px-6 py-5 text-xs font-black uppercase tracking-[0.3em] italic text-white shadow-xl shadow-brand-orange/20 hover:scale-105 transition-transform active:scale-95">
                                {t.join_cta}
                            </button>
                            <p className="mt-6 text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{t.join_info}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-32 text-center">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">ÉCOSYSTÈME HAUTE PERFORMANCE</h2>
            </div>
            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureGridItem key={index} {...feature} />
                ))}
            </div>

            <div className="mt-32 bg-brand-card border border-white/5 rounded-[3.5rem] py-20 px-10 text-center max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-violet/5"></div>
                <h2 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 relative z-10">VOTRE NOUVELLE <br/> <span className="text-brand-orange">ÈRE COMMENCE.</span></h2>
                <p className="mt-4 text-xs font-bold text-brand-light-gray max-w-xl mx-auto uppercase tracking-widest italic mb-12 relative z-10">L’INTELLIGENCE ARTIFICIELLE AU SERVICE DES PARIEURS PROFESSIONNELS.</p>
                <div className="relative z-10">
                    <button onClick={() => onNavigate(Page.Register)} className="rounded-2xl bg-gradient-to-r from-brand-orange to-brand-violet px-12 py-6 text-xs font-black uppercase tracking-[0.4em] italic text-white shadow-2xl shadow-brand-orange/20 hover:scale-105 transition-transform">
                        ACTIVER MON ACCÈS ÉLITE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinUs;