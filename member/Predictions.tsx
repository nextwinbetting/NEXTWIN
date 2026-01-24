
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'nextwin_shared_validated_pack';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = true }) => {
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
            if (packDate === today) {
                setDailyPack(pack);
            }
        }
    }, []);

    const isGenerationWindow = useMemo(() => {
        const hour = new Date().getHours();
        return hour >= 9 && hour <= 12;
    }, []);

    // RESTAURATION V8 - PROMPT HAUTE PERFORMANCE
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
            
            OUTPUT JSON:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Oui (BTTS)",
                  "category": "Bonus Football",
                  "probability": 78,
                  "analysis": "Data analysis based on xG and scoring streaks.",
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
            if (!jsonMatch) throw new Error("JSON Error");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => ({
                ...p,
                id: `v8-research-${i}-${Date.now()}`,
                date: new Date().toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US'),
                time: p.matchTime || '20:00',
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter((s: any) => s.uri).slice(0, 3) || []
            }));

            // On stocke en mode "Non Validé" pour l'Admin
            setDailyPack({
                timestamp: Date.now(),
                isValidated: false,
                predictions: formatted,
                publishedBy: 'Internal IA Engine V8'
            });

        } catch (err: any) {
            setError("Erreur Flux Engine. Vérifiez votre quota API.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishAndNotify = () => {
        if (!dailyPack) return;
        
        const validatedPack = {
            ...dailyPack,
            isValidated: true,
            timestamp: Date.now()
        };

        setDailyPack(validatedPack);
        localStorage.setItem(CACHE_KEY, JSON.stringify(validatedPack));
        
        // Simulation Envoi Email
        setEmailStatus(t.pred_email_status);
        setTimeout(() => setEmailStatus(null), 5000);
    };

    const predictions = dailyPack?.predictions || [];
    const filtered = useMemo(() => 
        activeSport === 'ALL' ? predictions : predictions.filter(p => p.sport.toUpperCase().includes(activeSport))
    , [activeSport, predictions]);

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* Bannière Notification Email */}
            {emailStatus && (
                <div className="fixed top-24 right-8 z-50 animate-fade-in">
                    <div className="bg-green-500 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-green-400">
                        <div className="bg-white/20 p-2 rounded-full">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                             <p className="font-black text-xs uppercase tracking-widest">{t.pred_notif_sent}</p>
                             <p className="text-[10px] opacity-80">{emailStatus}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase italic">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray text-[11px] uppercase tracking-[0.4em] font-black">{t.predictions_subtitle}</p>
            </div>

            {/* INTERFACE ADMIN */}
            {isAdmin && (
                <div className="mb-16 bg-brand-card border-2 border-orange-500/20 rounded-[2rem] p-10 text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10">
                        <h3 className="text-orange-500 font-black uppercase text-xs mb-6 tracking-[0.3em]">{t.pred_admin_desc}</h3>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button 
                                onClick={generateInternalResearch}
                                disabled={isLoading || (dailyPack?.isValidated && isGenerationWindow)}
                                className="bg-gray-800 border border-gray-700 px-10 py-5 rounded-2xl font-black text-white text-xs uppercase tracking-[0.2em] hover:bg-gray-700 transition-all disabled:opacity-30"
                            >
                                {isLoading ? "ENGINE V8 SCAN..." : t.pred_admin_gen}
                            </button>

                            {dailyPack && !dailyPack.isValidated && (
                                <button 
                                    onClick={handlePublishAndNotify}
                                    className="bg-gradient-brand px-12 py-5 rounded-2xl font-black text-white text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
                                >
                                    {t.pred_admin_val}
                                </button>
                            )}
                        </div>
                        {error && <p className="mt-6 text-red-500 text-[10px] font-black uppercase">{error}</p>}
                    </div>
                </div>
            )}

            {/* ÉTAT CHARGEMENT */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[450px]">
                    <div className="relative mb-12">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-orange-500 border-opacity-30"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-orange-500 font-black text-xl tracking-tighter">V8</span>
                        </div>
                    </div>
                    <p className="text-white font-black text-[11px] tracking-[0.6em] uppercase animate-pulse italic">Scanning Sports Fluxes...</p>
                </div>
            ) : dailyPack?.isValidated ? (
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
                        <p className="text-[10px] text-gray-700 uppercase font-black tracking-[0.5em] italic">PACK OFFICIEL V8.0.1 • GÉNÉRÉ À {new Date(dailyPack.timestamp).toLocaleTimeString()}</p>
                    </div>
                </>
            ) : dailyPack && !isAdmin ? (
                // Écran client quand le pack est en cours de validation
                <div className="text-center bg-brand-card border border-gray-800 rounded-[3rem] p-24 max-w-4xl mx-auto shadow-2xl">
                     <div className="w-24 h-24 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/10">
                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">{t.pred_waiting_title}</h3>
                     <p className="text-brand-light-gray text-sm mb-0 uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                        {t.pred_waiting_desc}
                     </p>
                </div>
            ) : dailyPack && isAdmin && !dailyPack.isValidated ? (
                 // Aperçu Admin avant validation
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
                    <div className="col-span-full text-center mb-8">
                        <span className="bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-yellow-500/30">Mode Aperçu (Non Publié)</span>
                    </div>
                    {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                </div>
            ) : (
                <div className="text-center bg-brand-card border border-gray-800 rounded-[3rem] p-24 max-w-4xl mx-auto shadow-2xl">
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">AUCUN PACK DISPONIBLE</h3>
                     <p className="mt-4 text-gray-500 uppercase text-[10px] tracking-widest font-black italic">PROCHAIN PACK PRÉVU ENTRE 9H ET 12H</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
