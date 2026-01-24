
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
        setStatus("VÉRIFICATION DES CALENDRIERS RÉELS (FLASHSCORE/SOFASCORE)...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const now = new Date();
            const dateToday = now.toLocaleDateString('fr-FR');
            const timeNow = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const prompt = `[SYSTEM: DEEP-SCHEDULE SCANNER V18.4]
            MISSION : Extraire les matchs RÉELS programmés.
            
            DONNÉES TEMPORELLES ACTUELLES :
            - DATE DU JOUR : ${dateToday}
            - HEURE DE PARIS : ${timeNow}
            
            INSTRUCTIONS CRITIQUES :
            1. RECHERCHE WEB : Utilise l'outil Google Search pour trouver le "Calendrier Football", "Calendrier NBA" et "Tableau ATP/WTA" pour les dates du ${dateToday} et du lendemain.
            2. FILTRE DE RÉALITÉ : Ne propose QUE des matchs qui vont COMMENCER après ${timeNow} aujourd'hui ou demain.
            3. HALLUCINATION INTERDITE : Si tu inventes un match ou que tu cites un match déjà terminé, c'est un échec critique. Vérifie l'état "Programmé" ou "À venir".
            4. SITES DE RÉFÉRENCE : Flashscore.fr, SofaScore, LiveScore.in/fr/, ATPTour.com.
            
            FORMAT DE SORTIE (8 PRONOSTICS) :
            - 2 Football (Ligue réelle)
            - 2 Basketball (NBA / Euroleague)
            - 2 Tennis (Tournoi en cours)
            - 1 BONUS Football (BTTS)
            - 1 BONUS Basketball (Total Points)
            
            JSON OUTPUT ONLY:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "competition": "Nom exact",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Pari suggéré",
                  "category": "Standard",
                  "date": "${dateToday}",
                  "time": "HH:MM",
                  "probability": 85,
                  "analysis": "Analyse basée sur les stats réelles de la saison en cours."
                }
              ]
            }`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }],
                    temperature: 0 // Zéro créativité, 100% précision
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Flux de données corrompu.");

            const data = JSON.parse(jsonMatch[0]);
            const rawPreds = data.predictions || [];
            
            const preds = rawPreds.map((p: any, i: number) => ({
                id: `v18-4-${Date.now()}-${i}`,
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
            setStatus(`✓ ${preds.length}/8 MATCHS RÉELS IDENTIFIÉS`);
        } catch (err) {
            setStatus("⚠ ERREUR DE SCAN CALENDRIER");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("GÉNÉRATION DU VISUEL HD...");
        
        try {
            await new Promise(r => setTimeout(r, 800));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 3, 
                useCORS: true,
                onclone: (clonedDoc: Document) => {
                    const el = clonedDoc.getElementById('capture-target');
                    if (el) {
                        el.style.padding = '100px'; 
                        el.style.width = '1650px'; 
                        el.style.borderRadius = '0px';
                        const gradientTexts = clonedDoc.querySelectorAll('.bg-clip-text');
                        gradientTexts.forEach((text: any) => {
                            text.classList.remove('text-transparent', 'bg-clip-text', 'bg-gradient-brand');
                            text.style.color = '#F97316'; 
                        });
                    }
                }
            });
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `NextWin_Pack_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.png`;
            link.href = image;
            link.click();
            setStatus("✓ EXPORT TERMINÉ");
        } catch (err) {
            console.error(err);
            setStatus("⚠ ÉCHEC EXPORT");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const clearDraft = () => {
        if (confirm("Reset du pack ?")) {
            const newStore = { ...store, draft: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-fade-in px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500 text-white px-8 py-4 rounded-2xl shadow-[0_0_50px_rgba(249,115,22,0.4)] backdrop-blur-xl flex items-center gap-4 border-l-4">
                    {isLoading && <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent animate-spin rounded-full"></div>}
                    <span className="font-black text-[10px] uppercase tracking-widest italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-16">
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                    NEXTWIN <span className="text-orange-500">BOSS</span> V18.4
                </h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">
                    DEEP-SCHEDULE SCANNER & HD EXPORT
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-8 rounded-[2.5rem] transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block tracking-[0.1em]">SCANNER LES CALENDRIERS</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 italic">Vérification Réalité 100%</span>
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
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] italic whitespace-nowrap">GRID 3-COLS PREMIUM (VISUEL HD)</h2>
                            <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-orange-500/30"></div>
                        </div>
                        
                        <button 
                            onClick={downloadAsImage}
                            disabled={isLoading}
                            className="bg-gradient-brand text-white font-black px-12 py-5 rounded-2xl flex items-center gap-4 transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(249,115,22,0.4)] text-[11px] uppercase tracking-[0.2em] italic"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            EXPORTER LE VISUEL HD
                        </button>
                    </div>

                    <div 
                        ref={previewContainerRef} 
                        id="capture-target"
                        className="bg-brand-dark-blue rounded-[5rem] p-12 border border-gray-800/50 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                    >
                        <div className="flex flex-col items-center mb-24 relative z-10">
                            <NextWinLogo className="h-28 mb-8" />
                            <div className="bg-orange-500/10 border-2 border-orange-500/30 px-12 py-3 rounded-full backdrop-blur-md">
                                <span className="text-orange-500 font-black text-xs uppercase tracking-[0.6em] italic">PACK OFFICIEL IA • {new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10 justify-center">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>

                        <div className="mt-28 text-center pt-16 border-t border-gray-800/50 relative z-10">
                            <p className="text-gray-500 font-black text-[11px] uppercase tracking-[1em] italic">WWW.NEXTWIN.AI • ANALYSE PRÉDICTIVE V18.4</p>
                            <p className="text-gray-700 font-bold text-[8px] uppercase tracking-[0.3em] mt-8 px-32 leading-relaxed opacity-60">
                                Les pronostics sont fournis à titre informatif. Le jeu comporte des risques : endettement, isolement, dépendance. Appelez le 09-74-75-13-13. Interdit aux mineurs.
                            </p>
                        </div>

                        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-orange-500/5 rounded-full blur-[250px]"></div>
                        <div className="absolute bottom-0 left-0 w-[900px] h-[900px] bg-purple-500/5 rounded-full blur-[250px]"></div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 border-2 border-dashed border-gray-800 rounded-[5rem] bg-gray-900/10">
                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-gray-600 font-black uppercase text-xl tracking-[0.3em] italic">DEEP SCANNER READY</h3>
                    <p className="text-gray-800 text-xs uppercase font-bold tracking-[0.4em] mt-4 italic">Recherche de calendrier en direct sur le web</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
