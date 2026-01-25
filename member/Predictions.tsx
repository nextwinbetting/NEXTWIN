
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_ACTIVE';

interface AdminStore {
    draft: DailyPack | null;
    activePack: DailyPack | null;
    history: DailyPack[];
}

const Predictions: React.FC<{ language: Language; isAdmin: boolean }> = ({ language, isAdmin }) => {
    const t = translations[language];
    const [store, setStore] = useState<AdminStore>({ draft: null, activePack: null, history: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const sync = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            setStore({
                draft: data.draft || null,
                activePack: data.activePack || null,
                history: data.history || []
            });
        }
    };

    useEffect(() => {
        sync();
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const generateIAPronostics = async () => {
        setIsLoading(true);
        setStatus("GÉNÉRATION DU BROUILLON...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const now = new Date();
            const fullTime = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const [datePart, timePart] = fullTime.split(' ');

            const prompt = `[ROLE: SPORTS DATA ANALYST]
            TASK: Identify 8 REAL upcoming matches for Football, Basketball, or Tennis.
            STRUCTURE: JSON
            {
              "predictions": [
                {
                  "sport": "Football | Basketball | Tennis",
                  "competition": "League Name",
                  "match": "Team A VS Team B",
                  "betType": "Prediction",
                  "category": "Standard | Bonus",
                  "probability": integer (70-95),
                  "analysis": "Short technical analysis.",
                  "date": "${datePart}",
                  "time": "HH:MM"
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.2,
                    responseMimeType: "application/json"
                }
            });

            const text = response.text || "";
            const data = JSON.parse(text);
            const rawPreds = data.predictions || [];
            
            const filtered: Prediction[] = rawPreds.map((p: any, i: number) => ({
                id: `nw-${Date.now()}-${i}`,
                sport: p.sport as Sport,
                competition: p.competition,
                match: p.match,
                betType: p.betType,
                category: p.category || 'Standard',
                probability: p.probability,
                analysis: p.analysis,
                date: p.date,
                time: p.time,
                isLive: false
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: filtered,
                publishedBy: 'NEXTWIN_ENGINE'
            };

            const updatedStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
            setStore(updatedStore);
            setStatus("BROUILLON PRÊT");
        } catch (err: any) {
            setStatus("ERREUR MOTEUR");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const publishToClient = () => {
        if (!store.draft) return;
        
        setIsLoading(true);
        setStatus("PUBLICATION EN COURS...");

        const validatedPack = {
            ...store.draft,
            isValidated: true
        };

        const updatedStore = {
            ...store,
            activePack: validatedPack,
            draft: null, // On vide le brouillon après publication
            history: [validatedPack, ...store.history].slice(0, 10)
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
        setStore(updatedStore);
        
        setTimeout(() => {
            setIsLoading(false);
            setStatus("ENVOYÉ AUX CLIENTS ✅");
            setTimeout(() => setStatus(null), 3000);
        }, 1000);
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-orange-500 text-white px-8 py-3 rounded-full shadow-2xl font-black text-[10px] tracking-widest uppercase animate-bounce">
                    {status}
                </div>
            )}

            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Console Administration</h1>
                    <p className="text-gray-400 text-sm mt-1">Gérez le flux de pronostics envoyé aux membres.</p>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={generateIAPronostics} 
                        disabled={isLoading} 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-bold text-xs transition-all disabled:opacity-50 uppercase tracking-wider"
                    >
                        {isLoading ? "Chargement..." : "1. Générer Brouillon"}
                    </button>
                    
                    {store.draft && (
                        <button 
                            onClick={publishToClient} 
                            disabled={isLoading}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-wider flex items-center gap-2 animate-pulse"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            2. Envoyer espace client
                        </button>
                    )}
                </div>
            </div>

            {/* Draft Preview Section */}
            {store.draft && (
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Aperçu du Brouillon (Non publié)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
                        {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            )}

            {/* Active Pack Section */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h2 className="text-sm font-bold text-white uppercase tracking-widest">Flux Actuellement en Ligne</h2>
                </div>
                {store.activePack ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {store.activePack.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-20 text-center">
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Aucun pronostic publié aujourd'hui.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictions;
