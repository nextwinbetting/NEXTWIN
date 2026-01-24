
import React, { useState, useEffect } from 'react';
import { Page, Language } from '../types';
import NextWinLogo from './NextWinLogo';
import { translations } from '../translations';

interface HeaderProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    isLoggedIn: boolean;
    onShowLogin: () => void;
    onLogout: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode; hint?: string }> = ({ page, currentPage, onNavigate, children, hint }) => (
    <div className="relative group flex flex-col items-center">
        <button
            onClick={() => onNavigate(page)}
            className={`relative px-2 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${currentPage === page ? 'text-white' : 'text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-brand'}`}
        >
            {children}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-brand transition-transform duration-300 transform ${currentPage === page ? 'scale-x-100' : 'scale-x-0'}`}></span>
        </button>
        {hint && currentPage === page && (
             <span className="absolute top-[115%] whitespace-nowrap text-[8px] font-black text-orange-500 uppercase tracking-[0.05em] bg-orange-500/5 border border-orange-500/20 px-3 py-1.5 rounded-full animate-pulse shadow-xl">
                {hint}
            </span>
        )}
    </div>
);

const MobileNavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, currentPage, onNavigate, children }) => (
     <button
        onClick={() => onNavigate(page)}
        className={`block w-full text-left rounded-xl px-4 py-4 text-xs font-black uppercase tracking-widest ${currentPage === page ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isLoggedIn, onShowLogin, onLogout, language, setLanguage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = translations[language];
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) { // xl breakpoint adjusted for more items
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { page: Page.Home, label: t.nav_home },
        { page: Page.HowItWorks, label: t.nav_how_it_works },
        { page: Page.StrategyInfo, label: t.nav_strategy_info },
        { page: Page.Bankroll, label: t.nav_bankroll },
        { page: Page.JoinUs, label: t.nav_join_us },
        { page: Page.FAQ, label: t.nav_faq },
    ];
    
    const handleMobileNav = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-[#110f1f] sticky top-0 z-50 border-b border-white/5 shadow-2xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24 lg:h-32">
                    <div className="flex-shrink-0">
                         <button onClick={() => onNavigate(Page.Home)} className="focus:outline-none hover:scale-[1.02] transition-transform">
                            <NextWinLogo className="h-7 lg:h-9"/>
                        </button>
                    </div>

                    <nav className="hidden xl:flex items-center space-x-3 lg:space-x-5">
                        {isLoggedIn ? (
                            <NavLink page={Page.Dashboard} currentPage={currentPage} onNavigate={onNavigate} hint={t.nav_dashboard_hint}>
                                {t.nav_dashboard}
                            </NavLink>
                        ) : (
                            navItems.map(item => <NavLink key={item.page} page={item.page} currentPage={currentPage} onNavigate={onNavigate}>{item.label}</NavLink>)
                        )}
                    </nav>
                   
                    <div className="flex items-center space-x-3 lg:space-x-5">
                        <div className="flex items-center border border-white/10 rounded-xl p-0.5 bg-gray-900/50 scale-90 lg:scale-100">
                            <button onClick={() => setLanguage('FR')} className={`px-3 py-1.5 rounded-lg transition-all text-[9px] font-black tracking-widest ${language === 'FR' ? 'bg-gradient-brand text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}>FR</button>
                            <button onClick={() => setLanguage('EN')} className={`px-3 py-1.5 rounded-lg transition-all text-[9px] font-black tracking-widest ${language === 'EN' ? 'bg-gradient-brand text-white shadow-xl' : 'text-gray-500 hover:text-gray-300'}`}>EN</button>
                        </div>
                        <div className="hidden lg:flex items-center space-x-4">
                            {isLoggedIn ? (
                                <button
                                    onClick={onLogout}
                                    className="px-5 py-2.5 text-[9px] font-black uppercase tracking-widest text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-all border border-white/5"
                                >
                                    {t.nav_logout}
                                </button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={onShowLogin}
                                        className="text-[9px] font-black uppercase tracking-widest text-white hover:text-orange-400 transition-colors"
                                    >
                                        {t.nav_login}
                                    </button>
                                    <button
                                        onClick={() => onNavigate(Page.JoinUs)}
                                        className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-white bg-gradient-brand hover:scale-105 rounded-xl transition-transform shadow-2xl shadow-orange-500/10"
                                    >
                                        {t.nav_signup}
                                    </button>
                                </div>
                            )}
                        </div>
                         <div className="xl:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-all"
                            >
                                {isMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu - TOTALEMENT OPAQUE */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} xl:hidden absolute left-0 w-full bg-[#110f1f] shadow-2xl z-50 border-b border-white/5 h-screen overflow-y-auto`} id="mobile-menu">
                <div className="px-6 pt-6 pb-8 space-y-3">
                    {isLoggedIn ? (
                         <MobileNavLink page={Page.Dashboard} currentPage={currentPage} onNavigate={() => handleMobileNav(Page.Dashboard)}>
                            {t.nav_dashboard}
                        </MobileNavLink>
                    ) : (
                        navItems.map(item => (
                            <MobileNavLink key={item.page} page={item.page} currentPage={currentPage} onNavigate={() => handleMobileNav(item.page)}>
                                {item.label}
                            </MobileNavLink>
                        ))
                    )}
                </div>
                 <div className="px-6 pb-24 border-t border-white/5 pt-8">
                     <div className="space-y-4">
                         {isLoggedIn ? (
                             <button
                                onClick={onLogout}
                                className="block w-full text-center rounded-xl px-4 py-5 text-xs font-black uppercase tracking-widest text-gray-300 bg-gray-900 hover:bg-gray-800 transition-all border border-white/5"
                            >
                                {t.nav_logout}
                            </button>
                         ) : (
                             <>
                                <button
                                    onClick={onShowLogin}
                                    className="block w-full text-center rounded-xl px-4 py-5 text-xs font-black uppercase tracking-widest text-gray-300 hover:text-white transition-all border border-white/5"
                                >
                                    {t.nav_login}
                                </button>
                                <button
                                    onClick={() => handleMobileNav(Page.JoinUs)}
                                    className="block w-full text-center rounded-xl bg-gradient-brand px-4 py-5 text-xs font-black uppercase tracking-widest text-white shadow-2xl"
                                >
                                    {t.nav_signup}
                                </button>
                            </>
                         )}
                     </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
