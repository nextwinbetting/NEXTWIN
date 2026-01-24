
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

    const checkStorage = () => {
        const savedImg = localStorage.getItem(STORAGE_IMAGE_KEY);
        const savedTime = localStorage.getItem(STORAGE_TIME_KEY);
        if (savedImg) setDailyImage(savedImg);
        if (savedTime) setPublishTime(savedTime);
    };

    useEffect(() => {
        checkStorage();
        window.addEventListener('storage', checkStorage);
        // Polling de sécurité toutes les 5 secondes pour les clients
        const interval = setInterval(checkStorage, 5000);
        return () => {
            window.removeEventListener('storage', checkStorage);
            clearInterval(interval);
        };
    }, []);

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
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-8 py-2.5 rounded-full mb-6 backdrop-blur-xl shadow-2xl">
                    <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.5em] italic">PRONOSTICS OFFICIELS</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.8em] italic opacity-60">Session Analyste du {todayDate}</p>
                    {publishTime && (
                        <span className="text-[9px] font-bold text-orange-500/60 uppercase tracking-widest italic animate-pulse">Mis à jour à {publishTime}</span>
                    )}
                </div>
            </div>

            {/* Image Viewer */}
            <div 
                className={`group relative bg-[#0a0a0a] rounded-[3rem] sm:rounded-[4rem] border-2 transition-all duration-1000 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] ${isHovered && dailyImage ? 'border-orange-500/40' : 'border-white/5'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {dailyImage ? (
                    <div className="relative">
                        <div 
                            className={`cursor-zoom-in transition-transform duration-[1500ms] ease-out origin-top ${isZoomed ? 'scale-150' : 'scale-100'}`} 
                            onClick={() => setIsZoomed(!isZoomed)}
                        >
                            <img src={dailyImage} alt="Pack NextWin" className="w-full h-auto" />
                        </div>
                        
                        {/* Interactive Overlay */}
                        <div className={`absolute inset-x-0 bottom-12 flex justify-center gap-4 transition-all duration-700 pointer-events-none ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                             <div className="bg-black/90 backdrop-blur-3xl px-8 py-4 rounded-full border border-white/10 shadow-2xl flex items-center gap-6 pointer-events-auto">
                                <button onClick={downloadPack} className="text-[10px] font-black text-white uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center gap-3">
                                    TÉLÉCHARGER PNG
                                </button>
                                <div className="w-[1px] h-4 bg-white/10"></div>
                                <button onClick={() => setIsZoomed(!isZoomed)} className="text-[10px] font-black text-white uppercase tracking-widest hover:text-orange-500 transition-colors">
                                    {isZoomed ? 'DÉZOOMER' : 'ZOOM ANALYSE'}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-56 flex flex-col items-center justify-center text-center px-12">
                        <div className="h-28 w-28 bg-orange-500/5 rounded-full flex items-center justify-center animate-pulse mb-8">
                             <svg className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-4">ANALYSE EN COURS</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] max-w-sm leading-relaxed mx-auto italic mb-8">
                            Actualisation entre 09:00 et 11:00 chaque matin.
                        </p>
                        <button onClick={checkStorage} className="text-[9px] font-black text-orange-500 border border-orange-500/20 px-6 py-3 rounded-full hover:bg-orange-500 hover:text-white transition-all">
                            VÉRIFIER LE FLUX MANUELLEMENT
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Strategique */}
            <div className="mt-24 text-center opacity-30">
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.8em] italic">NEXTWIN ENGINE • ACCÈS SÉCURISÉ</p>
            </div>
        </div>
    );
};

export default DailyPicks;
