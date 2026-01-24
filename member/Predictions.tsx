
import React, { useState, useEffect, useRef } from 'react';
import { Prediction, Sport, Language, DailyPack } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";
import NextWinLogo from '../components/NextWinLogo';

const STORAGE_KEY = 'NEXTWIN_ADMIN_FLOW_ACTIVE';

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
        setStatus("SCAN DES CALENDRIERS...");
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            const now = new Date();
            const dateToday = now.toLocaleDateString('fr-FR');
            const timeNow = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const prompt = `[SYSTEM: SPORTS SCANNER]
            MISSION : Extraire les matchs RÉELS programmés.
            DONNÉES TEMPORELLES : ${dateToday} - ${timeNow}.
            FORMAT JSON UNIQUEMENT.`;

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
            if (!jsonMatch) throw new Error("Erreur de flux.");

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
                publishedBy: 'ADMIN'
            };

            const newStore = { ...store, draft: newDraft };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
            setStatus(`✓ ${preds.length} MATCHS`);
        } catch (err) {
            setStatus("⚠ ERREUR");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 2500);
        }
    };

    const downloadAsImage = async () => {
        if (!previewContainerRef.current) return;
        setIsLoading(true);
        setStatus("GÉNÉRATION VISUELLE...");
        
        try {
            await new Promise(r => setTimeout(r, 500));
            const canvas = await html2canvas(previewContainerRef.current, {
                backgroundColor: '#110f1f',
                scale: 2.5, 
                useCORS: true
            });
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement('a');
            link.download = `NextWin_Pack.png`;
            link.href = image;
            link.click();
            setStatus("✓ PRÊT");
        } catch (err) {
            setStatus("⚠ ÉCHEC");
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatus(null), 2500);
        }
    };

    const clearDraft = () => {
        if (confirm("Reset ?")) {
            const newStore = { ...store, draft: null };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newStore));
            setStore(newStore);
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in px-4">
            {status && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-brand-dark-blue border border-orange-500/40 text-white px-6 py-3 rounded-xl shadow-2xl backdrop-blur-xl flex items-center gap-3">
                    <span className="font-black text-[9px] uppercase tracking-widest italic">{status}</span>
                </div>
            )}

            <div className="text-center mb-12">
                <div className="inline-block bg-orange-500/5 border border-orange-500/10 px-3 py-1 rounded-full mb-3">
                    <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest italic">PANNEAU ADMIN</span>
                </div>
                <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                    GÉNÉRATION DU <span className="text-orange-500">PACK</span>
                </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
                <button 
                    onClick={generateIAPronostics} 
                    disabled={isLoading}
                    className="bg-brand-card border border-white/5 hover:border-orange-500/40 p-6 rounded-2xl transition-all group flex-1 max-w-sm relative"
                >
                    <span className="text-white font-black text-base uppercase italic tracking-tighter block">LANCER LE SCAN IA</span>
                    <span className="text-gray-500 text-[8px] font-black uppercase tracking-widest block mt-1">Vérification temps réel</span>
                </button>

                {store.draft && (
                    <button onClick={clearDraft} className="bg-red-900/10 border border-red-900/20 hover:border-red-500 p-6 rounded-2xl transition-all max-w-[100px]">
                        <span className="text-red-500 font-black text-xs uppercase italic">RESET</span>
                    </button>
                )}
            </div>

            {store.draft ? (
                <div className="animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                        <h2 className="text-orange-500 font-black uppercase tracking-[0.3em] text-[9px] italic">APERÇU HD</h2>
                        <button onClick={downloadAsImage} disabled={isLoading} className="bg-gradient-brand text-white font-black px-8 py-3 rounded-xl flex items-center gap-3 transition-all text-[9px] uppercase tracking-widest italic">
                            TÉLÉCHARGER
                        </button>
                    </div>

                    <div ref={previewContainerRef} className="bg-brand-dark-blue rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden shadow-2xl">
                        <div className="flex flex-col items-center mb-16 relative z-10">
                            <NextWinLogo className="h-10 mb-6" />
                            <div className="bg-orange-500/10 border border-orange-500/20 px-8 py-1.5 rounded-full">
                                <span className="text-orange-500 font-black text-[9px] uppercase tracking-widest italic">PACK IA • {new Date().toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                            {store.draft.predictions.map(p => <PredictionCard key={p.id} prediction={p} />)}
                        </div>
                        <div className="mt-20 text-center opacity-30">
                            <p className="text-gray-600 font-black text-[8px] uppercase tracking-[1em] italic">ANALYSE PRÉDICTIVE • WWW.NEXTWIN.AI</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl opacity-30">
                    <p className="text-gray-500 text-[9px] uppercase font-bold tracking-[0.4em] italic">EN ATTENTE DE SCAN</p>
                </div>
            )}
        </div>
    );
};

export default Predictions;
