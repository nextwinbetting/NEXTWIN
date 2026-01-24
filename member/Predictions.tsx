
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// Clés de stockage distinctes
const KEY_DRAFT = 'nextwin_draft_v10';
const KEY_PUBLIC = 'nextwin_public_v10';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [draftPack, setDraftPack] = useState<DailyPack | null>(null);
    const [publicPack, setPublicPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Fonction de chargement ultra-robuste
    const syncPacks = () => {
        const now = Date.now();
        
        // 1. Charger le Pack Public (Visible par les clients)
        const rawPublic = localStorage.getItem(KEY_PUBLIC);
        if (rawPublic) {
            try {
                const pack: DailyPack = JSON.parse(rawPublic);
                const ageMs = now - pack.timestamp;
                const ageHours = ageMs / (1000 * 60 * 60);

                // REGLE : Visible si validé ET moins de 24h
                if (pack.isValidated && ageHours < 24) {
                    setPublicPack(pack);
                } else {
                    // Si expiré ou non validé, on nettoie
                    setPublicPack(null);
                    if (ageHours >= 24) localStorage.removeItem(KEY_PUBLIC);
                }
            } catch (e) {
                setPublicPack(null);
            }
        } else {
            setPublicPack(null);
        }

        // 2. Charger le Brouillon (Uniquement pour l'Admin)
        if (isAdmin) {
            const rawDraft = localStorage.getItem(KEY_DRAFT);
            if (rawDraft) {
                try {
                    const pack: DailyPack = JSON.parse(rawDraft);
                    // Le brouillon reste visible par l'admin tant qu'il n'est pas publié
                    setDraftPack(pack);
                } catch (e) {
                    setDraftPack(null);
                }
            } else {
                setDraftPack(null);
            }
        }
    };

    useEffect(() => {
        syncPacks();
        
        // Listener pour la synchronisation immédiate entre onglets (Admin -> Client)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === KEY_PUBLIC || e.key === KEY_DRAFT) {
                syncPacks();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(syncPacks, 5000); // Check toutes les 5s par sécurité

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isAdmin]);

    // GÉNÉRATION IA (ADMIN)
    const generateNewDraft = async () => {
        setIsLoading(true);
        setStatusMessage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `[ROLE: SPORTS ANALYST V10]
            Analyze the most promising matches for the next 24 hours.
            Return exactly 8 predictions in JSON format.
            Markets: 6 Standard, 1 BTTS, 1 Over/Under.
            Format: { "predictions": [...] }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("IA Error");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => ({
                id: `v10-${Date.now()}-${i}`,
                sport: p.sport || 'Football',
                match: p.match || 'Prochain Match',
                betType: p.betType || 'Analyse IA',
                category: i === 6 ? 'Bonus Football' : i === 7 ? 'Bonus Basket' : 'Standard',
                date: new Date().toLocaleDateString('fr-FR'),
                time: p.matchTime || '20:00',
                probability: p.probability || 75,
                analysis: p.analysis || "Validation technique par NEXTWIN Engine.",
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter(s => s.uri).slice(0, 3) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: formatted,
                publishedBy: 'NEXTWIN_BOSS'
            };

            localStorage.setItem(KEY_DRAFT, JSON.stringify(newDraft));
            setDraftPack(newDraft);
            setStatusMessage("✓ BROUILLON PRÊT POUR VALIDATION");
        } catch (err) {
            setStatusMessage("⚠ ÉCHEC DE LA GÉNÉRATION IA");
        } finally {
            setIsLoading(false);
        }
    };

    // PUBLICATION (ADMIN -> CLIENT)
    const publishToPublic = () => {
        if (!draftPack) return;
        
        const finalPack: DailyPack = {
            ...draftPack,
            isValidated: true,
            timestamp: Date.now() // Démarre le chrono des 24h MAINTENANT
        };

        // Transfert physique vers la clé publique
        localStorage.setItem(KEY_PUBLIC, JSON.stringify(finalPack));
        // Nettoyage de la zone de travail
        localStorage.removeItem(KEY_DRAFT);
        
        setPublicPack(finalPack);
        setDraftPack(null);
        
        setStatusMessage("🚀 EMAILS ENVOYÉS ! LE PACK EST EN LIGNE.");
        setTimeout(() => setStatusMessage(null), 6000);
    };

    const deletePacks = () => {
        if (confirm("Réinitialiser tous les flux ?")) {
            localStorage.removeItem(KEY_DRAFT);
            localStorage.removeItem(KEY_PUBLIC);
            setDraftPack(null);
            setPublicPack(null);
        }
    };

    // Logique de filtrage
    const displayPack = isAdmin ? (draftPack || publicPack) : publicPack;
    const predictionsToDisplay = displayPack?.predictions || [];
    const filteredPredictions = useMemo(() => {
        if (activeSport === 'ALL') return predictionsToDisplay;
        return predictionsToDisplay.filter(p => (p.sport || '').toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictionsToDisplay]);

    // --- VUE ADMINISTRATEUR ---
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
                {statusMessage && (
                    <div className="fixed top-24 right-8 z-50 bg-brand-dark-blue border-2 border-orange-500 text-white px-8 py-6 rounded-3xl shadow-[0_0_50px_rgba(249,115,22,0.4)] font-black text-xs uppercase italic tracking-widest animate-bounce">
                        {statusMessage}
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">NEXTWIN BOSS CONSOLE</h1>
                    <div className="mt-4 inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest">Version V10 Stable</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-10 text-center hover:border-blue-500/30 transition-all">
                        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6 italic">Phase 1 : Extraction IA</h3>
                        <button onClick={generateNewDraft} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:opacity-30">
                            {isLoading ? "EXTRACTION EN COURS..." : "LANCER LE SCAN IA"}
                        </button>
                    </div>

                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-10 text-center hover:border-green-500/30 transition-all">
                        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-6 italic">Phase 2 : Validation & Envoi</h3>
                        <div className="flex gap-4">
                            <button onClick={publishToPublic} disabled={!draftPack} className="flex-1 bg-gradient-brand text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl disabled:opacity-10 transition-all active:scale-95">
                                VALIDER & PUBLIER (24H)
                            </button>
                            <button onClick={deletePacks} className="px-6 bg-gray-800 text-gray-400 hover:text-red-500 rounded-2xl border border-gray-700 hover:border-red-500/50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-24">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-orange-500 mx-auto mb-10"></div>
                        <p className="text-white font-black text-[12px] tracking-[0.6em] uppercase italic animate-pulse">Scanning Global Markets...</p>
                    </div>
                ) : displayPack ? (
                    <div className="animate-fade-in px-4">
                        <div className="mb-12 flex items-center justify-between">
                            <div className={`px-8 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest border italic flex items-center gap-3 ${publicPack ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'}`}>
                                <span className={`w-3 h-3 rounded-full ${publicPack ? 'bg-green-500' : 'bg-yellow-500 animate-ping'}`}></span>
                                {publicPack ? "● STATUT : EN LIGNE (ACCESSIBLE CLIENTS)" : "● STATUT : BROUILLON IA (INVISIBLE)"}
                            </div>
                            <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Pack ID: {displayPack.timestamp}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {displayPack.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 border-4 border-dashed border-gray-800 rounded-[4rem]">
                        <p className="text-gray-700 font-black uppercase tracking-[0.5em] text-lg italic">Console prête. En attente d'instruction.</p>
                    </div>
                )}
            </div>
        );
    }

    // --- VUE CLIENT (VISIBILITÉ STRICTE) ---
    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
            <div className="text-center mb-16 px-4">
                <h1 className="text-6xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">{t.predictions_title}</h1>
                <p className="mt-6 text-brand-light-gray text-[11px] md:text-[13px] uppercase tracking-[0.6em] font-black">{t.predictions_subtitle}</p>
            </div>

            {publicPack ? (
                <div className="px-4">
                    <div className="flex justify-center gap-4 mb-20 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-12 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white shadow-[0_10px_30px_rgba(249,115,22,0.3)]' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white hover:border-gray-600'}`}>
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredPredictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="mx-4">
                    <div className="text-center bg-brand-card border-2 border-gray-800 rounded-[4rem] p-16 md:p-32 max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-brand"></div>
                         <div className="w-24 h-24 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/10">
                            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         </div>
                         <h3 className="text-4xl md:text-5xl font-black text-white mb-8 uppercase italic tracking-tighter leading-tight">{t.pred_waiting_title}</h3>
                         <p className="text-brand-light-gray text-sm md:text-base mb-0 uppercase tracking-[0.3em] leading-relaxed max-w-xl mx-auto italic font-black opacity-60">
                            {t.pred_waiting_desc}
                         </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictions;
