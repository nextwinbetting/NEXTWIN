
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_V18_1';

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
        setStatus("SCAN LIVESCORE.IN/FR/ - SYNC HORAIRES...");
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const prompt = `[ROLE: CHIEF ANALYST NEXTWIN V18.1]
            OBJECTIF: Générer 8 pronostics sportifs réels (6 Standards + 2 Bonus) pour les prochaines 24h.
            
            CONSIGNE CRITIQUE HORAIRE :
            - Tu DOIS utiliser les horaires EXACTS affichés sur LiveScore.in/fr/ (Heure française).
            - Ne fais aucune conversion UTC. Si le site dit 21:00, tu écris 21:00.
            - Langue : Français intégral.
            
            STRUCTURE DU PACK (8 PRONOS) :
            1. Football (Standard) : 2 matchs (Nom de la Ligue/Coupe obligatoire).
            2. Basketball (Standard) : 2 matchs (NBA, Euroleague, etc.).
            3. Tennis (Standard) : 2 matchs (Nom du tournoi ATP/WTA).
            4. BONUS Football : 1 prono "Les deux équipes marquent" (Ligue précise).
            5. BONUS Basketball : 1 prono "Total Points" (Ligue précise).
            
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
                  "probability": 85,
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
                id: `v18-1-${Date.now()}-${i}`,
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
            setStatus("✓ PACK 8/8 SYNCHRONISÉ");
        } catch (err) {
            setStatus("⚠ ERREUR DE SYNCHRONISATION");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("GÉNÉRATION DU VISUEL PREMIUM HD (3x3)...");
        
        try {
            // Pause pour rendu parfait
            await new Promise(r => setTimeout(r, 600));
            
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 3, // Ultra HD
                useCORS: true,
                logging: false,
                allowTaint: true,
                onclone: (clonedDoc: Document) => {
                    const el = clonedDoc.getElementById('capture-target');
                    if (el) {
                        el.style.padding = '80px';
                        el.style.width = '1600px'; // Un peu plus large pour 3 colonnes
                        el.style.borderRadius = '0px'; // Suppression pour l'export image pur
                    }
                }
            });
            
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
            link.download = `NextWin_DailyPack_${date}.png`;
            link.href = image;
            link.click();
            setStatus("✓ VISUEL TÉLÉCHARGÉ");
        } catch (err) {
            console.error(err);
            setStatus("⚠ ÉCHEC DE CAPTURE");
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
                    NEXTWIN <span className="text-orange-500">BOSS</span> V18.1
                </h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">
                    EXPORT VISUEL HAUTE DÉFINITION & SYNC LIVESCORE
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-8 rounded-[2.5rem] transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block tracking-[0.1em]">GÉNÉRER LE PACK</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 italic">Sync Horaires LiveScore FR</span>
                </button>

                {store.draft && (
                    <button 
                        onClick={clearDraft}
                        className="bg-red-900/10 border-2 border-red-900/30 hover:border-red-500 p-8 rounded-[2.5rem] transition-all group flex-1 max-w-xs"
                    >
                        <span className="text-red-500 font-black text-xl uppercase italic tracking-tighter block uppercase">RESET</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-6 flex-1">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-orange-500/30"></div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] italic whitespace-nowrap">APERÇU ORIENTÉ CLIENT (3 PAR RANGÉE)</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-orange-500/30"></div>
                        </div>
                        
                        <button 
                            onClick={downloadAsImage}
                            disabled={isLoading}
                            className="bg-gradient-brand text-white font-black px-12 py-5 rounded-2xl flex items-center gap-4 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(249,115,22,0.4)] text-[11px] uppercase tracking-[0.2em] italic"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            TÉLÉCHARGER LE VISUEL IA
                        </button>
                    </div>

                    {/* SECTION DE CAPTURE RÉELLE - MODIFIÉE POUR 3 COLONNES */}
                    <div 
                        ref={previewContainerRef} 
                        id="capture-target"
                        className="bg-brand-dark-blue rounded-[5rem] p-12 border border-gray-800/50 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        {/* Éléments de Branding Export */}
                        <div className="flex flex-col items-center mb-20 relative z-10">
                            <NextWinLogo className="h-24 mb-6" />
                            <div className="bg-orange-500/10 border-2 border-orange-500/30 px-12 py-3 rounded-full backdrop-blur-md">
                                <span className="text-orange-500 font-black text-xs uppercase tracking-[0.6em] italic">PACK OFFICIEL IA • {new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        {/* GRILLE : Passage à 3 colonnes (lg:grid-cols-3) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10 justify-center">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>

                        {/* Footer Export Pro */}
                        <div className="mt-24 text-center pt-12 border-t border-gray-800/50 relative z-10">
                            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.8em] italic">WWW.NEXTWIN.AI • ANALYSE PRÉDICTIVE V18.1</p>
                            <p className="text-gray-700 font-bold text-[8px] uppercase tracking-[0.3em] mt-6 px-20 leading-relaxed">
                                Les pronostics sont fournis à titre informatif. Le jeu comporte des risques : endettement, isolement, dépendance. Appelez le 09-74-75-13-13. Interdit aux mineurs.
                            </p>
                        </div>

                        {/* Effets de fond stylisés */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[200px]"></div>
                        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px]"></div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 border-2 border-dashed border-gray-800 rounded-[5rem] bg-gray-900/10">
                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-gray-600 font-black uppercase text-xl tracking-[0.3em] italic">Prêt pour la sync LiveScore</h3>
                    <p className="text-gray-800 text-xs uppercase font-bold tracking-[0.4em] mt-4 italic">Générez un pack pour activer l'exportation</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
