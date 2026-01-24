
import React from 'react';
import { Prediction, Sport } from '../types';

const SportIcon: React.FC<{ sport: any }> = ({ sport }) => {
    const s = (sport || 'Football').toString().toUpperCase();
    if (s.includes('FOOT')) return (
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>
        </div>
    );
    if (s.includes('BASKET')) return (
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>
        </div>
    );
    return (
        <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/></svg>
        </div>
    );
}

const PredictionCard: React.FC<{ prediction: Prediction; isBonus?: boolean }> = ({ prediction, isBonus }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const isVeryHigh = prob >= 85;
    const confidenceLabel = isVeryHigh ? 'TRÈS ÉLEVÉE' : 'ÉLEVÉE';
    const confidenceColor = isVeryHigh ? 'text-green-400' : 'text-emerald-400';

    return (
        <div className="bg-[#110f1f] border border-white/5 rounded-[2.5rem] p-8 lg:p-10 flex flex-col h-full space-y-8 transition-all duration-500 hover:bg-gray-900/40 group relative overflow-hidden shadow-2xl backdrop-blur-xl hover:border-orange-500/20 shadow-black/50">
            
            {/* Top Row: Info & Status */}
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                         <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2.5" strokeLinecap="round"/></svg>
                         <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{prediction.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5" strokeLinecap="round"/></svg>
                         <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic">{prediction.time}</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {isBonus && (
                        <span className="bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md italic">PACK BONUS</span>
                    )}
                    <div className="bg-gray-900/80 border border-white/5 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[8px] font-black text-white/70 uppercase tracking-widest italic">CONFIRMÉ</span>
                    </div>
                </div>
            </div>

            {/* Sport & League */}
            <div className="flex items-center justify-between">
                <div className="bg-gray-800/40 border border-white/5 px-4 py-1.5 rounded-lg">
                    <span className="text-white text-[9px] font-black tracking-widest uppercase italic">{prediction.competition}</span>
                </div>
                <div className="text-gray-500 group-hover:text-orange-500 transition-colors duration-500">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            {/* Match & Bet */}
            <div className="space-y-4">
                <h3 className="text-2xl lg:text-[26px] font-black text-white italic tracking-tighter uppercase leading-[1.15]">
                    {prediction.match}
                </h3>
                <div className="flex items-start gap-3">
                    <div className="h-5 w-1.5 bg-orange-500 rounded-full mt-0.5"></div>
                    <p className="text-[13px] font-black text-white uppercase italic tracking-wide">
                        {prediction.betType}
                    </p>
                </div>
            </div>

            {/* Reliability Progress */}
            <div className="pt-2">
                <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-2">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] italic">FIABILITÉ</p>
                        <span className={`text-[8px] font-black uppercase italic ${confidenceColor}`}>
                            {confidenceLabel}
                        </span>
                    </div>
                    <span className="text-white font-black text-3xl tracking-tighter italic">{prob}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-[2s] ease-out" 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>

            {/* Flash Analysis Box */}
            <div className="pt-6 border-t border-white/5">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mb-4 italic">ANALYSE FLASH</p>
                <div className="bg-gray-900/30 p-5 rounded-2xl border border-white/5">
                    <p className="text-[12px] text-gray-400 leading-relaxed font-bold italic">
                        "{prediction.analysis}"
                    </p>
                </div>
            </div>

            {/* Decorative Subtle Light */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500/5 rounded-full blur-[60px] pointer-events-none"></div>
        </div>
    );
};

export default PredictionCard;
