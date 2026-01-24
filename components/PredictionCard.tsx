
import React from 'react';
import { Prediction, Sport } from '../types';

const SportIcon: React.FC<{ sport: Sport }> = ({ sport }) => {
    const s = sport.toString().toUpperCase();
    if (s.includes('FOOT')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>;
    if (s.includes('BASKET')) return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12a5 5 0 0 0 5-5"/><path d="m12 12a5 5 0 0 1 5 5"/><path d="M12 12a5 5 0 0 0-5 5"/><path d="m12 12a5 5 0 0 1-5-5"/></svg>;
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    const isBonus = prediction.category.includes('Bonus');
    
    return (
        <div className={`bg-brand-card border-2 ${isBonus ? 'border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.15)]' : 'border-gray-800'} rounded-3xl p-6 flex flex-col h-full space-y-5 transition-all duration-500 hover:border-orange-500 group relative overflow-hidden`}>
            {isBonus && (
                <div className="absolute top-0 right-0">
                    <div className="bg-orange-500 text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest italic rounded-bl-xl shadow-lg">BONUS</div>
                </div>
            )}

            <div className="flex justify-between items-start">
                <div className="flex items-center text-[9px] text-gray-500 space-x-2 font-black uppercase tracking-[0.2em]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                    <span>{prediction.date} • {prediction.time}</span>
                </div>
                <div className="text-orange-500 group-hover:scale-110 transition-transform">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest border italic ${isBonus ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                        {prediction.category}
                    </span>
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter leading-tight group-hover:text-orange-500 transition-colors uppercase">{prediction.match}</h3>
                <p className="text-sm font-black text-transparent bg-clip-text bg-gradient-brand uppercase mt-2 italic tracking-widest">{prediction.betType}</p>
            </div>

            <div className="pt-4 border-t border-gray-800">
                <div className="flex justify-between items-end mb-3">
                    <p className="text-[9px] text-orange-500 font-black uppercase tracking-[0.3em] italic">Synthèse IA V8</p>
                    <span className="text-white font-black text-lg tracking-tighter">{prediction.probability}%</span>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-bold italic">"{prediction.analysis}"</p>
            </div>

            {prediction.sources && prediction.sources.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-4">
                    {prediction.sources.map((source, idx) => (
                        <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[8px] bg-brand-dark px-3 py-1.5 rounded-lg text-blue-400 hover:text-white transition-all truncate max-w-[120px] font-black uppercase tracking-tighter border border-gray-800">
                            {source.title || "SOURCE"}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PredictionCard;
