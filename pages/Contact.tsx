
import React, { useState } from 'react';
import { Language, Page } from '../App';
import { translations } from '../translations';
import ContactIllustration from '../components/ContactIllustration';

interface ContactProps {
    language: Language;
    onNavigate: (page: Page) => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; content: React.ReactNode; }> = ({ icon, title, content }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-lg bg-gray-800 text-orange-400">
            {icon}
        </div>
        <div className="ml-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="mt-1 text-brand-light-gray">{content}</div>
        </div>
    </div>
);

const Contact: React.FC<ContactProps> = ({ language, onNavigate }) => {
    const t = translations[language];
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* --- LEFT COLUMN: FORM --- */}
                <div>
                    <div className="max-w-xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">{t.contact_title}</h1>
                        <p className="mt-4 text-lg text-brand-light-gray">{t.contact_subtitle}</p>
                    </div>
                    
                    <div className="mt-8 bg-brand-card border border-gray-800 rounded-2xl p-6 sm:p-8">
                        {formSubmitted ? (
                            <div className="text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-white mb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                </div>
                                <h2 className="text-2xl font-bold text-white">{t.contact_success_title}</h2>
                                <p className="mt-2 text-brand-light-gray">{t.contact_success_message}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="text-sm font-semibold text-brand-light-gray">{t.contact_form_name}</label>
                                        <input type="text" id="name" required className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="text-sm font-semibold text-brand-light-gray">{t.contact_form_email}</label>
                                        <input type="email" id="email" required className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="text-sm font-semibold text-brand-light-gray">{t.contact_form_subject}</label>
                                    <select id="subject" required className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500">
                                        {t.contact_form_subject_options.map(option => <option key={option}>{option}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="message" className="text-sm font-semibold text-brand-light-gray">{t.contact_form_message}</label>
                                    <textarea id="message" rows={5} required className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500"></textarea>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover transition-transform transform hover:scale-105">
                                        {t.contact_form_send}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* --- RIGHT COLUMN: ILLUSTRATION & INFO --- */}
                <div className="hidden lg:flex flex-col items-center justify-start pt-8">
                    <ContactIllustration className="w-full h-auto max-w-md" />
                    <div className="mt-10 space-y-8 max-w-md w-full">
                        <InfoCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                            title={t.contact_support_title}
                            content={<a href={`mailto:${t.contact_info_email}`} className="hover:text-white transition-colors">{t.contact_info_email}</a>}
                        />
                        <InfoCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>}
                            title={t.contact_faq_title}
                            content={<button onClick={() => onNavigate(Page.FAQ)} className="hover:text-white transition-colors">{t.contact_faq_desc}</button>}
                        />
                         <InfoCard 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7h-4a3 3 0 0 1-3-3V8a3 3 0 0 1-3-3H2a7 7 0 0 0 7 7v4a3 3 0 0 1 3 3Z"/><path d="M12 2a7 7 0 0 1 7 7h-4a3 3 0 0 0-3-3V2a3 3 0 0 0-3-3H2a7 7 0 0 1 7-7v4a3 3 0 0 0 3 3Z"/></svg>}
                            title={t.contact_press_title}
                            content={<a href={`mailto:${t.contact_press_email}`} className="hover:text-white transition-colors">{t.contact_press_email}</a>}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
