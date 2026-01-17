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
    <div className="bg-brand-card border border-gray-800 rounded-xl p-6">
        <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm text-brand-light-gray">{title}</p>
                <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
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
                <div className="max-w-4xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.sub_manage_title}</h1>
                        <p className="mt-4 text-lg text-brand-light-gray">{t.sub_manage_subtitle}</p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    
                    <div className="mt-10 bg-brand-card border border-gray-800 rounded-xl p-8 text-center">
                        <h3 className="text-xl font-bold text-white">Zone de gestion</h3>
                         <button 
                            onClick={() => setShowCancelModal(true)}
                            className="mt-6 w-full max-w-sm mx-auto rounded-md bg-red-800/80 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-red-700/80 border border-red-600/50 transition-colors"
                        >
                           {t.sub_cancel_button}
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <button onClick={onNavigateToFaq} className="text-brand-light-gray hover:text-white transition-colors text-sm font-semibold">
                           👉 {t.sub_faq_link}
                        </button>
                    </div>
                </div>

                {showCancelModal && (
                    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                        <div className="bg-brand-dark-blue border border-gray-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
                             <h2 className="text-2xl font-bold text-white">{t.sub_modal_title}</h2>
                             <p className="mt-4 text-brand-light-gray">{t.sub_modal_text}</p>
                             <div className="mt-8 flex justify-end space-x-4">
                                <button onClick={() => setShowCancelModal(false)} className="px-6 py-2 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors">
                                    {t.sub_modal_cancel}
                                </button>
                                 <button onClick={handleConfirmCancel} className="px-6 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors">
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
         <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.sub_inactive_title}</h1>
             <p className="mt-4 text-lg text-brand-light-gray">
                {t.sub_inactive_subtitle}
            </p>

            <div className="mt-8 flex justify-center">
                 <div className="max-w-md w-full bg-brand-card border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-20 blur-3xl"></div>
                    <div className="relative z-10 text-center">
                        <span className="inline-block bg-gray-800 text-sm font-semibold text-transparent bg-clip-text bg-gradient-brand px-3 py-1 rounded-full">{t.join_pass}</span>
                        <h2 className="mt-4 text-5xl font-bold text-white">12,99€<span className="text-2xl text-brand-light-gray"> {t.join_price}</span></h2>
                        <p className="mt-2 text-sm text-yellow-400 bg-yellow-900/50 inline-block px-3 py-1 rounded-full">{t.join_commitment}</p>
                        <ul className="text-left mt-8 space-y-3 text-brand-light-gray">
                            <li className="flex items-center"><CheckIcon /><span className="ml-3">{t.join_feature_list_1}</span></li>
                            <li className="flex items-center"><CheckIcon /><span className="ml-3">{t.join_feature_list_2}</span></li>
                            <li className="flex items-center"><CheckIcon /><span className="ml-3">{t.join_feature_list_3}</span></li>
                        </ul>
                        <button onClick={onSubscribe} className="mt-8 w-full rounded-md bg-gradient-brand px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-transform transform hover:scale-105">
                            {t.join_cta}
                        </button>
                        <p className="mt-4 text-xs text-gray-500">{t.join_info}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Subscription;