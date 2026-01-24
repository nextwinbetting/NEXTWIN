
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_V19';

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
        setStatus("ANALYSE DES CALENDRIERS EN COURS...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const now = new Date();
            const dateToday = now.toLocaleDateString('fr-FR');
            const timeNow = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const prompt = `[SYSTEM: SPORTS SCANNER]
            MISSION : Extraire les matchs RÉELS programmés.
            
            DONNÉES TEMPORELLES ACTUELLES :
            - DATE DU JOUR : ${dateToday}
            - HEURE DE PARIS : ${timeNow}
            
            INSTRUCTIONS CRITIQUES :
            1. RECHERCHE WEB : Utilise l'outil Google Search pour trouver le "Calendrier Football", "Calendrier NBA" et "Tableau ATP/WTA" pour les dates du ${dateToday} et du lendemain.
            2. FILTRE DE RÉALITÉ : Ne propose QUE des matchs qui vont COMMENCER après ${timeNow} aujourd'hui ou demain.
            3. SITES DE RÉFÉRENCE : Flashscore.fr, SofaScore, LiveScore.in/fr/, ATPTour.com.
            
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
                    temperature: 0
                }
            });

            const text = response.text || "";
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Flux de données corrompu.");

            const data = JSON.parse(jsonMatch[0]);
            const rawPreds = data.predictions || [];
            
            const preds = rawPreds.map((p: any, i: number) => ({
                id: `nw-pred-${Date.now()}-${i}`,
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
            setStatus(`✓ ${preds.length}/8 MATCHS IDENTIFIÉS`);
        } catch (err) {
            setStatus("⚠ ERREUR DE SCAN");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("GÉNÉRATION DU VISUEL...");
        
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
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-3 py-1 rounded-full mb-4">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest italic">PANNEAU ADMINISTRATEUR</span>
                </div>
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                    GÉNÉRATION DU <span className="text-orange-500">PACK</span> QUOTIDIEN
                </h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black italic">
                    SCAN DES FLUX ET EXPORT HD
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border border-white/5 hover:border-orange-500/40 p-8 rounded-3xl transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block">LANCER LE SCAN</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 italic">Vérification temps réel</span>
                </button>

                {store.draft && (
                    <button 
                        onClick={clearDraft}
                        className="bg-red-900/10 border border-red-900/20 hover:border-red-500 p-8 rounded-3xl transition-all group flex-1 max-w-xs"
                    >
                        <span className="text-red-500 font-black text-xl uppercase italic tracking-tighter block">RESET</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-6 flex-1">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-orange-500/20"></div>
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] italic whitespace-nowrap">APERÇU DU VISUEL HD</h2>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-orange-500/20"></div>
                        </div>
                        
                        <button 
                            onClick={downloadAsImage}
                            disabled={isLoading}
                            className="bg-gradient-brand text-white font-black px-12 py-5 rounded-2xl flex items-center gap-4 transition-all transform hover:scale-105 shadow-xl text-[11px] uppercase tracking-[0.2em] italic"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            TÉLÉCHARGER LE PACK
                        </button>
                    </div>

                    <div 
                        ref={previewContainerRef} 
                        id="capture-target"
                        className="bg-brand-dark-blue rounded-[3rem] p-12 border border-white/5 relative overflow-hidden shadow-2xl"
                    >
                        <div className="flex flex-col items-center mb-24 relative z-10">
                            <NextWinLogo className="h-20 mb-8" />
                            <div className="bg-orange-500/10 border border-orange-500/20 px-10 py-2 rounded-full backdrop-blur-md">
                                <span className="text-orange-500 font-black text-[10px] uppercase tracking-[0.6em] italic">PACK OFFICIEL IA • {new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10 justify-center">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>

                        <div className="mt-28 text-center pt-16 border-t border-white/5 relative z-10">
                            <p className="text-gray-600 font-black text-[9px] uppercase tracking-[1em] italic leading-loose">ANALYSE PRÉDICTIVE • WWW.NEXTWIN.AI</p>
                        </div>

                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[200px]"></div>
                        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px]"></div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40 border border-dashed border-gray-800 rounded-[3rem] bg-gray-900/10">
                    <div className="w-20 h-20 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-gray-600 font-black uppercase text-lg tracking-[0.3em] italic">EN ATTENTE DE GÉNÉRATION</h3>
                    <p className="text-gray-800 text-[10px] uppercase font-bold tracking-[0.4em] mt-4 italic">Utilisez le bouton ci-dessus pour scanner les matchs</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
