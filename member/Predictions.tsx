
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'nextwin_official_daily_pack';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [dailyPack, setDailyPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailStatus, setEmailStatus] = useState<string | null>(null);

    // Synchronisation forcée : On écoute les changements dans le stockage local
    const loadPack = () => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const pack: DailyPack = JSON.parse(cached);
            const packDate = new Date(pack.timestamp).toLocaleDateString();
            const today = new Date().toLocaleDateString();

            // RÈGLE : L'admin voit tout. Le client voit si VALIDÉ + AUJOURD'HUI.
            if (isAdmin || (pack.isValidated && packDate === today)) {
                setDailyPack(pack);
            } else {
                setDailyPack(null); // Cache le pack non validé pour le client
            }
        } else {
            setDailyPack(null);
        }
    };

    useEffect(() => {
        loadPack();
        // Écouteur pour mettre à jour instantanément si vous avez 2 onglets ouverts
        window.addEventListener('storage', loadPack);
        return () => window.removeEventListener('storage', loadPack);
    }, [isAdmin]);

    // MOTEUR IA V8 - GÉNÉRATION AUTOMATIQUE
    const generateDailyPack = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: SPORTS ANALYST V8]
            Generate 8 real-time predictions for TODAY (${new Date().toLocaleDateString()}).
            Format: JSON with "predictions" array. 
            Include: 6 standard, 1 Football BTTS, 1 Basketball Total Points.
            Analysis must be professional and sharp.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("IA data format error.");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => ({
                ...p,
                id: `v8-${Date.now()}-${i}`,
                date: new Date().toLocaleDateString(),
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).slice(0, 3) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: formatted,
                publishedBy: 'NEXTWIN_BOSS'
            };

            setDailyPack(newDraft);
            localStorage.setItem(CACHE_KEY, JSON.stringify(newDraft));
        } catch (err) {
            setError("Erreur de génération. Réessayez.");
        } finally {
            setIsLoading(false);
        }
    };

    // ACTION : PUBLIER (ENVOI AUX CLIENTS)
    const handlePublish = () => {
        if (!dailyPack) return;
        
        const validatedPack = {
            ...dailyPack,
            isValidated: true,
            timestamp: Date.now() // Actualise l'heure pour être sûr que c'est "aujourd'hui"
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(validatedPack));
        setDailyPack(validatedPack);
        
        // Simulation Envoi Email
        setEmailStatus("NOTIFICATION ENVOYÉE PAR EMAIL À TOUS LES CLIENTS");
        setTimeout(() => setEmailStatus(null), 5000);
    };

    const reset = () => {
        if (confirm("Effacer le pack du jour ?")) {
            localStorage.removeItem(CACHE_KEY);
            setDailyPack(null);
        }
    };

    const predictions = dailyPack?.predictions || [];
    const filtered = useMemo(() => 
        activeSport === 'ALL' ? predictions : predictions.filter(p => p.sport.toUpperCase().includes(activeSport))
    , [activeSport, predictions]);

    // --- VUE ADMINISTRATEUR ---
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20">
                {emailStatus && (
                    <div className="fixed top-24 right-8 z-50 bg-green-600 text-white px-8 py-4 rounded-xl shadow-2xl animate-bounce border border-green-400 font-black text-xs uppercase italic tracking-widest">
                        {emailStatus}
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Console NEXTWIN_BOSS</h1>
                    <p className="mt-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.4em]">Contrôle total avant diffusion</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-brand-card border-2 border-gray-800 rounded-[2rem] p-8 text-center">
                        <h3 className="text-gray-500 font-black uppercase text-[10px] mb-6 tracking-widest">Étape 1 : Analyse</h3>
                        <button 
                            onClick={generateDailyPack} 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            {isLoading ? "IA SCAN EN COURS..." : "Lancer le Scan IA V8"}
                        </button>
                    </div>

                    <div className="bg-brand-card border-2 border-gray-800 rounded-[2rem] p-8 text-center">
                        <h3 className="text-gray-500 font-black uppercase text-[10px] mb-6 tracking-widest">Étape 2 : Diffusion</h3>
                        <div className="flex gap-4">
                            <button 
                                onClick={handlePublish}
                                disabled={!dailyPack || dailyPack.isValidated}
                                className="flex-1 bg-gradient-brand text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-20"
                            >
                                Valider & Envoyer aux Clients
                            </button>
                            <button onClick={reset} className="px-6 bg-gray-800 text-gray-400 hover:text-red-500 rounded-2xl border border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 animate-pulse">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-6"></div>
                         <p className="text-white font-black text-[10px] tracking-[0.4em] uppercase">Moteur V8 en action...</p>
                    </div>
                ) : dailyPack ? (
                    <>
                        <div className="mb-8 flex items-center justify-between px-4">
                            <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border italic ${dailyPack.isValidated ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'}`}>
                                {dailyPack.isValidated ? "● STATUT : DIFFUSÉ AUX CLIENTS" : "● STATUT : BROUILLON (INVISIBLE POUR LES CLIENTS)"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24 border-2 border-dashed border-gray-800 rounded-[3rem]">
                        <p className="text-gray-600 font-black uppercase tracking-[0.3em] text-sm italic">Aucun pack généré aujourd'hui.</p>
                    </div>
                )}
            </div>
        );
    }

    // --- VUE CLIENT ---
    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase italic">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray text-[11px] uppercase tracking-[0.4em] font-black">{t.predictions_subtitle}</p>
            </div>

            {dailyPack?.isValidated ? (
                <>
                    <div className="flex justify-center gap-4 mb-20 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-10 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white' : 'bg-brand-dark border-gray-800 text-gray-500'}`}>
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </>
            ) : (
                <div className="text-center bg-brand-card border border-gray-800 rounded-[3rem] p-24 max-w-4xl mx-auto shadow-2xl">
                     <div className="w-24 h-24 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/10">
                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-4xl font-black text-white mb-6 uppercase italic tracking-tighter">En attente de validation...</h3>
                     <p className="text-brand-light-gray text-sm mb-0 uppercase tracking-[0.2em] leading-relaxed max-w-lg mx-auto italic">
                        L'IA a terminé son analyse. L'administrateur valide actuellement les pronostics avant envoi des emails de notification.
                     </p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
