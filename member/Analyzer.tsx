
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
    } catch { return { dateStr: '--.--.----', timeStr: '--:--' }; }
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
        setLoading(true); setError(null); setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `[ROLE: SPORTS DATA SCIENTIST]
            ANALYSE : ${team1} vs ${team2} (${sport}).
            
            1. Vérifie l'état actuel sur SofaScore/Whoscored.
            2. Analyse les 5 derniers H2H, xG moyens, absents majeurs.
            3. Si le match est passé, indique-le dans "analysis".

            FORMAT JSON :
            {
              "analysis": "Analyse ultra-précise des dynamiques.",
              "probability": 1-100,
              "keyData": ["Point A", "Point B", "Stat C"],
              "recommendedBet": "Le pari à forte valeur",
              "recommendationReason": "Cause tactique principale",
              "matchDateTimeUTC": "ISO_TIMESTAMP"
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Flux Engine saturé.");
            
            const data = JSON.parse(jsonMatch[0]);
            const { dateStr, timeStr } = formatMatchDateTime(data.matchDateTimeUTC);
            
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                uri: c.web?.uri, title: c.web?.title
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
            setError("Synchronisation échouée. L' Engine n'a pas pu identifier ces équipes.");
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-20">
            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-1 rounded-full mb-4">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest italic">V10 ELITE ANALYZER ACTIVE</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">SCANNER HAUTE FIDÉLITÉ</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-brand-card border border-white/5 rounded-3xl p-8 space-y-6 shadow-2xl backdrop-blur-md">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Configuration du Scan</label>
                        <select value={sport} onChange={e => setSport(e.target.value as any)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white text-[11px] font-black focus:border-orange-500 outline-none uppercase tracking-widest transition-all">
                            <option>Football</option><option>Basketball</option><option>Tennis</option>
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="DOMICILE" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-white text-[11px] font-bold focus:border-orange-500 outline-none uppercase placeholder:text-gray-700" />
                            <input placeholder="EXTÉRIEUR" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-white text-[11px] font-bold focus:border-orange-500 outline-none uppercase placeholder:text-gray-700" />
                        </div>
                    </div>
                    <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-brand py-5 rounded-xl font-black text-white shadow-xl disabled:opacity-50 text-[10px] tracking-[0.2em] uppercase italic transition-all hover:scale-[1.02] active:scale-95">
                        {loading ? "EXTRACTION DES VARIABLES..." : "LANCER LE SCAN V10"}
                    </button>
                    {error && <p className="text-red-500 text-[10px] text-center font-black uppercase bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</p>}
                </div>

                <div className="bg-brand-card border border-white/5 rounded-3xl p-8 min-h-[450px] flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-md">
                    {loading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-6"></div>
                            <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.4em] animate-pulse">Sourcing Gemini 3 Pro...</span>
                        </div>
                    ) : result ? (
                        <div className="w-full z-10 animate-fade-in">
                            <div className="text-center mb-10">
                                <p className="text-[9px] uppercase text-gray-500 tracking-[0.4em] mb-4 font-black italic">PROBABILITÉ CERTIFIÉE</p>
                                <p className="text-8xl font-black text-white tracking-tighter">{result.probability}%</p>
                                <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mt-4 inline-block">Coup d'envoi : {result.matchDate} - {result.matchTime}</span>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-2xl text-center mb-8">
                                <p className="text-white font-black text-2xl tracking-tighter uppercase italic">{result.recommendedBet}</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-orange-500 pl-4">"{result.analysis}"</p>
                                <div className="grid grid-cols-2 gap-2 mt-6">
                                    {result.keyData.map((d, i) => (
                                        <div key={i} className="text-[9px] bg-gray-900 border border-gray-800 p-2 rounded-lg text-gray-300 font-black uppercase truncate italic">• {d}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-10">
                            <p className="text-brand-light-gray text-[11px] uppercase tracking-[0.8em] font-black italic">Moteur en attente de flux</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
