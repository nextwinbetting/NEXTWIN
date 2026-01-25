import React, { useState, useEffect, useCallback } from 'react';
import Predictions from './Predictions';
import BankrollManagement from './BankrollManagement';
import Subscription from './Subscription';
import Profile from './Profile';
import LockedFeature from './LockedFeature';
import Strategy from './Strategy';
import DashboardHome from './DashboardHome';
import Support from './Support';
import Archives from './Archives';
import Analyzer from './Analyzer';
import PredictionsMember from './PredictionsMember';
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
        window.scrollTo(0, 0);
    }, [activePage]);

    const handleNewAnalysis = useCallback((data: any) => {
        const newArchive: ArchivedAnalysis = {
            ...data.result,
            id: `arch-${Date.now()}`,
            sport: data.sport,
            team1: data.team1,
            team2: data.team2,
            betType: data.betType,
            analysisDate: new Date().toLocaleDateString('fr-FR')
        };
        const updated = [newArchive, ...archivedAnalyses].slice(0, 50);
        setArchivedAnalyses(updated);
        localStorage.setItem(STORAGE_ARCHIVES, JSON.stringify(updated));
    }, [archivedAnalyses]);

    const renderContent = () => {
        const pageMapping: { [key in DashboardNav]: React.ReactNode } = {
            [DashboardNav.DashboardHome]: <DashboardHome username={currentUser.username} setActivePage={setActivePage} language={language} />,
            [DashboardNav.Predictions]: isSubscribed ? (
                currentUser.isAdmin ? (
                    <Predictions language={language} isAdmin={true} />
                ) : (
                    <PredictionsMember language={language} />
                )
            ) : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Archives]: isSubscribed ? <Archives archives={archivedAnalyses} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Strategy]: isSubscribed ? <Strategy language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
            [DashboardNav.Bankroll]: <BankrollManagement />,
            [DashboardNav.Subscription]: <Subscription isSubscribed={isSubscribed} onSubscribe={onSubscribe} onCancel={onCancelSubscription} language={language} onNavigateToFaq={() => onNavigate(Page.FAQ)} />,
            [DashboardNav.Profile]: <Profile />,
            [DashboardNav.Support]: <Support language={language} setActivePage={setActivePage} onNavigateToFaq={() => onNavigate(Page.FAQ)} onNavigateToContact={() => onNavigate(Page.Contact)} />,
            [DashboardNav.LiveScores]: isSubscribed ? <Analyzer language={language} onNewAnalysis={handleNewAnalysis} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Subscription)} />,
        };
        return pageMapping[activePage] || pageMapping[DashboardNav.DashboardHome];
    }

    return (
        <div className="flex min-h-screen bg-brand-bg pt-24 lg:pt-32">
            <DashboardSidebar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                isSidebarOpen={isSidebarOpen}
                setSidebarOpen={setSidebarOpen}
                language={language}
                currentUser={currentUser}
            />

            <div className="flex-1 md:ml-72 transition-all duration-300">
                <main className="p-4 sm:p-8 lg:p-12">
                    <div className="max-w-[1200px] mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;