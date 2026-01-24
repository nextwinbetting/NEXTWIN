
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
        setStatus("CONNEXION SERVEURS TEMPS RÉEL...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            // Injection de la date et heure réelle pour le grounding
            const now = new Date();
            const dateStr = now.toLocaleDateString('fr-FR');
            const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const prompt = `[ROLE: CHIEF ANALYST NEXTWIN V18.3]
            CONTEXTE TEMPOREL CRITIQUE :
            - NOUS SOMMES LE : ${dateStr}
            - IL EST ACTUELLEMENT : ${timeStr} (Heure de Paris)
            
            MISSION : Générer 8 pronostics RÉELS pour des matchs se déroulant dans les prochaines 24 heures (donc après ${timeStr}).
            
            CONSIGNES DE VÉRIFICATION :
            1. RECHERCHE OBLIGATOIRE : Utilise l'outil Google Search pour vérifier les calendriers sur LiveScore.in/fr/, Flashscore.fr ou SofaScore.
            2. EXISTENCE : Si un match n'existe pas ou n'est pas confirmé à 100% sur ces sites, NE LE PROPOSE PAS.
            3. HORAIRES : Utilise l'heure exacte affichée sur LiveScore.in/fr/ (Heure française). Pas de décalage.
            4. LANGUE : Français uniquement.
            
            STRUCTURE (8 PRONOS) :
            - 2 Football (Ligue précise)
            - 2 Basketball (NBA ou Europe)
            - 2 Tennis (Tournoi précis)
            - 1 BONUS Football (Les deux équipes marquent)
            - 1 BONUS Basketball (Total Points)
            
            JSON OUTPUT ONLY:
            {
              "predictions": [
                {
                  "sport": "Football",
                  "competition": "Nom exact de la ligue",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Type de pari précis",
                  "category": "Standard",
                  "date": "JJ.MM.AAAA",
                  "time": "HH:MM",
                  "probability": 82,
                  "analysis": "Analyse technique de 2 phrases basée sur les dernières stats réelles."
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
            if (!jsonMatch) throw new Error("Flux corrompu");

            const data = JSON.parse(jsonMatch[0]);
            
            // On s'assure qu'on a bien nos 8 pronos
            const rawPreds = data.predictions || [];
            const preds = rawPreds.map((p: any, i: number) => ({
                id: `v18-3-${Date.now()}-${i}`,
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
            setStatus(`✓ ${preds.length}/8 MATCHS VÉRIFIÉS`);
        } catch (err) {
            setStatus("⚠ ERREUR DE SYNC RÉELLE");
            console.error(err);
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("GÉNÉRATION DU VISUEL PREMIUM HD...");
        
        try {
            await new Promise(r => setTimeout(r, 800));
            
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 3, 
                useCORS: true,
                logging: false,
                allowTaint: true,
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
                    NEXTWIN <span className="text-orange-500">BOSS</span> V18.3
                </h1>
                <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.6em] font-black">
                    REAL-TIME MATCH SYNC & HD EXPORT
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-20">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border-2 border-gray-800 hover:border-orange-500 p-8 rounded-[2.5rem] transition-all group flex-1 max-w-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-white font-black text-xl uppercase italic tracking-tighter block tracking-[0.1em]">GÉNÉRER LE PACK RÉEL</span>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest block mt-2 group-hover:text-orange-400 italic">Basé sur LiveScore ${new Date().toLocaleDateString()}</span>
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
                            <h2 className="text-orange-500 font-black uppercase tracking-[0.5em] text-[10px] italic whitespace-nowrap">APERÇU RÉEL (3 PAR RANGÉE)</h2>
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
                            <p className="text-gray-500 font-black text-[11px] uppercase tracking-[1em] italic">WWW.NEXTWIN.AI • ANALYSE PRÉDICTIVE V18.3</p>
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
                    <h3 className="text-gray-600 font-black uppercase text-xl tracking-[0.3em] italic">Prêt pour la sync LiveScore</h3>
                    <p className="text-gray-800 text-xs uppercase font-bold tracking-[0.4em] mt-4 italic">Générez un pack pour activer l'exportation</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
