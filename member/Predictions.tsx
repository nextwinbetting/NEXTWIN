
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// Source unique de vérité pour tout le site
const DB_KEY = 'NEXTWIN_GLOBAL_STORE_V11';

interface GlobalDB {
    draft: DailyPack | null;
    public: DailyPack | null;
    lastUpdated: number;
}

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [db, setDb] = useState<GlobalDB>({ draft: null, public: null, lastUpdated: 0 });
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // CHARGEMENT SYNCHRONE ET IMMEDIAT
    const refreshData = () => {
        const raw = localStorage.getItem(DB_KEY);
        if (raw) {
            try {
                const parsed: GlobalDB = JSON.parse(raw);
                const now = Date.now();
                
                // Vérification de péremption du pack public (24h)
                if (parsed.public && (now - parsed.public.timestamp) > 24 * 60 * 60 * 1000) {
                    parsed.public = null;
                    localStorage.setItem(DB_KEY, JSON.stringify(parsed));
                }
                
                setDb(parsed);
            } catch (e) {
                console.error("Erreur DB", e);
            }
        }
    };

    useEffect(() => {
        refreshData();
        // Écoute les changements depuis d'autres onglets
        window.addEventListener('storage', refreshData);
        // Intervalle ultra-rapide pour une réactivité maximale (1s)
        const timer = setInterval(refreshData, 1000);
        return () => {
            window.removeEventListener('storage', refreshData);
            clearInterval(timer);
        };
    }, []);

    // --- ACTIONS ADMIN ---
    const handleGenerate = async () => {
        setIsLoading(true);
        setStatusMessage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `[ROLE: SPORTS ANALYST V11]
            Generate 8 predictions for the next 24 hours.
            Format: JSON only { "predictions": [...] }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("IA Error");
            
            const data = JSON.parse(jsonMatch[0]);
            const predictions = data.predictions.map((p: any, i: number) => ({
                id: `v11-${Date.now()}-${i}`,
                sport: p.sport || 'Football',
                match: p.match || 'Match Pro',
                betType: p.betType || 'Analyse IA',
                category: i === 6 ? 'Bonus Football' : i === 7 ? 'Bonus Basket' : 'Standard',
                date: new Date().toLocaleDateString('fr-FR'),
                time: p.matchTime || '20:00',
                probability: p.probability || 78,
                analysis: p.analysis || "Validation technique par NEXTWIN.",
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter(s => s.uri).slice(0, 3) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions,
                publishedBy: 'BOSS'
            };

            const updatedDb = { ...db, draft: newDraft, lastUpdated: Date.now() };
            localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));
            setDb(updatedDb);
            setStatusMessage("✓ BROUILLON PRÊT");
        } catch (err) {
            setStatusMessage("⚠ ERREUR IA");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = () => {
        if (!db.draft) return;
        
        const publicPack: DailyPack = {
            ...db.draft,
            isValidated: true,
            timestamp: Date.now() // Le pack est frais à partir de MAINTENANT
        };

        const updatedDb: GlobalDB = {
            ...db,
            draft: null, // On vide le brouillon
            public: publicPack, // On remplit le public
            lastUpdated: Date.now()
        };

        localStorage.setItem(DB_KEY, JSON.stringify(updatedDb));
        setDb(updatedDb);
        setStatusMessage("🚀 DIFFUSION CLIENTS ACTIVÉE !");
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const handleClear = () => {
        if (confirm("Tout supprimer ?")) {
            const emptyDb = { draft: null, public: null, lastUpdated: Date.now() };
            localStorage.setItem(DB_KEY, JSON.stringify(emptyDb));
            setDb(emptyDb);
        }
    };

    // --- FILTRAGE DES DONNÉES ---
    // En tant qu'admin, on voit le brouillon s'il existe, sinon le pack public.
    // En tant que client, on ne voit QUE le pack public.
    const activePack = isAdmin ? (db.draft || db.public) : db.public;
    const list = activePack?.predictions || [];
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return list;
        return list.filter(p => p.sport.toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, list]);

    // --- VUE ADMIN ---
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
                {statusMessage && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-orange-600 text-white px-10 py-5 rounded-full shadow-[0_0_50px_rgba(249,115,22,0.6)] font-black text-xs uppercase tracking-[0.3em] animate-bounce">
                        {statusMessage}
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">CONTRÔLEUR DE DIFFUSION</h1>
                    <div className="mt-6 flex justify-center gap-4">
                        <div className={`flex items-center gap-2 px-5 py-2 rounded-full border ${db.public ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-gray-800 border-gray-700 text-gray-500'}`}>
                            <span className={`w-2 h-2 rounded-full ${db.public ? 'bg-green-500 animate-pulse' : 'bg-gray-700'}`}></span>
                            <span className="text-[10px] font-black uppercase">Statut : {db.public ? 'LIVE (CLIENTS OK)' : 'HORS LIGNE'}</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <button onClick={handleGenerate} disabled={isLoading} className="bg-brand-card border-2 border-gray-800 hover:border-blue-500 p-10 rounded-[2.5rem] transition-all group">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-4 italic">Action 1</span>
                        <span className="text-white font-black text-xl uppercase tracking-widest group-hover:text-blue-500">
                            {isLoading ? "SCAN EN COURS..." : "GÉNÉRER NOUVEAU PACK IA"}
                        </span>
                    </button>

                    <button onClick={handlePublish} disabled={!db.draft} className="bg-brand-card border-2 border-gray-800 hover:border-green-500 p-10 rounded-[2.5rem] transition-all group disabled:opacity-20">
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest block mb-4 italic">Action 2</span>
                        <span className="text-white font-black text-xl uppercase tracking-widest group-hover:text-green-500">
                            VALIDER & PUBLIER AUX CLIENTS
                        </span>
                    </button>
                </div>

                {db.draft && (
                    <div className="mb-20">
                        <div className="flex items-center justify-between mb-8 border-b border-yellow-500/20 pb-4">
                            <h2 className="text-yellow-500 font-black uppercase tracking-[0.4em] italic text-sm">Aperçu du Brouillon (Privé)</h2>
                            <button onClick={handleClear} className="text-gray-600 hover:text-red-500 font-black text-[10px] uppercase">Annuler tout</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {db.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}

                {db.public && (
                    <div>
                        <h2 className="text-green-500 font-black uppercase tracking-[0.4em] italic text-sm mb-8 border-b border-green-500/20 pb-4">Actuellement en ligne (Public)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60 grayscale-[0.5] hover:grayscale-0 transition-all">
                            {db.public.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                )}
                
                {!db.draft && !db.public && !isLoading && (
                    <div className="text-center py-40 border-4 border-dashed border-gray-800 rounded-[4rem]">
                         <p className="text-gray-700 font-black uppercase tracking-[0.6em] text-xl italic">AUCUN FLUX ACTIF</p>
                    </div>
                )}
            </div>
        );
    }

    // --- VUE CLIENT ---
    return (
        <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-none">{t.predictions_title}</h1>
                <p className="mt-8 text-brand-light-gray text-[11px] md:text-[14px] uppercase tracking-[0.8em] font-black opacity-40">{t.predictions_subtitle}</p>
            </div>

            {db.public ? (
                <div className="animate-fade-in">
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
                <div className="text-center bg-brand-card border-2 border-gray-800 rounded-[5rem] p-24 md:p-40 max-w-5xl mx-auto shadow-2xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent"></div>
                     <div className="w-32 h-32 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-16 animate-pulse border border-orange-500/20">
                        <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-5xl md:text-7xl font-black text-white mb-10 uppercase italic tracking-tighter leading-none">{t.pred_waiting_title}</h3>
                     <p className="text-brand-light-gray text-base md:text-xl uppercase tracking-[0.4em] leading-relaxed max-w-2xl mx-auto italic font-black opacity-30">
                        {t.pred_waiting_desc}
                     </p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
