
import React, { useState, useEffect } from 'react';
import { Language, User } from '../types';

interface DailyPicksProps {
    language: Language;
    currentUser: User;
}

const STORAGE_IMAGE_KEY = 'NEXTWIN_DAILY_PACK_IMAGE';

const DailyPicks: React.FC<DailyPicksProps> = ({ language, currentUser }) => {
    const [dailyImage, setDailyImage] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_IMAGE_KEY);
        if (saved) setDailyImage(saved);
        
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_IMAGE_KEY) {
                setDailyImage(e.newValue);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setDailyImage(base64);
            localStorage.setItem(STORAGE_IMAGE_KEY, base64);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        if (window.confirm("Voulez-vous vraiment retirer le pack actuel de l'espace client ?")) {
            setDailyImage(null);
            localStorage.removeItem(STORAGE_IMAGE_KEY);
        }
    };

    const todayDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="max-w-5xl mx-auto pb-32 px-4 animate-fade-in">
            {/* Header Section Minimaliste */}
            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-8 py-2.5 rounded-full mb-6 backdrop-blur-xl shadow-2xl">
                    <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em] italic">PRONOSTICS OFFICIELS</span>
                </div>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.8em] italic opacity-60">Session Analyste du {todayDate}</p>
            </div>

            {/* Zone d'administration : Uniquement pour Admin */}
            {currentUser.isAdmin && (
                <div className="mb-16 p-10 bg-[#161616] border-2 border-dashed border-orange-500/20 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                    </div>
                    
                    <div className="flex flex-col items-center gap-8 relative z-10">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 italic">CONSOLE DE PUBLICATION V10</p>
                            <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest">Uploadez ici l'image générée par le scanner</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <label className="flex-1 cursor-pointer bg-gradient-brand text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:scale-95 text-center flex items-center justify-center gap-3">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                POSTER LE PACK
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                            {dailyImage && (
                                <button onClick={clearImage} className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                    DÉPUBLIER
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Grid des bénéfices client (Informations sur le contenu du pack) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { label: 'SÉLECTION ÉLITE', val: '6 ANALYSES IA', color: 'orange' },
                    { label: 'CADEAU MEMBRE', val: '1 BONUS BTTS', color: 'purple' },
                    { label: 'CADEAU MEMBRE', val: '1 TOTAL POINTS', color: 'green' }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] text-center hover:border-white/10 transition-colors shadow-xl">
                        <p className={`text-[9px] font-black text-${item.color}-500 uppercase tracking-[0.3em] mb-3 italic opacity-80`}>{item.label}</p>
                        <p className="text-xl font-black text-white italic tracking-tighter uppercase">{item.val}</p>
                    </div>
                ))}
            </div>

            {/* Frame d'exposition de l'image */}
            <div 
                className={`group relative bg-[#0a0a0a] rounded-[4rem] border-2 transition-all duration-1000 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isHovered && dailyImage ? 'border-orange-500/40' : 'border-white/5'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {dailyImage ? (
                    <div className="relative">
                        <img 
                            src={dailyImage} 
                            alt="Daily Pack NextWin" 
                            className="w-full h-auto shadow-2xl transition-transform duration-[2000ms] transform group-hover:scale-[1.01]"
                        />
                        
                        {/* Overlay indicatif luxe */}
                        <div className={`absolute inset-x-0 bottom-12 flex justify-center transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                             <div className="bg-black/60 backdrop-blur-3xl px-12 py-5 rounded-full border border-white/10 shadow-2xl flex items-center gap-6">
                                <div className="flex -space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-orange-500 animate-ping"></div>
                                    <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">VÉRIFIÉ & VALIDÉ PAR ENGINE V10</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-56 flex flex-col items-center justify-center text-center px-12">
                        <div className="relative mb-12">
                            <div className="h-28 w-28 bg-orange-500/5 rounded-full flex items-center justify-center animate-pulse">
                                <svg className="h-16 w-16 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full"></div>
                        </div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">ANALYSE EN COURS</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] max-w-sm leading-relaxed mx-auto italic">
                            Nos algorithmes scannent les flux mondiaux. <br/>Le pack est actualisé chaque matin.
                        </p>
                    </div>
                )}
                
                {/* Effets de lumière ambiante */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/[0.03] blur-[120px] pointer-events-none rounded-full"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/[0.03] blur-[120px] pointer-events-none rounded-full"></div>
            </div>

            {/* Section Aide & Stratégie */}
            <div className="mt-24 grid md:grid-cols-2 gap-12 text-center md:text-left">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                    <h4 className="text-white font-black text-xs uppercase italic tracking-widest mb-4">RAPPEL STRATÉGIQUE</h4>
                    <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider italic">
                        Appliquez strictement la règle des 5% de mise sur chaque pronostic du pack pour une croissance de capital saine.
                    </p>
                </div>
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                    <h4 className="text-white font-black text-xs uppercase italic tracking-widest mb-4">OPTIMISATION</h4>
                    <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider italic">
                        Pour les cotes inférieures à 1.50, utilisez le mode "COMBINÉ X2" pour atteindre votre objectif de valeur cible.
                    </p>
                </div>
            </div>

            {/* Footer Footer */}
            <div className="mt-24 text-center">
                 <div className="h-[1px] w-24 bg-gradient-brand mx-auto opacity-30 mb-8"></div>
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.8em] italic">NEXTWIN PREDICTIVE ENGINE V10 • ALL RIGHTS RESERVED</p>
            </div>
        </div>
    );
};

export default DailyPicks;
