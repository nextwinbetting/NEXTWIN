import React, { useState } from 'react';
import { Page, Language, User } from '../types';
import NextWinLogo from '../components/NextWinLogo';
import { translations } from '../translations';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onNavigate: (page: Page) => void;
    language: Language;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onNavigate, language }) => {
    const t = translations[language];
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dummyUser: User = {
            firstName: 'Membre',
            lastName: 'Pro',
            dob: '01/01/1990',
            username: username,
            email: `${username.toLowerCase()}@nextwin.ai`,
        };
        onLoginSuccess(dummyUser);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
            <div className="max-w-md w-full bg-brand-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-64 h-64 bg-gradient-to-r from-brand-orange/10 to-brand-violet/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <NextWinLogo className="h-12 justify-center mb-10" />
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{t.login_title}</h2>
                    <p className="text-[10px] font-bold text-brand-light-gray uppercase tracking-widest italic">{t.login_subtitle}</p>

                    <form onSubmit={handleSubmit} className="text-left mt-10 space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">{t.login_username}</label>
                            <input 
                                type="text" 
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="PSEUDO"
                                className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase placeholder:text-gray-700 focus:border-brand-orange transition-all" 
                            />
                        </div>
                        <div>
                             <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">{t.login_password}</label>
                                <button type="button" onClick={() => onNavigate(Page.ForgotPassword)} className="text-[9px] font-black text-brand-orange hover:underline uppercase tracking-widest italic">MDP OUBLIÉ ?</button>
                            </div>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none focus:border-brand-orange transition-all" 
                            />
                        </div>
                        <div className="pt-4">
                            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-violet px-6 py-5 text-[11px] font-black uppercase tracking-[0.4em] italic text-white shadow-xl shadow-brand-orange/20 transition-transform transform hover:scale-105 active:scale-95">
                                {t.login_button}
                            </button>
                        </div>
                    </form>
                    
                    <p className="mt-10 text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">
                        NOUVEAU SUR NEXTWIN ?{' '}
                        <button onClick={() => onNavigate(Page.Register)} className="text-brand-orange hover:brightness-125 underline decoration-2 underline-offset-4 transition-all">
                            CRÉER UN COMPTE
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;