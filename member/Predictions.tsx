
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'nextwin_daily_pack_v8_final';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [dailyPack, setDailyPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [emailStatus, setEmailStatus] = useState<string | null>(null);

    // Identifiant de jour unique (ex: 20231027)
    const getTodayKey = () => {
        const d = new Date();
        return `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
    };

    const refreshData = () => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            setDailyPack(null);
            return;
        }

        try {
            const pack: DailyPack = JSON.parse(raw);
            const now = Date.now();
            const packAgeHours = (now - pack.timestamp) / (1000 * 60 * 60);
            
            // LOGIQUE DE VISIBILITÉ STRICTE :
            // 1. Un pack est "d'aujourd'hui" si son ID de date correspond
            const isFromToday = pack.timestamp && (new Date(pack.timestamp).toDateString() === new Date().toDateString());
            
            // 2. Un pack est "valide" s'il a moins de 24h
            const isFresh = packAgeHours < 24;

            if (isAdmin) {
                // L'admin voit le pack s'il est d'aujourd'hui (validé ou non)
                setDailyPack(isFromToday ? pack : null);
            } else {
                // Le client voit le pack SI (Validé ET Aujourd'hui) OU (Validé ET moins de 24h)
                if (pack.isValidated && (isFromToday || isFresh)) {
                    setDailyPack(pack);
                } else {
                    setDailyPack(null);
                }
            }
        } catch (e) {
            setDailyPack(null);
        }
    };

    useEffect(() => {
        refreshData();
        // Écoute les changements depuis d'autres onglets (Admin -> Client)
        window.addEventListener('storage', refreshData);
        // Vérification périodique (toutes les 30s)
        const interval = setInterval(refreshData, 30000);
        return () => {
            window.removeEventListener('storage', refreshData);
            clearInterval(interval);
        };
    }, [isAdmin]);

    const generateDailyPack = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `[ROLE: SPORTS ANALYST V8] Generate 8 real predictions for ${new Date().toLocaleDateString()}. JSON { "predictions": [...] }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format IA invalide");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => ({
                id: `v8-${Date.now()}-${i}`,
                sport: p.sport || 'Football',
                match: p.match || 'Match du jour',
                betType: p.betType || 'Analyse IA',
                category: i >= 6 ? (i === 6 ? 'Bonus Football' : 'Bonus Basket') : 'Standard',
                date: new Date().toLocaleDateString('fr-FR'),
                time: p.matchTime || '20:00',
                probability: p.probability || 75,
                analysis: p.analysis || "Basé sur les flux SofaScore temps réel.",
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter(s => s.uri).slice(0, 3) || []
            }));

            const newPack: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: formatted,
                publishedBy: 'NEXTWIN_BOSS'
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newPack));
            setDailyPack(newPack);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = () => {
        if (!dailyPack) return;
        
        const validatedPack: DailyPack = {
            ...dailyPack,
            isValidated: true,
            timestamp: Date.now() // On rafraîchit le temps au moment de la validation
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedPack));
        setDailyPack(validatedPack);
        
        setEmailStatus("LES PRONOSTICS SONT MAINTENANT EN LIGNE !");
        setTimeout(() => setEmailStatus(null), 5000);
    };

    const reset = () => {
        if (confirm("Supprimer le pack ?")) {
            localStorage.removeItem(STORAGE_KEY);
            setDailyPack(null);
        }
    };

    const predictionsList = dailyPack?.predictions || [];
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictionsList;
        return predictionsList.filter(p => (p.sport || '').toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictionsList]);

    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
                {emailStatus && (
                    <div className="fixed top-24 right-8 z-50 bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl animate-bounce border border-green-400 font-black text-xs uppercase tracking-widest italic">
                        {emailStatus}
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">NEXTWIN BOSS CONSOLE</h1>
                    <p className="mt-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.5em]">JOUR : {new Date().toLocaleDateString()}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500/30 transition-all">
                        <button onClick={generateDailyPack} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            {isLoading ? "GÉNÉRATION..." : "1. LANCER SCAN IA"}
                        </button>
                    </div>

                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center hover:border-orange-500/30 transition-all">
                        <div className="flex gap-4">
                            <button onClick={handlePublish} disabled={!dailyPack || dailyPack.isValidated} className="flex-1 bg-gradient-brand text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-20">
                                2. VALIDER ET PUBLIER
                            </button>
                            <button onClick={reset} className="px-6 bg-gray-800 text-gray-400 hover:text-red-500 rounded-2xl border border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-24">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mx-auto mb-8"></div>
                        <p className="text-white font-black text-[11px] tracking-[0.4em] uppercase italic">IA ENGINE V8 : ANALYSE EN COURS...</p>
                    </div>
                ) : dailyPack ? (
                    <div>
                        <div className="mb-10 px-6">
                            <span className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border italic ${dailyPack.isValidated ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'}`}>
                                {dailyPack.isValidated ? "● EN LIGNE" : "● BROUILLON (INVISIBLE CLIENT)"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {dailyPack.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 border-2 border-dashed border-gray-800 rounded-[3rem]">
                        <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-sm italic">Aucun pack généré pour aujourd'hui.</p>
                    </div>
                )}
            </div>
        );
    }

    // --- VUE CLIENT ---
    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray text-[11px] uppercase tracking-[0.5em] font-black">{t.predictions_subtitle}</p>
            </div>

            {dailyPack?.isValidated ? (
                <>
                    <div className="flex justify-center gap-4 mb-20 flex-wrap">
                        {['ALL', 'FOOTBALL', 'BASKETBALL', 'TENNIS'].map(s => (
                            <button key={s} onClick={() => setActiveSport(s as any)} className={`px-12 py-5 rounded-2xl text-[11px] font-black transition-all uppercase tracking-[0.2em] border-2 ${activeSport === s ? 'bg-orange-500 border-orange-500 text-white shadow-2xl' : 'bg-brand-dark border-gray-800 text-gray-500 hover:text-white'}`}>
                                {s === 'ALL' ? 'TOUS' : s}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filtered.map(p => <PredictionCard key={p.id} prediction={p} />)}
                    </div>
                </>
            ) : (
                <div className="text-center bg-brand-card border border-gray-800 rounded-[4rem] p-24 max-w-4xl mx-auto shadow-2xl">
                     <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse border border-orange-500/20">
                        <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     </div>
                     <h3 className="text-5xl font-black text-white mb-8 uppercase italic tracking-tighter">{t.pred_waiting_title}</h3>
                     <p className="text-brand-light-gray text-base mb-0 uppercase tracking-[0.2em] leading-relaxed max-w-xl mx-auto italic font-bold">
                        {t.pred_waiting_desc}
                     </p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
