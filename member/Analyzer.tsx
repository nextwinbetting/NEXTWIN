
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

    const handleAnalyze = async (useSearch = true) => {
        if (!team1 || !team2) return;
        setLoading(true);
        setError(null);
        if (useSearch) setResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `Analyser le match de ${sport} suivant : ${team1} vs ${team2}. 
            Type de pari analysé : ${betType}.
            Heure actuelle : ${new Date().toISOString()}.
            Utilise tes outils de recherche pour obtenir les dernières informations sur la forme des équipes, les blessures et les cotes.
            
            Répondre UNIQUEMENT avec un objet JSON sans texte autour :
            {
              "analysis": "Texte détaillé expliquant la probabilité...",
              "probability": 70,
              "keyData": ["Fait marquant 1", "Fait marquant 2", "Fait marquant 3"],
              "recommendedBet": "Pari suggéré par l'IA",
              "recommendationReason": "Justification de la suggestion",
              "matchDateTimeUTC": "2025-05-20T20:45:00Z"
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: useSearch ? [{ googleSearch: {} }] : undefined,
                }
            });

            const text = response.text || "";
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) throw new Error("Format de réponse invalide");
            
            const data = JSON.parse(jsonMatch[0]);
            const { dateStr, timeStr } = formatMatchDateTime(data.matchDateTimeUTC);
            
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
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
            if (useSearch && (err.message?.includes('400') || err.message?.includes('tool'))) {
                handleAnalyze(false);
            } else {
                setError("Échec de l'analyse Engine. Vérifiez vos paramètres ou réessayez.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Analyseur Expert</h1>
                <p className="mt-2 text-brand-light-gray text-xs uppercase tracking-widest">Technologie de calcul bayésien V7.2 - Gemini 3 Ultra-Low Latency</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 space-y-6 h-fit shadow-2xl backdrop-blur-sm">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Configuration du match</label>
                        <select value={sport} onChange={e => setSport(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-orange-500 transition-colors outline-none">
                            <option>Football</option><option>Basketball</option><option>Tennis</option>
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Équipe Domicile" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-orange-500 outline-none placeholder:text-gray-600" />
                            <input placeholder="Équipe Extérieur" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-orange-500 outline-none placeholder:text-gray-600" />
                        </div>
                    </div>
                    <button onClick={() => handleAnalyze()} disabled={loading} className="group relative w-full bg-gradient-brand py-5 rounded-lg font-black text-white shadow-lg disabled:opacity-50 text-sm tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all overflow-hidden">
                        <span className="relative z-10">{loading ? "Calculs Engine..." : "LANCER L'ANALYSE IA"}</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    {error && <p className="text-red-500 text-[10px] text-center font-bold uppercase animate-pulse">{error}</p>}
                </div>

                <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 min-h-[450px] flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-md">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="relative mb-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-orange-400 uppercase">AI</div>
                            </div>
                            <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.4em] animate-pulse">Extraction de données web...</span>
                            <p className="mt-2 text-[9px] text-gray-600 uppercase">Synchronisation des sources mondiales</p>
                        </div>
                    ) : result ? (
                        <div className="w-full z-10 animate-fade-in">
                            <div className="flex justify-between text-[9px] text-gray-500 mb-6 border-b border-gray-800 pb-3 uppercase font-black tracking-widest">
                                <span>DATE ÉVÉNEMENT: {result.matchDate}</span>
                                <span>FLUX: PARIS {result.matchTime}</span>
                            </div>
                            <div className="text-center mb-10">
                                <p className="text-[10px] uppercase text-brand-light-gray tracking-[0.4em] mb-4 font-black">Indice de Confiance Engine</p>
                                <div className="relative inline-block">
                                    <p className="text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{result.probability}%</p>
                                    <div className="absolute -inset-8 bg-gradient-brand blur-3xl rounded-full -z-10 opacity-20"></div>
                                </div>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/30 p-6 rounded-2xl text-center mb-8 ring-1 ring-orange-500/10">
                                <p className="text-[9px] text-orange-400 uppercase mb-2 font-black tracking-[0.3em]">Recommandation IA</p>
                                <p className="text-white font-black text-2xl tracking-tight uppercase italic">{result.recommendedBet}</p>
                                <p className="mt-2 text-[10px] text-gray-400">{result.recommendationReason}</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[11px] text-gray-400 leading-relaxed text-justify border-l-2 border-orange-500/50 pl-4 py-1 italic">"{result.analysis}"</p>
                            </div>
                            
                            {result.sources && result.sources.length > 0 && (
                                <div className="mt-10 pt-6 border-t border-gray-800">
                                    <p className="text-[9px] text-gray-500 uppercase font-black mb-4 tracking-widest flex items-center gap-2">
                                        <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 10-2 0h-1a1 1 0 100 2h1a1 1 0 102 0zm-7 7a1 1 0 10-2 0v1a1 1 0 102 0v-1zM5.05 6.464a1 1 0 10-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM5 10a1 1 0 10-2 0H2a1 1 0 100 2h1a1 1 0 102 0zM8 16.5a1 1 0 100-2H7a1 1 0 100 2h1zm7-1.5a1 1 0 100-2h-1a1 1 0 100 2h1z" /></svg>
                                        Sources Grounding :
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.sources.map((s, idx) => (
                                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-gray-900 border border-gray-800 px-4 py-2 rounded-lg text-blue-400 hover:text-white hover:border-blue-500 transition-all truncate max-w-[180px] font-bold">
                                                {s.title || "Données vérifiées"}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center opacity-30 group">
                            <svg className="w-20 h-20 text-gray-600 mx-auto mb-6 group-hover:scale-110 group-hover:text-orange-500/50 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <p className="text-brand-light-gray text-[10px] uppercase tracking-[0.5em] font-black">Prêt pour acquisition de flux</p>
                            <p className="mt-2 text-[8px] text-gray-700 uppercase">NEXTWIN ENGINE V7.2 BY GEMINI</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
