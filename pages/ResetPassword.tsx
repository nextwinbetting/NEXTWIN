import React, { useState, useEffect } from 'react';
import { Page, Language } from '../types';
import NextWinLogo from '../components/NextWinLogo';
import { translations } from '../translations';

interface ResetPasswordProps {
    email: string | null;
    onNavigate: (page: Page) => void;
    language: Language;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ email, onNavigate, language }) => {
    const t = translations[language];
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isReset, setIsReset] = useState(false);

    useEffect(() => {
        if (!email) {
            onNavigate(Page.ForgotPassword);
        }
    }, [email, onNavigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        if (password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        // Dans une vraie application, ici on appellerait une API pour réinitialiser le mot de passe.
        console.log(`Password reset for ${email} with new password: ${password}`);
        setIsReset(true);
    };

    if (!email) {
        return null; // Affiche une page blanche pendant la redirection
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
            <div className="max-w-md w-full bg-brand-card border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-24 -mr-24 w-64 h-64 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <NextWinLogo className="h-12 justify-center" />
                    
                    {isReset ? (
                        <div className="mt-6">
                             <h2 className="text-2xl font-bold text-white">{t.reset_password_success_title}</h2>
                             <p className="mt-2 text-sm text-brand-light-gray">{t.reset_password_success_message}</p>
                             <div className="mt-8">
                                <button onClick={() => onNavigate(Page.Login)} className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover transition-transform transform hover:scale-105">
                                    {t.reset_password_go_to_login}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2 className="mt-6 text-2xl font-bold text-white">{t.reset_password_title}</h2>
                            <p className="mt-2 text-sm text-brand-light-gray">{t.reset_password_subtitle}</p>
                            <p className="mt-4 text-xs text-gray-400 bg-gray-900/50 rounded-md p-2">{t.reset_password_email_info} <span className="font-semibold text-gray-300">{email}</span></p>

                            <form onSubmit={handleSubmit} className="text-left mt-6 space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-brand-light-gray">{t.reset_password_new}</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" 
                                    />
                                </div>
                                 <div>
                                    <label className="text-sm font-semibold text-brand-light-gray">{t.reset_password_confirm}</label>
                                    <input 
                                        type="password" 
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" 
                                    />
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover transition-transform transform hover:scale-105">
                                        {t.reset_password_button}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;