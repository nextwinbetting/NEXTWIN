
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
    if (prob >= 80) return 'VERY HIGH';
    if (prob >= 70) return 'HIGH';
    return 'MODERATE';
}

const PredictionCard: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
    return (
        <div className="bg-brand-card border border-gray-800 rounded-xl p-5 flex flex-col h-full space-y-4 transition-all duration-300 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-900/20">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center text-xs text-brand-light-gray space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        <span>{prediction.date}</span>
                    </div>
                    <div className="flex items-center text-xs text-brand-light-gray space-x-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span>{prediction.time} (Paris)</span>
                    </div>
                </div>
                <div className="flex items-center text-orange-400">
                    <SportIcon sport={prediction.sport} />
                </div>
            </div>

            <div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getProbabilityColor(prediction.probability).replace('bg-', 'bg-').replace('500', '900/50')} ${getProbabilityColor(prediction.probability).replace('bg-', 'text-')}`}>{getBadgeText(prediction.probability)}</span>
            </div>

            <div className="flex-grow">
                <h3 className="text-lg font-bold text-white">{prediction.match}</h3>
                <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-brand">{prediction.betType}</p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-brand-light-gray">PROBABILITÉ</span>
                    <span className="font-bold text-white">{prediction.probability}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${getProbabilityColor(prediction.probability)}`}
                        style={{ width: `${prediction.probability}%` }}
                    ></div>
                </div>
            </div>

            <div className="border-t border-gray-800 pt-3">
                <p className="text-xs text-brand-light-gray font-semibold">ANALYSE FLASH</p>
                <p className="text-sm text-gray-300 mt-1">{prediction.analysis}</p>
            </div>
        </div>
    );
};

export default PredictionCard;
