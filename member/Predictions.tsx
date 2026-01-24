
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
        setStatus("ENGINE V10 : ANALYSE DES FLUX...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const now = new Date();
            const parisTime = now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
            const [datePart, timePart] = parisTime.split(' ');

            const prompt = `[ROLE: SENIOR SPORTS TRADER]
            MISSION : Générer 8 pronostics RÉELS pour le ${datePart}.
            Coup d'envoi > 2h après ${timePart}. 
            Format JSON avec predictions array (category, sport, competition, match, betType, probability, analysis, date, time).`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1,
                    responseMimeType: "application/json"
                }
            });

            const data = JSON.parse(response.text);
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
            setStatus(`✓ PACK IA GÉNÉRÉ`);
        } catch (err: any) {
            setStatus(`⚠ ERREUR ENGINE`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            localStorage.setItem(STORAGE_IMAGE_KEY, base64);
            localStorage.setItem(STORAGE_TIME_KEY, time);
            window.dispatchEvent(new Event('storage'));
            setStatus("🚀 PACK MANUEL PUBLIÉ !");
            setTimeout(() => setStatus(null), 3000);
        };
        reader.readAsDataURL(file);
    };

    const publishAuto = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("CAPTURE DU PACK IA...");
        try {
            await new Promise(r => setTimeout(r, 500));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#0f0f0f',
                scale: 2,
                useCORS: true
            });
            const imageData = canvas.toDataURL("image/png");
            const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            localStorage.setItem(STORAGE_IMAGE_KEY, imageData);
            localStorage.setItem(STORAGE_TIME_KEY, time);
            window.dispatchEvent(new Event('storage'));
            setStatus("🚀 PACK IA PROPULSÉ !");
        } catch (err) {
            setStatus("⚠ ERREUR CAPTURE");
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
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-black border border-orange-500/40 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in">
                    <span className="font-black text-[10px] uppercase tracking-widest italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <div className="inline-block bg-orange-500/10 border border-orange-500/20 px-6 py-2 rounded-full mb-6">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest italic tracking-[0.3em]">CONSOLE DE DIFFUSION</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">PUBLIER <span className="text-transparent bg-clip-text bg-gradient-brand">LE PACK DU JOUR</span></h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto">
                <div className="bg-brand-card border border-white/5 p-8 rounded-[2rem] flex flex-col items-center gap-6">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-center">MÉTHODE A : GÉNÉRATION IA</p>
                    <div className="flex flex-col gap-3 w-full">
                        <button onClick={generateIAPronostics} disabled={isLoading} className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                            1. SCANNER LE MARCHÉ
                        </button>
                        {store.draft && (
                            <button onClick={publishAuto} disabled={isLoading} className="w-full bg-gradient-brand text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all animate-pulse">
                                2. PROPULSER L'IMAGE IA
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-brand-card border border-white/5 p-8 rounded-[2rem] flex flex-col items-center gap-6">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic text-center">MÉTHODE B : UPLOAD MANUEL</p>
                    <label className="w-full cursor-pointer bg-orange-500/10 border-2 border-dashed border-orange-500/20 hover:border-orange-500/50 text-orange-500 py-10 rounded-xl flex flex-col items-center justify-center gap-3 transition-all">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeWidth={2}/></svg>
                        <span className="font-black text-[10px] uppercase tracking-widest">PUBLIER MON PNG DIRECT</span>
                        <input type="file" accept="image/*" onChange={handleManualUpload} className="hidden" />
                    </label>
                </div>
            </div>

            {store.draft && (
                <div className="opacity-50 pointer-events-none scale-95 origin-top">
                    <p className="text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] italic mb-10">APERÇU DE LA STRUCTURE IA :</p>
                    <div ref={previewContainerRef} className="bg-[#0f0f0f] p-12 rounded-[4rem] border border-white/5">
                        <div className="flex flex-col items-center mb-16">
                             <NextWinLogo className="h-10 mb-8" />
                             <div className="bg-orange-500/10 border border-orange-500/20 px-8 py-2 rounded-full">
                                 <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.6em] italic">V10 ELITE EDITION • {new Date().toLocaleDateString('fr-FR')}</p>
                             </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {elitePicks.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictions;
