
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'nextwin_official_daily_pack';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [dailyPack, setDailyPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailStatus, setEmailStatus] = useState<string | null>(null);

    // Initialisation et récupération du pack stocké
    useEffect(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const pack: DailyPack = JSON.parse(cached);
            const packDate = new Date(pack.timestamp).toDateString();
            const today = new Date().toDateString();

            // L'admin voit toujours le pack s'il existe
            // Le client ne voit le pack que s'il est validé ET qu'il est d'aujourd'hui
            if (isAdmin || (pack.isValidated && packDate === today)) {
                setDailyPack(pack);
            }
        }
    }, [isAdmin]);

    // MOTEUR DE GÉNÉRATION IA V8 RESTAURÉ
    const generateDailyPack = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: SENIOR SPORTS ANALYST - NEXTWIN ENGINE V8]
            DATE: ${new Date().toLocaleDateString()}
            
            OBJECTIVE: Generate exactly 8 professional predictions for matches happening TODAY.
            
            STRICT STRUCTURE:
            - 6 Standard Predictions (Winner or Over/Under).
            - 1 Bonus Football: Market MUST be "Both Teams to Score" (BTTS).
            - 1 Bonus Basketball: Market MUST be "Total Points" (Over/Under).
            
            QUALITY RULES:
            - Scan real-time data from SofaScore, Flashscore, and WhoScored.
            - Minimum confidence: 70%.
            - Provide a sharp 2-line professional analysis for each.
            
            OUTPUT JSON FORMAT:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Vainqueur Team A",
                  "category": "Standard",
                  "probability": 78,
                  "analysis": "Analysis based on xG and lineup news.",
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
            
            if (!jsonMatch) throw new Error("Format de réponse IA invalide.");
            
            const data = JSON.parse(jsonMatch[0]);
            const formattedPredictions = data.predictions.map((p: any, i: number) => ({
                ...p,
                id: `v8-auto-${i}-${Date.now()}`,
                date: new Date().toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US'),
                time: p.matchTime || '20:00',
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter((s: any) => s.uri).slice(0, 3) || []
            }));

            const newDraftPack: DailyPack = {
                timestamp: Date.now(),
                isValidated: false, // Reste en brouillon pour l'admin
                predictions: formattedPredictions,
                publishedBy: 'NEXTWIN ENGINE V8 (AUTO)'
            };

            setDailyPack(newDraftPack);
            localStorage.setItem(CACHE_KEY, JSON.stringify(newDraftPack));

        } catch (err: any) {
            setError("L'analyse IA a échoué. Vérifiez votre connexion ou votre quota API.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // VALIDATION FINALE ET DIFFUSION AUX CLIENTS
    const handlePublishAndNotify = () => {
        if (!dailyPack) return;
        
        const finalPack = {
            ...dailyPack,
            isValidated: true,
            timestamp: Date.now() // On actualise l'heure de publication
        };

        setDailyPack(finalPack);
        localStorage.setItem(CACHE_KEY, JSON.stringify(finalPack));
        
        // Simulation de l'envoi d'email
        setEmailStatus(t.pred_email_status);
        setTimeout(() => setEmailStatus(null), 6000);
    };

    const resetPack = () => {
        if(window.confirm("Supprimer les analyses actuelles ?")) {
            setDailyPack(null);
            localStorage.removeItem(CACHE_KEY);
        }
    }

    const predictions = dailyPack?.predictions || [];
    const filtered = useMemo(() => 
        activeSport === 'ALL' ? predictions : predictions.filter(p => p.sport.toUpperCase().includes(activeSport))
    , [activeSport, predictions]);

    // VUE ADMINISTRATEUR (NEXTWIN_BOSS)
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20">
                {emailStatus && (
                    <div className="fixed top-24 right-8 z-50 animate-bounce">
                        <div className="bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-green-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <div>
                                <p className="font-black text-xs uppercase tracking-widest">{t.pred_notif_sent}</p>
                                <p className="text-[10px] opacity-80 uppercase tracking-tighter italic">Notification envoyée aux abonnés</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Console Administrateur</h1>
                    <p className="mt-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.4em]">Gestion du Pack Quotidien V8</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center flex flex-col justify-center">
                        <h3 className="text-white font-black uppercase text-xs mb-6 tracking-widest">1. Génération Automatique</h3>
                        <button 
                            onClick={generateDailyPack}
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-30"
                        >
                            {isLoading ? "IA SCANNING DATA..." : "Lancer le Scan IA V8"}
                        </button>
                        {error && <p className="mt-4 text-red-500 text-[10px] font-black uppercase">{error}</p>}
                    </div>

                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center flex flex-col justify-center">
                        <h3 className="text-white font-black uppercase text-xs mb-6 tracking-widest">2. Publication Clients</h3>
                        <div className="flex gap-4">
                            <button 
                                onClick={handlePublishAndNotify}
                                disabled={!dailyPack || dailyPack.isValidated}
                                className="flex-1 bg-gradient-brand text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-30"
                            >
                                Valider & Envoyer Emails
                            </button>
                            <button 
                                onClick={resetPack}
                                className="px-6 bg-gray-800 hover:bg-red-900/50 text-gray-500 hover:text-red-500 rounded-2xl transition-all border border-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mb-6"></div>
                         <p className="text-white font-black text-[10px] tracking-[0.5em] uppercase italic">IA Moteur V8 : Analyse statistique en cours...</p>
                    </div>
                ) : dailyPack ? (
                    <>
                        <div className="flex items-center justify-between mb-8 px-6">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic border ${dailyPack.isValidated ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'}`}>
                                {dailyPack.isValidated ? "● STATUT : PUBLIC (CLIENTS NOTIFIÉS)" : "● STATUT : BROUILLON (EN ATTENTE DE VALIDATION)"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-90 scale-95 origin-top">
                            {predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed border-gray-800 rounded-[3rem]">
                        <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-sm italic">Aucune analyse générée pour aujourd'hui.</p>
                    </div>
                )}
            </div>
        );
    }

    // VUE CLIENT (ABONNÉ PRO)
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
                        <p className="text-[10px] text-gray-700 uppercase font-black tracking-[0.5em] italic">PACK OFFICIEL V8.0.1 • VALIDÉ PAR L'ADMINISTRATEUR À {new Date(dailyPack.timestamp).toLocaleTimeString()}</p>
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
