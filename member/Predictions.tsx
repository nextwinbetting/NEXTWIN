
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
        setStatus("ANALYSE DES FLUX DE MARCHÉ...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const now = new Date();
            const fullTime = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const [datePart, timePart] = fullTime.split(' ');

            const prompt = `[ROLE: SENIOR QUANTITATIVE SPORTS TRADER]
            [MISSION: GENERATE HIGH-VALUE PREDICTIONS PACK]
            [SYSTEM_TIME: ${fullTime} (Paris UTC+1)]
            
            TASK: Identify 8 REAL upcoming matches for Football, Basketball, or Tennis with positive expected value.
            
            CONSTRAINTS:
            1. FUTURE MATCHES ONLY: Kick-off must be at least 1 hour from ${timePart}.
            2. REAL DATA: Sourced from actual top-tier leagues (Premier League, LaLiga, NBA, ATP, WTA, etc.).
            3. DIVERSITY: 6 'Standard' (High Win Prob) and 2 'Bonus' (Niche markets like BTTS or Player Props).
            4. ACCURACY: Probability score based on recent form, xG/xPoints, and key injury reports.
            5. ANALYSIS: Expert, technical tone. Use betting terminology. Max 100 characters per analysis.

            JSON STRUCTURE REQUIRED:
            {
              "predictions": [
                {
                  "sport": "Football | Basketball | Tennis",
                  "competition": "League/Tournament Name",
                  "match": "Team A VS Team B",
                  "betType": "Specific bet recommendation",
                  "category": "Standard | Bonus",
                  "probability": integer (70-95),
                  "analysis": "Technical expert analysis snippet.",
                  "date": "${datePart}",
                  "time": "HH:MM (Paris Time)"
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
                id: `nw-pro-${Date.now()}-${i}`,
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
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter((s: any) => s.uri).slice(0, 2) || []
            }));

            if (filtered.length === 0) throw new Error("Aucun signal détecté sur les flux.");

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: filtered,
                publishedBy: 'NEXTWIN_QUANT_ENGINE_V10'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus(`✓ ${filtered.length} SÉLECTIONS GÉNÉRÉES`);
        } catch (err: any) {
            setStatus(`⚠ ERREUR : ${err.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("RENDU GRAPHIQUE HAUTE DÉFINITION...");
        try {
            await new Promise(r => setTimeout(r, 1000));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#0f0e1f', scale: 2.5, useCORS: true,
                onclone: (cloned: any) => {
                    cloned.querySelectorAll('.logo-win-part').forEach((el: any) => el.style.color = '#F97316');
                }
            });
            const link = document.createElement('a');
            link.download = `NEXTWIN_ELITE_PACK_${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
            setStatus("✓ EXPORT RÉUSSI");
        } catch { setStatus("⚠ ERREUR RENDU"); }
        finally { setIsLoading(false); setTimeout(() => setStatus(null), 2500); }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f]/90 border border-orange-500/20 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-2xl flex items-center gap-4">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="font-black text-[10px] uppercase tracking-[0.3em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-5 py-1.5 rounded-full mb-4">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-[0.5em] italic">ADMIN CONSOLE • V10 QUANTUM</span>
                </div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">FLUX <span className="text-transparent bg-clip-text bg-gradient-brand">ELITE V10</span></h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
                <button onClick={generateIAPronostics} disabled={isLoading} className="bg-[#1a1835] border border-white/5 hover:border-orange-500/30 p-6 rounded-2xl transition-all group flex-1 max-w-md relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-sm uppercase italic tracking-tighter block">DÉMARRER LE SCANNER</span>
                    <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em] block mt-1 opacity-60">Sourcing Quantitatif Gemini 3 Pro</span>
                </button>
                {store.draft && (
                    <button onClick={() => { if(confirm("Vider?")) setStore({...store, draft: null}); }} className="bg-red-950/20 border border-red-500/20 hover:bg-red-500 hover:text-white px-8 rounded-2xl transition-all shadow-lg text-red-500 text-[9px] font-black uppercase tracking-widest italic">RÉINITIALISER</button>
                )}
            </div>

            {store.draft && (
                <div className="animate-fade-in space-y-8">
                    <div className="bg-[#151425]/40 p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[9px] italic">VÉRIFICATION DU FLUX SORTANT</h2>
                            <p className="text-gray-500 text-[8px] font-bold uppercase mt-1 tracking-widest italic">PRÊT POUR LE DÉPLOIEMENT MEMBRE</p>
                        </div>
                        <button onClick={downloadAsImage} disabled={isLoading} className="bg-gradient-brand text-white font-black px-8 py-3.5 rounded-xl flex items-center gap-3 transition-all text-[9px] uppercase tracking-widest italic shadow-xl hover:scale-105 active:scale-95">EXPORT GRAPHIQUE HD</button>
                    </div>

                    <div className="rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl bg-[#0f0e1f]">
                        <div ref={previewContainerRef} className="bg-[#0f0e1f] p-12 lg:p-20 relative overflow-hidden">
                            <div className="flex flex-col items-center mb-16 relative z-10">
                                <div className="mb-8 transform scale-90"><NextWinLogo /></div>
                                <div className="bg-orange-500/5 border border-orange-500/20 px-8 py-2 rounded-full backdrop-blur-md">
                                    <span className="text-orange-500 font-black text-[9px] uppercase tracking-[0.6em] italic">V10 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                                {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                            </div>
                            <div className="mt-20 text-center opacity-20">
                                <p className="text-gray-500 font-black text-[8px] uppercase tracking-[1.2em] italic">QUANTUM VERIFIED • NEXTWIN.AI • {new Date().getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictions;
