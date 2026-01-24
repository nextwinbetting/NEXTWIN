
import React from 'react';
import { Prediction } from '../types';

const SportIcon: React.FC<{ sport: any }> = ({ sport }) => {
    const s = (sport || 'Football').toString().toUpperCase();
    if (s.includes('FOOT')) return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>;
    if (s.includes('BASKET')) return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>;
    return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/></svg>;
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const isBonus = prediction.category && prediction.category.includes('Bonus');
    const isVeryHigh = prob >= 85;
    const confidence = isVeryHigh ? 'TRÈS ÉLEVÉE' : 'ÉLEVÉE';
    const confidenceColor = isVeryHigh ? 'text-green-500' : 'text-green-400';

    return (
        <div className={`bg-[#171717]/60 border ${isBonus ? 'border-orange-500/20' : 'border-white/5'} rounded-[2rem] p-8 flex flex-col h-full space-y-7 transition-all duration-500 hover:border-orange-500/30 group relative overflow-hidden shadow-2xl backdrop-blur-xl`}>
            {/* Header: Date, Time & Sport */}
            <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] italic">
                        <svg className="w-3 h-3 text-orange-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round"/></svg>
                        {prediction.date}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] italic">
                        <svg className="w-3 h-3 text-orange-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round"/></svg>
                        {prediction.time}
                    </div>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                    {isBonus && (
                        <div className="bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                            <span className="text-[7px] font-black text-orange-500 uppercase tracking-widest italic">PACK BONUS</span>
                        </div>
                    )}
                    <div className="bg-gray-900/50 border border-white/5 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest italic">CONFIRMÉ</span>
                    </div>
                </div>
            </div>

            {/* Competition & Sport */}
            <div className="flex items-center justify-between">
                <span className="bg-white/5 border border-white/5 text-gray-400 px-4 py-1.5 rounded-lg text-[8px] font-black tracking-[0.25em] uppercase italic">
                    {prediction.competition || "PRO LEAGUE"}
                </span>
                <div className="text-gray-700 group-hover:text-orange-500 transition-colors transform group-hover:scale-110 duration-500">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            {/* Match & Bet */}
            <div className="flex-grow space-y-4">
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-[1.1] group-hover:text-orange-500 transition-colors duration-500">
                    {prediction.match}
                </h3>
                <div className="flex items-center gap-3">
                    <div className="h-4 w-1 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    <p className="text-[12px] font-black text-white uppercase italic tracking-[0.1em]">
                        {prediction.betType}
                    </p>
                </div>
            </div>

            {/* Reliability Progress */}
            <div>
                <div className="flex justify-between items-end mb-2.5">
                    <div className="flex items-center gap-2">
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.4em]">FIABILITÉ</p>
                        <span className={`${confidenceColor} text-[7px] font-black uppercase tracking-widest`}>{confidence}</span>
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter">{prob}%</span>
                </div>
                <div className="h-[5px] bg-gray-900 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out" 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>

            {/* Analysis Block */}
            <div className="pt-6 border-t border-white/5">
                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.5em] mb-3 italic">ANALYSE FLASH</p>
                <div className="bg-black/10 p-5 rounded-2xl border border-white/5 relative">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-bold italic">
                        "{prediction.analysis}"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PredictionCard;
