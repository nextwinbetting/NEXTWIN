
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
        setStatus("RECHERCHE DES OPPORTUNITÉS RÉELLES...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const now = new Date();
            const fullTime = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const [datePart, timePart] = fullTime.split(' ');

            const prompt = `[ROLE: WORLD-CLASS SPORTS TRADER & DATA ARCHITECT]
            [SYSTEM_TIME: ${fullTime} (UTC+1)]
            
            MISSION : Extraire 8 matchs RÉELS de Football, Basketball ou Tennis prévus UNIQUEMENT dans le futur.
            
            PROTOCOLE DE SÉCURITÉ :
            1. Scanne SofaScore, Flashscore et ESPN en temps réel.
            2. INTERDICTION : N'inclus aucun match commencé ou fini.
            3. MARGE DE SÉCURITÉ : Le coup d'envoi doit avoir lieu au minimum 60 minutes APRÈS ${timePart}.
            4. DIVERSITÉ : Propose des ligues variées (NBA, EuroLeague, Top Ligues Europe, ATP/WTA).

            STRUCTURE JSON RÉPONSE :
            {
              "predictions": [
                {
                  "sport": "Football | Basketball | Tennis",
                  "competition": "Nom officiel",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Pari suggéré",
                  "probability": 70-95,
                  "analysis": "Analyse ultra-courte (1 phrase)",
                  "date": "${datePart}",
                  "time": "HH:MM (Heure Paris)"
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1,
                    responseMimeType: "application/json"
                }
            });

            const text = response.text || "";
            const data = JSON.parse(text);
            const rawPreds = data.predictions || [];
            
            const filtered: Prediction[] = rawPreds.map((p: any, i: number) => ({
                id: `nw-v10-${Date.now()}-${i}`,
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
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter((s: any) => s.uri).slice(0, 2) || []
            }));

            if (filtered.length === 0) throw new Error("Aucun match futur trouvé. Relancez le scanner.");

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: filtered,
                publishedBy: 'ADMIN_V10_PRO'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus(`✓ ${filtered.length} MATCHS EXTRAITS`);
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
        setStatus("OPTIMISATION DU RENDU...");
        try {
            await new Promise(r => setTimeout(r, 1200));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#0f0f0f',
                scale: 3, 
                useCORS: true,
                logging: false,
                onclone: (cloned: any) => {
                    // FIX DU LOGO POUR L'EXPORT : html2canvas galère avec background-clip: text
                    const logoWinPart = cloned.querySelector('.logo-win-part');
                    if (logoWinPart) {
                        logoWinPart.style.backgroundImage = 'none';
                        logoWinPart.style.webkitBackgroundClip = 'initial';
                        logoWinPart.style.backgroundClip = 'initial';
                        logoWinPart.style.color = '#F97316'; // Couleur orange du thème
                    }
                }
            });
            const link = document.createElement('a');
            link.download = `NEXTWIN_V10_ELITE_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
            setStatus("✓ PACK EXPORTÉ");
        } catch (err) {
            console.error(err);
            setStatus("⚠ ÉCHEC RENDU");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 2500);
        }
    };

    if (!isAdmin) return null;

    const todayDate = new Date().toLocaleDateString('fr-FR');

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f] border border-orange-500/40 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic tracking-[0.3em]">GEMINI 3 PRO • V10 ENGINE</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">ELITE <span className="text-transparent bg-clip-text bg-gradient-brand">PACK GENERATOR</span></h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button onClick={generateIAPronostics} disabled={isLoading} className="bg-brand-card border-2 border-white/5 hover:border-orange-500/40 p-8 rounded-[2rem] transition-all group flex-1 max-w-lg relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-lg uppercase italic tracking-tighter block">LANCER LE SCANNER V10</span>
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] block mt-2 opacity-60">Sourcing direct SofaScore/FlashScore</span>
                </button>
                {store.draft && (
                    <button onClick={() => { if(confirm("Vider?")) setStore({...store, draft: null}); }} className="bg-red-900/10 border border-red-500/20 hover:bg-red-500 hover:text-white px-10 rounded-[2rem] transition-all shadow-2xl text-red-500 text-[10px] font-black uppercase tracking-widest">RESET</button>
                )}
            </div>

            {store.draft && (
                <div className="animate-fade-in space-y-10">
                    <div className="bg-gray-900/40 p-8 rounded-[2rem] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[11px] italic">FLUX DE DONNÉES SÉCURISÉ</h2>
                            <p className="text-gray-500 text-[9px] font-bold uppercase mt-1 tracking-widest">GÉNÉRATION HD DU PACK MEMBRES</p>
                        </div>
                        <button onClick={downloadAsImage} disabled={isLoading} className="bg-gradient-brand text-white font-black px-10 py-4 rounded-xl flex items-center gap-3 transition-all text-[10px] uppercase tracking-widest italic shadow-xl hover:scale-105 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            TÉLÉCHARGER LE PACK V10
                        </button>
                    </div>

                    {/* ZONE DE CAPTURE - DESIGN IDENTIQUE À L'IMAGE MOCKUP */}
                    <div className="rounded-[3.5rem] overflow-hidden border-4 border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                        <div ref={previewContainerRef} className="bg-[#0f0f0f] p-16 relative overflow-hidden capture-zone">
                            {/* Header Image */}
                            <div className="flex flex-col items-center mb-16 relative z-10">
                                <div className="mb-10 h-16 flex items-center justify-center scale-125">
                                    <NextWinLogo />
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/30 px-16 py-3 rounded-full backdrop-blur-md">
                                    <span className="text-orange-500 font-black text-xs uppercase tracking-[0.6em] italic">V10 ELITE EDITION • {todayDate}</span>
                                </div>
                            </div>

                            {/* Grid Predictions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                                {store.draft.predictions.map(p => (
                                    <PredictionCard key={p.id} prediction={p} />
                                ))}
                            </div>

                            {/* Footer Image */}
                            <div className="mt-24 text-center opacity-30">
                                <p className="text-gray-600 font-black text-[10px] uppercase tracking-[1.5em] italic">VERIFIED BY GEMINI 3 PRO • HIGH ACCURACY</p>
                                <p className="text-gray-700 font-black text-[10px] uppercase tracking-[1em] italic mt-4">WWW.NEXTWIN.AI</p>
                            </div>

                            {/* Glows Backgrounds (Seulement visibles si l'export gère bien l'opacité) */}
                            <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-orange-500/[0.03] blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/[0.03] blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictions;
