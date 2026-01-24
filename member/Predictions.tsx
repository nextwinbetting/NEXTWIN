
import React, { useState, useMemo, useEffect } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// Clés de stockage distinctes pour éviter tout conflit de visibilité
const KEY_DRAFT = 'nextwin_draft_v9';
const KEY_PUBLIC = 'nextwin_public_v9';

const Predictions: React.FC<{ language: Language; isAdmin?: boolean }> = ({ language, isAdmin = false }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [draftPack, setDraftPack] = useState<DailyPack | null>(null);
    const [publicPack, setPublicPack] = useState<DailyPack | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Fonction de rafraîchissement des données
    const loadData = () => {
        const now = Date.now();
        
        // 1. Charger le Pack Public (Visible par tous si < 24h)
        const rawPublic = localStorage.getItem(KEY_PUBLIC);
        if (rawPublic) {
            try {
                const pack: DailyPack = JSON.parse(rawPublic);
                const ageHours = (now - pack.timestamp) / (1000 * 60 * 60);
                if (ageHours < 24) {
                    setPublicPack(pack);
                } else {
                    setPublicPack(null); // Périmé
                }
            } catch (e) { setPublicPack(null); }
        } else {
            setPublicPack(null);
        }

        // 2. Charger le Brouillon (Admin uniquement, doit être du jour même)
        if (isAdmin) {
            const rawDraft = localStorage.getItem(KEY_DRAFT);
            if (rawDraft) {
                try {
                    const pack: DailyPack = JSON.parse(rawDraft);
                    const isToday = new Date(pack.timestamp).toDateString() === new Date().toDateString();
                    setDraftPack(isToday ? pack : null);
                } catch (e) { setDraftPack(null); }
            } else {
                setDraftPack(null);
            }
        }
    };

    useEffect(() => {
        loadData();
        // Écouter les changements (si l'admin valide dans un autre onglet)
        window.addEventListener('storage', loadData);
        const timer = setInterval(loadData, 10000); // Check toutes les 10s
        return () => {
            window.removeEventListener('storage', loadData);
            clearInterval(timer);
        };
    }, [isAdmin]);

    // GÉNÉRATION (ADMIN)
    const generateDraft = async () => {
        setIsLoading(true);
        setStatusMessage(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `[ROLE: SPORTS ANALYST V9]
            Generate 8 highly accurate predictions for TODAY ${new Date().toLocaleDateString()}.
            Include: 6 standard, 1 Football BTTS, 1 Basketball Points.
            Respond strictly with JSON: { "predictions": [...] }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { tools: [{ googleSearch: {} }], temperature: 0.1 }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Format JSON non détecté");
            
            const data = JSON.parse(jsonMatch[0]);
            const formatted = data.predictions.map((p: any, i: number) => ({
                id: `v9-${Date.now()}-${i}`,
                sport: p.sport || 'Football',
                match: p.match || 'Match en cours',
                betType: p.betType || 'Analyse IA',
                category: i === 6 ? 'Bonus Football' : i === 7 ? 'Bonus Basket' : 'Standard',
                date: new Date().toLocaleDateString('fr-FR'),
                time: p.matchTime || '20:00',
                probability: p.probability || 75,
                analysis: p.analysis || "Basé sur les flux de données temps réel.",
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

            localStorage.setItem(KEY_DRAFT, JSON.stringify(newDraft));
            setDraftPack(newDraft);
            setStatusMessage("BROUILLON GÉNÉRÉ AVEC SUCCÈS");
        } catch (err) {
            setStatusMessage("ERREUR DE GÉNÉRATION IA");
        } finally {
            setIsLoading(false);
        }
    };

    // VALIDATION & PUBLICATION (ADMIN)
    const handlePublish = () => {
        if (!draftPack) return;
        
        const finalPack: DailyPack = {
            ...draftPack,
            isValidated: true,
            timestamp: Date.now() // Le compteur de 24h démarre AUJOURD'HUI à cette seconde
        };

        // On enregistre dans la clé PUBLIQUE lue par les clients
        localStorage.setItem(KEY_PUBLIC, JSON.stringify(finalPack));
        // On nettoie le brouillon
        localStorage.removeItem(KEY_DRAFT);
        
        setPublicPack(finalPack);
        setDraftPack(null);
        
        setStatusMessage("✅ PACK PUBLIÉ : VISIBLE PAR LES CLIENTS PENDANT 24H");
        setTimeout(() => setStatusMessage(null), 5000);
    };

    const clearAll = () => {
        if (confirm("Supprimer le pack actuel et le brouillon ?")) {
            localStorage.removeItem(KEY_DRAFT);
            localStorage.removeItem(KEY_PUBLIC);
            setDraftPack(null);
            setPublicPack(null);
        }
    };

    // Filtrage pour l'affichage
    const currentViewPack = isAdmin ? (draftPack || publicPack) : publicPack;
    const predictionsList = currentViewPack?.predictions || [];
    
    const filtered = useMemo(() => {
        if (activeSport === 'ALL') return predictionsList;
        return predictionsList.filter(p => (p.sport || '').toString().toUpperCase().includes(activeSport.toUpperCase()));
    }, [activeSport, predictionsList]);

    // --- RENDU ADMINISTRATEUR ---
    if (isAdmin) {
        return (
            <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
                {statusMessage && (
                    <div className="fixed top-24 right-8 z-50 bg-orange-600 text-white px-8 py-5 rounded-2xl shadow-2xl border border-orange-400 font-black text-xs uppercase italic tracking-widest animate-bounce">
                        {statusMessage}
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">NEXTWIN BOSS CONSOLE</h1>
                    <p className="mt-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.5em]">GESTION DES FLUX PUBLICS</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 mb-16">
                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center hover:border-blue-500/30 transition-all">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-4 block">1. PRÉPARATION</span>
                        <button onClick={generateDraft} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
                            {isLoading ? "EXTRACTION IA..." : "LANCER LE SCAN IA"}
                        </button>
                    </div>

                    <div className="bg-brand-card border-2 border-gray-800 rounded-3xl p-8 text-center hover:border-green-500/30 transition-all">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-4 block">2. MISE EN LIGNE</span>
                        <div className="flex gap-4">
                            <button onClick={handlePublish} disabled={!draftPack} className="flex-1 bg-gradient-brand text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-20">
                                VALIDER & PUBLIER (24H)
                            </button>
                            <button onClick={clearAll} className="px-6 bg-gray-800 text-gray-400 hover:text-red-500 rounded-2xl border border-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-24">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mx-auto mb-8"></div>
                        <p className="text-white font-black text-[11px] tracking-[0.4em] uppercase italic">IA ENGINE V9 : ANALYSE DES MARCHÉS...</p>
                    </div>
                ) : currentViewPack ? (
                    <div className="animate-fade-in">
                        <div className="mb-10 flex items-center justify-between px-6">
                            <span className={`px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest border italic ${publicPack ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 animate-pulse'}`}>
                                {publicPack ? "● PACK EN LIGNE (CLIENTS OK)" : "● BROUILLON GÉNÉRÉ (EN ATTENTE DE PUBLICATION)"}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {currentViewPack.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 border-2 border-dashed border-gray-800 rounded-[3rem]">
                        <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-sm italic">Aucun contenu prêt. Lancez le scan IA.</p>
                    </div>
                )}
            </div>
        );
    }

    // --- RENDU CLIENT ---
    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase">{t.predictions_title}</h1>
                <p className="mt-4 text-brand-light-gray text-[11px] uppercase tracking-[0.5em] font-black">{t.predictions_subtitle}</p>
            </div>

            {publicPack ? (
                <div>
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
                </div>
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
