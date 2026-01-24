
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'nextwin_official_daily_pack';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(false);
    const [dailyPack, setDailyPack] = useState<DailyPack | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [emailStatus, setEmailStatus] = useState<string | null>(null);

    // Initialisation du cache
    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const pack: DailyPack = JSON.parse(cached);
            const packDate = new Date(pack.timestamp).toDateString();
            const today = new Date().toDateString();
            // On ne montre au client que si c'est validé ET que c'est le pack d'aujourd'hui
            if (packDate === today && pack.isValidated) {
                setDailyPack(pack);
            } else if (isAdmin) {
                // L'admin voit quand même le pack s'il est en cours de validation
                setDailyPack(pack);
            }
        }
    }, [isAdmin]);

    // RESTAURATION V8 - PROMPT HAUTE PERFORMANCE DU 23/01/2026
    const generateInternalResearch = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: NEXTWIN ENGINE V8 - RESTORED 2026-01-23]
            TASK: Generate exactly 8 professional sports predictions for TODAY.
            
            STRUCTURE REQUIREMENTS:
            - 6 Standard Predictions: High confidence (70%+) on winner or double chance.
            - 1 Bonus Football: Locked Market "BOTH TEAMS TO SCORE" (BTTS).
            - 1 Bonus Basketball: Locked Market "TOTAL POINTS" (Over/Under).
            
            RULES:
            - Sources: SofaScore, Flashscore, WhoScored.
            - Low Temperature Mode: 0.1 (Strict accuracy).
            - Analysis: Professional data-driven reasoning (max 2 lines).
            
            OUTPUT JSON STRICT FORMAT:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Oui (BTTS)",
                  "category": "Bonus Football",
                  "probability": 78,
                  "analysis": "Analysis based on current xG and defensive injuries.",
                  "matchTime": "20:45"
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Erreur de flux IA Studio.");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => ({
                ...p,
                id: `v8-${i}-${Date.now()}`,
                date: new Date().toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US'),
                time: p.matchTime || '20:00',
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter((s: any) => s.uri).slice(0, 3) || []
            }));

            const researchPack: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: formatted,
                publishedBy: 'NEXTWIN ENGINE V8'
            };

            setDailyPack(researchPack);
            // On stocke temporairement pour l'admin
            localStorage.setItem(CACHE_KEY, JSON.stringify(researchPack));

        } catch (err: any) {
            setError("L'Engine V8 a rencontré un problème. Vérifiez votre clé API.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishAndNotify = () => {
        if (!dailyPack) return;
        
        const finalPack = {
            ...dailyPack,
            isValidated: true,
            timestamp: Date.now()
        };

        setDailyPack(finalPack);
        localStorage.setItem(CACHE_KEY, JSON.stringify(finalPack));
        
        // Simulation Notification Email
        setEmailStatus(t.pred_email_status);
        setTimeout(() => setEmailStatus(null), 5000);
    };

    const predictions = dailyPack?.predictions || [];
    const filtered = useMemo(() => 
        activeSport === 'ALL' ? predictions : predictions.filter(p => p.sport.toUpperCase().includes(activeSport))
    , [activeSport, predictions]);

    // VUE ADMINISTRATEUR
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20">
                {emailStatus && (
                    <div className="fixed top-24 right-8 z-50 animate-bounce">
                        <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="font-black text-xs uppercase tracking-widest">{t.pred_notif_sent}</span>
                        </div>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Console Administrateur</h1>
                    <p className="mt-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.4em]">Gestion du pack V8 - Accès Privé</p>
                </div>

                <div className="bg-brand-card border-2 border-orange-500/30 rounded-[2rem] p-10 mb-16 text-center backdrop-blur-xl shadow-2xl">
                    <h3 className="text-orange-500 font-black uppercase text-xs mb-8 tracking-[0.2em]">{t.pred_admin_desc}</h3>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <button 
                            onClick={generateInternalResearch}
                            disabled={isLoading}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                            {isLoading ? "RECHERCHE V8 EN COURS..." : t.pred_admin_gen}
                        </button>
                        
                        {dailyPack && !dailyPack.isValidated && (
                            <button 
                                onClick={handlePublishAndNotify}
                                className="bg-gradient-brand text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                            >
                                {t.pred_admin_val}
                            </button>
                        )}
                    </div>
                    {error && <p className="mt-4 text-red-500 font-black text-xs uppercase">{error}</p>}
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                         <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-orange-500 mb-6"></div>
                         <p className="text-white font-black text-[10px] tracking-[0.5em] uppercase">Syncing V8 Engine Data...</p>
                    </div>
                ) : dailyPack ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-80">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                ) : null}
            </div>
        );
    }

    // VUE CLIENT (MEMBRE PRO)
    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase italic">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray text-[11px] uppercase tracking-[0.4em] font-black">{t.predictions_subtitle}</p>
            </div>

            {dailyPack?.isValidated ? (
                <>
                    <div className="flex justify-center gap-4 mb-20 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button 
                                key={s} 
                                onClick={() => setActiveSport(s as any)} 
                                className={`px-10 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white shadow-2xl' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white'}`}
                            >
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                    <div className="mt-24 text-center border-t border-gray-800 pt-12">
                        <p className="text-[10px] text-gray-700 uppercase font-black tracking-[0.5em] italic">PACK OFFICIEL V8.0.1 • VALIDÉ À {new Date(dailyPack.timestamp).toLocaleTimeString()}</p>
                    </div>
                </>
            ) : (
                <div className="text-center bg-brand-card border border-gray-800 rounded-[3rem] p-24 max-w-4xl mx-auto shadow-2xl">
                     <div className="w-24 h-24 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/10">
                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">{t.pred_waiting_title}</h3>
                     <p className="text-brand-light-gray text-sm mb-0 uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                        {t.pred_waiting_desc}
                     </p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
