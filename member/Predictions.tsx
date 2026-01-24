
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
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format de réponse invalide.");

            const data = JSON.parse(jsonMatch[0]);
            const rawPreds = data.predictions || [];
            
            if (!Array.isArray(rawPreds) || rawPreds.length === 0) {
                throw new Error("Aucun match trouvé.");
            }

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
        setStatus("GÉNÉRATION HD...");
        
        try {
            await new Promise(r => setTimeout(r, 1000));
            
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 3, 
                useCORS: true,
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc: Document) => {
                    // FIX : On s'assure que la partie "Win" du logo est visible si le dégradé échoue
                    const winParts = clonedDoc.querySelectorAll('.logo-win-part');
                    winParts.forEach((el: any) => {
                        el.style.color = '#F97316'; // Fallback orange solide pour l'export
                        el.style.backgroundImage = 'none';
                        el.style.webkitBackgroundClip = 'initial';
                        el.style.backgroundClip = 'initial';
                    });
                }
            });

            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `NEXTWIN_PACK_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
            link.href = image;
            link.click();
            setStatus("✓ PACK PRÊT !");
        } catch (err) {
            console.error(err);
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
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f] border border-orange-500/40 text-white px-10 py-5 rounded-2xl shadow-2xl backdrop-blur-2xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></div>
                    <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic">CONSOLE ADMIN ENGINE</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                    PILOTAGE DU <span className="text-transparent bg-clip-text bg-gradient-brand">PACK PREMIUM</span>
                </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-8 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-white/5 hover:border-orange-500/40 p-10 rounded-[2.5rem] transition-all group flex-1 max-w-lg relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block">LANCER LE SCAN IA</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] block mt-3 opacity-60">Synchronisation mondiale active</span>
                </button>

                {store.draft && (
                    <button onClick={clearDraft} className="bg-red-900/10 border-2 border-red-900/20 hover:border-red-500 p-10 rounded-[2.5rem] transition-all w-full md:w-auto shadow-2xl">
                        <span className="text-red-500 font-black text-sm uppercase italic tracking-widest">RESET ENGINE</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in space-y-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 bg-gray-900/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-md">
                        <div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.4em] text-[11px] italic">PACK GÉNÉRÉ AVEC SUCCÈS</h2>
                            <p className="text-gray-500 text-[9px] font-bold uppercase mt-2 tracking-widest">VÉRIFIEZ LE RENDU AVANT LE TÉLÉCHARGEMENT</p>
                        </div>
                        <button onClick={downloadAsImage} disabled={isLoading} className="w-full sm:w-auto bg-gradient-brand text-white font-black px-12 py-5 rounded-2xl flex items-center justify-center gap-4 transition-all text-xs uppercase tracking-widest italic shadow-2xl shadow-orange-500/20 hover:scale-105 active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            TÉLÉCHARGER L'IMAGE HD
                        </button>
                    </div>

                    {/* Zone de capture HD */}
                    <div className="rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border-4 border-white/5">
                        <div ref={previewContainerRef} className="bg-[#110f1f] p-16 relative overflow-hidden capture-zone">
                            {/* Éléments de Branding Exportation */}
                            <div className="flex flex-col items-center mb-24 relative z-10">
                                <div className="mb-10 h-20 flex items-center justify-center">
                                    <NextWinLogo />
                                </div>
                                <div className="bg-orange-500/10 border border-orange-500/30 px-12 py-3 rounded-full backdrop-blur-md">
                                    <span className="text-orange-500 font-black text-xs uppercase tracking-[0.5em] italic">ÉDITION OFFICIELLE • {new Date().toLocaleDateString('fr-FR')}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
                                {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                            </div>
                            
                            <div className="mt-28 text-center opacity-30">
                                <p className="text-gray-600 font-black text-[10px] uppercase tracking-[1.8em] italic">PRECISION IA • ANALYSE PRO • WWW.NEXTWIN.AI</p>
                            </div>

                            {/* Décors subtils pour l'export */}
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 border-4 border-dashed border-gray-800 rounded-[3.5rem] opacity-30 bg-white/[0.01]">
                    <svg className="mx-auto h-20 w-20 text-gray-700 mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <p className="text-gray-500 text-sm uppercase font-black tracking-[1em] italic">MOTEUR IA EN ATTENTE DE FLUX</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
