
import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface SubscriptionProps {
    isSubscribed: boolean;
    onSubscribe: () => void;
    onCancel: () => void;
    language: Language;
    onNavigateToFaq: () => void;
}

const CheckIcon: React.FC = () => (
    <svg className="h-6 w-5 text-green-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
);

const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode; valueColor?: string; }> = ({ title, value, icon, valueColor = 'text-white' }) => (
    <div className="bg-brand-card border border-white/5 rounded-2xl p-8 transition-all duration-300 hover:border-orange-500/20">
        <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-xl bg-gray-900 border border-white/10 text-orange-500">
                {icon}
            </div>
            <div className="ml-5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{title}</p>
                <p className={`text-xl font-black italic tracking-tighter uppercase ${valueColor}`}>{value}</p>
            </div>
        </div>
    </div>
);

const Subscription: React.FC<SubscriptionProps> = ({ isSubscribed, onSubscribe, onCancel, language, onNavigateToFaq }) => {
    const t = translations[language];
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleConfirmCancel = () => {
        onCancel();
        setShowCancelModal(false);
    };

    if (isSubscribed) {
        return (
            <>
                <div className="max-w-5xl mx-auto pb-24">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-8">
                            <span className="text-xs font-black text-orange-500 uppercase tracking-[0.4em] italic">SÉCURITÉ DU COMPTE</span>
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-[1.1] mb-6">{t.sub_manage_title}</h1>
                        <p className="text-sm sm:text-xl font-bold text-gray-500 uppercase tracking-[0.4em] italic leading-relaxed">{t.sub_manage_subtitle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InfoCard 
                            title={t.sub_card_type_title}
                            value={t.sub_card_type_value}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" /></svg>}
                        />
                        <InfoCard 
                            title={t.sub_card_status_title}
                            value={t.sub_card_status_active}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                            valueColor="text-green-400"
                        />
                        <InfoCard 
                            title={t.sub_card_renewal_title}
                            value={t.sub_card_renewal_date}
                            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" /></svg>}
                        />
                    </div>
                    
                    <div className="mt-16 bg-brand-card border border-white/5 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-8">ZONE DE GESTION ADMINISTRATIVE</h3>
                         <button 
                            onClick={() => setShowCancelModal(true)}
                            className="w-full max-w-md mx-auto rounded-xl bg-red-900/20 border border-red-500/30 px-8 py-5 text-xs font-black uppercase italic tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500"
                        >
                           {t.sub_cancel_button}
                        </button>
                    </div>

                    <div className="mt-12 text-center">
                        <button onClick={onNavigateToFaq} className="text-gray-500 hover:text-orange-500 transition-colors text-[10px] font-black uppercase tracking-widest italic">
                           👉 {t.sub_faq_link}
                        </button>
                    </div>
                </div>

                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-xl">
                        <div className="bg-brand-dark-blue border border-white/10 rounded-[2.5rem] max-w-lg w-full p-12 shadow-2xl">
                             <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-6">{t.sub_modal_title}</h2>
                             <p className="text-gray-400 text-sm font-bold uppercase tracking-widest leading-loose mb-10">{t.sub_modal_text}</p>
                             <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => setShowCancelModal(false)} className="flex-1 px-8 py-4 text-xs font-black text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-all uppercase tracking-widest">
                                    {t.sub_modal_cancel}
                                </button>
                                 <button onClick={handleConfirmCancel} className="flex-1 px-8 py-4 text-xs font-black text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-red-500/20">
                                    {t.sub_modal_confirm}
                                </button>
                             </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
         <div className="text-center pb-24">
            <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter uppercase mb-6">{t.sub_inactive_title}</h1>
             <p className="text-sm sm:text-xl font-bold text-gray-500 uppercase tracking-[0.4em] italic mb-16">
                {t.sub_inactive_subtitle}
            </p>

            <div className="flex justify-center">
                 <div className="max-w-lg w-full bg-brand-card border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 text-center">
                        <span className="inline-block bg-gray-900 border border-white/10 text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] italic px-6 py-2 rounded-full mb-8">{t.join_pass}</span>
                        <h2 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">12,99€<span className="text-2xl text-gray-500 italic"> {t.join_price}</span></h2>
                        <p className="text-[10px] font-black text-yellow-500/60 uppercase tracking-[0.2em] italic bg-yellow-500/5 inline-block px-4 py-1 rounded-full mb-10 border border-yellow-500/10">{t.join_commitment}</p>
                        <ul className="text-left space-y-4 mb-12">
                            {[t.join_feature_list_1, t.join_feature_list_2, t.join_feature_list_3].map((feat, i) => (
                                <li key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-xl border border-white/5">
                                    <CheckIcon />
                                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={onSubscribe} className="w-full rounded-2xl bg-gradient-brand px-8 py-5 text-xs font-black uppercase italic tracking-[0.2em] text-white shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform">
                            {t.join_cta}
                        </button>
                        <p className="mt-6 text-[10px] font-black text-gray-600 uppercase tracking-widest italic">{t.join_info}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;
