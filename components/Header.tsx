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

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, currentPage, onNavigate, children }) => (
    <button
        onClick={() => onNavigate(page)}
        className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group ${currentPage === page ? 'text-white' : 'text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-brand'}`}
    >
        {children}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-brand transition-transform duration-300 transform ${currentPage === page ? 'scale-x-100' : 'scale-x-0'}`}></span>
    </button>
);

const MobileNavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode }> = ({ page, currentPage, onNavigate, children }) => (
     <button
        onClick={() => onNavigate(page)}
        className={`block w-full text-left rounded-md px-3 py-2 text-base font-medium ${currentPage === page ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, isLoggedIn, onShowLogin, onLogout, language, setLanguage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const t = translations[language];
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
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

    const handleMobileLogin = () => {
        onShowLogin();
        setIsMenuOpen(false);
    };

    const handleMobileLogout = () => {
        onLogout();
        setIsMenuOpen(false);
    }

    return (
        <header className="bg-brand-dark-blue/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                         <button onClick={() => onNavigate(Page.Home)} className="focus:outline-none">
                            <NextWinLogo className="h-10"/>
                        </button>
                    </div>

                    <nav className="hidden lg:flex items-baseline space-x-4">
                        {isLoggedIn ? (
                             <div className="relative group flex items-center">
                                <NavLink page={Page.Dashboard} currentPage={currentPage} onNavigate={onNavigate}>{t.nav_dashboard}</NavLink>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-xs p-3 text-xs bg-gray-900 border border-gray-700 text-gray-300 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                                    {t.header_dashboard_tooltip}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-700"></div>
                                </div>
                            </div>
                        ) : (
                            navItems.map(item => <NavLink key={item.page} page={item.page} currentPage={currentPage} onNavigate={onNavigate}>{item.label}</NavLink>)
                        )}
                    </nav>
                   
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm border border-gray-700 rounded-md p-0.5">
                            <button onClick={() => setLanguage('FR')} className={`px-2 py-1 rounded-md transition-all text-xs font-bold ${language === 'FR' ? 'bg-gradient-brand text-white' : 'text-gray-400 hover:bg-gray-800'}`}>FR</button>
                            <button onClick={() => setLanguage('EN')} className={`px-2 py-1 rounded-md transition-all text-xs font-bold ${language === 'EN' ? 'bg-gradient-brand text-white' : 'text-gray-400 hover:bg-gray-800'}`}>EN</button>
                        </div>
                        <div className="hidden lg:flex items-center">
                            {isLoggedIn ? (
                                <button
                                    onClick={onLogout}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                                >
                                    {t.nav_logout}
                                </button>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={onShowLogin}
                                        className="px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 rounded-md transition-colors"
                                    >
                                        {t.nav_login}
                                    </button>
                                    <button
                                        onClick={() => onNavigate(Page.JoinUs)}
                                        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-brand hover:bg-gradient-brand-hover rounded-md transition-transform transform hover:scale-105"
                                    >
                                        {t.nav_signup}
                                    </button>
                                </div>
                            )}
                        </div>
                         <div className="lg:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                aria-controls="mobile-menu"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

             {/* Mobile menu */}
            <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden absolute left-0 w-full bg-brand-dark-blue/95 backdrop-blur-sm shadow-lg`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
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
                 <div className="pt-4 pb-3 border-t border-gray-700">
                     <div className="px-5 space-y-3">
                         {isLoggedIn ? (
                             <button
                                onClick={handleMobileLogout}
                                className="block w-full text-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                {t.nav_logout}
                            </button>
                         ) : (
                             <>
                                <button
                                    onClick={handleMobileLogin}
                                    className="block w-full text-center rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                                >
                                    {t.nav_login}
                                </button>
                                <button
                                    onClick={() => handleMobileNav(Page.JoinUs)}
                                    className="block w-full text-center rounded-md bg-gradient-brand px-3 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover"
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