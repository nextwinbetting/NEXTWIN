
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// VERSION 13 - STRUCTURE DE DONNÉES UNIFIÉE ET SÉCURISÉE
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

    // 1. SYNCHRONISATION EN TEMPS RÉEL
    const sync = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        
        if (raw) {
            try {
                const data: MasterStore = JSON.parse(raw);
                // Auto-nettoyage des packs de plus de 24h
                if (data.public && (now - data.public.timestamp) > 24 * 60 * 60 * 1000) {
                    data.public = null;
                    data.notificationsSent = false;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                }
                setStore(data);
            } catch (e) {
                console.error("Store Sync Error");
            }
        } else if (isAdmin) {
            const initial: MasterStore = { draft: null, public: null, notificationsSent: false, lastAction: now };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            setStore(initial);
        }
    };

    useEffect(() => {
        sync();
        window.addEventListener('storage', sync);
        const interval = setInterval(sync, 1000);
        return () => {
            window.removeEventListener('storage', sync);
            clearInterval(interval);
        };
    }, []);

    // 2. MOTEUR DE GÉNÉRATION IA (RÉSERVÉ ADMIN)
    const runExpertGeneration = async () => {
        setIsLoading(true);
        setStatusMessage("ANALYSE DES FLUX LIVESCORE / SOFASCORE...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: SENIOR SPORTS ANALYST V13]
            MISSION: Generate EXACTLY 8 professional sports predictions for TODAY.
            
            CONSTRAINTS:
            - SOURCE: Search LiveScore.in, SofaScore, and ATP/WTA/NBA official stats.
            - 2 Football (Standard Winners)
            - 2 Basketball (Standard Winners)
            - 2 Tennis (Standard Winners)
            - 1 BONUS Football: "Both Teams to Score (BTTS) - Yes/No"
            - 1 BONUS Basketball: "Total Points Over/Under"
            
            RULES:
            - ALL probabilities MUST be >= 70%.
            - Dates/Times must be for TODAY in Paris Time.
            - Analysis must be professional (Analyse Flash).
            
            OUTPUT JSON FORMAT:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Team A Winner",
                  "category": "Standard",
                  "date": "DD.MM.YYYY",
                  "time": "HH:MM (Paris)",
                  "probability": 78,
                  "analysis": "Flash analysis describing why this pick is solid."
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
            if (!jsonMatch) throw new Error("Format JSON non détecté");
            
            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v13-${Date.now()}-${i}`,
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

            const newStore = { ...store, draft: newDraft, lastAction: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatusMessage("✓ ANALYSE TERMINÉE : 8 PRONOSTICS PRÊTS");
        } catch (err) {
            console.error(err);
            setStatusMessage("⚠ ERREUR LORS DE LA GÉNÉRATION");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. PUBLICATION FINALE (RÉSERVÉ ADMIN)
    const validateAndPublish = () => {
        if (!store.draft) return;
        
        setIsPublishing(true);
        setStatusMessage("ENVOI DES NOTIFICATIONS AUX MEMBRES...");

        setTimeout(() => {
            const publicPack: DailyPack = {
                ...store.draft!,
                isValidated: true,
                timestamp: Date.now()
            };

            const updatedStore: MasterStore = {
                draft: null,
                public: publicPack,
                notificationsSent: true,
                lastAction: Date.now()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
            setStore(updatedStore);
            setIsPublishing(false);
            setStatusMessage("🚀 PACK V13 PUBLIÉ ET VISIBLE !");
            setTimeout(() => setStatusMessage(null), 4000);
        }, 2500);
    };

    const resetDraft = () => {
        if (confirm("Supprimer le brouillon actuel ?")) {
            const updated = { ...store, draft: null, lastAction: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setStore(updated);
        }
    };

    // 4. LOGIQUE D'AFFICHAGE (MEMBRE VS ADMIN)
    const activePack = isAdmin ? (store.draft || store.public) : store.public;
    const predictions = activePack?.predictions || [];
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictions;
        return predictions.filter(p => p.sport.toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictions]);

    // VIEW: ADMIN
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
                {statusMessage && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border-2 border-orange-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_60px_rgba(249,115,22,0.4)] flex items-center gap-4 backdrop-blur-xl">
                        {isPublishing && <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>}
                        <span className="font-black text-xs uppercase italic tracking-[0.2em]">{statusMessage}</span>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">NEXTWIN ADMIN CENTER</h1>
                    <div className="mt-4 flex justify-center gap-4">
                         <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${store.public ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                            STATUT PUBLIC : {store.public ? 'LIVE' : 'OFFLINE'}
                         </div>
                         <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${store.draft ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                            BROUILLON : {store.draft ? 'PRÊT' : 'VIDE'}
                         </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <button onClick={runExpertGeneration} disabled={isLoading || isPublishing} className="group bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-10 rounded-[3rem] transition-all relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-white font-black text-2xl uppercase tracking-tighter italic block">
                            {isLoading ? "EXTRACTION IA..." : "1. GÉNÉRER PACK 6+2"}
                        </span>
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 block">Scan SofaScore & LiveScore</span>
                    </button>

                    <button onClick={validateAndPublish} disabled={!store.draft || isPublishing} className="group bg-brand-card border-2 border-gray-800 hover:border-green-500 p-10 rounded-[3rem] transition-all relative overflow-hidden disabled:opacity-20">
                         <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <span className="text-white font-black text-2xl uppercase tracking-tighter italic block">
                            2. VALIDER & PUBLIER
                        </span>
                        <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 block">Rendre public pour les membres</span>
                    </button>
                </div>

                {store.draft && (
                    <div className="animate-fade-in mb-20">
                        <div className="flex items-center justify-between mb-8 border-b border-yellow-500/30 pb-4">
                            <h2 className="text-yellow-500 font-black uppercase tracking-[0.4em] italic text-xs">VISUALISATION DU BROUILLON IA</h2>
                            <button onClick={resetDraft} className="text-red-500 hover:text-red-400 text-[10px] font-black uppercase tracking-widest transition-colors">ANNULER LE BROUILLON</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}

                {store.public && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-8 border-b border-green-500/30 pb-4">
                            <h2 className="text-green-500 font-black uppercase tracking-[0.4em] italic text-xs">CONTENU ACTUELLEMENT EN LIGNE</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-60">
                            {store.public.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // VIEW: MEMBER
    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">{t.predictions_title}</h1>
                <p className="mt-8 text-brand-light-gray text-[11px] md:text-[14px] uppercase tracking-[0.8em] font-black opacity-30">{t.predictions_subtitle}</p>
            </div>

            {store.public ? (
                <div className="animate-fade-in">
                    <div className="flex justify-center gap-4 mb-20 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-12 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white shadow-2xl' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white'}`}>
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="text-center bg-brand-card border-2 border-gray-800 rounded-[5rem] p-24 md:p-40 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent"></div>
                     <div className="w-32 h-32 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-16 animate-pulse border border-orange-500/20">
                        <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-5xl md:text-7xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none">{t.pred_waiting_title}</h3>
                     <p className="text-brand-light-gray text-base md:text-xl uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto italic font-black opacity-20">
                        {t.pred_waiting_desc}
                     </p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
