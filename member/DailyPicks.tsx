
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
        
        // Synchronisation en temps réel si plusieurs onglets sont ouverts
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
        <div className="max-w-6xl mx-auto pb-20 px-4 animate-fade-in">
            {/* Header Section - Uniquement le badge et la date */}
            <div className="text-center mb-10">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-full mb-4 backdrop-blur-md">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] italic">SESSION OFFICIELLE V10</span>
                </div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.5em] italic">Analyse du {todayDate}</p>
            </div>

            {/* Admin Controls - Totalement masqués pour les clients */}
            {currentUser.isAdmin && (
                <div className="mb-12 p-8 bg-[#1a1a1a] border-2 border-dashed border-orange-500/30 rounded-[2.5rem] flex flex-col items-center gap-6 shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest italic">PANNEAU D'ADMINISTRATION : PUBLICATION DU PACK</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4">
                        <label className="cursor-pointer bg-gradient-brand text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95">
                            SÉLECTIONNER LE PACK PNG
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        {dailyImage && (
                            <button onClick={clearImage} className="bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                RETIRER LE PACK
                            </button>
                        )}
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase italic">L'image sera immédiatement visible par tous les clients abonnés.</p>
                </div>
            )}

            {/* Content Summary Cards - Pour donner du contexte au client */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center group hover:border-orange-500/20 transition-colors">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2">SÉLECTION MAJEURE</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">6 ANALYSES ÉLITE</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center group hover:border-purple-500/20 transition-colors">
                    <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-2">OFFRE CADEAU #1</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">1 BONUS BTTS</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center group hover:border-green-500/20 transition-colors">
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-2">OFFRE CADEAU #2</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">1 BONUS POINTS</p>
                </div>
            </div>

            {/* Main Image Viewport */}
            <div 
                className={`relative bg-[#0f0f0f] rounded-[3.5rem] border-2 transition-all duration-1000 overflow-hidden shadow-2xl ${isHovered ? 'border-orange-500/40 shadow-orange-500/5' : 'border-white/5'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {dailyImage ? (
                    <div className="p-2 sm:p-6 lg:p-10">
                        <img 
                            src={dailyImage} 
                            alt="Pack du jour NextWin V10" 
                            className="w-full h-auto rounded-[2.5rem] shadow-2xl transition-transform duration-1000 transform group-hover:scale-[1.01]"
                        />
                        {/* Overlay indicatif qui apparaît au survol */}
                        <div className={`absolute inset-x-0 bottom-16 flex justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                             <div className="flex items-center gap-4 bg-black/80 backdrop-blur-2xl px-10 py-5 rounded-full border border-white/10 shadow-2xl">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-ping"></div>
                                <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">VÉRIFIÉ & CERTIFIÉ IA PAR NEXTWIN ENGINE</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-48 flex flex-col items-center justify-center opacity-30 text-center px-10">
                        <div className="relative mb-10">
                            <svg className="h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full"></div>
                        </div>
                        <p className="text-sm font-black uppercase tracking-[0.8em] italic text-white/80">Publication imminente...</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-6 max-w-xs leading-relaxed">
                            Nos algorithmes finalisent le pack. <br/>Disponibilité habituelle : 09:00 - 11:00.
                        </p>
                    </div>
                )}
                
                {/* Decorative Ambient Glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] blur-[150px] pointer-events-none rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/[0.03] blur-[150px] pointer-events-none rounded-full"></div>
            </div>

            {/* Footer de la page */}
            <div className="mt-16 text-center space-y-6">
                <div className="h-[1px] w-32 bg-gradient-brand mx-auto opacity-20"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] italic leading-relaxed px-4">
                    STRATÉGIE DE MISE CONSEILLÉE : 5% DU CAPITAL PAR PRONOSTIC
                </p>
                <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">© {new Date().getFullYear()} NEXTWIN DIGITAL TECHNOLOGIES - TOUS DROITS RÉSERVÉS</p>
            </div>
        </div>
    );
};

export default DailyPicks;
