
import React from 'react';
import { Prediction } from '../types';

const SportIcon: React.FC<{ sport: any }> = ({ sport }) => {
    const s = (sport || 'Football').toString().toUpperCase();
    if (s.includes('FOOT')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>;
    if (s.includes('BASKET')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/></svg>;
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const isVeryHigh = prob >= 85;
    const confidence = isVeryHigh ? 'TRÈS ÉLEVÉE' : 'ÉLEVÉE';
    const confidenceColor = isVeryHigh ? 'bg-green-600/20 text-green-500 border-green-500/30' : 'bg-green-800/20 text-green-400 border-green-800/30';

    return (
        <div className="bg-brand-card border-2 border-gray-800/50 rounded-[2.5rem] p-8 flex flex-col h-full space-y-6 transition-all duration-500 hover:border-orange-500/40 hover:bg-gray-800/60 group relative overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Background Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all"></div>

            {/* Header: Date & Time */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] italic">
                        <svg className="w-3 h-3 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round"/></svg>
                        {prediction.date}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] italic">
                        <svg className="w-3 h-3 text-orange-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round"/></svg>
                        {prediction.time}
                    </div>
                </div>
                <div className="text-gray-600 group-hover:text-orange-500 transition-colors transform group-hover:scale-110 duration-500">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            {/* Competition Badge */}
            <div className="mt-2">
                <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-xl text-[9px] font-black tracking-[0.2em] uppercase italic inline-block">
                    {prediction.competition || "LIGUE"}
                </span>
            </div>

            {/* Match & Bet */}
            <div className="flex-grow space-y-3">
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-orange-500 transition-colors duration-500">
                    {prediction.match}
                </h3>
                <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-orange-500 rounded-full"></div>
                    <p className="text-[11px] font-black text-white/80 uppercase italic tracking-[0.2em]">
                        {prediction.betType}
                    </p>
                </div>
            </div>

            {/* Probability Progress */}
            <div className="pt-2">
                <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-2">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em]">FIABILITÉ</p>
                        <span className={`${confidenceColor} text-[8px] font-black px-2 py-0.5 rounded-md`}>{confidence}</span>
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter">{prob}%</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                    <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000 ease-out" 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>

            {/* Analysis Block */}
            <div className="pt-6 border-t border-gray-800/50">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.4em] mb-3 italic">ANALYSE FLASH</p>
                <div className="bg-black/20 p-4 rounded-2xl border border-gray-800/50 relative">
                    <p className="text-[11px] text-gray-300 leading-relaxed font-bold italic">
                        "{prediction.analysis}"
                    </p>
                </div>
            </div>

            {/* Sources */}
            {prediction.sources && prediction.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 opacity-50 hover:opacity-100 transition-opacity">
                    {prediction.sources.map((source, idx) => (
                        <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[8px] bg-gray-900/50 px-2 py-1 rounded-lg text-gray-500 hover:text-orange-400 transition-all font-black uppercase tracking-tighter border border-gray-800/50 truncate max-w-[120px]"
                        >
                            {source.title || "LIVESCORE"}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PredictionCard;
