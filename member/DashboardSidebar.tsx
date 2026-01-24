
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
            className={`flex items-center w-full px-4 py-3.5 text-[11px] font-black uppercase italic tracking-[0.15em] rounded-xl transition-all duration-300 relative group mb-1 ${
                isActive
                    ? 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-white shadow-[0_0_20px_rgba(249,115,22,0.1)] border border-orange-500/20'
                    : 'text-gray-500 hover:bg-white/5 hover:text-white'
            }`}
        >
            <div className={`absolute left-0 top-2 bottom-2 w-1 bg-gradient-brand rounded-r-full transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
            <div className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-600 group-hover:text-orange-400'}`}>{icon}</div>
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
        className="flex items-center w-full px-4 py-3.5 text-[11px] font-black uppercase italic tracking-[0.15em] rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all duration-300 group mb-1"
    >
        <div className="w-5 h-5 mr-3 text-gray-600 group-hover:text-orange-400">{icon}</div>
        <span>{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-auto text-gray-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
);

const DashboardSidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen, language, currentUser }) => {
    const t = translations[language];

    const navLinks = (
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
            <div className="px-4 py-4 mb-4">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.5em] italic mb-4">{t.dash_nav_menu}</p>
                <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent"></div>
            </div>

            <NavItem 
                page={DashboardNav.DashboardHome} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_home} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>} 
            />
            
            {currentUser.isAdmin && (
                <NavItem 
                    page={DashboardNav.Predictions} 
                    activePage={activePage} 
                    setActivePage={setActivePage} 
                    label={t.dash_nav_predictions} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>} 
                />
            )}

            <NavItem 
                page={DashboardNav.Strategy} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_strategy} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} 
            />
            
            <NavItem 
                page={DashboardNav.Bankroll} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_bankroll} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00-.75-.75h-.75m7.5-1.5V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0h3.75m-3.75 0a2.25 2.25 0 01-2.25 2.25V15m1.5 0v.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-.75" /></svg>} 
            />
            
            <ExternalNavItem 
                href="https://www.livescore.in/fr/" 
                label={t.dash_nav_live_scores} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} 
            />
            
            <div className="px-4 py-8 mt-4">
                 <div className="h-[1px] w-full bg-gradient-to-r from-gray-800 to-transparent mb-4"></div>
            </div>

            <NavItem 
                page={DashboardNav.Subscription} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_subscription} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 110 6H9m9-13.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V6.75A2.25 2.25 0 0018.75 4.5H5.25z" /></svg>} 
            />
            
            <NavItem 
                page={DashboardNav.Profile} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_profile} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} 
            />

            <NavItem 
                page={DashboardNav.Support} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_support} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></svg>} 
            />
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
                    <div className="p-8 border-b border-white/5">
                        <NextWinLogo className="h-10"/>
                    </div>
                    {navLinks}
                </div>
            </div>

            <div className="hidden md:flex md:fixed md:top-28 md:bottom-0 md:left-0 md:w-64 md:flex-col bg-brand-dark-blue border-r border-white/5">
                <div className="flex flex-col h-full">
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
