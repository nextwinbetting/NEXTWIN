
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'NEXTWIN_MASTER_V13';

interface MasterStore {
    draft: DailyPack | null;
    public: DailyPack | null;
    notificationsSent: boolean;
    lastAction: number;
}

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [store, setStore] = useState<MasterStore>({ draft: null, public: null, notificationsSent: false, lastAction: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const sync = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try { setStore(JSON.parse(raw)); } catch (e) { console.error("Sync error"); }
        }
    };

    useEffect(() => {
        sync();
        window.addEventListener('storage', sync);
        const interval = setInterval(sync, 2000);
        return () => {
            window.removeEventListener('storage', sync);
            clearInterval(interval);
        };
    }, []);

    const runExpertAnalysis = async () => {
        setIsLoading(true);
        setStatusMessage("SCAN DES FLUX (SOFASCORE / LIVESCORE)...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            // PROMPT EXPERT V13 - STRATÉGIE 6+2
            const prompt = `[ROLE: SENIOR SPORTS ANALYST V13]
            GOAL: Generate EXACTLY 8 high-probability sports predictions for the next 24 hours.
            
            CONSTRAINTS:
            - 1. Football: 2 most probable winners.
            - 2. Basketball: 2 most probable winners.
            - 3. Tennis: 2 most probable players to win.
            - 4. Bonus Football: 1 "Both Teams to Score (BTTS) - Yes/No" (High value).
            - 5. Bonus Basketball: 1 "Total Points Over/Under" (High reliability).
            - ALL probabilities MUST be >= 70%.
            
            REQUIRED DATA SOURCES: Search LiveScore.in, SofaScore, and TennisAbstract for real-time fixtures.
            
            OUTPUT FORMAT: JSON ONLY.
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Team A Winner",
                  "category": "Standard",
                  "matchDate": "DD.MM.YYYY",
                  "matchTime": "HH:MM (Paris)",
                  "probability": 75,
                  "analysis": "Short technical flash analysis (max 150 chars)."
                },
                ... (total 8)
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
            if (!jsonMatch) throw new Error("Format IA invalide");
            
            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => {
                // Attribution automatique des catégories bonus si l'IA ne l'a pas fait
                let finalCat = p.category;
                if (i === 6) finalCat = 'Bonus Football';
                if (i === 7) finalCat = 'Bonus Basket';

                return {
                    id: `v13-${Date.now()}-${i}`,
                    sport: p.sport,
                    match: p.match,
                    betType: p.betType,
                    category: finalCat,
                    date: p.matchDate,
                    time: p.matchTime,
                    probability: p.probability,
                    analysis: p.analysis,
                    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                        uri: c.web?.uri,
                        title: c.web?.title
                    })).filter(s => s.uri).slice(0, 2) || []
                };
            });

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: preds,
                publishedBy: 'NEXTWIN_IA'
            };

            const newStore = { ...store, draft: newDraft, lastAction: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatusMessage("✓ PACK 6+2 GÉNÉRÉ AVEC SUCCÈS");
        } catch (err) {
            setStatusMessage("⚠ ERREUR DE CONNEXION AUX FLUX");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = () => {
        if (!store.draft) return;
        setIsPublishing(true);
        setStatusMessage("VALIDATION & DIFFUSION EMAIL...");

        setTimeout(() => {
            const publicPack = { ...store.draft!, isValidated: true, timestamp: Date.now() };
            const updatedStore = { draft: null, public: publicPack, notificationsSent: true, lastAction: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
            setStore(updatedStore);
            setIsPublishing(false);
            setStatusMessage("🚀 PACK EN LIGNE !");
            setTimeout(() => setStatusMessage(null), 3000);
        }, 2000);
    };

    const activePack = isAdmin ? (store.draft || store.public) : store.public;
    const predictions = activePack?.predictions || [];
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictions;
        return predictions.filter(p => p.sport.toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictions]);

    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
                {statusMessage && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500/50 text-white px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.3)] backdrop-blur-xl">
                        <span className="font-black text-[10px] uppercase tracking-widest italic">{statusMessage}</span>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Console d'Analyse V13</h1>
                    <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">Stratégie Hybride 6 Standards + 2 Bonus</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <button onClick={runExpertAnalysis} disabled={isLoading} className="bg-brand-card border-2 border-gray-800 hover:border-blue-500 p-12 rounded-[2.5rem] transition-all group">
                        <span className="text-white font-black text-xl uppercase italic tracking-tighter">
                            {isLoading ? "EXTRACTION..." : "1. LANCER LE SCAN IA"}
                        </span>
                    </button>
                    <button onClick={handlePublish} disabled={!store.draft || isPublishing} className="bg-brand-card border-2 border-gray-800 hover:border-green-500 p-12 rounded-[2.5rem] transition-all group disabled:opacity-20">
                        <span className="text-white font-black text-xl uppercase italic tracking-tighter">
                            2. VALIDER & PUBLIER
                        </span>
                    </button>
                </div>

                {store.draft && (
                    <div className="animate-fade-in">
                        <h2 className="text-yellow-500 font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">Brouillon en attente de vérification</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">{t.predictions_title}</h1>
                <p className="mt-8 text-brand-light-gray text-[11px] md:text-[14px] uppercase tracking-[0.8em] font-black opacity-30">{t.predictions_subtitle}</p>
            </div>

            {store.public ? (
                <div>
                    <div className="flex justify-center gap-4 mb-20 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-12 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white shadow-2xl' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white'}`}>
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="text-center py-40">
                     <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/20">
                        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">{t.pred_waiting_title}</h3>
                     <p className="text-gray-500 uppercase tracking-widest text-xs font-black">{t.pred_waiting_desc}</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
