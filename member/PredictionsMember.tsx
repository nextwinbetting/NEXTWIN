
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
                // On affiche uniquement le pack ACTIF et VALIDÉ
                if (store.activePack && store.activePack.isValidated) {
                    setPack(store.activePack);
                }
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
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Synchronisation du flux...</p>
            </div>
        );
    }

    if (!pack) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center animate-fade-in">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-12 lg:p-20">
                    <div className="w-16 h-16 bg-gray-900 border border-white/10 rounded-2xl flex items-center justify-center text-orange-500 mx-auto mb-8 shadow-2xl">
                        <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Analyse en cours</h2>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                        Notre IA finalise les calculs de probabilités pour les matchs à venir. 
                        Revenez d'ici quelques minutes pour les derniers signaux.
                    </p>
                </div>
            </div>
        );
    }

    const standardPredictions = pack.predictions.filter(p => p.category === 'Standard');
    const bonusPredictions = pack.predictions.filter(p => p.category !== 'Standard');

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            {/* Simple Header */}
            <div className="mb-12">
                <h1 className="text-2xl font-bold text-white">Pronostics du jour</h1>
                <p className="text-gray-400 text-sm mt-1">{new Date(pack.timestamp).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
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
