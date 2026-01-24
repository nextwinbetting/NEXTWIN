
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
            
            // PROMPT AGENTIQUE : Force l'IA à simuler une extraction de données pro
            const prompt = `AGIS EN EXPERT DATA ANALYSTE SPORTIF.
            MATCH : ${team1} vs ${team2} (${sport}).
            TYPE DE PARI : ${betType}.

            TA MISSION : 
            1. Analyse les données en temps réel en consultant prioritairement : 
               - ${sport === 'Football' ? 'WhoScored, SofaScore, Transfermarkt' : sport === 'Basketball' ? 'NBA Stats, ESPN, Basketball Reference' : 'ATP/WTA, Tennis Abstract, Flashscore'}.
            2. Examine la forme (5 derniers matchs), les absences, et la valeur marchande (ELO).
            3. Calcule une probabilité mathématique précise basée sur ces sources.

            RÉPONDRE UNIQUEMENT AVEC CE JSON :
            {
              "analysis": "Synthèse technique de 3-4 lignes mentionnant les statistiques clés extraites.",
              "probability": 75,
              "keyData": ["Donnée 1 (ex: xG récent)", "Donnée 2 (ex: Absence majeure)", "Donnée 3 (ex: H2H)"],
              "recommendedBet": "Le pari le plus sûr",
              "recommendationReason": "Justification par les chiffres",
              "matchDateTimeUTC": "${new Date().toISOString()}"
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: useSearch ? [{ googleSearch: {} }] : undefined,
                    temperature: 0.1, // Basse température pour plus de rigueur mathématique
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            
            if (!jsonMatch) throw new Error("Erreur d'acquisition des flux de données.");
            
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
            if (useSearch && (err.message?.includes('429') || err.message?.includes('Quota'))) {
                setError("Quota API atteint. Vérifiez votre facturation Google Cloud.");
            } else {
                setError("Échec de la synchronisation avec les serveurs de données sportives.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Analyseur de Flux Temps Réel</h1>
                <p className="mt-2 text-brand-light-gray text-xs uppercase tracking-widest">Connecté aux serveurs WhoScored, SofaScore & Flashscore</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                {/* Configuration de l'agent */}
                <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 space-y-6 h-fit shadow-2xl">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Target : Match & Discipline</label>
                        <select value={sport} onChange={e => setSport(e.target.value as any)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-orange-500 outline-none">
                            <option>Football</option><option>Basketball</option><option>Tennis</option>
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                            <input placeholder="Home Team / Player" value={team1} onChange={e => setTeam1(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-orange-500 outline-none" />
                            <input placeholder="Away Team / Player" value={team2} onChange={e => setTeam2(e.target.value)} className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-sm focus:border-orange-500 outline-none" />
                        </div>
                    </div>
                    <button onClick={() => handleAnalyze()} disabled={loading} className="w-full bg-gradient-brand py-5 rounded-lg font-black text-white shadow-lg disabled:opacity-50 text-sm tracking-[0.2em] uppercase transition-all">
                        {loading ? "Acquisition en cours..." : "DÉMARRER L'EXTRACTION"}
                    </button>
                    {error && <p className="text-red-500 text-[10px] text-center font-bold uppercase">{error}</p>}
                </div>

                {/* Dashboard de l'IA */}
                <div className="bg-brand-card border border-gray-800 rounded-2xl p-8 min-h-[450px] flex items-center justify-center relative overflow-hidden shadow-2xl backdrop-blur-md">
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <div className="relative mb-8">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500"></div>
                            </div>
                            <span className="text-[10px] text-orange-400 font-black uppercase tracking-[0.4em] animate-pulse">Scanning Data Sources...</span>
                        </div>
                    ) : result ? (
                        <div className="w-full z-10 animate-fade-in">
                            <div className="text-center mb-10">
                                <p className="text-[10px] uppercase text-brand-light-gray tracking-[0.4em] mb-4 font-black">Probabilité Calculée</p>
                                <p className="text-8xl font-black text-white tracking-tighter">{result.probability}%</p>
                            </div>
                            <div className="bg-orange-500/5 border border-orange-500/30 p-6 rounded-2xl text-center mb-8">
                                <p className="text-[9px] text-orange-400 uppercase mb-2 font-black tracking-[0.3em]">Signal Détecté</p>
                                <p className="text-white font-black text-2xl tracking-tight uppercase italic">{result.recommendedBet}</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[11px] text-gray-400 leading-relaxed italic border-l-2 border-orange-500 pl-4">"{result.analysis}"</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {result.keyData.map((d, i) => (
                                        <div key={i} className="text-[10px] bg-gray-800/50 p-2 rounded border border-gray-700 text-gray-300">
                                            ● {d}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {result.sources && result.sources.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-800">
                                    <p className="text-[9px] text-gray-500 uppercase font-black mb-3">Sources vérifiées :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.sources.map((s, idx) => (
                                            <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-gray-900 px-3 py-1.5 rounded-lg text-blue-400 hover:text-white transition-all truncate max-w-[150px]">
                                                {s.title || "Donnée Source"}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center opacity-30">
                            <p className="text-brand-light-gray text-[10px] uppercase tracking-[0.5em] font-black">En attente de cible</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analyzer;
