
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_V17';

interface AdminStore {
    draft: DailyPack | null;
    history: DailyPack[];
}

// Déclaration globale pour html2canvas chargé via CDN dans index.html
declare var html2canvas: any;

const Predictions: React.FC<{ language: Language; isAdmin: boolean }> = ({ language, isAdmin }) => {
    const t = translations[language];
    const [store, setStore] = useState<AdminStore>({ draft: null, history: [] });
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);
    
    // Ref pour capturer l'aperçu client exact
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
        setStatus("SCAN DES COMPÉTITIONS SUR LIVESCORE.IN/FR/...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: CHIEF ANALYST NEXTWIN V17]
            OBJECTIF: Générer 8 pronostics sportifs réels (6 Standards + 2 Bonus) pour les prochaines 24h.
            
            INSTRUCTIONS CRITIQUES :
            1. UTILISE Google Search pour consulter LiveScore.in/fr/.
            2. RÉCUPÈRE : Nom de la Compétition (ex: Ligue 1, NBA, Roland Garros), Équipes, Date et Heure (Paris).
            3. LANGUE : Tout le contenu JSON doit être en FRANÇAIS.
            4. FILTRE : Probabilité minimale de 70%.
            
            STRUCTURE DU PACK (8 PRONOS) :
            - Football : 2 vainqueurs (inclure la ligue).
            - Basketball : 2 vainqueurs (inclure la ligue).
            - Tennis : 2 vainqueurs (inclure le tournoi).
            - BONUS Football : 1 "Les deux équipes marquent - OUI" (Ligue précise).
            - BONUS Basketball : 1 "Total Points Plus/Moins" (Ligue précise).
            
            JSON OUTPUT ONLY:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "competition": "Ligue 1",
                  "match": "PSG vs Marseille",
                  "betType": "Victoire PSG",
                  "category": "Standard",
                  "date": "25.05.2024",
                  "time": "21:00",
                  "probability": 82,
                  "analysis": "Analyse technique basée sur les derniers flux de données."
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0.1
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Flux corrompu");

            const data = JSON.parse(jsonMatch[0]);
            const preds = data.predictions.map((p: any, i: number) => ({
                id: `v18-${Date.now()}-${i}`,
                ...p,
                sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => ({
                    uri: c.web?.uri,
                    title: c.web?.title
                })).filter(s => s.uri).slice(0, 2) || []
            }));

            const newDraft: DailyPack = {
                timestamp: Date.now(),
                isValidated: false,
                predictions: preds,
                publishedBy: 'NEXTWIN_BOSS'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus("✓ PACK GÉNÉRÉ AVEC SUCCÈS");
        } catch (err) {
            setStatus("⚠ ÉCHEC DU SCAN DES COMPÉTITIONS");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("CONVERSION DE L'APERÇU EN IMAGE HD...");
        
        try {
            // Petit temps d'attente pour stabiliser les animations
            await new Promise(r => setTimeout(r, 400));
            
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f', // Correspond au fond du site
                scale: 2.5, // Très haute définition pour export pro
                useCORS: true,
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc: Document) => {
                    // Optionnel: On peut ajuster des styles sur le clone avant capture
                    const el = clonedDoc.getElementById('capture-target');
                    if (el) el.style.padding = '60px'; // Plus d'espace pour l'image finale
                }
            });
            
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
            link.download = `NextWin_Pronos_IA_${date}.png`;
            link.href = image;
            link.click();
            setStatus("✓ VISUEL GÉNÉRÉ ET TÉLÉCHARGÉ");
        } catch (err) {
            console.error(err);
            setStatus("⚠ ERREUR LORS DE LA CAPTURE");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const clearDraft = () => {
        if (confirm("Supprimer le pack actuel ?")) {
            const newStore = { ...store, draft: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.4)] backdrop-blur-xl flex items-center gap-4">
                    {isLoading && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent animate-spin rounded-full"></div>}
                    <span className="font-black text-[10px] uppercase tracking-widest italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    NEXTWIN <span className="text-orange-500">BOSS</span> V18
                </h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">
                    CONSOLE DE GÉNÉRATION & EXPORT VISUEL PRO
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-8 rounded-[2.5rem] transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block">SCANNER LES MATCHS</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 italic">Extraction LiveScore V18</span>
                </button>

                {store.draft && (
                    <button 
                        onClick={clearDraft}
                        className="bg-red-900/10 border-2 border-red-900/30 hover:border-red-500 p-8 rounded-[2.5rem] transition-all group flex-1 max-w-xs"
                    >
                        <span className="text-red-500 font-black text-xl uppercase italic tracking-tighter block uppercase">EFFACER TOUT</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-6 flex-1">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-orange-500/30"></div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] italic whitespace-nowrap">APERÇU RÉEL ORIENTÉ CLIENT</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-orange-500/30"></div>
                        </div>
                        
                        <button 
                            onClick={downloadAsImage}
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-2xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(249,115,22,0.3)] text-xs uppercase tracking-widest italic"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            TÉLÉCHARGER L'IMAGE PRO
                        </button>
                    </div>

                    {/* SECTION DE CAPTURE - C'est ce bloc qui sera transformé en image */}
                    <div 
                        ref={previewContainerRef} 
                        id="capture-target"
                        className="bg-brand-dark-blue rounded-[4rem] p-10 border border-gray-800/50 relative overflow-hidden"
                    >
                        {/* Éléments de Branding pour l'image exportée */}
                        <div className="flex flex-col items-center mb-16">
                            <NextWinLogo className="h-16 mb-4" />
                            <div className="bg-orange-500/10 border border-orange-500/30 px-6 py-2 rounded-full">
                                <span className="text-orange-500 font-black text-[9px] uppercase tracking-[0.4em] italic">PACK OFFICIEL IA • {new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>

                        {/* Footer Branding pour l'image exportée */}
                        <div className="mt-16 text-center pt-10 border-t border-gray-800/50">
                            <p className="text-gray-600 font-black text-[8px] uppercase tracking-[0.6em] italic">WWW.NEXTWIN.AI • STRATÉGIE RIGUREUSE • RISK MANAGEMENT 5%</p>
                            <p className="text-gray-700 font-bold text-[7px] uppercase tracking-widest mt-4">Interdit aux mineurs. Jouer comporte des risques : 09-74-75-13-13.</p>
                        </div>

                        {/* Background Effects for the image */}
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px]"></div>
                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"></div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 border-2 border-dashed border-gray-800 rounded-[5rem] bg-gray-900/10">
                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-gray-600 font-black uppercase text-xl tracking-[0.3em] italic">Système V18 prêt</h3>
                    <p className="text-gray-800 text-xs uppercase font-bold tracking-[0.4em] mt-4 italic">Lancez le scan pour générer votre pack visuel</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
