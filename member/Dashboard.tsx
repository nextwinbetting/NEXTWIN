import React, { useState } from 'react';
import Predictions from './Predictions';
import Analyzer from './Analyzer';
import BankrollManagement from './BankrollManagement';
import Archives from './Archives';
import Subscription from './Subscription';
import Profile from './Profile';
import LockedFeature from './LockedFeature';
import Strategy from './Strategy';
import { Language } from '../types';
import { translations } from '../translations';
import { ArchivedAnalysis, AnalysisResult } from '../types';

type DashboardPage = 'Pronostics' | 'Stratégie' | 'Analyseur' | 'Bankroll' | 'Archives' | 'Abonnement' | 'Profil';

interface DashboardProps {
    language: Language;
    isSubscribed: boolean;
    onSubscribe: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ language, isSubscribed, onSubscribe }) => {
    const [activePage, setActivePage] = useState<DashboardPage>('Pronostics');
    const [archives, setArchives] = useState<ArchivedAnalysis[]>([]);
    const t = translations[language];

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
    
    const pageMapping: { [key in DashboardPage]: React.ReactNode } = {
        'Pronostics': isSubscribed ? <Predictions language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage('Abonnement')} />,
        'Stratégie': isSubscribed ? <Strategy language={language} /> : <LockedFeature language={language} onNavigate={() => setActivePage('Abonnement')} />,
        'Analyseur': isSubscribed ? <Analyzer language={language} onNewAnalysis={handleNewAnalysis} /> : <LockedFeature language={language} onNavigate={() => setActivePage('Abonnement')} />,
        'Bankroll': <BankrollManagement />,
        'Archives': <Archives archives={archives} />,
        'Abonnement': <Subscription isSubscribed={isSubscribed} onSubscribe={onSubscribe} language={language} />,
        'Profil': <Profile />
    };

    const navItems: { key: DashboardPage; label: string }[] = [
        { key: 'Pronostics', label: t.dash_nav_predictions },
        { key: 'Stratégie', label: t.dash_nav_strategy },
        { key: 'Analyseur', label: t.dash_nav_analyzer },
        { key: 'Bankroll', label: t.dash_nav_bankroll },
        { key: 'Archives', label: t.dash_nav_archives },
        { key: 'Abonnement', label: t.dash_nav_subscription },
        { key: 'Profil', label: t.dash_nav_profile },
    ];


    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center mb-8 border-b border-gray-800">
                <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2" aria-label="Tabs">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActivePage(item.key)}
                            className={`${
                                activePage === item.key
                                    ? 'border-orange-500 text-white'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                            } whitespace-nowrap py-4 px-2 sm:px-4 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {pageMapping[activePage]}
            </div>
        </div>
    );
};

export default Dashboard;