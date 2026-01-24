
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// VERSION 14 - MASTER STORAGE SYSTEM
const STORAGE_KEY = 'NEXTWIN_CMD_CONTROL_V14';

interface MasterStore {
    draft: DailyPack | null;
    public: DailyPack | null;
    lastUpdate: number;
}

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [store, setStore] = useState<MasterStore>({ draft: null, public: null, lastUpdate: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    // 1. SYNCHRONISATION MASTER
    const syncStore = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try {
                const data = JSON.parse(raw);
                setStore(data);
            } catch (e) {
                console.error("Store corrupt");
            }
        }
    };

    useEffect(() => {
        syncStore();
        window.addEventListener('storage', syncStore);
        const interval = setInterval(syncStore, 2000);
        return () => {
            window.removeEventListener('storage', syncStore);
            clearInterval(interval);
        };
    }, []);

    // 2. MOTEUR D'ANALYSE IA (ADMIN ONLY)
    const runIAAnalysis = async () => {
        setIsLoading(true);
        setStatus("CONNEXION AUX FLUX LIVESCORE / SOFASCORE...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: CHIEF ANALYST NEXTWIN]
            MISSION: Generate exactly 8 professional predictions for TODAY.
            
            STRUCTURE:
            - 2 Football (Winners)
            - 2 Basketball (Winners)
            - 2 Tennis (Winners)
            - 1 Bonus Football (BTTS Market)
            - 1 Bonus Basketball (Total Points Market)
            
            SOURCES: Use Google Search to verify exact match times (Paris Time) on LiveScore.in and probabilities on SofaScore.
            FILTER: Only select outcomes with probability >= 70%.
            
            OUTPUT JSON:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Team A Winner",
                  "category": "Standard",
                  "date": "DD.MM.YYYY",
                  "time": "HH:MM",
                  "probability": 78,
                  "analysis": "Short professional flash analysis."
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
            if (!jsonMatch) throw new Error("Format IA Invalide");

            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v14-${Date.now()}-${i}`,
                ...p,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter(s => s.uri).slice(0, 2) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: preds,
                publishedBy: 'NEXTWIN_BOSS'
            };

            const updatedStore = { ...store, draft: newDraft, lastUpdate: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
            setStore(updatedStore);
            setStatus("✓ BROUILLON 6+2 GÉNÉRÉ");
        } catch (err) {
            setStatus("⚠ ERREUR DE SYNCHRONISATION");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    // 3. PUBLICATION FINALE (ADMIN ONLY)
    const publishPack = () => {
        if (!store.draft) return;
        setStatus("PUBLICATION & ENVOI DES NOTIFICATIONS...");
        
        setTimeout(() => {
            const publicPack = { ...store.draft!, isValidated: true, timestamp: Date.now() };
            const finalStore = { draft: null, public: publicPack, lastUpdate: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(finalStore));
            setStore(finalStore);
            setStatus("🚀 PACK PUBLIÉ AVEC SUCCÈS");
            setTimeout(() => setStatus(null), 3000);
        }, 1500);
    };

    const resetSystem = () => {
        if (confirm("Réinitialiser tout le système ?")) {
            localStorage.removeItem(STORAGE_KEY);
            setStore({ draft: null, public: null, lastUpdate: 0 });
        }
    };

    const activePack = isAdmin ? (store.draft || store.public) : store.public;
    const predictions = activePack?.predictions || [];
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictions;
        return predictions.filter(p => p.sport.toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictions]);

    // RENDU ADMINISTRATEUR
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
                {status && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)] backdrop-blur-xl">
                        <span className="font-black text-[10px] uppercase tracking-widest italic">{status}</span>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">NEXTWIN CONTROL V14</h1>
                    <p className="mt-2 text-gray-500 text-[10px] uppercase tracking-widest font-black">Administration Sécurisée • NEXTWIN_BOSS</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    <button onClick={runIAAnalysis} disabled={isLoading} className="bg-brand-card border-2 border-gray-800 hover:border-blue-500 p-10 rounded-[2.5rem] transition-all group relative overflow-hidden">
                        <span className="text-white font-black text-lg uppercase italic tracking-tighter block">1. SCANNER EXPERT IA</span>
                        <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Générer le flux 6+2</span>
                    </button>

                    <button onClick={publishPack} disabled={!store.draft} className="bg-brand-card border-2 border-gray-800 hover:border-green-500 p-10 rounded-[2.5rem] transition-all group disabled:opacity-20">
                        <span className="text-white font-black text-lg uppercase italic tracking-tighter block">2. VALIDER & PUBLIER</span>
                        <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Rendre public (Espace Membres)</span>
                    </button>

                    <button onClick={resetSystem} className="bg-brand-card border-2 border-gray-800 hover:border-red-500 p-10 rounded-[2.5rem] transition-all group">
                        <span className="text-white font-black text-lg uppercase italic tracking-tighter block">RESET SYSTEM</span>
                        <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Nettoyer les données</span>
                    </button>
                </div>

                {store.draft && (
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-0.5 flex-1 bg-yellow-500/20"></div>
                            <h2 className="text-yellow-500 font-black uppercase text-[10px] tracking-[0.4em] italic">BROUILLON EN ATTENTE DE VALIDATION</h2>
                            <div className="h-0.5 flex-1 bg-yellow-500/20"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}

                {store.public && (
                    <div>
                         <div className="flex items-center gap-4 mb-8">
                            <div className="h-0.5 flex-1 bg-green-500/20"></div>
                            <h2 className="text-green-500 font-black uppercase text-[10px] tracking-[0.4em] italic">PACK ACTUELLEMENT EN LIGNE</h2>
                            <div className="h-0.5 flex-1 bg-green-500/20"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-40 grayscale">
                            {store.public.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // RENDU MEMBRE
    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">{t.predictions_title}</h1>
                <p className="mt-8 text-brand-light-gray text-[11px] md:text-[14px] uppercase tracking-[0.8em] font-black opacity-30">{t.predictions_subtitle}</p>
            </div>

            {store.public ? (
                <div>
                    <div className="flex justify-center gap-4 mb-16 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-10 py-4 rounded-xl text-[10px] font-black transition-all uppercase tracking-[0.2em] border ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white'}`}>
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 bg-brand-card border-2 border-gray-800 rounded-[4rem] max-w-4xl mx-auto shadow-2xl">
                     <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/20">
                        <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">{t.pred_waiting_title}</h3>
                     <p className="text-gray-500 uppercase tracking-widest text-xs font-black italic max-w-sm mx-auto">{t.pred_waiting_desc}</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
