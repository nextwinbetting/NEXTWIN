
import React from 'react';
import { DashboardNav, Language, User } from '../types';
import NextWinLogo from '../components/NextWinLogo';
import { translations } from '../translations';

interface SidebarProps {
    activePage: DashboardNav;
    setActivePage: (page: DashboardNav) => void;
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
    language: Language;
    currentUser: User;
}

const NavItem: React.FC<{
    page: DashboardNav;
    activePage: DashboardNav;
    setActivePage: (page: DashboardNav) => void;
    icon: React.ReactNode;
    label: string;
}> = ({ page, activePage, setActivePage, icon, label }) => {
    const isActive = activePage === page;
    return (
        <button
            onClick={() => setActivePage(page)}
            className={`flex items-center w-full px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 relative group mb-1.5 ${
                isActive
                    ? 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-white border border-orange-500/20'
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
            }`}
        >
            <div className={`absolute left-0 top-3 bottom-3 w-0.5 bg-gradient-brand rounded-r-full transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
            <div className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-600 group-hover:text-orange-400'}`}>{icon}</div>
            <span className="truncate">{label}</span>
        </button>
    );
};

const ExternalNavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    href: string;
}> = ({ icon, label, href }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center w-full px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all duration-300 group mb-1.5"
    >
        <div className="w-4 h-4 mr-3 text-gray-600 group-hover:text-orange-400">{icon}</div>
        <span className="truncate">{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-auto text-gray-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
);

const DashboardSidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen, language, currentUser }) => {
    const t = translations[language];

    const navLinks = (
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 py-2 mb-6">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic mb-2 opacity-60">{t.dash_nav_menu}</p>
                <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>

            <NavItem 
                page={DashboardNav.DashboardHome} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_home} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>} 
            />
            
            {currentUser.isAdmin && (
                <NavItem 
                    page={DashboardNav.Predictions} 
                    activePage={activePage} 
                    setActivePage={setActivePage} 
                    label={t.dash_nav_predictions} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>} 
                />
            )}

            <NavItem 
                page={DashboardNav.Strategy} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_strategy} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} 
            />
            
            <NavItem 
                page={DashboardNav.Bankroll} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_bankroll} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>} 
            />
            
            <ExternalNavItem 
                href="https://www.livescore.in/fr/" 
                label={t.dash_nav_live_scores} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} 
            />
            
            <div className="px-4 py-5">
                 <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>

            <NavItem 
                page={DashboardNav.Subscription} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_subscription} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>} 
            />
            
            <NavItem 
                page={DashboardNav.Profile} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_profile} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} 
            />

            <NavItem 
                page={DashboardNav.Support} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_support} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>} 
            />
            
            <div className="mt-8 px-4 py-3 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest text-center">Version Pro Active</p>
            </div>
        </nav>
    );

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/80 z-40 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <div className={`fixed top-0 left-0 h-full w-64 bg-brand-dark-blue border-r border-white/5 z-50 transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <button 
                        onClick={() => setActivePage(DashboardNav.DashboardHome)}
                        className="p-8 border-b border-white/5 text-left hover:bg-white/5 transition-colors"
                    >
                        <NextWinLogo className="h-7"/>
                    </button>
                    {navLinks}
                </div>
            </div>

            <div className="hidden md:flex md:fixed md:top-28 md:bottom-0 md:left-0 md:w-64 md:flex-col bg-brand-dark-blue border-r border-white/5">
                <div className="flex flex-col h-full">
                    <button 
                        onClick={() => setActivePage(DashboardNav.DashboardHome)}
                        className="p-8 border-b border-white/5 text-left hover:bg-white/5 transition-colors hidden"
                    >
                         {/* Hidden because header already has logo, but logic kept for structure */}
                        <NextWinLogo className="h-7"/>
                    </button>
                    {navLinks}
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
            `}</style>
        </>
    );
};

export default DashboardSidebar;
