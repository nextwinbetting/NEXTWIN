
import React, { useState } from 'react';
import Predictions from './Predictions';
import BankrollManagement from './BankrollManagement';
import Subscription from './Subscription';
import Profile from './Profile';
import LockedFeature from './LockedFeature';
import Strategy from './Strategy';
import DashboardHome from './DashboardHome';
import Support from './Support';
import DashboardSidebar from './DashboardSidebar';
import { Language, DashboardNav, Page, User } from '../types';

interface DashboardProps {
    currentUser: User;
    language: Language;
    isSubscribed: boolean;
    onSubscribe: () => void;
    onCancelSubscription: () => void;
    onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, language, isSubscribed, onSubscribe, onCancelSubscription, onNavigate }) => {
    const [activePage, setActivePage] = useState<DashboardNav>(DashboardNav.DashboardHome);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        const pageMapping: { [key in DashboardNav]: React.ReactNode } = {
            [DashboardNav.DashboardHome]: <DashboardHome username={currentUser.username} setActivePage={setActivePage} language={language} />,
            // SÉCURITÉ : Seul NEXTWIN_BOSS peut accéder à cet onglet
            [DashboardNav.Predictions]: currentUser.isAdmin ? <Predictions language={language} isAdmin={true} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Strategy]: isSubscribed ? <Strategy language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Bankroll]: <BankrollManagement />,
            [DashboardNav.Subscription]: <Subscription isSubscribed={isSubscribed} onSubscribe={onSubscribe} onCancel={onCancelSubscription} language={language} onNavigateToFaq={() => onNavigate(Page.FAQ)} />,
            [DashboardNav.Profile]: <Profile />,
            // Pass setActivePage to Support component to fix prop error after Support.tsx update
            [DashboardNav.Support]: <Support language={language} setActivePage={setActivePage} onNavigateToFaq={() => onNavigate(Page.FAQ)} onNavigateToContact={() => onNavigate(Page.Contact)} />,
            // Pages retirées mais conservées dans l'enum pour compatibilité
            [DashboardNav.Analyzer]: null,
            [DashboardNav.Archives]: null,
            [DashboardNav.LiveScores]: null,
        };
        return pageMapping[activePage];
    }

    return (
        <div className="flex min-h-screen bg-brand-dark">
            <DashboardSidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                language={language}
                currentUser={currentUser}
            />

            <div className="flex-1 md:ml-64 transition-all duration-300">
                 {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-brand-dark-blue/80 backdrop-blur-sm border-b border-gray-800">
                    <span className="text-white font-bold tracking-tighter italic">NEXTWIN</span>
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
                
                <main className="p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
