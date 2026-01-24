
import React, { useState, useEffect } from 'react';
import { Language, User } from '../types';

interface DailyPicksProps {
    language: Language;
    currentUser: User;
}

const STORAGE_IMAGE_KEY = 'NEXTWIN_DAILY_PACK_IMAGE';
const STORAGE_TIME_KEY = 'NEXTWIN_DAILY_PACK_TIME';

const DailyPicks: React.FC<DailyPicksProps> = ({ language, currentUser }) => {
    const [dailyImage, setDailyImage] = useState<string | null>(null);
    const [publishTime, setPublishTime] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const savedImg = localStorage.getItem(STORAGE_IMAGE_KEY);
        const savedTime = localStorage.getItem(STORAGE_TIME_KEY);
        if (savedImg) setDailyImage(savedImg);
        if (savedTime) setPublishTime(savedTime);
        
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_IMAGE_KEY) setDailyImage(e.newValue);
            if (e.key === STORAGE_TIME_KEY) setPublishTime(e.newValue);
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
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            setDailyImage(base64);
            setPublishTime(time);
            localStorage.setItem(STORAGE_IMAGE_KEY, base64);
            localStorage.setItem(STORAGE_TIME_KEY, time);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        if (window.confirm("Voulez-vous vraiment retirer le pack actuel de l'espace client ?")) {
            setDailyImage(null);
            setPublishTime(null);
            localStorage.removeItem(STORAGE_IMAGE_KEY);
            localStorage.removeItem(STORAGE_TIME_KEY);
        }
    };

    const downloadPack = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!dailyImage) return;
        const link = document.createElement('a');
        link.download = `NEXTWIN_PACK_V10_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
        link.href = dailyImage;
        link.click();
    };

    const todayDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

    return (
        <div className="max-w-5xl mx-auto pb-32 px-4 animate-fade-in">
            {/* Entête avec Badge Officiel */}
            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-8 py-2.5 rounded-full mb-6 backdrop-blur-xl shadow-2xl">
                    <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em] italic">PRONOSTICS OFFICIELS</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.8em] italic opacity-60">Session Analyste du {todayDate}</p>
                    {publishTime && (
                        <span className="text-[9px] font-bold text-orange-500/60 uppercase tracking-widest italic animate-pulse">Flux mis à jour à {publishTime}</span>
                    )}
                </div>
            </div>

            {/* Console de Publication Admin - Invisible pour les clients */}
            {currentUser.isAdmin && (
                <div className="mb-16 p-10 bg-[#161616] border-2 border-dashed border-orange-500/20 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="flex flex-col items-center gap-8 relative z-10">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2 italic">PUBLICATION DU PACK PNG</p>
                            <p className="text-gray-500 text-[9px] uppercase font-bold tracking-widest italic">L'image sera instantanément synchronisée chez tous les clients</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                            <label className="flex-1 cursor-pointer bg-gradient-brand text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.03] transition-all shadow-xl active:scale-95 text-center flex items-center justify-center gap-3">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                PUBLIER VOTRE IMAGE
                                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                            </label>
                            {dailyImage && (
                                <button onClick={clearImage} className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg">
                                    RETIRER
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Frame d'exposition de l'image Pack */}
            <div 
                className={`group relative bg-[#0a0a0a] rounded-[4rem] border-2 transition-all duration-1000 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isHovered && dailyImage ? 'border-orange-500/40' : 'border-white/5'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {dailyImage ? (
                    <div className="relative">
                        <div 
                            className={`cursor-zoom-in transition-transform duration-[1500ms] ease-out origin-top ${isZoomed ? 'scale-150' : 'scale-100'}`} 
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <img 
                                src={dailyImage} 
                                alt="Pack du Jour NextWin" 
                                className="w-full h-auto shadow-2xl"
                            />
                        </div>
                        
                        {/* Contrôles Interactifs Flottants */}
                        <div className={`absolute inset-x-0 bottom-12 flex justify-center gap-4 transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                             <div className="bg-black/80 backdrop-blur-3xl px-8 py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-6 pointer-events-auto">
                                <button onClick={downloadPack} className="text-[10px] font-black text-white uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-3">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    TÉLÉCHARGER PNG
                                </button>
                                <div className="w-[1px] h-4 bg-white/10"></div>
                                <button onClick={() => setIsZoomed(!isZoomed)} className="text-[10px] font-black text-white uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-3">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                                    {isZoomed ? 'VUE NORMALE' : 'ZOOM ANALYSE'}
                                </button>
                            </div>
                        </div>

                        {/* Badge de Certification IA */}
                        <div className="absolute top-8 right-8 pointer-events-none">
                             <div className="bg-black/40 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-4 shadow-xl">
                                 <div className="h-2 w-2 rounded-full bg-green-500 animate-ping"></div>
                                 <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] italic">NEXTWIN ENGINE V10 CERTIFIED</span>
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
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4 text-transparent bg-clip-text bg-gradient-brand">ANALYSE EN COURS</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] max-w-sm leading-relaxed mx-auto italic">
                            Nos algorithmes scannent les flux mondiaux. <br/>Le pack est actualisé chaque matin entre 09:00 et 11:00.
                        </p>
                    </div>
                )}
            </div>

            {/* Rappels Stratégiques */}
            <div className="mt-24 grid md:grid-cols-2 gap-12 text-center md:text-left">
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                    <h4 className="text-white font-black text-xs uppercase italic tracking-widest mb-4 flex items-center gap-3 justify-center md:justify-start">
                        <div className="h-1 w-4 bg-orange-500 rounded-full group-hover:w-8 transition-all"></div>
                        RAPPEL STRATÉGIQUE
                    </h4>
                    <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider italic">
                        Appliquez strictement la règle des 5% de mise sur chaque pronostic du pack pour une croissance de capital saine et durable.
                    </p>
                </div>
                <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                    <h4 className="text-white font-black text-xs uppercase italic tracking-widest mb-4 flex items-center gap-3 justify-center md:justify-start">
                         <div className="h-1 w-4 bg-purple-500 rounded-full group-hover:w-8 transition-all"></div>
                         CONSEIL OPTIMISATION
                    </h4>
                    <p className="text-gray-500 text-[10px] font-bold uppercase leading-relaxed tracking-wider italic">
                        Pour les cotes inférieures à 1.50, utilisez le mode "COMBINÉ X2" pour atteindre votre objectif de valeur cible par coupon.
                    </p>
                </div>
            </div>

            <div className="mt-24 text-center">
                 <div className="h-[1px] w-24 bg-gradient-brand mx-auto opacity-30 mb-8"></div>
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.8em] italic">NEXTWIN PREDICTIVE ENGINE V10 • TOUS DROITS RÉSERVÉS</p>
            </div>
        </div>
    );
};

export default DailyPicks;
