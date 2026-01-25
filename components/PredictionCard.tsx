
import React from 'react';
import { Prediction } from '../types';

const PredictionCard: React.FC<{ prediction: Prediction; isBonus?: boolean }> = ({ prediction, isBonus }) => {
    if (!prediction) return null;
    
    const prob = prediction.probability || 0;
    const isVeryHigh = prob >= 80;

    return (
        <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:border-orange-500/30 group relative shadow-md">
            {/* Tag & Date */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{prediction.date} • {prediction.time}</span>
                {isBonus && (
                    <span className="bg-orange-500/10 text-orange-500 text-[9px] font-bold uppercase px-2 py-1 rounded border border-orange-500/20">Bonus</span>
                )}
            </div>

            {/* Title */}
            <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 truncate">{prediction.competition}</p>
                <h3 className="text-base font-bold text-white group-hover:text-orange-500 transition-colors leading-tight">
                    {prediction.match}
                </h3>
            </div>

            {/* Recommendation Box */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 italic">Conseil IA</p>
                <p className="text-sm font-bold text-white uppercase">{prediction.betType}</p>
            </div>

            {/* Probability Gauge */}
            <div className="mt-auto space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confiance</span>
                    <span className={`text-sm font-bold ${isVeryHigh ? 'text-emerald-400' : 'text-orange-400'}`}>{prob}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ${isVeryHigh ? 'bg-emerald-500' : 'bg-orange-500'}`} 
                        style={{ width: `${prob}%` }}
                    ></div>
                </div>
            </div>

            {/* Short Analysis */}
            <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-gray-400 leading-relaxed italic line-clamp-3">
                    "{prediction.analysis}"
                </p>
            </div>
        </div>
    );
};

export default PredictionCard;
