
import React from 'react';
import { Prediction, Sport } from '../types';

const SportIcon: React.FC<{ sport: any }> = ({ sport }) => {
    const s = (sport || 'Football').toString().toUpperCase();
    if (s.includes('FOOT')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>;
    if (s.includes('BASKET')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/></svg>;
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const isVeryHigh = prob >= 85;
    const confidence = isVeryHigh ? 'TRÈS ÉLEVÉE' : 'ÉLEVÉE';
    const confidenceColor = isVeryHigh ? 'text-green-400' : 'text-emerald-500';

    return (
        <div className="bg-[#171717]/80 border border-white/5 rounded-[2.5rem] p-10 flex flex-col h-full space-y-8 transition-all duration-700 hover:bg-gray-800/80 group relative overflow-hidden shadow-2xl backdrop-blur-xl hover:border-orange-500/40 transform hover:-translate-y-2">
            
            {/* Confirmation Badge */}
            <div className="absolute top-8 right-10">
                <div className="bg-gray-900/80 border border-white/5 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-2xl">
                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest italic">CONFIRMÉ</span>
                </div>
            </div>

            {/* Date & Time Section */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-orange-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] italic">{prediction.date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-orange-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round"/></svg>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] italic">{prediction.time}</span>
                </div>
            </div>

            {/* Competition & Sport */}
            <div className="flex items-center justify-between">
                <div className="bg-gray-900 border border-white/10 px-6 py-2 rounded-xl">
                    <span className="text-white/80 text-[10px] font-black tracking-[0.3em] uppercase italic">
                        {prediction.competition}
                    </span>
                </div>
                <div className="text-gray-700 group-hover:text-orange-500 transition-colors duration-700 transform group-hover:scale-110">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            {/* Match Name */}
            <div className="space-y-4">
                <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-[1.1] group-hover:text-orange-500 transition-colors duration-700">
                    {prediction.match}
                </h3>
                <div className="flex items-center gap-4">
                    <div className="h-6 w-1.5 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.6)]"></div>
                    <p className="text-sm font-black text-white uppercase italic tracking-[0.1em]">
                        {prediction.betType}
                    </p>
                </div>
            </div>

            {/* Reliability (ProgressBar) */}
            <div className="pt-4">
                <div className="flex justify-between items-end mb-4">
                    <div className="flex items-center gap-3">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] italic">FIABILITÉ</p>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-md border border-white/5 uppercase italic ${confidenceColor} bg-white/[0.03]`}>
                            {confidence}
                        </span>
                    </div>
                    <span className="text-white font-black text-3xl tracking-tighter italic">{prob}%</span>
                </div>
                <div className="h-2.5 bg-gray-900/50 rounded-full overflow-hidden border border-white/5 backdrop-blur-md">
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-[1.5s] ease-out" 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>

            {/* Analysis Flash */}
            <div className="pt-10 border-t border-white/5">
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.6em] mb-4 italic">ANALYSE FLASH</p>
                <div className="bg-black/40 p-6 rounded-[1.5rem] border border-white/5 relative group-hover:border-orange-500/20 transition-all duration-700">
                    <p className="text-[13px] text-gray-400 leading-relaxed font-bold italic">
                        "{prediction.analysis}"
                    </p>
                </div>
            </div>

            {/* Subtle Gradient Shadow */}
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity"></div>
        </div>
    );
};

export default PredictionCard;
