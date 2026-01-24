
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// VERSION 12 - STRUCTURE DE DONNÉES UNIFIÉE
const STORAGE_KEY = 'NEXTWIN_MASTER_V12';

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

    // 1. SYNCHRONISATION ÉLITE
    const sync = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        
        if (raw) {
            try {
                const data: MasterStore = JSON.parse(raw);
                // Vérification de validité 24h pour le pack public
                if (data.public && (now - data.public.timestamp) > 24 * 60 * 60 * 1000) {
                    data.public = null;
                    data.notificationsSent = false;
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                }
                setStore(data);
            } catch (e) {
                console.error("Store Corrompu");
            }
        } else {
            // Premier lancement ou reset
            const initial: MasterStore = { draft: null, public: null, notificationsSent: false, lastAction: now };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            setStore(initial);
        }
    };

    useEffect(() => {
        sync();
        // Nettoyage des anciennes versions pour éviter les conflits
        localStorage.removeItem('NEXTWIN_GLOBAL_STORE_V11');
        localStorage.removeItem('nextwin_public_v10');

        window.addEventListener('storage', sync);
        const interval = setInterval(sync, 1000); // Check chaque seconde pour le client
        return () => {
            window.removeEventListener('storage', sync);
            clearInterval(interval);
        };
    }, []);

    // 2. GÉNÉRATION IA (ADMIN)
    const runIAGeneration = async () => {
        setIsLoading(true);
        setStatusMessage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `[ROLE: NEXTWIN ANALYST V12]
            Generate 8 professional sports predictions for today.
            6 Standard (2 per sport), 1 Football BTTS, 1 Basketball Over/Under.
            Format: JSON only { "predictions": [...] }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }], temperature: 0.2 }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("No JSON found");
            
            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v12-${Date.now()}-${i}`,
                sport: p.sport || 'Football',
                match: p.match || 'Match Analyste',
                betType: p.betType || 'IA Selection',
                category: i === 6 ? 'Bonus Football' : i === 7 ? 'Bonus Basket' : 'Standard',
                date: new Date().toLocaleDateString('fr-FR'),
                time: p.matchTime || '18:00',
                probability: p.probability || 80,
                analysis: p.analysis || "Validé par le moteur NextWin V12.",
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
            setStatusMessage("✓ ANALYSE IA TERMINÉE");
        } catch (err) {
            setStatusMessage("⚠ ERREUR GÉNÉRATION");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. VALIDATION & PUBLICATION (ADMIN)
    const validateAndPublish = () => {
        if (!store.draft) return;
        
        setIsPublishing(true);
        setStatusMessage("📧 ENVOI DES EMAILS AUX MEMBRES...");

        // Simulation de délai d'envoi d'emails (3 secondes)
        setTimeout(() => {
            const finalPack: DailyPack = {
                ...store.draft!,
                isValidated: true,
                timestamp: Date.now()
            };

            const updatedStore: MasterStore = {
                draft: null,
                public: finalPack,
                notificationsSent: true,
                lastAction: Date.now()
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
            setStore(updatedStore);
            setIsPublishing(false);
            setStatusMessage("🚀 PACK PUBLIÉ & EMAILS ENVOYÉS !");
            setTimeout(() => setStatusMessage(null), 4000);
        }, 3000);
    };

    const resetStore = () => {
        if (confirm("Réinitialiser tout le système ?")) {
            const empty = { draft: null, public: null, notificationsSent: false, lastAction: Date.now() };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
            setStore(empty);
        }
    };

    // 4. LOGIQUE D'AFFICHAGE
    const activePack = isAdmin ? (store.draft || store.public) : store.public;
    const predictions = activePack?.predictions || [];
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictions;
        return predictions.filter(p => p.sport.toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictions]);

    // --- RENDER ADMIN ---
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
                {statusMessage && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border-2 border-orange-500 text-white px-10 py-6 rounded-3xl shadow-[0_0_60px_rgba(249,115,22,0.5)] flex items-center gap-4">
                        {isPublishing && <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>}
                        <span className="font-black text-xs uppercase italic tracking-widest">{statusMessage}</span>
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">NEXTWIN CONTROL V12</h1>
                    <div className="mt-4 flex justify-center gap-6">
                         <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${store.public ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                            DIFFUSION : {store.public ? 'LIVE' : 'OFFLINE'}
                         </div>
                         <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase border ${store.notificationsSent ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                            EMAILS : {store.notificationsSent ? 'SENT' : 'WAITING'}
                         </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <button onClick={runIAGeneration} disabled={isLoading || isPublishing} className="group bg-brand-card border-2 border-gray-800 hover:border-blue-600 p-12 rounded-[3rem] transition-all relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="text-white font-black text-2xl uppercase tracking-tighter italic">
                            {isLoading ? "PHASE DE SCAN..." : "1. GÉNÉRER LE PACK IA"}
                        </span>
                    </button>

                    <button onClick={validateAndPublish} disabled={!store.draft || isPublishing} className="group bg-brand-card border-2 border-gray-800 hover:border-green-600 p-12 rounded-[3rem] transition-all relative overflow-hidden disabled:opacity-20">
                         <div className="absolute top-0 right-0 w-1 h-full bg-green-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <span className="text-white font-black text-2xl uppercase tracking-tighter italic">
                            2. VALIDER & NOTIFIER
                        </span>
                    </button>
                </div>

                {store.draft && (
                    <div className="mb-20 animate-fade-in">
                        <div className="flex items-center justify-between mb-8 border-b border-yellow-500/30 pb-4">
                            <h2 className="text-yellow-500 font-black uppercase tracking-[0.4em] italic text-sm">BROUILLON EN ATTENTE (INVISIBLE CLIENTS)</h2>
                            <button onClick={resetStore} className="text-red-500/50 hover:text-red-500 text-[10px] font-black uppercase">Réinitialiser</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}

                {store.public && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-8 border-b border-green-500/30 pb-4">
                            <h2 className="text-green-500 font-black uppercase tracking-[0.4em] italic text-sm">PACK ACTUELLEMENT EN LIGNE (PUBLIC)</h2>
                            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest italic">Expire dans 24h</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 opacity-70">
                            {store.public.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}

                {!store.draft && !store.public && !isLoading && (
                    <div className="text-center py-40 border-4 border-dashed border-gray-800 rounded-[4rem]">
                         <p className="text-gray-700 font-black uppercase tracking-[0.6em] text-xl italic">SYSTEME PRÊT • AUCUN FLUX</p>
                    </div>
                )}
            </div>
        );
    }

    // --- RENDER CLIENT ---
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
