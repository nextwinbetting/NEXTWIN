import React, { useState, useEffect } from 'react';
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
        setStatus("INITIALISATION DU MOTEUR NEURAL...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const now = new Date();
            const fullTime = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const [datePart, timePart] = fullTime.split(' ');

            const prompt = `[ROLE: NEXTWIN NEURAL ENGINE]
            TASK: Identify 8 REAL upcoming matches for Football, Basketball, or Tennis occurring in the next 24-48 hours.
            STRUCTURE: JSON
            {
              "predictions": [
                {
                  "sport": "Football | Basketball | Tennis",
                  "competition": "League Name",
                  "match": "Team A VS Team B",
                  "betType": "1N2 or Over/Under 2.5 or Score Exact",
                  "category": "Standard",
                  "probability": integer (70-95),
                  "analysis": "Short technical data-based analysis emphasizing why this bet has value.",
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
                    temperature: 0.1, // Low temperature for high precision
                    responseMimeType: "application/json"
                }
            });

            // CRITICAL: use response.text, not response.text()
            const responseText = response.text || "";
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format JSON non trouvé");
            
            const data = JSON.parse(jsonMatch[0]);
            const rawPreds = data.predictions || [];
            
            const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title
            })).filter((s: any) => s.uri) || [];

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
                isLive: false,
                sources: sources
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: filtered.slice(0, 8),
                publishedBy: 'NEXTWIN_NEURAL_ENGINE'
            };

            const updatedStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
            setStore(updatedStore);
            setStatus("SCAN TERMINÉ : 8 SIGNAUX IDENTIFIÉS");
        } catch (err: any) {
            console.error("AI Generation Error:", err);
            setStatus("ERREUR ENGINE : SYNCHRONISATION ÉCHOUÉE");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    const publishToClient = () => {
        if (!store.draft) return;
        setIsLoading(true);
        setStatus("DÉPLOIEMENT SUR LE TERMINAL MEMBRE...");

        const validatedPack = { ...store.draft, isValidated: true };
        const updatedStore = {
            ...store,
            activePack: validatedPack,
            draft: null,
            history: [validatedPack, ...store.history].slice(0, 10)
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStore));
        setStore(updatedStore);
        
        setTimeout(() => {
            setIsLoading(false);
            setStatus("VOTRE FLUX EST EN LIGNE ✅");
            setTimeout(() => setStatus(null), 3000);
        }, 1200);
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            {status && (
                <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[60] bg-brand-accent text-black px-8 py-4 rounded-xl shadow-[0_0_40px_rgba(255,107,0,0.3)] font-black text-[11px] tracking-widest uppercase italic animate-slide-up border border-white/20">
                    {status}
                </div>
            )}

            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-display font-black text-white italic uppercase tracking-tighter leading-none">Console Admin</h1>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Contrôle du Flux Neural</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={generateIAPronostics} 
                        disabled={isLoading} 
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-black text-[10px] transition-all uppercase tracking-[0.2em] italic group"
                    >
                        {isLoading ? "CALCUL EN COURS..." : "1. GÉNÉRER FLUX IA"}
                    </button>
                    {store.draft && (
                        <button 
                            onClick={publishToClient} 
                            disabled={isLoading} 
                            className="bg-gradient-pro text-white px-8 py-4 rounded-xl font-black text-[10px] transition-all shadow-[0_0_30px_rgba(255,107,0,0.3)] uppercase tracking-[0.2em] italic hover:scale-105 active:scale-95"
                        >
                            2. DÉPLOYER LE PACK
                        </button>
                    )}
                </div>
            </div>

            {store.draft && (
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-[1px] flex-1 bg-white/5"></div>
                        <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.5em] italic">Brouillon en attente de validation</h2>
                        <div className="h-[1px] flex-1 bg-white/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-70 hover:opacity-100 transition-opacity">
                        {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </div>
            )}

            <div>
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                    <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] italic">Flux Actif sur le Terminal</h2>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
                {store.activePack ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {store.activePack.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                ) : (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] py-32 text-center">
                        <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.8em] italic">Aucun flux neural en ligne actuellement.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predictions;