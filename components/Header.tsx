import React, { useState, useEffect } from 'react';
import { Page, Language } from '../types';
import NextWinLogo from './NextWinLogo';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    isLoggedIn: boolean;
    onShowLogin: () => void;
    onLogout: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isLoggedIn, onShowLogin }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-brand-bg/95 backdrop-blur-2xl py-6 border-b border-white/5 shadow-2xl' : 'bg-transparent py-12'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <NextWinLogo onClick={() => onNavigate(Page.Home)} />

                <nav className="hidden xl:flex items-center gap-16">
                    {[
                        { p: Page.Home, l: 'ACCUEIL' },
                        { p: Page.HowItWorks, l: 'PROTOCOLE' },
                        { p: Page.StrategyInfo, l: 'STRATÉGIE' },
                        { p: Page.JoinUs, l: 'MEMBERSHIP' }
                    ].map(item => (
                        <button 
                            key={item.p}
                            onClick={() => onNavigate(item.p)}
                            className={`text-[11px] font-black uppercase tracking-[0.4em] italic transition-all relative group ${currentPage === item.p ? 'text-white' : 'text-white/50 hover:text-white'}`}
                        >
                            {item.l}
                            <span className={`absolute -bottom-2 left-0 h-[2px] bg-brand-orange transition-all duration-500 ${currentPage === item.p ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-10">
                    {isLoggedIn ? (
                        <button 
                            onClick={() => onNavigate(Page.Dashboard)}
                            className="bg-gradient-to-r from-brand-orange to-brand-violet text-white px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            DASHBOARD
                        </button>
                    ) : (
                        <button 
                            onClick={onShowLogin}
                            className="text-white border-b-2 border-brand-orange px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] italic hover:text-brand-orange transition-all"
                        >
                            LOGIN
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;