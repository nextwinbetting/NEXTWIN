
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// VERSION 16 - CONSOLE ADMIN SÉCURISÉE (FRANÇAIS NATIF)
const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_V16';

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

    // MOTEUR D'ANALYSE EXPERT V16 - FOCUS FRANCE & LIVESCORE
    const generateIAPronostics = async () => {
        setIsLoading(true);
        setStatus("SCAN DES FLUX LIVESCORE.IN/FR/ EN COURS...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: ANALYSTE SPORTIF SENIOR NEXTWIN]
            OBJECTIF: Générer 8 pronostics sportifs ultra-fiables (6 Standards + 2 Bonus) pour aujourd'hui/demain.
            
            INSTRUCTIONS CRITIQUES :
            1. UTILISE l'outil de recherche Google pour consulter LiveScore.in/fr/ et extraire les MATCHS RÉELS de la journée.
            2. LES HORAIRES doivent correspondre exactement à ceux affichés sur LiveScore.in/fr/ (Heure de Paris, ex: 20:45).
            3. LANGUE : Tout le contenu JSON doit être rédigé en FRANÇAIS (noms d'équipes, types de paris, analyses).
            4. FILTRE : Probabilité minimale de 70% par sélection.
            
            STRUCTURE DU PACK (8 PRONOS) :
            - Football : 2 vainqueurs les plus probables.
            - Basketball : 2 vainqueurs les plus probables.
            - Tennis : 2 vainqueurs les plus probables.
            - BONUS Football : 1 pari "Les deux équipes marquent - OUI" (prob >= 70%).
            - BONUS Basketball : 1 pari "Total Points Plus/Moins" (prob >= 70%).
            
            FORMAT DE SORTIE JSON UNIQUEMENT :
            {
              "predictions": [
                {
                  "sport": "Football",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Victoire Équipe A",
                  "category": "Standard",
                  "date": "JJ.MM.AAAA",
                  "time": "HH:MM",
                  "probability": 75,
                  "analysis": "Analyse technique en français basée sur les stats xG et la forme actuelle."
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
            if (!jsonMatch) throw new Error("Réponse IA non exploitable");

            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v16-${Date.now()}-${i}`,
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
            setStatus("✓ DONNÉES LIVESCORE EXTRAITES ET ANALYSÉES");
        } catch (err) {
            setStatus("⚠ ERREUR DE SYNCHRONISATION LIVESCORE");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const clearDraft = () => {
        if (confirm("Supprimer ce brouillon IA ?")) {
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
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">PRONOSTICS IA : ESPACE BOSS</h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">
                    CONSOLE DE GESTION V16 • SYNCHRONISATION LIVESCORE.IN/FR/
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-10 rounded-[3rem] transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-2xl uppercase italic tracking-tighter block">LANCER LE SCAN LIVESCORE</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 transition-colors">Extraction 6+2 (Français)</span>
                </button>

                {store.draft && (
                    <button 
                        onClick={clearDraft}
                        className="bg-red-900/10 border-2 border-red-900/30 hover:border-red-500 p-10 rounded-[3rem] transition-all group flex-1 max-w-lg"
                    >
                        <span className="text-red-500 font-black text-2xl uppercase italic tracking-tighter block">EFFACER LE PACK</span>
                        <span className="text-red-900 text-[10px] font-black uppercase tracking-widest block mt-2">Réinitialiser la console</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-orange-500/30"></div>
                        <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-xs italic">APERÇU DES PRONOSTICS EN FRANÇAIS</h2>
                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-orange-500/30"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-800 rounded-[5rem] bg-gray-900/10">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-8">
                        <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-gray-500 font-black uppercase text-lg tracking-widest italic">Système de scan prêt</h3>
                    <p className="text-gray-700 text-[11px] uppercase font-bold tracking-[0.4em] mt-3">Prêt pour l'analyse multi-sources V16</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
