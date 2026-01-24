
import React, { useState, useEffect } from 'react';
import Predictions from './Predictions';
import BankrollManagement from './BankrollManagement';
import Subscription from './Subscription';
import Profile from './Profile';
import LockedFeature from './LockedFeature';
import Strategy from './Strategy';
import DashboardHome from './DashboardHome';
import Support from './Support';
import Analyzer from './Analyzer';
import Archives from './Archives';
import DashboardSidebar from './DashboardSidebar';
import { Language, DashboardNav, Page, User, ArchivedAnalysis } from '../types';

interface DashboardProps {
    currentUser: User;
    language: Language;
    isSubscribed: boolean;
    onSubscribe: () => void;
    onCancelSubscription: () => void;
    onNavigate: (page: Page) => void;
}

const STORAGE_ARCHIVES = 'NEXTWIN_ANALYSIS_ARCHIVES';

const Dashboard: React.FC<DashboardProps> = ({ currentUser, language, isSubscribed, onSubscribe, onCancelSubscription, onNavigate }) => {
    const [activePage, setActivePage] = useState<DashboardNav>(DashboardNav.DashboardHome);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [archivedAnalyses, setArchivedAnalyses] = useState<ArchivedAnalysis[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_ARCHIVES);
        if (saved) setArchivedAnalyses(JSON.parse(saved));
    }, []);

    const handleNewAnalysis = (data: any) => {
        const newArchive: ArchivedAnalysis = {
            ...data.result,
            id: `arch-${Date.now()}`,
            sport: data.sport,
            team1: data.team1,
            team2: data.team2,
            betType: data.betType,
            analysisDate: new Date().toLocaleDateString('fr-FR')
        };
        const updated = [newArchive, ...archivedAnalyses].slice(0, 50); // Garder les 50 dernières
        setArchivedAnalyses(updated);
        localStorage.setItem(STORAGE_ARCHIVES, JSON.stringify(updated));
    };

    const renderContent = () => {
        const pageMapping: { [key in DashboardNav]: React.ReactNode } = {
            [DashboardNav.DashboardHome]: <DashboardHome username={currentUser.username} setActivePage={setActivePage} language={language} />,
            [DashboardNav.Predictions]: currentUser.isAdmin ? <Predictions language={language} isAdmin={true} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Analyzer]: isSubscribed ? <Analyzer language={language} onNewAnalysis={handleNewAnalysis} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Archives]: isSubscribed ? <Archives archives={archivedAnalyses} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Strategy]: isSubscribed ? <Strategy language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Bankroll]: <BankrollManagement />,
            [DashboardNav.Subscription]: <Subscription isSubscribed={isSubscribed} onSubscribe={onSubscribe} onCancel={onCancelSubscription} language={language} onNavigateToFaq={() => onNavigate(Page.FAQ)} />,
            [DashboardNav.Profile]: <Profile />,
            [DashboardNav.Support]: <Support language={language} setActivePage={setActivePage} onNavigateToFaq={() => onNavigate(Page.FAQ)} onNavigateToContact={() => onNavigate(Page.Contact)} />,
            [DashboardNav.LiveScores]: null,
        };
        return pageMapping[activePage];
    }

    const handleHomeReturn = () => {
        setActivePage(DashboardNav.DashboardHome);
        setSidebarOpen(false);
    };

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
                <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-brand-dark-blue/80 backdrop-blur-sm border-b border-gray-800">
                    <button onClick={handleHomeReturn} className="text-white font-bold tracking-tighter italic text-lg">NEXTWIN</button>
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
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
