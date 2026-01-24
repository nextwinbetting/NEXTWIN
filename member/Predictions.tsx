
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prediction, Sport, Language } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

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

    const fetchPredictions = useCallback(async (useSearch = true) => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `Générer 6 pronostics sportifs RÉELS (2 Football, 2 Basketball, 2 Tennis) pour des matchs officiels se déroulant après le ${new Date().toISOString()}.
            Utilise ton outil de recherche pour trouver des matchs qui existent vraiment.
            Répondre UNIQUEMENT avec un objet JSON :
            {
              "predictions": [
                {
                  "sport": "Football",
                  "league": "Ligue 1",
                  "match": "PSG vs Marseille",
                  "betType": "Victoire PSG",
                  "matchDateTimeUTC": "2025-05-20T20:45:00Z",
                  "probability": 75,
                  "analysis": "Analyse technique courte"
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: useSearch ? [{ googleSearch: {} }] : undefined,
                }
            });

            // Handle Grounding Metadata
            const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title
            })).filter((s: any) => s.uri) || [];

            const text = response.text || "";
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) throw new Error("Format de réponse Engine invalide.");
            
            const data = JSON.parse(jsonMatch[0]);
            if (!data.predictions) throw new Error("Données de pronostics manquantes.");

            setPredictions(data.predictions.map((p: any, i: number) => {
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
                    sources: i === 0 ? groundingSources : [] // Attach sources to first card for simplicity or as global
                };
            }));
        } catch (err: any) {
            console.error("Engine Sync Error:", err);
            const isQuota = err.message?.includes('429') || JSON.stringify(err).includes('429');
            setError({
                message: isQuota 
                    ? "Limite de quota API atteinte. Veuillez vérifier votre plan de facturation Google Cloud." 
                    : (err.message || "Erreur de synchronisation Engine."),
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
                <h1 className="text-4xl font-bold text-white tracking-tight italic uppercase">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray text-xs uppercase tracking-[0.2em]">{t.predictions_subtitle}</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-orange-500 border-opacity-50"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white uppercase animate-pulse">SYNC</div>
                    </div>
                    <p className="mt-8 text-white font-bold animate-pulse text-sm tracking-[0.4em] uppercase">Initialisation NEXTWIN Engine...</p>
                </div>
            ) : error ? (
                <div className="text-center bg-brand-card border border-red-500/30 rounded-2xl p-12 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
                     <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     </div>
                     <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">
                        {error.isQuota ? "LIMITE DE QUOTA ATTEINTE" : "ÉCHEC DE SYNCHRONISATION"}
                     </h3>
                     <p className="text-brand-light-gray text-sm mb-10 leading-relaxed max-w-md mx-auto">
                        {error.isQuota 
                          ? "Votre clé API Gemini a épuisé son quota actuel. Veuillez passer à un plan payant ou attendre la réinitialisation de votre quota dans Google AI Studio."
                          : "Le moteur NEXTWIN n'a pas pu authentifier les flux de données sportives en temps réel."}
                     </p>
                     <button onClick={() => fetchPredictions()} className="bg-gradient-brand px-12 py-5 rounded-lg font-black text-white uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/20">
                        RÉESSAYER LA CONNEXION
                     </button>
                     <p className="text-[10px] mt-10 text-gray-700 font-mono select-all uppercase">LOG_STATUS_429: QUOTA_EXCEEDED_CHECK_BILLING</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center gap-3 mb-12 flex-wrap">
                        {['ALL', ...Object.values(Sport)].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-6 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest border ${activeSport === s ? 'bg-gradient-brand text-white border-transparent shadow-xl ring-2 ring-orange-500/20' : 'bg-brand-dark border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white'}`}>
                                {s === 'ALL' ? 'Tous les sports' : s}
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
