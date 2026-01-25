
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
            className={`flex items-center w-full px-5 py-3 rounded-xl transition-all duration-200 group mb-1 ${
                isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            <div className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-400'}`}>
                {icon}
            </div>
            <span className="text-xs font-semibold tracking-wide">{label}</span>
        </button>
    );
};

const DashboardSidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isSidebarOpen, setSidebarOpen, language }) => {
    const t = translations[language];

    const navLinks = (
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <div className="px-5 mb-6">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">Navigation</p>
                <div className="h-[1px] w-full bg-white/5"></div>
            </div>

            <NavItem 
                page={DashboardNav.DashboardHome} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_home} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
            />
            
            <NavItem 
                page={DashboardNav.Predictions} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_predictions} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
            />

            <NavItem 
                page={DashboardNav.Strategy} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_strategy} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} 
            />
            
            <NavItem 
                page={DashboardNav.Bankroll} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_bankroll} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
            />

            <div className="pt-8">
                 <div className="h-[1px] w-full bg-white/5 mb-6"></div>
            </div>

            <NavItem 
                page={DashboardNav.Subscription} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_subscription} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} 
            />

            <NavItem 
                page={DashboardNav.Profile} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_profile} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
            />

            <NavItem 
                page={DashboardNav.Support} 
                activePage={activePage} 
                setActivePage={setActivePage} 
                label={t.dash_nav_support} 
                icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} 
            />
        </nav>
    );

    return (
        <>
            <div className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed top-0 left-0 h-full w-64 bg-[#111319] border-r border-white/5 z-50 transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/5 flex items-center justify-center"><NextWinLogo className="h-6"/></div>
                    {navLinks}
                </div>
            </div>

            <div className="hidden md:flex md:fixed md:top-24 md:bottom-0 md:left-0 md:w-64 md:flex-col bg-[#111319] border-r border-white/5">
                <div className="flex flex-col h-full">{navLinks}</div>
            </div>
        </>
    );
};

export default DashboardSidebar;
