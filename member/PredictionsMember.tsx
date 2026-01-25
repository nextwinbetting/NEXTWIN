
import React, { useState, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_ACTIVE';

const PredictionsMember: React.FC<{ language: Language }> = ({ language }) => {
    const [pack, setPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPack = () => {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const store = JSON.parse(raw);
                if (store.draft) setPack(store.draft);
            }
            setIsLoading(false);
        };
        const timer = setTimeout(loadPack, 800);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh]">
                <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Mise à jour du flux...</p>
            </div>
        );
    }

    const defaultPredictions: Prediction[] = [
        { id: '1', sport: Sport.Basketball, competition: 'NBA', match: 'DALLAS MAVERICKS VS UTAH JAZZ', betType: 'DALLAS MAVERICKS -5.5', probability: 82, analysis: 'Dallas domine les Utah Jazz sur les dernières confrontations.', date: '25/01/2026', time: '01:30', category: 'Standard' },
        { id: '2', sport: Sport.Tennis, competition: 'AUSTRALIAN OPEN', match: 'CARLOS ALCARAZ VS TOMMY PAUL', betType: 'VICTOIRE CARLOS ALCARAZ', probability: 88, analysis: 'Alcaraz est en grande forme sur cette surface.', date: '25/01/2026', time: '09:00', category: 'Standard' },
        { id: '3', sport: Sport.Football, competition: 'PREMIER LEAGUE', match: 'NEWCASTLE UNITED VS ASTON VILLA', betType: 'VICTOIRE NEWCASTLE UNITED', probability: 72, analysis: 'Newcastle est solide à domicile cette saison.', date: '25/01/2026', time: '15:00', category: 'Standard' },
        { id: '4', sport: Sport.Football, competition: 'LA LIGA', match: 'FC BARCELONA VS REAL OVIEDO', betType: 'FC BARCELONA -1.5', probability: 85, analysis: 'Barcelone devrait l\'emporter largement.', date: '25/01/2026', time: '16:15', category: 'Standard' },
        { id: '5', sport: Sport.Football, competition: 'PREMIER LEAGUE', match: 'ARSENAL VS MANCHESTER UNITED', betType: 'VICTOIRE ARSENAL', probability: 75, analysis: 'Arsenal est favori dans ce choc de Premier League.', date: '25/01/2026', time: '17:30', category: 'Standard' },
        { id: '6', sport: Sport.Football, competition: 'SERIE A', match: 'JUVENTUS VS NAPOLI', betType: 'VICTOIRE JUVENTUS', probability: 70, analysis: 'Match serré mais avantage à la Juve à domicile.', date: '25/01/2026', time: '18:00', category: 'Standard' },
    ];

    const displayPredictions = (pack && pack.predictions.length > 0) ? pack.predictions : defaultPredictions;
    const standardPredictions = displayPredictions.filter(p => p.category === 'Standard');
    const bonusPredictions = displayPredictions.filter(p => p.category !== 'Standard');

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            {/* Simple Header */}
            <div className="mb-12">
                <h1 className="text-2xl font-bold text-white">Pronostics du jour</h1>
                <p className="text-gray-400 text-sm mt-1">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standardPredictions.map(p => (
                    <PredictionCard key={p.id} prediction={p} />
                ))}
            </div>

            {/* Bonus Section */}
            {bonusPredictions.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-xl font-bold text-white mb-8">Opportunités Bonus</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        {bonusPredictions.map(p => (
                            <PredictionCard key={p.id} prediction={p} isBonus />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionsMember;
