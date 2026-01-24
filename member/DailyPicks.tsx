
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
        if (window.confirm("Supprimer le pack actuel ?")) {
            setDailyImage(null);
            localStorage.removeItem(STORAGE_IMAGE_KEY);
        }
    };

    const todayDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 animate-fade-in">
            {/* Header Section */}
            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-full mb-6 backdrop-blur-md">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] italic">PRONOSTICS OFFICIELS</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
                    PACK <span className="text-transparent bg-clip-text bg-gradient-brand">V10 ELITE</span>
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.5em] italic">Session du {todayDate}</p>
            </div>

            {/* Admin Upload Control */}
            {currentUser.isAdmin && (
                <div className="mb-12 p-8 bg-brand-card border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ESPACE ADMINISTRATION : MISE À JOUR DU FLUX</p>
                    <div className="flex gap-4">
                        <label className="cursor-pointer bg-gradient-brand text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                            UPLOADER LE PACK PNG
                            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                        </label>
                        {dailyImage && (
                            <button onClick={clearImage} className="bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                SUPPRIMER
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Content Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center">
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2">SÉLECTION MAJEURE</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">6 ANALYSES ÉLITE</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center">
                    <p className="text-[9px] font-black text-purple-500 uppercase tracking-widest mb-2">OFFRE CADEAU #1</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">1 BONUS BTTS</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl text-center">
                    <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-2">OFFRE CADEAU #2</p>
                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">1 BONUS POINTS</p>
                </div>
            </div>

            {/* Main Image Viewport */}
            <div 
                className={`relative bg-[#0f0f0f] rounded-[3.5rem] border-2 transition-all duration-700 overflow-hidden shadow-2xl ${isHovered ? 'border-orange-500/40' : 'border-white/5'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {dailyImage ? (
                    <div className="p-4 sm:p-8">
                        <img 
                            src={dailyImage} 
                            alt="Pack du jour NextWin V10" 
                            className="w-full h-auto rounded-[2rem] shadow-2xl"
                        />
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-ping"></div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">VÉRIFIÉ & CERTIFIÉ IA</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center justify-center opacity-30 text-center px-10">
                        <svg className="h-24 w-24 mb-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-black uppercase tracking-[0.8em] italic">En attente de publication...</p>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-4">Le pack est généralement publié entre 9h et 11h.</p>
                    </div>
                )}
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none"></div>
            </div>

            <div className="mt-12 text-center opacity-40">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[1em] italic leading-relaxed">
                    SUIVEZ LA STRATÉGIE DE MISE À 5% • WWW.NEXTWIN.AI
                </p>
            </div>
        </div>
    );
};

export default DailyPicks;
