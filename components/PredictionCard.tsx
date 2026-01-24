
import React from 'react';
import { Prediction } from '../types';

const SportIcon: React.FC<{ sport: any }> = ({ sport }) => {
    const s = (sport || 'Football').toString().toUpperCase();
    if (s.includes('FOOT')) return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>;
    if (s.includes('BASKET')) return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/></svg>;
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const confidence = prob >= 85 ? 'VERY HIGH' : 'HIGH';
    const confidenceColor = prob >= 85 ? 'bg-green-600' : 'bg-green-800/60';

    return (
        <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-6 flex flex-col h-full space-y-4 transition-all duration-500 hover:border-orange-500/50 hover:bg-gray-800/40 group relative overflow-hidden shadow-2xl">
            {/* Header: Date & Time */}
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                        <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round"/></svg>
                        {prediction.date}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                        <svg className="w-3 h-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round"/></svg>
                        {prediction.time}
                    </div>
                </div>
                <div className="text-orange-500 group-hover:rotate-12 transition-transform">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            {/* Confidence Badge */}
            <div className="pt-2">
                 <span className={`${confidenceColor} text-white px-3 py-1 rounded-full text-[8px] font-black tracking-[0.2em] italic uppercase`}>
                    {confidence}
                </span>
            </div>

            {/* Match & Bet */}
            <div className="flex-grow">
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-orange-500 transition-colors">
                    {prediction.match}
                </h3>
                <p className="text-xs font-black text-orange-500 uppercase mt-2 italic tracking-widest">
                    {prediction.betType}
                </p>
            </div>

            {/* Probability Progress */}
            <div className="pt-4">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.2em]">PROBABILITÉ</p>
                    <span className="text-white font-black text-lg tracking-tighter">{prob}%</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                    <div 
                        className="h-full bg-gradient-brand transition-all duration-1000 ease-out" 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>

            {/* Analysis Block */}
            <div className="pt-4 border-t border-gray-800/50">
                <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.3em] mb-2 italic">ANALYSE FLASH</p>
                <div className="bg-brand-dark/30 p-3 rounded-xl border border-gray-800/50">
                    <p className="text-[10px] text-gray-300 leading-relaxed font-bold italic">
                        "{prediction.analysis}"
                    </p>
                </div>
            </div>

            {/* Sources Links */}
            {prediction.sources && prediction.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {prediction.sources.map((source, idx) => (
                        <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[8px] bg-brand-dark px-2 py-1 rounded-lg text-blue-400 hover:bg-blue-400 hover:text-white transition-all font-black uppercase tracking-tighter border border-gray-800 truncate max-w-[100px]"
                        >
                            {source.title || "SOURCE"}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PredictionCard;
