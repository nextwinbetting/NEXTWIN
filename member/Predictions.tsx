
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

            const prompt = `[ROLE: WORLD-CLASS SPORTS TRADER]
            [SYSTEM_TIME: ${fullTime}]
            
            MISSION : Générer 8 pronostics RÉELS futurs (Coup d'envoi > 1h après ${timePart}).
            
            RÉPARTITION OBLIGATOIRE (8 MATCHS TOTAL) :
            1. 6 Matchs "Standard" : Football/Basket/Tennis (Vainqueur ou Double Chance). C'est la Sélection Élite.
            2. 1 Match "Bonus Football" : Marché "Les deux équipes marquent" (BTTS) uniquement.
            3. 1 Match "Bonus Basket" : Marché "Nombre de points" (Over/Under Player ou Team) uniquement.

            STRUCTURE JSON :
            {
              "predictions": [
                {
                  "category": "Standard | Bonus Football | Bonus Basket",
                  "sport": "Football | Basketball | Tennis",
                  "competition": "Nom ligue",
                  "match": "Team A vs Team B",
                  "betType": "Sujet précis du pari",
                  "probability": 70-95,
                  "analysis": "1 phrase technique",
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
                category: p.category as any,
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

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: filtered,
                publishedBy: 'ADMIN_V10_PRO'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus(`✓ PACK GÉNÉRÉ : ${filtered.length} ANALYSES`);
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
        setStatus("RENDU HAUTE DÉFINITION...");
        try {
            await new Promise(r => setTimeout(r, 1500));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#0f0f0f',
                scale: 3, 
                useCORS: true,
                onclone: (clonedDoc: any) => {
                    clonedDoc.querySelectorAll('.logo-win-part').forEach((el: any) => {
                        el.style.backgroundImage = 'none'; 
                        el.style.color = '#F97316'; 
                        el.style.opacity = '1'; 
                        el.style.webkitBackgroundClip = 'initial';
                        el.style.backgroundClip = 'initial';
                    });
                }
            });
            const link = document.createElement('a');
            link.download = `NEXTWIN_ELITE_PACK_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
            link.href = canvas.toDataURL("image/png", 1.0);
            link.click();
            setStatus("✓ EXPORT RÉUSSI");
        } catch { setStatus("⚠ ÉCHEC RENDU"); }
        finally { setIsLoading(false); setTimeout(() => setStatus(null), 2500); }
    };

    if (!isAdmin) return null;

    const mainPicks = store.draft?.predictions.filter(p => p.category === 'Standard') || [];
    const bttsPicks = store.draft?.predictions.filter(p => p.category === 'Bonus Football') || [];
    const basketPicks = store.draft?.predictions.filter(p => p.category === 'Bonus Basket') || [];

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f] border border-orange-500/40 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-ping"></div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic tracking-[0.3em]">IA V10 • GESTION DES PACKS</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">GENERATOR <span className="text-transparent bg-clip-text bg-gradient-brand">PRO FLOW</span></h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button onClick={generateIAPronostics} disabled={isLoading} className="bg-brand-card border-2 border-white/5 hover:border-orange-500/40 p-8 rounded-[2rem] transition-all group flex-1 max-w-lg relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-lg uppercase italic tracking-tighter block">LANCER LE SCANNER V10</span>
                    <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] block mt-2 opacity-60">Répartition : 6 Élite + 1 BTTS + 1 Points</span>
                </button>
                {store.draft && (
                    <button onClick={downloadAsImage} disabled={isLoading} className="bg-brand-card border-2 border-white/5 hover:border-green-500/40 p-8 rounded-[2rem] transition-all group flex-1 max-w-lg relative overflow-hidden shadow-2xl text-white font-black uppercase italic tracking-widest">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                        EXPORTER LE PACK (PNG)
                    </button>
                )}
            </div>

            {store.draft && (
                <div ref={previewContainerRef} className="bg-[#0f0f0f] p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
                    <div className="flex flex-col items-center mb-16">
                         <NextWinLogo className="h-14 mb-8" />
                         <div className="bg-orange-500/10 border border-orange-500/20 px-10 py-2 rounded-full">
                             <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em] italic">PACK ELITE V10 • {new Date().toLocaleDateString('fr-FR')}</p>
                         </div>
                    </div>

                    {/* SECTION 1 : SELECTION ELITE (6 MATCHS) */}
                    <div className="mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sélection <span className="text-orange-500">Élite</span></h2>
                            <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {mainPicks.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>

                    {/* SECTION 2 : LES BONUS SEPARÉS (1 + 1) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* BONUS FOOTBALL */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4">
                                <span className="bg-orange-500 text-white text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest">BONUS</span>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-widest">BTTS Football</h3>
                            </div>
                            <div className="space-y-6">
                                {bttsPicks.map(p => <PredictionCard key={p.id} prediction={p} />)}
                            </div>
                        </div>

                        {/* BONUS BASKETBALL */}
                        <div className="space-y-10">
                             <div className="flex items-center gap-4">
                                <span className="bg-purple-500 text-white text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest">BONUS</span>
                                <h3 className="text-lg font-black text-white italic uppercase tracking-widest">Points Basketball</h3>
                            </div>
                            <div className="space-y-6">
                                {basketPicks.map(p => <PredictionCard key={p.id} prediction={p} />)}
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 text-center opacity-30 pt-10 border-t border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[1em] italic">VERIFIED BY GEMINI 3 PRO • WWW.NEXTWIN.AI</p>
                    </div>
                    
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </div>
            )}
        </div>
    );
};

export default Predictions;
