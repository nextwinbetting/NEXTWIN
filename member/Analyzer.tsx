import React, { useState } from 'react';
import { Language, AnalysisResult } from '../types';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

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
            // FIX: Initialized GoogleGenAI according to strict guidelines (named parameter, direct env access)
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `EXPERT ANALYSTE : ${team1} vs ${team2} (${sport}).
            Scraper SofaScore/Flashscore pour : forme (5 matchs), xG, absences.
            Réponse JSON UNIQUEMENT :
            {
              "analysis": "Analyse technique courte.",
              "probability": 75,
              "keyData": ["Stat 1", "Stat 2", "Stat 3"],
              "recommendedBet": "Le pari recommandé",
              "recommendationReason": "Cause technique",
              "matchDateTimeUTC": "${new Date().toISOString()}"
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1
                }
            });

            // FIX: Accessing text property directly (not a method) as per guidelines
            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) throw new Error("Flux Engine inaccessible.");
            
            const data = JSON.parse(jsonMatch[0]);
            const { dateStr, timeStr } = formatMatchDateTime(data.matchDateTimeUTC);
            
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                uri: c.web?.uri,
                title: c.web?.title
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
            const isQuota = err.message?.includes('429') || JSON.stringify(err).includes('429');
            setError(isQuota 
                ? "Quota API atteint. Activez le Billing Google Cloud pour un usage illimité." 
                : "Synchronisation échouée avec les serveurs de statistiques.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">ANALYSEUR EXPERT V8</h1>
                <p className="mt-2 text-brand-light-gray text-[10px] uppercase tracking-widest font-black">SCANNER WHO SCORED • SOFA SCORE • TENNIS ABSTRACT</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 space-y-6 shadow-2xl backdrop-blur-md">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Configuration du Scan</label>
                        <select value={sport} onChange={e => setSport(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-white text-xs font-bold focus:border-orange-500 outline-none uppercase">
                            <option>Football</option><option>Basketball</option><option>Tennis</option>
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="DOMICILE" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-white text-xs font-bold focus:border-orange-500 outline-none uppercase" />
                            <input placeholder="EXTÉRIEUR" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-white text-xs font-bold focus:border-orange-500 outline-none uppercase" />
                        </div>
                    </div>
                    <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-brand py-5 rounded-xl font-black text-white shadow-xl disabled:opacity-50 text-xs tracking-widest uppercase transition-all">
                        {loading ? "EXTRACTION DES FLUX..." : "LANCER L'ANALYSE IA"}
                    </button>
                    {error && <p className="text-red-500 text-[10px] text-center font-black uppercase bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</p>}
                </div>

                <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 min-h-[450px] flex items-center justify-center relative overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-6"></div>
                            <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.4em] animate-pulse">Consultation des serveurs sportifs...</span>
                        </div>
                    ) : result ? (
                        <div className="w-full z-10 animate-fade-in">
                            <div className="text-center mb-10">
                                <p className="text-[10px] uppercase text-brand-light-gray tracking-[0.4em] mb-4 font-black italic">PROBABILITÉ CALCULÉE</p>
                                <p className="text-8xl font-black text-white tracking-tighter">{result.probability}%</p>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl text-center mb-8">
                                <p className="text-white font-black text-2xl tracking-tighter uppercase italic">{result.recommendedBet}</p>
                            </div>
                            <div className="space-y-3">
                                <p className="text-xs text-gray-400 leading-relaxed italic">"{result.analysis}"</p>
                                {result.keyData.map((d, i) => (
                                    <div key={i} className="text-[10px] bg-gray-900 border border-gray-800 p-2 rounded-lg text-gray-300 font-bold uppercase">
                                        • {d}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-20">
                            <p className="text-brand-light-gray text-[10px] uppercase tracking-[0.5em] font-black">Moteur en veille</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;