
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_ACTIVE';
const STORAGE_IMAGE_KEY = 'NEXTWIN_DAILY_PACK_IMAGE';
const STORAGE_TIME_KEY = 'NEXTWIN_DAILY_PACK_TIME';

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
        setStatus("SCANNER V10 EN ACTION...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const now = new Date();
            const parisTime = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const [datePart, timePart] = parisTime.split(' ');

            const prompt = `[ROLE: SENIOR SPORTS TRADER - PARIS HUB]
            [LOCAL_TIME_PARIS: ${parisTime}]
            MISSION : Générer 8 pronostics RÉELS futurs pour le ${datePart}.
            Le coup d'envoi doit avoir lieu au minimum 2h APRÈS ${timePart}. 

            RÉPARTITION (8 MATCHS TOTAL) :
            1. 6 Matchs "Standard" : Football/Basket/Tennis.
            2. 1 Match "Bonus Football" : Marché BTTS.
            3. 1 Match "Bonus Basket" : Marché Points total.

            STRUCTURE JSON :
            {
              "predictions": [
                {
                  "category": "Standard | Bonus Football | Bonus Basket",
                  "sport": "Football | Basketball | Tennis",
                  "competition": "Ligue",
                  "match": "A vs B",
                  "betType": "Pari",
                  "probability": 70-95,
                  "analysis": "Argument court",
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
            
            const filtered: Prediction[] = data.predictions.map((p: any, i: number) => ({
                ...p,
                id: `nw-v10-${Date.now()}-${i}`,
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
            setStatus(`✓ PACK PRÊT POUR DIFFUSION`);
        } catch (err: any) {
            setStatus(`⚠ ERREUR ENGINE`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const publishToClientArea = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("DIFFUSION SUR L'ESPACE CLIENT...");
        try {
            // Attendre un peu pour s'assurer que les styles sont appliqués
            await new Promise(r => setTimeout(r, 800));
            
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#0f0f0f',
                scale: 2, 
                useCORS: true
            });
            
            const imageData = canvas.toDataURL("image/png");
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            
            // Sauvegarde dans les clés utilisées par DailyPicks.tsx
            localStorage.setItem(STORAGE_IMAGE_KEY, imageData);
            localStorage.setItem(STORAGE_TIME_KEY, time);
            
            // Déclencher l'événement pour les autres onglets
            window.dispatchEvent(new Event('storage'));
            
            setStatus("🚀 PACK PROPULSÉ AVEC SUCCÈS !");
        } catch (err) {
            setStatus("⚠ ÉCHEC DE DIFFUSION");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    if (!isAdmin) return null;

    const elitePicks = store.draft?.predictions.filter(p => p.category === 'Standard') || [];
    const bonusPicks = store.draft?.predictions.filter(p => p.category.includes('Bonus')) || [];

    return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#110f1f] border border-orange-500/40 text-white px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-6 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] italic">CONSOLE ADMINISTRATIVE V10</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">PILOTAGE <span className="text-transparent bg-clip-text bg-gradient-brand">DES FLUX</span></h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button onClick={generateIAPronostics} disabled={isLoading} className="bg-brand-card border-2 border-white/5 hover:border-orange-500/40 p-8 rounded-[2rem] transition-all group flex-1 max-w-sm relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-brand"></div>
                    <span className="text-white font-black text-xs uppercase italic tracking-widest block">1. SCANNER LE MARCHÉ</span>
                    <span className="text-gray-500 text-[8px] font-black uppercase tracking-[0.3em] block mt-2 opacity-60">Générer le pack IA</span>
                </button>
                
                {store.draft && (
                    <button onClick={publishToClientArea} disabled={isLoading} className="bg-orange-500 text-white p-8 rounded-[2rem] transition-all hover:scale-105 group flex-1 max-w-sm relative overflow-hidden shadow-2xl shadow-orange-500/20">
                        <span className="font-black text-xs uppercase italic tracking-widest block">2. PROPULSER AUX CLIENTS</span>
                        <span className="text-white/60 text-[8px] font-black uppercase tracking-[0.3em] block mt-2">Mise à jour instantanée</span>
                    </button>
                )}
            </div>

            {store.draft && (
                <div className="space-y-10">
                    <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic">Aperçu du pack avant diffusion :</p>
                    <div ref={previewContainerRef} className="bg-[#0f0f0f] p-12 rounded-[4rem] border border-white/5 relative overflow-hidden">
                        <div className="flex flex-col items-center mb-16">
                             <NextWinLogo className="h-14 mb-8" />
                             <div className="bg-orange-500/10 border border-orange-500/20 px-10 py-2 rounded-full">
                                 <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.6em] italic">V10 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}</p>
                             </div>
                        </div>

                        <div className="mb-20">
                            <h2 className="text-center text-2xl font-black text-white italic uppercase tracking-tighter mb-10 underline decoration-orange-500 decoration-4 underline-offset-8">SÉLECTION ÉLITE</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {elitePicks.map(p => <PredictionCard key={p.id} prediction={p} />)}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-center text-2xl font-black text-white italic uppercase tracking-tighter mb-10 underline decoration-purple-500 decoration-4 underline-offset-8">OFFRE BONUS CLIENT</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {bonusPicks.map(p => (
                                    <div key={p.id} className="relative">
                                        <div className="absolute -top-4 -right-4 bg-orange-500 text-white font-black text-[10px] px-4 py-1.5 rounded-full z-20 shadow-xl rotate-12">GIFT</div>
                                        <PredictionCard prediction={p} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-24 text-center opacity-30 pt-10 border-t border-white/5">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[1em] italic">VERIFIED BY GEMINI 3 PRO • WWW.NEXTWIN.AI</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictions;
