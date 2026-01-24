
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

const CACHE_KEY = 'nextwin_official_daily_pack_v8';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [dailyPack, setDailyPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailStatus, setEmailStatus] = useState<string | null>(null);

    // Synchronisation robuste des dates
    const isSameDay = (timestamp: number) => {
        const d1 = new Date(timestamp);
        const d2 = new Date();
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    };

    const loadPack = () => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const pack: DailyPack = JSON.parse(cached);
                
                // Vérification de validité temporelle
                const isToday = isSameDay(pack.timestamp);

                // LOGIQUE D'ACCÈS : 
                // Admin : voit toujours le pack s'il existe
                // Client : voit UNIQUEMENT si isValidated ET est d'aujourd'hui
                if (isAdmin || (pack.isValidated && isToday)) {
                    setDailyPack(pack);
                } else {
                    setDailyPack(null);
                }
            } else {
                setDailyPack(null);
            }
        } catch (e) {
            console.error("Erreur de lecture du pack", e);
            setDailyPack(null);
        }
    };

    useEffect(() => {
        loadPack();
        window.addEventListener('storage', loadPack);
        return () => window.removeEventListener('storage', loadPack);
    }, [isAdmin]);

    const generateDailyPack = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: SPORTS ANALYST V8]
            Generate 8 real-time predictions for TODAY.
            Format: JSON with "predictions" array. 
            Rules: Use real team names from today's calendar. 
            Predictions must have: sport, match, betType, category, probability, analysis, matchTime.`;

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
            if (!jsonMatch) throw new Error("Format de réponse IA invalide.");
            
            const data = JSON.parse(jsonMatch[0]);
            if (!data.predictions) throw new Error("Aucun pronostic trouvé.");

            const formatted = data.predictions.map((p: any, i: number) => ({
                id: `v8-${Date.now()}-${i}`,
                sport: p.sport || 'Football',
                match: p.match || 'Match inconnu',
                betType: p.betType || 'Analyse en cours',
                category: p.category || 'Standard',
                date: new Date().toLocaleDateString(),
                time: p.matchTime || '20:00',
                probability: p.probability || 70,
                analysis: p.analysis || "Analyse technique basée sur les flux récents.",
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter(s => s.uri).slice(0, 3) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: formatted,
                publishedBy: 'NEXTWIN_BOSS'
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(newDraft));
            setDailyPack(newDraft);
        } catch (err) {
            setError("Erreur lors de la génération. Vérifiez vos crédits API.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublish = () => {
        if (!dailyPack) return;
        
        const validatedPack = {
            ...dailyPack,
            isValidated: true,
            timestamp: Date.now() // On force le timestamp au moment de la validation
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(validatedPack));
        setDailyPack(validatedPack);
        
        // Signal visuel de succès
        setEmailStatus("LES PRONOSTICS SONT DÉSORMAIS VISIBLES PAR VOS CLIENTS");
        setTimeout(() => setEmailStatus(null), 5000);
    };

    const reset = () => {
        if (confirm("Supprimer le pack actuel ?")) {
            localStorage.removeItem(CACHE_KEY);
            setDailyPack(null);
        }
    };

    const predictions = dailyPack?.predictions || [];
    
    // Filtrage sécurisé (Correction du crash 'includes' ici)
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictions;
        return predictions.filter(p => {
            const pSport = (p.sport || '').toString().toUpperCase();
            return pSport.includes(activeSport.toUpperCase());
        });
    }, [activeSport, predictions]);

    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20">
                {emailStatus && (
                    <div className="fixed top-24 right-8 z-50 bg-green-600 text-white px-8 py-5 rounded-2xl shadow-2xl animate-bounce border border-green-400 font-black text-xs uppercase italic tracking-widest">
                        {emailStatus}
                    </div>
                )}

                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">ADMINISTRATION V8</h1>
                    <p className="mt-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.5em]">Mode : NEXTWIN_BOSS</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center transition-all hover:border-gray-700">
                        <h3 className="text-gray-500 font-black uppercase text-[10px] mb-6 tracking-widest italic">Étape 1 : Génération IA</h3>
                        <button 
                            onClick={generateDailyPack} 
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl"
                        >
                            {isLoading ? "SCAN EN COURS..." : "Lancer le Scan IA V8"}
                        </button>
                    </div>

                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center transition-all hover:border-gray-700">
                        <h3 className="text-gray-500 font-black uppercase text-[10px] mb-6 tracking-widest italic">Étape 2 : Publication Clients</h3>
                        <div className="flex gap-4">
                            <button 
                                onClick={handlePublish}
                                disabled={!dailyPack || dailyPack.isValidated}
                                className="flex-1 bg-gradient-brand text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:opacity-20"
                            >
                                Valider & Envoyer aux Clients
                            </button>
                            <button onClick={reset} className="px-6 bg-gray-800 text-gray-500 hover:text-red-500 rounded-2xl border border-gray-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-24">
                         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mx-auto mb-8"></div>
                         <p className="text-white font-black text-[12px] tracking-[0.5em] uppercase italic">IA Moteur V8 : Analyse des flux sportifs en cours...</p>
                    </div>
                ) : dailyPack ? (
                    <>
                        <div className="mb-10 flex items-center justify-between px-6">
                            <span className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border italic transition-all ${dailyPack.isValidated ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'}`}>
                                {dailyPack.isValidated ? "● STATUT : PUBLIÉ (VISIBLE PAR TOUS)" : "● STATUT : BROUILLON (INVISIBLE POUR LES CLIENTS)"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-32 border-2 border-dashed border-gray-800 rounded-[3rem]">
                        <p className="text-gray-600 font-black uppercase tracking-[0.5em] text-sm italic">Prêt pour la génération du pack officiel.</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
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
                     <h3 className="text-5xl font-black text-white mb-8 uppercase italic tracking-tighter">En attente de validation...</h3>
                     <p className="text-brand-light-gray text-base mb-0 uppercase tracking-[0.2em] leading-relaxed max-w-xl mx-auto italic font-bold">
                        L'IA a terminé son analyse. L'administrateur valide actuellement les pronostics avant envoi des emails de notification.
                     </p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
