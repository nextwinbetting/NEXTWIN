
import React, { useState } from 'react';
import { Page, Language } from '../App';
import NextWinLogo from '../components/NextWinLogo';
import { translations } from '../translations';

interface LoginProps {
    onLoginSuccess: (email: string) => void;
    onNavigate: (page: Page) => void;
    language: Language;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate, language }) => {
    const t = translations[language];
    const [email, setEmail] = useState('demo@nextwin.ai');
    const [password, setPassword] = useState('password');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess(email);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
            <div className="max-w-md w-full bg-brand-card border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-64 h-64 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <NextWinLogo className="h-12 justify-center" />
                    <h2 className="mt-6 text-2xl font-bold text-white">{t.login_title}</h2>
                    <p className="mt-2 text-sm text-brand-light-gray">{t.login_subtitle}</p>

                    <form onSubmit={handleSubmit} className="text-left mt-8 space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-brand-light-gray">{t.login_email}</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-brand-light-gray">{t.login_password}</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" 
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover transition-transform transform hover:scale-105">
                                {t.login_button}
                            </button>
                        </div>
                    </form>
                    
                    <p className="mt-6 text-sm text-brand-light-gray">
                        {t.login_no_account}{' '}
                        <button onClick={() => onNavigate(Page.JoinUs)} className="font-semibold text-transparent bg-clip-text bg-gradient-brand hover:brightness-125">
                            {t.login_join_us}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;