
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_ACTIVE';

interface AdminStore {
    draft: DailyPack | null;
    history: DailyPack[];
}

declare var html2canvas: any;

const Predictions: React.FC<{ language: Language; isAdmin: boolean }> = ({ language, isAdmin }) => {
    const t = translations[language];
    const [store, setStore] = useState<AdminStore>({ draft: null, history: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    
    const previewContainerRef = useRef<HTMLDivElement>(null);

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
        setStatus("RECHERCHE DE MATCHS...");
        
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

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        } catch (err: any) {
            setStatus("Erreur de génération.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 2000);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 border border-white/10 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-xl">
                    <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
                </div>
            )}

            <div className="mb-10">
                <h1 className="text-2xl font-bold text-white">Gestion des Pronostics</h1>
                <p className="text-gray-400 text-sm mt-1">Générez et validez le flux quotidien.</p>
            </div>

            <div className="flex gap-4 mb-12">
                <button onClick={generateIAPronostics} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                    {isLoading ? "Chargement..." : "Générer les matchs"}
                </button>
                {store.draft && (
                    <button onClick={() => { if(confirm("Vider?")) setStore({...store, draft: null}); }} className="bg-white/5 hover:bg-white/10 text-gray-400 px-6 py-3 rounded-xl font-bold text-sm transition-all">Réinitialiser</button>
                )}
            </div>

            {store.draft && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                </div>
            )}
        </div>
    );
};

export default Predictions;
