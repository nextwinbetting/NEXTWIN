import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prediction, Sport, Language } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");
    return new GoogleGenAI({ apiKey });
};

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
    const [error, setError] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    const fetchPredictions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Générer 6 pronostics sportifs réels (2 Football, 2 Basketball, 2 Tennis) pour des matchs après ${new Date().toISOString()}. Vérifie les horaires sur Flashscore via Google Search. 
                Répondre UNIQUEMENT avec un objet JSON au format suivant sans texte autour :
                {
                  "predictions": [
                    {
                      "sport": "Football",
                      "league": "Ligue 1",
                      "match": "Equipe A vs Equipe B",
                      "betType": "Victoire Equipe A",
                      "matchDateTimeUTC": "2025-05-20T20:45:00Z",
                      "probability": 75,
                      "analysis": "Texte d'analyse..."
                    }
                  ]
                }`,
                config: {
                    tools: [{ googleSearch: {} }]
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format de réponse invalide");
            
            const data = JSON.parse(jsonMatch[0]);
            if (!data.predictions) throw new Error("Données manquantes");

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
                    analysis: `[${p.league}] ${p.analysis}`
                };
            }));
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Erreur de connexion");
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
                <h1 className="text-4xl font-bold text-white">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray">{t.predictions_subtitle}</p>
                 <button onClick={fetchPredictions} className="mt-6 inline-flex items-center text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    RAFRAÎCHIR LES FLUX
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mb-4"></div>
                    <p className="text-white font-medium animate-pulse text-sm tracking-widest uppercase">Analyse des flux en cours...</p>
                </div>
            ) : error ? (
                <div className="text-center bg-brand-card border border-red-500/20 rounded-xl p-12">
                     <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                     <h3 className="text-xl font-bold text-white mb-2">Erreur Engine</h3>
                     <p className="text-brand-light-gray text-sm mb-6 max-w-xs mx-auto">Impossible de synchroniser les données réelles pour le moment. Veuillez patienter 60s.</p>
                     <button onClick={fetchPredictions} className="bg-gradient-brand px-8 py-3 rounded-md font-bold text-white text-sm">RÉESSAYER</button>
                </div>
            ) : (
                <>
                    <div className="flex justify-center gap-2 mb-8 flex-wrap">
                        {['ALL', ...Object.values(Sport)].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest ${activeSport === s ? 'bg-gradient-brand text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                                {s === 'ALL' ? 'Tous' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </>
            )}
        </div>
    );
};

export default Predictions;