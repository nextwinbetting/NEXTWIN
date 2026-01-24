
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// VERSION 15 - ADMIN CONSOLE ONLY
const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_V15';

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

    // MOTEUR D'ANALYSE EXPERT V15
    const generateIAPronostics = async () => {
        setIsLoading(true);
        setStatus("SCAN DES FLUX LIVESCORE.IN (SCHEDULES)...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            // PROMPT V15 : EXTRÊME PRÉCISION SUR LES DATES ET HEURES
            const prompt = `[ROLE: CHIEF SPORTS DATA ANALYST]
            GOAL: Generate 8 ultra-reliable sports predictions (6 Standard + 2 Bonus) for the next 24 hours.
            
            MANDATORY STEPS:
            1. Access LiveScore.in/fr/ and SofaScore to find TODAYS exact matches and schedules.
            2. Match times MUST be in Paris (CET/CEST) timezone. No fictional times.
            3. Probability filter: min 70% per pick.
            
            PACK STRUCTURE:
            - Football: 2 most probable winners.
            - Basketball: 2 most probable winners.
            - Tennis: 2 most probable winners.
            - BONUS Football: 1 "Both Teams to Score - Yes" with prob >= 70%.
            - BONUS Basketball: 1 "Total Points Over/Under" with prob >= 70%.
            
            JSON OUTPUT ONLY:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Team A vs Team B",
                  "betType": "Team A Winner",
                  "category": "Standard",
                  "date": "DD.MM.YYYY",
                  "time": "HH:MM",
                  "probability": 75,
                  "analysis": "Technical reason from stats."
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
            if (!jsonMatch) throw new Error("Format Invalide");

            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v15-${Date.now()}-${i}`,
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
            setStatus("✓ PRONOSTICS RÉELS EXTRAITS AVEC SUCCÈS");
        } catch (err) {
            setStatus("⚠ ÉCHEC DE SYNCHRONISATION LIVESCORE");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const clearDraft = () => {
        if (confirm("Supprimer le brouillon actuel ?")) {
            const newStore = { ...store, draft: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4">
                    {isLoading && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent animate-spin rounded-full"></div>}
                    <span className="font-black text-[10px] uppercase tracking-widest italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">PRONOSTICS IA : ESPACE BOSS</h1>
                <p className="mt-2 text-gray-500 text-[10px] uppercase tracking-[0.5em] font-black">
                    Interface de contrôle réservée à NEXTWIN_BOSS • Moteur Gemini 3 Pro
                </p>
            </div>

            <div className="flex justify-center gap-6 mb-16">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-10 rounded-[2.5rem] transition-all group w-full max-w-sm"
                >
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block">LANCER L'EXTRACTION</span>
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-widest block mt-2">Grounding LiveScore.in + SofaScore</span>
                </button>

                {store.draft && (
                    <button 
                        onClick={clearDraft}
                        className="bg-red-900/10 border-2 border-red-900/30 hover:border-red-500 p-10 rounded-[2.5rem] transition-all group w-full max-w-sm"
                    >
                        <span className="text-red-500 font-black text-xl uppercase italic tracking-tighter block">EFFACER BROUILLON</span>
                        <span className="text-red-900 text-[9px] font-black uppercase tracking-widest block mt-2">Réinitialiser la session</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-[2px] flex-1 bg-orange-500/20"></div>
                        <h2 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[10px] italic">APERÇU DU PACK IA SÉCURISÉ</h2>
                        <div className="h-[2px] flex-1 bg-orange-500/20"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-[3rem]">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-gray-500 font-black uppercase text-sm tracking-widest italic">Aucun pronostic généré</h3>
                    <p className="text-gray-700 text-[10px] uppercase font-bold tracking-widest mt-2">Appuyez sur 'Lancer l'extraction' pour débuter le scan</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
