import React, { useState } from 'react';
import { Page, Language, User } from '../types';
import NextWinLogo from '../components/NextWinLogo';
import { translations } from '../translations';

interface RegisterProps {
    onRegisterSuccess: (user: User) => void;
    onNavigate: (page: Page) => void;
    language: Language;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigate, language }) => {
    const t = translations[language];
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }
        const newUser: User = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob,
            username: formData.username,
            email: formData.email,
        };
        onRegisterSuccess(newUser);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center items-center">
            <div className="max-w-xl w-full bg-brand-card border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 -mt-24 -ml-24 w-64 h-64 bg-gradient-to-r from-brand-orange/10 to-brand-violet/10 rounded-full blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <NextWinLogo className="h-12 justify-center mb-10" />
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">{t.register_title}</h2>
                    <p className="text-[10px] font-bold text-brand-light-gray uppercase tracking-widest italic">{t.register_subtitle}</p>

                    <form onSubmit={handleSubmit} className="text-left mt-10 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">NOM</label>
                                <input type="text" name="lastName" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase placeholder:text-gray-700 focus:border-brand-orange transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">PRÉNOM</label>
                                <input type="text" name="firstName" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase placeholder:text-gray-700 focus:border-brand-orange transition-all" />
                            </div>
                        </div>
                         <div>
                            <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">DATE DE NAISSANCE</label>
                            <input type="date" name="dob" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none focus:border-brand-orange transition-all" />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">NOM D'UTILISATEUR</label>
                            <input type="text" name="username" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none uppercase placeholder:text-gray-700 focus:border-brand-orange transition-all" />
                        </div>
                         <div>
                            <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">E-MAIL</label>
                            <input type="email" name="email" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none placeholder:text-gray-700 focus:border-brand-orange transition-all" />
                        </div>
                         <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">MOT DE PASSE</label>
                                <input type="password" name="password" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none focus:border-brand-orange transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">CONFIRMATION</label>
                                <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full mt-2 bg-gray-900 border border-white/5 rounded-xl p-4 text-white text-xs font-bold outline-none focus:border-brand-orange transition-all" />
                            </div>
                        </div>
                        <div className="pt-6">
                            <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-brand-orange to-brand-violet px-6 py-5 text-[11px] font-black uppercase tracking-[0.4em] italic text-white shadow-xl shadow-brand-orange/20 transition-transform transform hover:scale-105 active:scale-95">
                                {t.register_button}
                            </button>
                        </div>
                    </form>
                    
                    <p className="mt-10 text-[10px] font-black text-brand-light-gray uppercase tracking-widest italic">
                        DÉJÀ MEMBRE ?{' '}
                        <button onClick={() => onNavigate(Page.Login)} className="text-brand-orange hover:brightness-125 underline decoration-2 underline-offset-4 transition-all">
                            SE CONNECTER
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;