
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
            // If no pack found, we might want to show defaults for the demo matching the image
            setIsLoading(false);
        };

        const timer = setTimeout(loadPack, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                <h2 className="text-xl font-black text-white italic tracking-widest uppercase animate-pulse">Chargement Elite V10...</h2>
            </div>
        );
    }

    // Default mock data to match the image exactly if no admin pack is present
    const displayPack = pack?.predictions.length ? pack : {
        predictions: [
            { id: '1', sport: Sport.Basketball, competition: 'NBA', match: 'DALLAS MAVERICKS VS UTAH JAZZ', betType: 'DALLAS MAVERICKS -5.5', probability: 82, analysis: 'Dallas à domicile possède une force de frappe offensive supérieure avec un effectif plus complet face à une équipe du Jazz en difficulté défensive.', date: '25/01/2026', time: '01:30', category: 'Standard' },
            { id: '2', sport: Sport.Tennis, competition: 'AUSTRALIAN OPEN', match: 'CARLOS ALCARAZ VS TOMMY PAUL', betType: 'VICTOIRE CARLOS ALCARAZ', probability: 88, analysis: 'En 8ème de finale de Grand Chelem, la puissance et la variété du jeu d\'Alcaraz devraient surclasser la régularité de Paul sur dur.', date: '25/01/2026', time: '09:00', category: 'Standard' },
            { id: '3', sport: Sport.Football, competition: 'PREMIER LEAGUE', match: 'NEWCASTLE UNITED VS ASTON VILLA', betType: 'VICTOIRE NEWCASTLE UNITED', probability: 72, analysis: 'À St James\' Park, l\'intensité des Magpies est souvent fatale aux visiteurs, surtout dans ce duel direct pour l\'Europe.', date: '25/01/2026', time: '15:00', category: 'Standard' },
            { id: '4', sport: Sport.Football, competition: 'LA LIGA', match: 'FC BARCELONA VS REAL OVIEDO', betType: 'FC BARCELONA -1.5 (HANDICAP ASIATIQUE)', probability: 85, analysis: 'L\'écart technique est immense entre le Barça à domicile et le promu Oviedo. Une victoire par au moins deux buts d\'écart est logique.', date: '25/01/2026', time: '16:15', category: 'Standard' },
            { id: '5', sport: Sport.Football, competition: 'PREMIER LEAGUE', match: 'ARSENAL VS MANCHESTER UNITED', betType: 'VICTOIRE ARSENAL', probability: 75, analysis: 'Arsenal, en course pour le titre, affiche une solidité collective à l\'Emirates bien supérieure à l\'inconstance chronique de United.', date: '25/01/2026', time: '17:30', category: 'Standard' },
            { id: '6', sport: Sport.Football, competition: 'SERIE A', match: 'JUVENTUS VS NAPOLI', betType: 'VICTOIRE JUVENTUS', probability: 70, analysis: 'La Juventus est impériale à Turin cette saison. Sa rigueur tactique devrait étouffer les velléités offensives du Napoli.', date: '25/01/2026', time: '18:00', category: 'Standard' },
            // Bonus
            { id: '7', sport: Sport.Basketball, competition: 'NBA', match: 'MEMPHIS GRIZZLIES VS NEW ORLEANS PELICANS', betType: 'POINTS TOTAL : PLUS DE 228.5', probability: 78, analysis: 'Deux équipes au rythme de jeu très élevé (Pace) et aux talents offensifs explosifs, favorisant un match à haut score.', date: '25/01/2026', time: '03:00', category: 'Bonus' },
            { id: '8', sport: Sport.Football, competition: 'SERIE A', match: 'AS ROMA VS AC MILAN', betType: 'LES DEUX ÉQUIPES MARQUENT (BTTS)', probability: 76, analysis: 'Le choc de la journée en Italie. Deux attaques performantes et des défenses souvent exposées dans les grands rendez-vous garantissent des buts.', date: '25/01/2026', time: '20:45', category: 'Bonus' },
        ]
    };

    const eliteSelection = displayPack.predictions.filter(p => p.category === 'Standard');
    const bonusSelection = displayPack.predictions.filter(p => p.category === 'Bonus' || p.category === 'Gift');

    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 animate-fade-in font-sans">
            {/* Main Header Capsule */}
            <div className="flex flex-col items-center text-center mb-16">
                <div className="mb-8"><NextWinLogo className="h-10 lg:h-12" /></div>
                <div className="inline-flex items-center bg-gray-900/40 border border-orange-500/30 px-8 py-2.5 rounded-full backdrop-blur-xl shadow-2xl">
                    <span className="text-orange-500 font-black text-[10px] lg:text-[12px] uppercase tracking-[0.4em] italic">
                        V10 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}
                    </span>
                </div>
            </div>

            {/* SÉLECTION ÉLITE SECTION */}
            <div className="mb-24">
                <div className="flex items-center justify-center mb-14">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-800 to-gray-700"></div>
                    <h2 className="mx-8 lg:mx-12 text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter">
                        SÉLECTION <span className="text-transparent bg-clip-text bg-gradient-brand">ÉLITE</span>
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-800 to-gray-700"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {eliteSelection.map(p => (
                        <PredictionCard key={p.id} prediction={p as any} />
                    ))}
                </div>
            </div>

            {/* OFFRE BONUS CLIENT SECTION */}
            {bonusSelection.length > 0 && (
                <div className="relative">
                    <div className="flex items-center justify-center mb-14">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gray-800 to-gray-700"></div>
                        <h2 className="mx-8 lg:mx-12 text-3xl lg:text-4xl font-black text-white italic uppercase tracking-tighter">
                            OFFRE <span className="text-transparent bg-clip-text bg-gradient-brand">BONUS</span> CLIENT
                        </h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-gray-800 to-gray-700"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
                        {bonusSelection.map(p => (
                            <div key={p.id} className="relative">
                                {/* Gift Badge Tag as seen in image */}
                                <div className="absolute -top-3 -right-3 bg-orange-600 text-white font-black text-[9px] px-5 py-2 rounded-full rotate-12 shadow-2xl z-20 tracking-widest uppercase italic">GIFT</div>
                                <PredictionCard prediction={p as any} isBonus />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Verification Footer */}
            <div className="mt-32 text-center opacity-30 border-t border-white/5 pt-12">
                <p className="text-gray-500 font-black text-[9px] lg:text-[10px] uppercase tracking-[1em] lg:tracking-[1.5em] italic">
                    VERIFIED BY GEMINI 3 PRO • HIGH ACCURACY • WWW.NEXTWIN.AI
                </p>
            </div>
        </div>
    );
};

export default PredictionsMember;
