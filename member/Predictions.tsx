
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
        setStatus("RECHERCHE DES MATCHS RÉELS...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const now = new Date();
            const dateToday = now.toLocaleDateString('fr-FR');
            const timeNow = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const prompt = `[SYSTEM: SPORTS ANALYST]
            MISSION : Scanne le web pour trouver 8 matchs RÉELS de Football, Basketball ou Tennis programmés aujourd'hui (${dateToday}) ou demain.
            FORMAT EXCLUSIF : JSON STRICT.
            SCHÉMA JSON : 
            {
              "predictions": [
                {
                  "sport": "Football",
                  "competition": "Nom de la ligue",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Pronostic recommandé",
                  "probability": 75,
                  "analysis": "Pourquoi ce pronostic ?",
                  "date": "JJ/MM/AAAA",
                  "time": "HH:MM"
                }
              ]
            }
            RÈGLES : Ne renvoie QUE le JSON. Ne sois pas verbeux. Utilise Google Search pour vérifier les calendriers réels.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0,
                    responseMimeType: "application/json"
                }
            });

            const text = response.text || "";
            // Robust JSON extraction
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format de réponse invalide.");

            const data = JSON.parse(jsonMatch[0]);
            const rawPreds = data.predictions || [];
            
            if (!Array.isArray(rawPreds) || rawPreds.length === 0) {
                throw new Error("Aucun match trouvé.");
            }

            // Fix type error by explicitly typing the array as Prediction[] to satisfy the literal union for 'category'
            const preds: Prediction[] = rawPreds.map((p: any, i: number) => ({
                id: `nw-pred-${Date.now()}-${i}`,
                sport: p.sport || Sport.Football,
                competition: p.competition || "International",
                match: p.match || "Match Inconnu",
                betType: p.betType || "TBD",
                category: 'Standard',
                probability: p.probability || 70,
                analysis: p.analysis || "Analyse automatique générée par l'Engine.",
                date: p.date || dateToday,
                time: p.time || timeNow,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter((s: any) => s.uri).slice(0, 2) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: preds,
                publishedBy: 'ADMIN'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus(`✓ ${preds.length} PRONOSTICS PRÊTS`);
        } catch (err: any) {
            console.error("Erreur IA:", err);
            setStatus(`⚠ ERREUR: ${err.message || 'Engine Fail'}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("RENDU VISUEL HD...");
        
        try {
            await new Promise(r => setTimeout(r, 500));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 2.5, 
                useCORS: true
            });
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `NextWin_Pack_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
            link.href = image;
            link.click();
            setStatus("✓ TÉLÉCHARGÉ");
        } catch (err) {
            setStatus("⚠ ÉCHEC RENDU");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 2500);
        }
    };

    const clearDraft = () => {
        if (confirm("Réinitialiser le pack en cours ?")) {
            const newStore = { ...store, draft: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f] border border-orange-500/40 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-2xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest italic">CONSOLE ADMIN ENGINE</span>
                </div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    PILOTAGE DU <span className="text-orange-500">PACK PREMIUM</span>
                </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-16">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border border-white/5 hover:border-orange-500/40 p-8 rounded-3xl transition-all group flex-1 max-w-md relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-lg uppercase italic tracking-tighter block">LANCER LE SCAN IA TEMPS RÉEL</span>
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] block mt-2 opacity-50 group-hover:opacity-100 transition-opacity">Vérification des calendriers mondiaux</span>
                </button>

                {store.draft && (
                    <button onClick={clearDraft} className="bg-red-900/10 border border-red-900/20 hover:border-red-500 p-8 rounded-3xl transition-all w-full md:w-auto">
                        <span className="text-red-500 font-black text-xs uppercase italic tracking-widest">RESET</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 bg-gray-900/50 p-6 rounded-3xl border border-white/5">
                        <div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] italic">APERÇU DU PACK IA</h2>
                            <p className="text-gray-500 text-[8px] font-bold uppercase mt-1 tracking-widest">{store.draft.predictions.length} ÉVÉNEMENTS DÉTECTÉS</p>
                        </div>
                        <button onClick={downloadAsImage} disabled={isLoading} className="w-full sm:w-auto bg-gradient-brand text-white font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all text-[10px] uppercase tracking-widest italic shadow-xl shadow-orange-500/20 hover:scale-105">
                            TÉLÉCHARGER LE VISUEL HD
                        </button>
                    </div>

                    <div ref={previewContainerRef} className="bg-[#110f1f] rounded-[3.5rem] p-12 border border-white/10 relative overflow-hidden shadow-2xl">
                        <div className="flex flex-col items-center mb-20 relative z-10">
                            <NextWinLogo className="h-12 mb-8" />
                            <div className="bg-orange-500/10 border border-orange-500/30 px-10 py-2.5 rounded-full backdrop-blur-md">
                                <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.4em] italic">ÉDITION OFFICIELLE • {new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                        <div className="mt-24 text-center opacity-40">
                            <p className="text-gray-600 font-black text-[9px] uppercase tracking-[1.5em] italic">ANALYSE PRÉDICTIVE • HAUTE PRÉCISION • WWW.NEXTWIN.AI</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-800 rounded-[3rem] opacity-20 bg-white/[0.01]">
                    <svg className="mx-auto h-16 w-16 text-gray-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.75 17L9 21l-3.5-3.5L2 21l.75-7.25M21 3v6h-6m6-6L14 10" /></svg>
                    <p className="text-gray-500 text-[11px] uppercase font-black tracking-[0.6em] italic">AUCUNE DONNÉE DANS LE FLUX ACTUEL</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
