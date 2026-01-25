
import React, { useState, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_ACTIVE';

const PredictionsMember: React.FC<{ language: Language }> = ({ language }) => {
    const [pack, setPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPack = () => {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const store = JSON.parse(raw);
                if (store.draft) {
                    setPack(store.draft);
                }
            }
            setIsLoading(false);
        };

        const timer = setTimeout(loadPack, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <div className="relative mb-6">
                    <div className="w-16 h-16 border-2 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-orange-500/5 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h2 className="text-sm font-black text-white italic tracking-[0.4em] uppercase animate-pulse">Synchronisation Elite V10...</h2>
                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-[0.3em] mt-3 italic">Chargement du flux certifié</p>
            </div>
        );
    }

    const defaultPredictions: Prediction[] = [
        { id: '1', sport: Sport.Basketball, competition: 'NBA', match: 'DALLAS MAVERICKS VS UTAH JAZZ', betType: 'DALLAS MAVERICKS -5.5', probability: 82, analysis: 'Analyse quantitative favorable à Dallas sur le segment offensif. Utah en difficulté sur la transition défensive.', date: '25/01/2026', time: '01:30', category: 'Standard' },
        { id: '2', sport: Sport.Tennis, competition: 'AUSTRALIAN OPEN', match: 'CARLOS ALCARAZ VS TOMMY PAUL', betType: 'VICTOIRE CARLOS ALCARAZ', probability: 88, analysis: 'Supériorité technique d\'Alcaraz sur surface rapide. Paul manque de solutions tactiques face à cette puissance.', date: '25/01/2026', time: '09:00', category: 'Standard' },
        { id: '3', sport: Sport.Football, competition: 'PREMIER LEAGUE', match: 'NEWCASTLE UNITED VS ASTON VILLA', betType: 'VICTOIRE NEWCASTLE UNITED', probability: 72, analysis: 'Intensité physique élevée des Magpies à domicile. Aston Villa vulnérable sur les phases de contre-attaque.', date: '25/01/2026', time: '15:00', category: 'Standard' },
        { id: '4', sport: Sport.Football, competition: 'LA LIGA', match: 'FC BARCELONA VS REAL OVIEDO', betType: 'FC BARCELONA -1.5', probability: 85, analysis: 'Différentiel de xG massif. Le Barça devrait dominer largement la possession et concrétiser ses occasions.', date: '25/01/2026', time: '16:15', category: 'Standard' },
        { id: '5', sport: Sport.Football, competition: 'PREMIER LEAGUE', match: 'ARSENAL VS MANCHESTER UNITED', betType: 'VICTOIRE ARSENAL', probability: 75, analysis: 'Cohésion tactique supérieure d\'Arsenal. United peine à stabiliser son bloc défensif face aux top teams.', date: '25/01/2026', time: '17:30', category: 'Standard' },
        { id: '6', sport: Sport.Football, competition: 'SERIE A', match: 'JUVENTUS VS NAPOLI', betType: 'VICTOIRE JUVENTUS', probability: 70, analysis: 'Solidité défensive record à Turin. Le Napoli affiche des signes de fatigue sur les dernières rotations.', date: '25/01/2026', time: '18:00', category: 'Standard' },
        { id: '7', sport: Sport.Basketball, competition: 'NBA', match: 'MEMPHIS GRIZZLIES VS NEW ORLEANS PELICANS', betType: 'POINTS TOTAL : > 228.5', probability: 78, analysis: 'Pace de jeu élevé pour les deux franchises. Probabilité forte d\'un match à haut score cumulé.', date: '25/01/2026', time: '03:00', category: 'Bonus' },
        { id: '8', sport: Sport.Football, competition: 'SERIE A', match: 'AS ROMA VS AC MILAN', betType: 'BTTS (OUI)', probability: 76, analysis: 'Dualité offensive marquée. Les deux équipes possèdent les profils pour exploiter les failles adverses.', date: '25/01/2026', time: '20:45', category: 'Bonus' },
    ];

    const displayPredictions = (pack && pack.predictions.length > 0) ? pack.predictions : defaultPredictions;
    const eliteSelection = displayPredictions.filter(p => p.category === 'Standard').slice(0, 6);
    const bonusSelection = displayPredictions.filter(p => p.category === 'Bonus' || p.category === 'Gift');

    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 lg:px-8 animate-fade-in">
            {/* Header V10 Elite */}
            <div className="flex flex-col items-center text-center mb-20">
                <div className="mb-6 transform scale-90 opacity-80"><NextWinLogo /></div>
                <div className="bg-[#1a1835]/40 border border-orange-500/10 px-8 py-2.5 rounded-full backdrop-blur-2xl shadow-xl relative overflow-hidden group">
                    <span className="text-orange-500 font-black text-[10px] lg:text-[11px] uppercase tracking-[0.5em] italic relative z-10">
                        V10 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}
                    </span>
                    <div className="absolute inset-0 bg-orange-500/5 opacity-20 animate-pulse"></div>
                </div>
            </div>

            {/* SECTION ÉLITE */}
            <div className="relative mb-24">
                <div className="flex items-center justify-center mb-12">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/5 to-white/10"></div>
                    <h2 className="mx-8 text-xl lg:text-3xl font-black text-white italic uppercase tracking-tighter">
                        FLUX <span className="text-transparent bg-clip-text bg-gradient-brand">ÉLITE</span>
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/5 to-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {eliteSelection.map(p => (
                        <PredictionCard key={p.id} prediction={p} />
                    ))}
                </div>
            </div>

            {/* SECTION BONUS */}
            {bonusSelection.length > 0 && (
                <div className="relative">
                    <div className="flex items-center justify-center mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/5 to-white/10"></div>
                        <h2 className="mx-8 text-xl lg:text-3xl font-black text-white italic uppercase tracking-tighter">
                            OPPORTUNITÉS <span className="text-transparent bg-clip-text bg-gradient-brand">BONUS</span>
                        </h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/5 to-white/10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {bonusSelection.map(p => (
                            <div key={p.id} className="relative group">
                                <div className="absolute -top-3 -right-3 bg-gradient-brand text-white font-black text-[8px] px-4 py-1.5 rounded-full rotate-12 shadow-xl z-20 group-hover:scale-110 transition-transform tracking-[0.2em] uppercase italic border border-white/20">ELITE BONUS</div>
                                <PredictionCard prediction={{...p, category: 'Bonus'}} isBonus />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Branding Footer */}
            <div className="mt-32 text-center opacity-10 border-t border-white/5 pt-12">
                <p className="text-gray-500 font-black text-[9px] uppercase tracking-[1em] italic">
                    QUANTUM VERIFIED INFRASTRUCTURE • NEXTWIN.AI
                </p>
            </div>
        </div>
    );
};

export default PredictionsMember;
