
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { analyzeMatch } from '../engine/nextwinEngine';
import { AnalysisResult } from '../types';

enum AnalysisStatus {
    Idle,
    Loading,
    Success,
    Error,
}

type SportSelection = 'Football' | 'Basketball' | 'Tennis';

interface AnalyzerProps {
    language: Language;
    onNewAnalysis: (analysisData: {
        result: AnalysisResult;
        sport: string;
        team1: string;
        team2: string;
        betType: string;
    }) => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ language, onNewAnalysis }) => {
    const t = translations[language];

    const betTypesBySport: Record<SportSelection, string[]> = {
        Football: t.bet_types_football,
        Basketball: t.bet_types_basketball,
        Tennis: t.bet_types_tennis,
    };
    
    const [sport, setSport] = useState<SportSelection>('Football');
    const [team1, setTeam1] = useState('');
    const [team2, setTeam2] = useState('');
    const [betType, setBetType] = useState(betTypesBySport[sport][0]);
    const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.Idle);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    
    useEffect(() => {
        // Reset bet type to the first in the list when sport changes
        setBetType(betTypesBySport[sport][0]);
    }, [sport, language]);


    const handleAnalyze = async () => {
        if (!team1 || !team2) {
            alert("Veuillez entrer les deux équipes.");
            return;
        }
        setStatus(AnalysisStatus.Loading);
        setResult(null);
        
        try {
            const analysisResult = await analyzeMatch(sport, team1, team2, betType);
            setResult(analysisResult);
            setStatus(AnalysisStatus.Success);
            onNewAnalysis({ result: analysisResult, sport, team1, team2, betType });
        } catch (error) {
            console.error("Analysis failed:", error);
            setStatus(AnalysisStatus.Error);
        }
    };
    
    const renderResult = () => {
        switch (status) {
            case AnalysisStatus.Idle:
                return <div className="text-center text-brand-light-gray">Lancez une analyse pour visualiser les probabilités.</div>;
            case AnalysisStatus.Loading:
                return (
                    <div className="text-center flex flex-col items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                        <p className="mt-4 text-white">Analyse par NEXTWIN Engine...</p>
                    </div>
                );
            case AnalysisStatus.Success:
                if (!result) return null;
                const probColor = result.probability >= 70 ? 'text-green-400' : result.probability >= 60 ? 'text-yellow-400' : 'text-red-400';
                return (
                    <div className="text-left">
                        <div className="flex justify-between items-center text-xs text-brand-light-gray mb-4 border-b border-gray-700 pb-3">
                            <div className="flex items-center space-x-2">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                <span>{result.matchDate}</span>
                            </div>
                             <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span>{result.matchTime} (Paris)</span>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 border border-orange-500/30 p-4 rounded-lg mb-6">
                            <h4 className="font-semibold text-white flex items-center text-base">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-orange-400"><path d="M15.09 14.09 14.09 15.09"/><path d="M12 17.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5Z"/><path d="M8.5 11.5 7.5 12.5"/><path d="M12 2a10 10 0 0 1 10 10c0 .5-.1 1-.2 1.5"/><path d="m2.5 15.2.7-1.4.7 1.4"/><path d="m5.2 16 .7-1.4.7 1.4"/><path d="M2.5 19h2.8"/><path d="M5.2 19h2.8"/><path d="M4 16.8h2.5"/><path d="M12 22a10 10 0 0 1-10-10c0-.5.1-1 .2-1.5"/></svg>
                                Avis de NEXTWIN Engine
                            </h4>
                            <p className="text-lg font-bold text-orange-400 mt-2">{result.recommendedBet}</p>
                            <p className="text-brand-light-gray text-sm mt-1">{result.recommendationReason}</p>
                        </div>

                        <h3 className="text-lg font-bold text-white">Analyse du pari demandé</h3>
                        <div className="text-center my-4">
                            <p className="text-brand-light-gray text-sm">PROBABILITÉ POUR "{betType.toUpperCase()}"</p>
                            <p className={`text-6xl font-bold ${probColor}`}>{result.probability}%</p>
                        </div>

                        <div className="bg-gray-900 p-4 rounded-lg">
                            <h4 className="font-semibold text-white">Analyse Détaillée</h4>
                            <p className="text-brand-light-gray text-sm mt-2">{result.analysis}</p>
                        </div>
                         <div className="mt-4">
                            <h4 className="font-semibold text-white">Données Clés</h4>
                            <ul className="list-disc list-inside mt-2 text-brand-light-gray text-sm space-y-1">
                                {result.keyData.map((item, index) => <li key={index}>{item}</li>)}
                            </ul>
                        </div>
                        
                        {result.sources && result.sources.length > 0 && (
                             <div className="mt-6 border-t border-gray-700 pt-4">
                                <h4 className="font-semibold text-white text-sm">Sources</h4>
                                <ul className="list-disc list-inside mt-2 text-blue-400 text-sm space-y-1">
                                    {result.sources.map((source, index) => (
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
                );
            case AnalysisStatus.Error:
                 return (
                    <div className="text-center flex flex-col items-center justify-center h-full text-red-400">
                         <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <h3 className="text-xl font-bold mt-4">Erreur d'Analyse</h3>
                        <p className="text-sm mt-2">NEXTWIN Engine n'a pas pu traiter cette requête. Veuillez réessayer.</p>
                        <button onClick={handleAnalyze} className="mt-6 rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover">
                           RÉESSAYER L'ANALYSE
                        </button>
                    </div>
                );
        }
    }

    return (
        <div>
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Analyseur Expert</h1>
                <p className="mt-4 text-lg text-brand-light-gray">
                    Utilisez NEXTWIN Engine pour faire vos propres recherches et analyses de matchs.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Form Section */}
                <div className="bg-brand-card border border-gray-800 rounded-xl p-6 space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">1. Discipline Sportive</label>
                        <select value={sport} onChange={e => setSport(e.target.value as SportSelection)} className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500">
                            <option>Football</option>
                            <option>Basketball</option>
                            <option>Tennis</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">2. Équipes / Joueurs</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                             <input type="text" placeholder="Équipe / Joueur 1" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                            <input type="text" placeholder="Équipe / Joueur 2" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">3. Type de Pari</label>
                         <select value={betType} onChange={e => setBetType(e.target.value)} className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500">
                            {betTypesBySport[sport].map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button onClick={handleAnalyze} disabled={status === AnalysisStatus.Loading} className="w-full rounded-md bg-gradient-brand px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        {status === AnalysisStatus.Loading ? "ANALYSE EN COURS..." : "LANCER L'ANALYSE"}
                    </button>
                </div>
                
                {/* Result Section */}
                <div className="bg-brand-card border border-gray-800 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
                    {renderResult()}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;