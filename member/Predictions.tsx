
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// VERSION 17 - CONSOLE ADMIN SÉCURISÉE (COMPÉTITIONS + FRANÇAIS)
const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_V17';

interface AdminStore {
    draft: DailyPack | null;
    history: DailyPack[];
}

const Predictions: React.FC<{ language: Language; isAdmin: boolean }> = ({ language, isAdmin }) => {
    const t = translations[language];
    const [store, setStore] = useState<AdminStore>({ draft: null, history: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const sync = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setStore(JSON.parse(raw));
    };

    useEffect(() => {
        sync();
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const generateIAPronostics = async () => {
        setIsLoading(true);
        setStatus("SCAN DES COMPÉTITIONS SUR LIVESCORE.IN/FR/...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: CHIEF ANALYST NEXTWIN V17]
            OBJECTIF: Générer 8 pronostics sportifs réels (6 Standards + 2 Bonus) pour les prochaines 24h.
            
            INSTRUCTIONS CRITIQUES :
            1. UTILISE Google Search pour consulter LiveScore.in/fr/ (Section Football, Basketball, Tennis).
            2. RÉCUPÈRE : Nom de la Compétition (ex: Ligue 1, NBA, Roland Garros), Équipes, Date et Heure (Paris).
            3. LANGUE : Tout le contenu JSON doit être en FRANÇAIS.
            4. FILTRE : Probabilité minimale de 70%.
            
            PACK STRUCTURE (8 PRONOS) :
            - Football : 2 vainqueurs (inclure la ligue).
            - Basketball : 2 vainqueurs (inclure la ligue).
            - Tennis : 2 vainqueurs (inclure le tournoi).
            - BONUS Football : 1 "Les deux équipes marquent - OUI" (Ligue précise).
            - BONUS Basketball : 1 "Total Points Plus/Moins" (Ligue précise).
            
            JSON OUTPUT ONLY:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "competition": "Nom de la Ligue/Tournoi",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Victoire Équipe A",
                  "category": "Standard",
                  "date": "JJ.MM.AAAA",
                  "time": "HH:MM",
                  "probability": 75,
                  "analysis": "Analyse flash technique en français."
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Flux corrompu");

            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v17-${Date.now()}-${i}`,
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

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus("✓ PACK 6+2 GÉNÉRÉ AVEC COMPÉTITIONS");
        } catch (err) {
            setStatus("⚠ ÉCHEC DU SCAN DES COMPÉTITIONS");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const clearDraft = () => {
        if (confirm("Supprimer le pack actuel ?")) {
            const newStore = { ...store, draft: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.4)] backdrop-blur-xl flex items-center gap-4">
                    {isLoading && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent animate-spin rounded-full"></div>}
                    <span className="font-black text-[10px] uppercase tracking-widest italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    NEXTWIN <span className="text-orange-500">BOSS</span> V17
                </h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">
                    CONTRÔLE DES COMPÉTITIONS & ANALYSE RÉELLE LIVESCORE
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-16 px-4">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-10 rounded-[3rem] transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-2xl uppercase italic tracking-tighter block">SCANNER LIVESCORE</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 transition-colors italic">Extraire Compétitions + Matchs</span>
                </button>

                {store.draft && (
                    <button 
                        onClick={clearDraft}
                        className="bg-red-900/10 border-2 border-red-900/30 hover:border-red-500 p-10 rounded-[3rem] transition-all group flex-1 max-w-lg"
                    >
                        <span className="text-red-500 font-black text-2xl uppercase italic tracking-tighter block">RÉINITIALISER</span>
                        <span className="text-red-900 text-[10px] font-black uppercase tracking-widest block mt-2 italic">Nettoyer la session actuelle</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in px-4">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-orange-500/30"></div>
                        <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] italic">APERÇU DU PACK ORIENTÉ CLIENT</h2>
                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-orange-500/30"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-800 rounded-[5rem] bg-gray-900/10 mx-4">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-gray-500 font-black uppercase text-lg tracking-widest italic">Aucun flux actif</h3>
                    <p className="text-gray-700 text-[11px] uppercase font-bold tracking-[0.4em] mt-3">Prêt pour l'extraction V17</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
