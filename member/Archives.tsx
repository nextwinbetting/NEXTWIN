
import React, { useState } from 'react';
import { ArchivedAnalysis } from '../types';

const ArchiveItem: React.FC<{ item: ArchivedAnalysis }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const probColor = item.probability >= 70 ? 'text-green-400' : item.probability >= 60 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="border-b border-gray-800 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-5 px-6 text-left hover:bg-gray-800/50 transition-colors"
                aria-expanded={isOpen}
            >
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{item.team1} vs {item.team2}</p>
                    <p className="text-sm text-brand-light-gray mt-1">
                        {item.sport} - Pari demandé : "{item.betType}"
                    </p>
                </div>
                <div className="flex items-center space-x-4 pl-4">
                    <span className="hidden sm:inline text-sm text-gray-400">{item.analysisDate}</span>
                    <svg className={`w-6 h-6 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1500px]' : 'max-h-0'}`}>
                <div className="p-6 bg-gray-900/50 border-t border-gray-800">
                    <div className="flex justify-between items-center text-xs text-brand-light-gray mb-4 border-b border-gray-700 pb-3">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                            <span>{item.matchDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            <span>{item.matchTime} (Paris)</span>
                        </div>
                    </div>

                    <div className="bg-gray-900 border border-orange-500/30 p-4 rounded-lg mb-6">
                        <h4 className="font-semibold text-white flex items-center text-base">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-orange-400"><path d="M15.09 14.09 14.09 15.09"/><path d="M12 17.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M8.5 11.5 7.5 12.5"/><path d="M12 2a10 10 0 0 1 10 10c0 .5-.1 1-.2 1.5"/><path d="m2.5 15.2.7-1.4.7 1.4"/><path d="m5.2 16 .7-1.4.7 1.4"/><path d="M2.5 19h2.8"/><path d="M5.2 19h2.8"/><path d="M4 16.8h2.5"/><path d="M12 22a10 10 0 0 1-10-10c0-.5.1-1 .2-1.5"/></svg>
                            Avis de NEXTWIN Engine
                        </h4>
                        <p className="text-lg font-bold text-orange-400 mt-2">{item.recommendedBet}</p>
                        <p className="text-brand-light-gray text-sm mt-1">{item.recommendationReason}</p>
                    </div>

                    <h3 className="text-lg font-bold text-white">Analyse du pari demandé</h3>
                    <div className="text-center my-4">
                        <p className="text-brand-light-gray text-sm">PROBABILITÉ POUR "{item.betType.toUpperCase()}"</p>
                        <p className={`text-6xl font-bold ${probColor}`}>{item.probability}%</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="font-semibold text-white">Analyse Détaillée</h4>
                        <p className="text-brand-light-gray text-sm mt-2">{item.analysis}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-white">Données Clés</h4>
                        <ul className="list-disc list-inside mt-2 text-brand-light-gray text-sm space-y-1">
                            {item.keyData.map((data, index) => <li key={index}>{data}</li>)}
                        </ul>
                    </div>
                     {item.sources && item.sources.length > 0 && (
                         <div className="mt-6 border-t border-gray-700 pt-4">
                            <h4 className="font-semibold text-white text-sm">Sources</h4>
                            <ul className="list-disc list-inside mt-2 text-blue-400 text-sm space-y-1">
                                {item.sources.map((source, index) => (
                                    <li key={index}>
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors truncate" title={source.title}>
                                            {source.title || new URL(source.uri).hostname}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const Archives: React.FC<{ archives: ArchivedAnalysis[] }> = ({ archives }) => {
    return (
        <div>
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Archives des Analyses</h1>
                <p className="mt-4 text-lg text-brand-light-gray">
                    Retrouvez l'historique de toutes les analyses que vous avez effectuées avec l'Analyseur Expert.
                </p>
            </div>

            <div className="max-w-4xl mx-auto mt-12 bg-brand-card border border-gray-800 rounded-xl overflow-hidden">
                {archives.length === 0 ? (
                    <div className="p-12 text-center text-brand-light-gray">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-600"><path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                        <h3 className="text-lg font-semibold text-white">Votre historique est vide</h3>
                        <p className="mt-1">Utilisez l'Analyseur Expert pour commencer à sauvegarder vos recherches personnelles.</p>
                    </div>
                ) : (
                    <div>
                        {archives.map(item => <ArchiveItem key={item.id} item={item} />)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archives;
