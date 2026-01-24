
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prediction, Sport, Language } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'nextwin_daily_predictions';
const CACHE_EXPIRATION = 12 * 60 * 60 * 1000; // 12 heures

const mapStringToSport = (sport: string): Sport => {
    const s = sport.toUpperCase();
    if (s.includes('BASKET')) return Sport.Basketball;
    if (s.includes('TENNIS')) return Sport.Tennis;
    return Sport.Football;
};

const formatMatchDateTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) throw new Error();
        return {
            dateStr: date.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
            timeStr: date.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' })
        };
    } catch {
        return { dateStr: '--.--.----', timeStr: '--:--' };
    }
};

const Predictions: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<{message: string, isQuota: boolean} | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    const fetchPredictions = useCallback(async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);

        // 1. Vérifier le cache
        if (!forceRefresh) {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_EXPIRATION) {
                    setPredictions(data);
                    setIsLoading(false);
                    return;
                }
            }
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `Générer 6 pronostics sportifs RÉELS (2 Football, 2 Basketball, 2 Tennis) pour aujourd'hui et demain.
            Sources à consulter : SofaScore, Flashscore, WhoScored.
            Format JSON STRICT :
            {
              "predictions": [
                {
                  "sport": "Football",
                  "league": "Premier League",
                  "match": "Team A vs Team B",
                  "betType": "Victoire Team A",
                  "matchDateTimeUTC": "2025-05-20T20:00:00Z",
                  "probability": 78,
                  "analysis": "Analyse basée sur xG et forme récente."
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.2
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Réponse Engine malformée.");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => {
                const { dateStr, timeStr } = formatMatchDateTime(p.matchDateTimeUTC);
                return {
                    id: `${i}-${Date.now()}`,
                    sport: mapStringToSport(p.sport),
                    match: p.match,
                    betType: p.betType,
                    date: dateStr,
                    time: timeStr,
                    probability: p.probability,
                    analysis: `[${p.league}] ${p.analysis}`,
                    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                        uri: c.web?.uri,
                        title: c.web?.title
                    })).filter((s: any) => s.uri).slice(0, 3) || []
                };
            });

            setPredictions(formatted);
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: formatted, timestamp: Date.now() }));
            
        } catch (err: any) {
            console.error("Fetch Error:", err);
            const isQuota = err.message?.includes('429') || JSON.stringify(err).includes('429');
            setError({
                message: isQuota 
                    ? "Limite de quota API atteinte. Le serveur se réinitialise..." 
                    : "Erreur de synchronisation Engine.",
                isQuota
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchPredictions(); }, [fetchPredictions]);

    const filtered = useMemo(() => 
        activeSport === 'ALL' ? predictions : predictions.filter(p => p.sport === activeSport)
    , [activeSport, predictions]);

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white tracking-tight italic uppercase italic tracking-tighter">PRONOSTICS IA TEMPS RÉEL</h1>
                <p className="mt-4 text-brand-light-gray text-[10px] uppercase tracking-[0.3em] font-black">{t.predictions_subtitle}</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative mb-8">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-orange-500"></div>
                    </div>
                    <p className="text-white font-black text-xs tracking-[0.5em] uppercase animate-pulse">Sync avec SofaScore & Flashscore...</p>
                </div>
            ) : error ? (
                <div className="text-center bg-brand-card border border-red-500/20 rounded-2xl p-12 max-w-2xl mx-auto shadow-2xl backdrop-blur-xl">
                     <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">
                        {error.isQuota ? "QUOTA API ÉPUISÉ" : "SYNCHRONISATION INTERROMPUE"}
                     </h3>
                     <p className="text-gray-400 text-xs mb-8 leading-relaxed max-w-sm mx-auto uppercase tracking-widest">
                        {error.isQuota 
                          ? "Votre clé API gratuite a atteint sa limite journalière. Veuillez activer la facturation (Billing) dans Google AI Studio ou patienter."
                          : "Le flux de données sportives est temporairement indisponible."}
                     </p>
                     <button onClick={() => fetchPredictions(true)} className="bg-gradient-brand px-10 py-4 rounded-lg font-black text-white text-xs uppercase tracking-widest hover:scale-105 transition-all">
                        TENTER UNE RECONNEXION
                     </button>
                     <p className="mt-8 text-[9px] text-gray-700 font-mono">STATUS: QUOTA_429_LIMIT_REACHED</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center gap-3 mb-12 flex-wrap">
                        {['ALL', ...Object.values(Sport)].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border ${activeSport === s ? 'bg-gradient-brand text-white border-transparent shadow-xl' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white'}`}>
                                {s === 'ALL' ? 'TOUS LES MATCHS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default Predictions;
