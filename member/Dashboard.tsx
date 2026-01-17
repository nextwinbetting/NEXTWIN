import React, { useState } from 'react';
import Predictions from './Predictions';
import Analyzer from './Analyzer';
import BankrollManagement from './BankrollManagement';
import Archives from './Archives';
import Subscription from './Subscription';
import Profile from './Profile';
import LockedFeature from './LockedFeature';
import Strategy from './Strategy';
import DashboardHome from './DashboardHome';
import Support from './Support';
import DashboardSidebar from './DashboardSidebar';
import { Language, DashboardNav } from '../types';
import { ArchivedAnalysis, AnalysisResult } from '../types';

interface DashboardProps {
    language: Language;
    isSubscribed: boolean;
    onSubscribe: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ language, isSubscribed, onSubscribe }) => {
    const [activePage, setActivePage] = useState<DashboardNav>(DashboardNav.DashboardHome);
    const [archives, setArchives] = useState<ArchivedAnalysis[]>([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleNewAnalysis = (analysisData: { result: AnalysisResult; sport: string; team1: string; team2: string; betType: string; }) => {
        const newArchiveEntry: ArchivedAnalysis = {
            id: Date.now().toString(),
            ...analysisData.result,
            sport: analysisData.sport,
            team1: analysisData.team1,
            team2: analysisData.team2,
            betType: analysisData.betType,
            analysisDate: new Date().toLocaleDateString('fr-FR'),
        };
        setArchives(prev => [newArchiveEntry, ...prev]);
    };
    
    const renderContent = () => {
        const pageMapping: { [key in DashboardNav]: React.ReactNode } = {
            [DashboardNav.DashboardHome]: <DashboardHome setActivePage={setActivePage} language={language} />,
            [DashboardNav.Predictions]: isSubscribed ? <Predictions language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Profile)} />,
            [DashboardNav.Analyzer]: isSubscribed ? <Analyzer language={language} onNewAnalysis={handleNewAnalysis} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Profile)} />,
            [DashboardNav.Strategy]: isSubscribed ? <Strategy language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage(DashboardNav.Profile)} />,
            [DashboardNav.Bankroll]: <BankrollManagement />,
            [DashboardNav.Archives]: <Archives archives={archives} />,
            [DashboardNav.Profile]: <Profile />,
            [DashboardNav.Support]: <Support language={language} />,
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
            />

            <div className="flex-1 md:ml-64 transition-all duration-300">
                 {/* Mobile Header */}
                <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-brand-dark-blue/80 backdrop-blur-sm border-b border-gray-800">
                    <span className="text-white font-bold">NEXTWIN</span>
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