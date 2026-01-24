
import React from 'react';
import { Prediction, Sport } from '../types';

const SportIcon: React.FC<{ sport: Sport }> = ({ sport }) => {
    switch (sport) {
        case Sport.Football:
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15.6 3.4-2.2 2.2"/><path d="M10.2 6.8 6.8 10.2"/><path d="m3.4 8.4 2.2 2.2"/><path d="M8.4 20.6l2.2-2.2"/><path d="m13.8 17.2 3.4-3.4"/><path d="m20.6 15.6-2.2-2.2"/><path d="m17.2 10.2 3.4-3.4"/><path d="m11.6 3.4-2.2 2.2"/><path d="M6.8 13.8l-3.4 3.4"/><path d="M3.4 11.6 5.6 9.4"/><path d="M20.6 8.4l-2.2 2.2"/><path d="M9.4 18.4l-2.2 2.2"/></svg>;
        case Sport.Basketball:
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5"/><path d="M22 12c0-4.42-2.87-8.17-6.84-9.5"/><path d="M2 12h20"/><path d="M12 22a10 10 0 0 0 10-10"/></svg>;
        case Sport.Tennis:
            return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12a5 5 0 0 0 5-5"/><path d="m12 12a5 5 0 0 1 5 5"/><path d="M12 12a5 5 0 0 0-5 5"/><path d="m12 12a5 5 0 0 1-5-5"/></svg>;
        default:
            return null;
    }
}

const getProbabilityColor = (prob: number): string => {
    if (prob >= 80) return 'bg-green-500';
    if (prob >= 70) return 'bg-lime-500';
    return 'bg-yellow-500';
};

const getBadgeText = (prob: number): string => {
    if (prob >= 80) return 'TRÈS ÉLEVÉ';
    if (prob >= 70) return 'ÉLEVÉ';
    return 'MODÉRÉ';
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    return (
        <div className="bg-brand-card border border-gray-800 rounded-xl p-5 flex flex-col h-full space-y-4 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-900/20">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center text-[10px] text-brand-light-gray space-x-2 font-black uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        <span>{prediction.date} • {prediction.time}</span>
                    </div>
                </div>
                <div className="flex items-center text-orange-400">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            <div>
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${getProbabilityColor(prediction.probability).replace('bg-', 'bg-').replace('500', '900/50')} ${getProbabilityColor(prediction.probability).replace('bg-', 'text-')}`}>{getBadgeText(prediction.probability)}</span>
            </div>

            <div className="flex-grow">
                <h3 className="text-xl font-black text-white italic tracking-tight">{prediction.match}</h3>
                <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-brand uppercase mt-1 italic">{prediction.betType}</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-brand-light-gray">
                    <span>INDICE DE CONFIANCE</span>
                    <span className="text-white">{prediction.probability}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${getProbabilityColor(prediction.probability)} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                        style={{ width: `${prediction.probability}%` }}
                    ></div>
                </div>
            </div>

            <div className="border-t border-gray-800/50 pt-3">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Analyse Engine</p>
                <p className="text-xs text-gray-300 leading-relaxed font-medium italic">"{prediction.analysis}"</p>
            </div>

            {prediction.sources && prediction.sources.length > 0 && (
                <div className="pt-2">
                    <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Sources de vérification :</p>
                    <div className="flex flex-wrap gap-1">
                        {prediction.sources.map((source, idx) => (
                            <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-[8px] bg-gray-900 border border-gray-800 px-2 py-1 rounded text-blue-500 hover:text-white transition-colors truncate max-w-[100px]">
                                {source.title || "Vérifier source"}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionCard;
