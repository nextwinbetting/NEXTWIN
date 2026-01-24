
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
        setStatus("CONNEXION AUX FLUX PRO (GEMINI 3 PRO)...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const now = new Date();
            const dateToday = now.toLocaleDateString('fr-FR');
            const fullIso = now.toISOString();
            const timeNow = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', hour12: false });

            // Prompt ultra-directif pour Gemini 3 Pro
            const prompt = `[ROLE: ELITE SPORTS TRADER & DATA SCIENTIST]
            [CONTEXT: UTC TIME IS ${fullIso}. LOCAL TIME IS ${timeNow} (${dateToday})]

            MISSION CRITIQUE :
            1. Scanne Flashscore, SofaScore et ESPN pour trouver 8 matchs de Football, Basketball ou Tennis.
            2. SECURITE TEMPORELLE : N'inclus QUE des matchs qui commencent au minimum 1 HEURE APRÈS ${timeNow}. 
            3. Interdiction formelle des matchs "En cours", "Terminés", "Reportés".
            4. Vérifie l'orthographe exacte des compétitions (ex: "Premier League", "EuroLeague").

            FORMAT DE RÉPONSE : JSON PUR.
            SCHÉMA :
            {
              "predictions": [
                {
                  "sport": "Football | Basketball | Tennis",
                  "competition": "Nom exact",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Type de pari (ex: Victoire A, +2.5 buts, etc)",
                  "probability": 70-95,
                  "analysis": "Analyse technique détaillée (forme, xG, absences)",
                  "date": "${dateToday}",
                  "time": "HH:MM (Heure précise du coup d'envoi)"
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview', // Passage au modèle Pro pour une qualité maximale
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1, // Très bas pour éviter les hallucinations
                    responseMimeType: "application/json"
                }
            });

            const text = response.text || "";
            const data = JSON.parse(text);
            const rawPreds = data.predictions || [];
            
            // FILTRE DE SÉCURITÉ CLIENT (Double check mathématique)
            const filteredPreds: Prediction[] = rawPreds
                .map((p: any, i: number) => {
                    const [hour, minute] = p.time.split(':').map(Number);
                    const matchDate = new Date();
                    matchDate.setHours(hour, minute, 0, 0);

                    // Si l'IA renvoie par erreur un match passé ou dans moins de 30 min, on le marque pour rejet
                    const timeDiffMinutes = (matchDate.getTime() - now.getTime()) / 60000;
                    const isInvalid = timeDiffMinutes < 30;

                    return {
                        id: `nw-v9-${Date.now()}-${i}`,
                        sport: p.sport as Sport,
                        competition: p.competition,
                        match: p.match,
                        betType: p.betType,
                        category: 'Standard',
                        probability: p.probability,
                        analysis: p.analysis,
                        date: p.date,
                        time: p.time,
                        isLive: false,
                        isInvalid: isInvalid,
                        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                            uri: c.web?.uri,
                            title: c.web?.title
                        })).filter((s: any) => s.uri).slice(0, 2) || []
                    };
                })
                .filter(p => !p.isInvalid);

            if (filteredPreds.length === 0) throw new Error("Aucun match futur fiable trouvé. Relancez l'Engine.");

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: filteredPreds,
                publishedBy: 'NEXTWIN_PRO_ENGINE'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus(`✓ ${filteredPreds.length} PRONOSTICS HAUTE PRÉCISION`);
        } catch (err: any) {
            console.error(err);
            setStatus(`⚠ ERREUR ENGINE : ${err.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 4000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("RENDU HD EN COURS...");
        
        try {
            await new Promise(r => setTimeout(r, 1200));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 3, 
                useCORS: true,
                logging: false,
                onclone: (clonedDoc: any) => {
                    const winParts = clonedDoc.querySelectorAll('.logo-win-part');
                    winParts.forEach((el: any) => {
                        el.style.color = '#F97316';
                        el.style.backgroundImage = 'none';
                        el.style.webkitBackgroundClip = 'initial';
                        el.style.backgroundClip = 'initial';
                        el.style.opacity = '1';
                    });
                }
            });

            const link = document.createElement('a');
            link.download = `NEXTWIN_V9_PACK_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
            setStatus("✓ PACK EXPORTÉ");
        } catch (err) {
            setStatus("⚠ ÉCHEC RENDU");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 2500);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f] border border-orange-500/40 text-white px-10 py-5 rounded-2xl shadow-2xl backdrop-blur-2xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></div>
                    <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">VERSION PRO V9 • CALIBRAGE GEMINI 3 PRO</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                    ENGINE <span className="text-transparent bg-clip-text bg-gradient-brand">ELITE SCANNER</span>
                </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-white/5 hover:border-orange-500/40 p-10 rounded-[2.5rem] transition-all group flex-1 max-w-lg relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block">LANCER SCAN ULTRA-PRÉCIS</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] block mt-3 opacity-60">Filtrage temporel & Grounding IA actif</span>
                </button>

                {store.draft && (
                    <button onClick={() => { if(confirm("Vider?")) setStore({...store, draft: null}); }} className="bg-red-900/10 border-2 border-red-900/20 hover:border-red-500 p-10 rounded-[2.5rem] transition-all w-full md:w-auto shadow-2xl">
                        <span className="text-red-500 font-black text-sm uppercase italic tracking-widest">RESET</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in space-y-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-gray-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md">
                        <div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[11px] italic">SÉCURISATION DES FLUX TERMINÉE</h2>
                            <p className="text-gray-500 text-[9px] font-bold uppercase mt-2 tracking-widest">TOUS LES MATCHS DÉBUTENT APRÈS {new Date().toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'})}</p>
                        </div>
                        <button onClick={downloadAsImage} disabled={isLoading} className="w-full sm:w-auto bg-gradient-brand text-white font-black px-12 py-5 rounded-2xl flex items-center justify-center gap-4 transition-all text-xs uppercase tracking-widest italic shadow-2xl shadow-orange-500/20 hover:scale-105 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            TÉLÉCHARGER LE PACK V9
                        </button>
                    </div>

                    <div className="rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-4 border-white/5">
                        <div ref={previewContainerRef} className="bg-[#110f1f] p-16 relative overflow-hidden capture-zone">
                            <div className="flex flex-col items-center mb-24 relative z-10">
                                <div className="mb-10 h-20 flex items-center justify-center">
                                    <NextWinLogo />
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/30 px-12 py-3 rounded-full backdrop-blur-md">
                                    <span className="text-orange-500 font-black text-xs uppercase tracking-[0.5em] italic">V9 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                                {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                            </div>
                            
                            <div className="mt-28 text-center opacity-30">
                                <p className="text-gray-600 font-black text-[10px] uppercase tracking-[1.8em] italic">GEMINI 3 PRO VERIFIED • NO DELAY • WWW.NEXTWIN.AI</p>
                            </div>

                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 border-4 border-dashed border-gray-800 rounded-[3.5rem] opacity-30 bg-white/[0.01]">
                    <svg className="mx-auto h-20 w-20 text-gray-700 mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.003 9.003 0 008.34-5.5M12 21a9.003 9.003 0 01-8.34-5.5M12 21V12m0 0a3 3 0 100-6 3 3 0 000 6zm0 0v-3.75M12 3v3.75" /></svg>
                    <p className="text-gray-500 text-sm uppercase font-black tracking-[1em] italic">PRÊT POUR LE RAFFINAGE V9</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
