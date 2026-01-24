import React, { useState, useEffect } from 'react';
import { Language, AnalysisResult } from '../types';
import { translations } from '../translations';
import { GoogleGenAI, Type } from "@google/genai";

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("La clé API n'est pas configurée.");
    return new GoogleGenAI({ apiKey });
};

const formatMatchDateTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        const dateStr = date.toLocaleDateString('fr-FR', { 
            timeZone: 'Europe/Paris', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }).replace(/\//g, '.');
        
        const timeStr = date.toLocaleTimeString('fr-FR', { 
            timeZone: 'Europe/Paris', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        return { dateStr, timeStr };
    } catch (e) {
        return { dateStr: '--.--.----', timeStr: '--:--' };
    }
};

enum AnalysisStatus { Idle, Loading, Success, Error }
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
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => { setBetType(betTypesBySport[sport][0]); }, [sport, language]);

    const handleAnalyze = async () => {
        if (!team1 || !team2) { alert("Veuillez entrer les deux équipes."); return; }
        setStatus(AnalysisStatus.Loading);
        setResult(null);
        setError(null);
        
        try {
            const currentUTC = new Date().toISOString();
            const ai = getAiClient();
            
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `Analyser le match à venir entre ${team1} et ${team2} pour ${sport} (Pari: ${betType}). Référence: ${currentUTC}. Vérifie Flashscore.`,
                config: { 
                    tools: [{ googleSearch: {} }],
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            analysis: { type: Type.STRING },
                            probability: { type: Type.INTEGER },
                            keyData: { type: Type.ARRAY, items: { type: Type.STRING } },
                            recommendedBet: { type: Type.STRING },
                            recommendationReason: { type: Type.STRING },
                            matchDateTimeUTC: { type: Type.STRING }
                        },
                        required: ["analysis", "probability", "keyData", "recommendedBet", "recommendationReason", "matchDateTimeUTC"]
                    }
                },
            });
    
            const parsed = JSON.parse(response.text || '{}');
            const { dateStr, timeStr } = formatMatchDateTime(parsed.matchDateTimeUTC);
    
            const analysisResult: AnalysisResult = {
                analysis: parsed.analysis,
                probability: parsed.probability,
                keyData: parsed.keyData,
                recommendedBet: parsed.recommendedBet,
                recommendationReason: parsed.recommendationReason,
                matchDate: dateStr,
                matchTime: timeStr,
            };

            setResult(analysisResult);
            setStatus(AnalysisStatus.Success);
            onNewAnalysis({ result: analysisResult, sport, team1, team2, betType });
        } catch (err: any) {
            console.error("Analysis failed:", err);
            const isQuotaError = err.message.includes('429') || err.message.includes('quota');
            setError(isQuotaError ? "Serveur en surcharge, veuillez patienter 1 min." : (err.message || "Erreur d'analyse"));
            setStatus(AnalysisStatus.Error);
        }
    };
    
    return (
        <div>
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">Analyseur Expert</h1>
                <p className="mt-4 text-lg text-brand-light-gray">Recherche en temps réel synchronisée avec les horaires officiels.</p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <div className="bg-brand-card border border-gray-800 rounded-xl p-6 space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">1. Discipline Sportive</label>
                        <select value={sport} onChange={e => setSport(e.target.value as SportSelection)} className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500 focus:border-orange-500">
                            <option>Football</option><option>Basketball</option><option>Tennis</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">2. Équipes / Joueurs</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                             <input type="text" placeholder="Équipe 1" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500" />
                            <input type="text" placeholder="Équipe 2" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-brand-light-gray">3. Type de Pari</label>
                         <select value={betType} onChange={e => setBetType(e.target.value)} className="w-full mt-2 bg-gray-900 border border-gray-700 rounded-md p-3 text-white focus:ring-orange-500">
                            {betTypesBySport[sport].map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <button onClick={handleAnalyze} disabled={status === AnalysisStatus.Loading} className="w-full rounded-md bg-gradient-brand px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gradient-brand-hover transition-all disabled:opacity-50">
                        {status === AnalysisStatus.Loading ? "ANALYSE EN COURS..." : "LANCER L'ANALYSE"}
                    </button>
                </div>
                
                <div className="bg-brand-card border border-gray-800 rounded-xl p-6 min-h-[300px] flex items-center justify-center">
                    {status === AnalysisStatus.Idle && <div className="text-center text-brand-light-gray">Lancez une analyse pour voir les données synchronisées.</div>}
                    {status === AnalysisStatus.Loading && (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                            <p className="mt-4 text-white">Analyse et synchronisation horaires...</p>
                        </div>
                    )}
                    {status === AnalysisStatus.Success && result && (
                        <div className="text-left w-full">
                            <div className="flex justify-between items-center text-xs text-brand-light-gray mb-4 border-b border-gray-700 pb-3">
                                <div className="flex items-center space-x-2">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="3" x2="21" y1="10" /></svg>
                                   <span className="font-bold text-white">{result.matchDate}</span>
                                </div>
                                 <div className="flex items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                    <span className="font-bold text-white">{result.matchTime} (Paris)</span>
                                </div>
                            </div>
                            <div className="bg-gray-900/50 border border-orange-500/30 p-4 rounded-lg mb-6 text-center">
                                <p className="text-brand-light-gray text-xs uppercase tracking-widest">Avis Engine</p>
                                <p className="text-lg font-bold text-orange-400 mt-1">{result.recommendedBet}</p>
                            </div>
                            <div className="text-center mb-6">
                                <p className="text-brand-light-gray text-xs uppercase tracking-widest">Probabilité de réussite</p>
                                <p className={`text-6xl font-bold ${result.probability >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>{result.probability}%</p>
                            </div>
                            <div className="bg-gray-900 p-4 rounded-lg">
                                <h4 className="font-semibold text-white text-sm">Analyse Détaillée</h4>
                                <p className="text-brand-light-gray text-sm mt-2 leading-relaxed">{result.analysis}</p>
                            </div>
                        </div>
                    )}
                    {status === AnalysisStatus.Error && <div className="text-center text-red-400">Une erreur est survenue.<br/><span className="text-[12px] opacity-70 mt-2 block">{error}</span></div>}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;