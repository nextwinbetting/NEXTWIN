
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
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!team1 || !team2) return;
        setLoading(true); setError(null); setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `[ROLE: NEXTWIN NEURAL ENGINE]
            ANALYSE : ${team1} vs ${team2} (${sport}).
            
            TASK: Identify high-probability betting outcomes for 1N2, Over/Under, or Exact Scores.
            STRUCTURE: JSON
            {
              "analysis": "Precise data-based dynamics.",
              "probability": 1-100,
              "keyData": ["Variable 1", "Variable 2", "Variable 3"],
              "recommendedBet": "Specific Outcome",
              "recommendationReason": "Core tactical edge",
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
            onNewAnalysis({ result: res, sport, team1, team2, betType: "Neural Analysis" });
        } catch (err: any) {
            setError("Synchronisation échouée. L' Engine n'a pas pu identifier ces équipes.");
        } finally { setLoading(false); }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-20">
            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] italic">NEXTWIN NEURAL SCANNER ACTIVE</span>
                </div>
                <h1 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter leading-none">EXTRACTION DE <br/> <span className="text-transparent bg-clip-text bg-gradient-pro">VARIABLES.</span></h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">Configuration du Scan Engine</label>
                        <select value={sport} onChange={e => setSport(e.target.value as any)} className="w-full bg-gray-900 border border-gray-800 rounded-xl p-5 text-white text-[11px] font-black outline-none uppercase tracking-widest focus:border-orange-500 transition-all">
                            <option>Football</option><option>Basketball</option><option>Tennis</option>
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="DOMICILE" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-white text-[11px] font-bold outline-none uppercase placeholder:text-gray-700 focus:border-orange-500 transition-all" />
                            <input placeholder="EXTÉRIEUR" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-white text-[11px] font-bold outline-none uppercase placeholder:text-gray-700 focus:border-orange-500 transition-all" />
                        </div>
                    </div>
                    <button onClick={handleAnalyze} disabled={loading} className="w-full bg-gradient-brand py-6 rounded-xl font-black text-white shadow-xl disabled:opacity-50 text-[11px] tracking-[0.2em] uppercase italic transition-all hover:scale-[1.02]">
                        {loading ? "TRAITEMENT NEURAL..." : "LANCER LE SCAN ENGINE"}
                    </button>
                    {error && <p className="text-red-500 text-[10px] text-center font-black uppercase bg-red-500/10 p-4 rounded-lg border border-red-500/20">{error}</p>}
                </div>

                <div className="bg-brand-card border border-white/5 rounded-[2.5rem] p-10 min-h-[450px] flex items-center justify-center relative overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-6"></div>
                            <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.4em] animate-pulse italic">NextWin Engine v2.0...</span>
                        </div>
                    ) : result ? (
                        <div className="w-full z-10 animate-fade-in">
                            <div className="text-center mb-10">
                                <p className="text-[9px] uppercase text-gray-500 tracking-[0.4em] mb-4 font-black italic">PROBABILITÉ ENGINE</p>
                                <p className="text-7xl font-display font-black text-white tracking-tighter italic">{result.probability}%</p>
                                <span className="bg-gray-800 text-gray-400 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest mt-6 inline-block italic border border-white/5">Kick-off : {result.matchDate} - {result.matchTime}</span>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/20 p-8 rounded-2xl text-center mb-8">
                                <p className="text-white font-black text-2xl tracking-tighter uppercase italic">{result.recommendedBet}</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400 leading-relaxed italic border-l-2 border-brand-violet pl-6">"{result.analysis}"</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center opacity-20">
                            <p className="text-gray-500 text-[11px] uppercase tracking-[0.6em] font-black italic">Engine Idle — Waiting for Data</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
