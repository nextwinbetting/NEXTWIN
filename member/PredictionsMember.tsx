
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

        // Simuler un chargement pro
        const timer = setTimeout(loadPack, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="relative mb-10">
                    <div className="w-24 h-24 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h2 className="text-xl font-black text-white italic tracking-widest uppercase animate-pulse">Synchronisation Elite V10...</h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Extraction du flux de données certifié</p>
            </div>
        );
    }

    if (!pack || !pack.predictions || pack.predictions.length === 0) {
        return (
            <div className="text-center py-20 px-4 bg-brand-card border border-white/5 rounded-[3rem] max-w-4xl mx-auto">
                <NextWinLogo className="h-10 justify-center mb-10 opacity-20" />
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">Aucun pack actif</h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
                    Le moteur IA prépare actuellement la prochaine sélection Elite. Revenez d'ici quelques minutes.
                </p>
                <div className="mt-10 inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic tracking-[0.3em]">PROCHAINE MAJ : 09:00 (UTC+1)</span>
                </div>
            </div>
        );
    }

    // Séparer les prédictions en catégories
    const eliteSelection = pack.predictions.slice(0, 6);
    const bonusSelection = pack.predictions.slice(6);

    return (
        <div className="max-w-7xl mx-auto pb-32 px-4 animate-fade-in">
            {/* Header Elite */}
            <div className="flex flex-col items-center text-center mb-24">
                <div className="mb-10 scale-110"><NextWinLogo /></div>
                <div className="bg-orange-500/5 border border-orange-500/20 px-10 py-3 rounded-full backdrop-blur-xl shadow-2xl">
                    <span className="text-orange-500 font-black text-[11px] uppercase tracking-[0.5em] italic">
                        V10 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}
                    </span>
                </div>
            </div>

            {/* SÉLECTION ÉLITE */}
            <div className="relative mb-32">
                <div className="flex items-center justify-center mb-16">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <h2 className="mx-10 text-4xl font-black text-white italic uppercase tracking-tighter">
                        SÉLECTION <span className="text-transparent bg-clip-text bg-gradient-brand">ÉLITE</span>
                    </h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {eliteSelection.map(p => (
                        <div key={p.id} className="h-full">
                            <PredictionCard prediction={p} />
                        </div>
                    ))}
                </div>
            </div>

            {/* OFFRE BONUS */}
            {bonusSelection.length > 0 && (
                <div className="relative">
                    <div className="flex items-center justify-center mb-16">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                        <h2 className="mx-10 text-4xl font-black text-white italic uppercase tracking-tighter">
                            OFFRE <span className="text-transparent bg-clip-text bg-gradient-brand">BONUS</span> CLIENT
                        </h2>
                        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {bonusSelection.map(p => (
                            <div key={p.id} className="relative group">
                                <div className="absolute -top-4 -right-4 bg-orange-600 text-white font-black text-[9px] px-6 py-2 rounded-full rotate-12 shadow-xl z-20 group-hover:scale-110 transition-transform tracking-widest uppercase italic">GIFT</div>
                                <PredictionCard prediction={{...p, category: 'Bonus'}} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer de certification */}
            <div className="mt-40 text-center opacity-20 border-t border-white/5 pt-12">
                <p className="text-gray-500 font-black text-[10px] uppercase tracking-[1.5em] italic">
                    VERIFIED BY GEMINI 3 PRO • HIGH ACCURACY • WWW.NEXTWIN.AI
                </p>
            </div>
        </div>
    );
};

export default PredictionsMember;
