import React from 'react';
import { Prediction } from '../types';

const PredictionCard: React.FC<{ prediction: Prediction; isBonus?: boolean }> = ({ prediction, isBonus }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const isVeryHigh = prob >= 80;

    return (
        <div className="glass-premium p-10 flex flex-col h-full group relative overflow-hidden transition-all duration-500 border-white/5 hover:border-brand-orange/40 rounded-[3rem]">
            {/* Soft background glow */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 blur-[80px] opacity-10 transition-all duration-700 ${isBonus ? 'bg-brand-orange' : 'bg-brand-violet'}`}></div>

            <div className="flex items-center justify-between mb-12 relative z-10">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic">{prediction.date} • {prediction.time}</span>
                <span className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl border tracking-[0.2em] italic ${isBonus ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' : 'bg-brand-violet/10 text-brand-violet border-brand-violet/20'}`}>
                    {isBonus ? 'NEURAL BONUS' : 'AI SIGNAL'}
                </span>
            </div>

            <div className="mb-12 relative z-10">
                <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] mb-4 truncate italic">{prediction.competition}</p>
                <h3 className="text-3xl font-sans font-black text-white leading-tight italic uppercase tracking-tighter">
                    {prediction.match}
                </h3>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 mb-12 relative z-10">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-2 italic">Scénario Engine</p>
                <p className="text-xl font-sans font-black text-brand-orange uppercase italic tracking-tighter">{prediction.betType}</p>
            </div>

            <div className="mt-auto flex items-end justify-between relative z-10">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] italic mb-2">FIABILITÉ IA</span>
                    <span className={`text-5xl font-sans font-black italic tracking-tighter ${isVeryHigh ? 'text-white' : 'text-gray-400'}`}>{prob}%</span>
                </div>
                <div className="w-24 h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${isBonus ? 'bg-brand-orange' : 'bg-brand-violet'}`} 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default PredictionCard;