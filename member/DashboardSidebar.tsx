
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
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 relative group ${
                isActive
                    ? 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-brand rounded-r-full transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
            <div className="w-6 h-6 mr-3">{icon}</div>
            <span>{label}</span>
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
        className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200 group"
    >
        <div className="w-6 h-6 mr-3">{icon}</div>
        <span>{label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto text-gray-500 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </a>
);


const DashboardSidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen, language, currentUser }) => {
    const t = translations[language];

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>
            <div className={`fixed top-0 left-0 h-full w-64 bg-brand-dark-blue border-r border-gray-800 z-50 transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-800">
                        <NextWinLogo className="h-10"/>
                    </div>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <NavItem page={DashboardNav.DashboardHome} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_home} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>} />
                        
                        {/* ACCÈS EXCLUSIF ADMIN */}
                        {currentUser.isAdmin && (
                            <NavItem page={DashboardNav.Predictions} activePage={activePage} setActivePage={setActivePage} label="PRONOSTICS IA" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>} />
                        )}

                        <NavItem page={DashboardNav.Analyzer} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_analyzer} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} />
                        <NavItem page={DashboardNav.Strategy} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_strategy} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} />
                        <NavItem page={DashboardNav.Bankroll} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_bankroll} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00-.75-.75h-.75m7.5-1.5V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0h3.75m-3.75 0a2.25 2.25 0 01-2.25 2.25V15m1.5 0v.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-.75" /></svg>} />
                        <ExternalNavItem href="https://www.livescore.in/fr/" label="MATCHS EN DIRECT" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} />
                        <NavItem page={DashboardNav.Archives} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_archives} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>} />
                        <NavItem page={DashboardNav.Subscription} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_subscription} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 110 6H9m9-13.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V6.75A2.25 2.25 0 0018.75 4.5H5.25z" /></svg>} />
                        <NavItem page={DashboardNav.Profile} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_profile} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
                    </nav>
                </div>
            </div>

            <div className="hidden md:flex md:fixed md:top-28 md:bottom-0 md:left-0 md:w-64 md:flex-col bg-brand-dark-blue border-r border-gray-800">
                <div className="flex flex-col h-full">
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <NavItem page={DashboardNav.DashboardHome} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_home} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>} />
                        
                        {currentUser.isAdmin && (
                            <NavItem page={DashboardNav.Predictions} activePage={activePage} setActivePage={setActivePage} label="PRONOSTICS IA" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>} />
                        )}

                        <NavItem page={DashboardNav.Analyzer} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_analyzer} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} />
                        <NavItem page={DashboardNav.Strategy} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_strategy} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>} />
                        <NavItem page={DashboardNav.Bankroll} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_bankroll} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0a.75.75 0 00-.75-.75h-.75m7.5-1.5V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.75m0 0h3.75m-3.75 0a2.25 2.25 0 01-2.25 2.25V15m1.5 0v.75a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25v-.75" /></svg>} />
                        <ExternalNavItem href="https://www.livescore.in/fr/" label="MATCHS EN DIRECT" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>} />
                        <NavItem page={DashboardNav.Archives} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_archives} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>} />
                        <NavItem page={DashboardNav.Subscription} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_subscription} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 110 6H9m9-13.5H5.25A2.25 2.25 0 003 6.75v10.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V6.75A2.25 2.25 0 0018.75 4.5H5.25z" /></svg>} />
                        <NavItem page={DashboardNav.Profile} activePage={activePage} setActivePage={setActivePage} label={t.dash_nav_profile} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>} />
                    </nav>
                </div>
            </div>
        </>
    );
};

export default DashboardSidebar;
