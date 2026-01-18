import React, { useState } from 'react';
import { Page, Language } from '../types';
import NextWinLogo from '../components/NextWinLogo';
import { translations } from '../translations';

interface ForgotPasswordProps {
    onNavigate: (page: Page) => void;
    language: Language;
    onRequestReset: (email: string) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigate, language, onRequestReset }) => {
    const t = translations[language];
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Dans une vraie application, ici on appellerait une API pour envoyer l'e-mail.
        onRequestReset(email);
        setSubmitted(true);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
            <div className="max-w-md w-full bg-brand-card border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <NextWinLogo className="h-12 justify-center" />
                    <h2 className="mt-6 text-2xl font-bold text-white">{t.forgot_password_title}</h2>
                    
                    {submitted ? (
                        <div className="mt-8 text-center">
                            <p className="text-brand-light-gray">{t.forgot_password_success}</p>
                            <button 
                                onClick={() => onNavigate(Page.ResetPassword)} 
                                className="mt-6 w-full rounded-md bg-orange-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors"
                            >
                                {t.forgot_password_simulation_link}
                            </button>
                            <button onClick={() => onNavigate(Page.Login)} className="mt-4 text-sm font-semibold text-brand-light-gray hover:text-white">
                                {t.forgot_password_back_to_login}
                            </button>
                        </div>
                    ) : (
                        <>
                            <p className="mt-2 text-sm text-brand-light-gray">{t.forgot_password_subtitle}</p>
                            <form onSubmit={handleSubmit} className="text-left mt-8 space-y-6">
                                <div>
                                    <label className="text-sm font-semibold text-brand-light-gray">{t.forgot_password_email}</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ex: john.doe@email.com"
                                        className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" 
                                    />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover transition-transform transform hover:scale-105">
                                        {t.forgot_password_button}
                                    </button>
                                </div>
                            </form>
                             <p className="mt-6 text-sm">
                                <button onClick={() => onNavigate(Page.Login)} className="text-brand-light-gray hover:text-white transition-colors">
                                    ← {t.forgot_password_back_to_login}
                                </button>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;