import React, { useState, useEffect } from 'react';
import { Language, AnalysisResult } from '../types';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API_KEY_MISSING");
    return new GoogleGenAI({ apiKey });
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

const Analyzer: React.FC<{ language: Language; onNewAnalysis: (d: any) => void }> = ({ language, onNewAnalysis }) => {
    const t = translations[language];
    const [sport, setSport] = useState<'Football' | 'Basketball' | 'Tennis'>('Football');
    const [team1, setTeam1] = useState('');
    const [team2, setTeam2] = useState('');
    const [betType, setBetType] = useState(t.bet_types_football[0]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!team1 || !team2) return;
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const ai = getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Analyser le match suivant : ${team1} vs ${team2} (${sport}). Type de pari : ${betType}. Heure actuelle : ${new Date().toISOString()}. Vérifie les données réelles sur Flashscore.
                Répondre UNIQUEMENT avec un objet JSON sans texte autour :
                {
                  "analysis": "Texte détaillé...",
                  "probability": 70,
                  "keyData": ["Ligne 1", "Ligne 2"],
                  "recommendedBet": "Pari suggéré",
                  "recommendationReason": "Raison...",
                  "matchDateTimeUTC": "2025-05-20T20:45:00Z"
                }`,
                config: {
                    tools: [{ googleSearch: {} }]
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format JSON non détecté");
            
            const data = JSON.parse(jsonMatch[0]);
            const { dateStr, timeStr } = formatMatchDateTime(data.matchDateTimeUTC);
            
            // Extraction des sources obligatoires
            const groundingChunks = (response as any).candidates?.[0]?.groundingMetadata?.groundingChunks;
            const sources = groundingChunks?.map((chunk: any) => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title
            })).filter((s: any) => s.uri) || [];

            const res: AnalysisResult = {
                analysis: data.analysis,
                probability: data.probability,
                keyData: data.keyData,
                recommendedBet: data.recommendedBet,
                recommendationReason: data.recommendationReason,
                matchDate: dateStr,
                matchTime: timeStr,
                sources: sources
            };
            setResult(res);
            onNewAnalysis({ result: res, sport, team1, team2, betType });
        } catch (err: any) {
            console.error(err);
            setError("Erreur d'analyse. Réessayez dans un instant.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Analyseur Expert</h1>
                <p className="mt-2 text-brand-light-gray text-sm">Synchronisation mondiale via NEXTWIN Engine V7.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-brand-card border border-gray-800 rounded-xl p-6 space-y-6 h-fit">
                    <select value={sport} onChange={e => setSport(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white text-sm">
                        <option>Football</option><option>Basketball</option><option>Tennis</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Équipe 1" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white text-sm" />
                        <input placeholder="Équipe 2" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-md p-3 text-white text-sm" />
                    </div>
                    <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-brand py-4 rounded-md font-bold text-white shadow-lg disabled:opacity-50 text-sm tracking-widest uppercase">
                        {loading ? "CALCULS EN COURS..." : "LANCER L'ANALYSE"}
                    </button>
                    {error && <p className="text-red-400 text-[10px] text-center font-bold uppercase">{error}</p>}
                </div>

                <div className="bg-brand-card border border-gray-800 rounded-xl p-6 min-h-[400px] flex items-center justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mb-4"></div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Accès satellite...</span>
                        </div>
                    ) : result ? (
                        <div className="w-full">
                            <div className="flex justify-between text-[10px] text-brand-light-gray mb-4 border-b border-gray-800 pb-2 uppercase font-bold">
                                <span>DATE: {result.matchDate}</span>
                                <span>PARIS: {result.matchTime}</span>
                            </div>
                            <div className="text-center mb-8">
                                <p className="text-[10px] uppercase text-brand-light-gray tracking-[0.2em] mb-2">Fiabilité Estimée</p>
                                <p className="text-7xl font-black text-white">{result.probability}%</p>
                            </div>
                            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-lg text-center mb-6">
                                <p className="text-[10px] text-orange-400/70 uppercase mb-1 font-bold">Suggestion IA</p>
                                <p className="text-orange-400 font-black text-lg">{result.recommendedBet}</p>
                            </div>
                            <p className="text-xs text-brand-light-gray leading-relaxed mb-6">{result.analysis}</p>
                            
                            {result.sources && result.sources.length > 0 && (
                                <div className="border-t border-gray-800 pt-4">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Sources vérifiées :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.sources.map((s, idx) => (
                                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-400 hover:underline truncate max-w-[150px]">
                                                {s.title || "Lien source"}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-brand-light-gray text-center text-xs uppercase tracking-widest opacity-40">En attente de paramètres...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;