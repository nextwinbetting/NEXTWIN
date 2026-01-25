import React from 'react';
import { DashboardNav, Language, User } from '../types';
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
            className={`flex items-center w-full px-5 py-4 rounded-xl transition-all duration-500 group mb-2 relative overflow-hidden ${
                isActive
                    ? 'bg-gradient-to-r from-brand-orange to-brand-violet text-white font-black shadow-lg shadow-brand-orange/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
        >
            {/* Sublimate active state with a very subtle inner light */}
            {isActive && <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none"></div>}
            
            <div className={`w-5 h-5 mr-4 relative z-10 transition-transform duration-500 ${isActive ? 'scale-110 text-white' : 'text-gray-400 group-hover:text-brand-orange'}`}>
                {icon}
            </div>
            <span className={`text-[10px] uppercase tracking-[0.2em] italic font-bold relative z-10`}>{label}</span>
            
            {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white/40 rounded-l-full"></div>
            )}
        </button>
    );
};

const DashboardSidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, language, currentUser }) => {
    const t = translations[language];

    return (
        <aside className="hidden md:flex md:fixed md:top-24 md:bottom-0 md:left-0 md:w-72 md:flex-col bg-brand-bg border-r border-white/5 z-40">
            <div className="flex-1 px-6 py-10 space-y-1 overflow-y-auto">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.6em] mb-8 px-5">NEXTWIN TERMINAL V2.5</p>
                
                <NavItem 
                    page={DashboardNav.DashboardHome} activePage={activePage} setActivePage={setActivePage} 
                    label={t.dash_nav_home} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} 
                />
                <NavItem 
                    page={DashboardNav.Predictions} activePage={activePage} setActivePage={setActivePage} 
                    label={t.dash_nav_predictions} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} 
                />
                <NavItem 
                    page={DashboardNav.LiveScores} activePage={activePage} setActivePage={setActivePage} 
                    label="SCANNER" icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>} 
                />
                <NavItem 
                    page={DashboardNav.Strategy} activePage={activePage} setActivePage={setActivePage} 
                    label={t.dash_nav_strategy} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} 
                />
                <NavItem 
                    page={DashboardNav.Bankroll} activePage={activePage} setActivePage={setActivePage} 
                    label={t.dash_nav_bankroll} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} 
                />

                <div className="pt-10">
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.6em] mb-6 px-5">ACCOUNT & BILLING</p>
                    <NavItem 
                        page={DashboardNav.Subscription} activePage={activePage} setActivePage={setActivePage} 
                        label={t.dash_nav_subscription} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} 
                    />
                    <NavItem 
                        page={DashboardNav.Profile} activePage={activePage} setActivePage={setActivePage} 
                        label={t.dash_nav_profile} icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} 
                    />
                </div>
            </div>
            
            <div className="p-8 bg-brand-surface border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-orange to-brand-violet flex items-center justify-center font-display font-black text-white text-sm italic shadow-lg shadow-brand-orange/10">
                        {currentUser.username.substring(0, 1).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-white truncate uppercase tracking-widest italic">{currentUser.username}</p>
                        <p className="text-[9px] text-brand-orange font-black uppercase tracking-widest italic">PREMIUM ELITE</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;