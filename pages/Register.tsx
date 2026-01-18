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
            <div className="max-w-xl w-full bg-brand-card border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 -mt-24 -ml-24 w-64 h-64 bg-gradient-to-r from-orange-600 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
                <div className="relative z-10 text-center">
                    <NextWinLogo className="h-12 justify-center" />
                    <h2 className="mt-6 text-2xl font-bold text-white">{t.register_title}</h2>
                    <p className="mt-2 text-sm text-brand-light-gray">{t.register_subtitle}</p>

                    <form onSubmit={handleSubmit} className="text-left mt-8 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-brand-light-gray">{t.register_lastname}</label>
                                <input type="text" name="lastName" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-light-gray">{t.register_firstname}</label>
                                <input type="text" name="firstName" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-brand-light-gray">{t.register_dob}</label>
                            <input type="date" name="dob" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-brand-light-gray">{t.register_username}</label>
                            <input type="text" name="username" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-brand-light-gray">{t.register_email}</label>
                            <input type="email" name="email" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                         <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-brand-light-gray">{t.register_password}</label>
                                <input type="password" name="password" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-brand-light-gray">{t.register_confirm_password}</label>
                                <input type="password" name="confirmPassword" required onChange={handleChange} className="w-full mt-1 bg-gray-900 border border-gray-700 rounded-md p-2 text-white focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                        </div>
                        <div className="pt-2">
                            <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover transition-transform transform hover:scale-105">
                                {t.register_button}
                            </button>
                        </div>
                    </form>
                    
                    <p className="mt-6 text-sm text-brand-light-gray">
                        {t.register_has_account}{' '}
                        <button onClick={() => onNavigate(Page.Login)} className="font-semibold text-transparent bg-clip-text bg-gradient-brand hover:brightness-125">
                            {t.register_login_here}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;