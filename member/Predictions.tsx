import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prediction, Sport, GroundingSource, Language } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// --- AI LOGIC ---
const extractJson = (rawText: string): string => {
    const match = rawText.match(/```json\s*([\sS]*?)\s*```/);
    if (match && match[1]) {
        return match[1];
    }
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    if (startIndex > -1 && endIndex > -1) {
        return rawText.substring(startIndex, endIndex + 1);
    }
    throw new Error("Aucun objet JSON valide n'a été trouvé.");
};

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("La clé API n'est pas configurée.");
    return new GoogleGenAI({ apiKey });
};

const getCurrentUTCISO = (): string => {
    return new Date().toISOString();
};

const mapStringToSport = (sport: string): Sport => {
    const upperCaseSport = sport.toUpperCase();
    if (upperCaseSport.includes('BASKET')) return Sport.Basketball;
    if (upperCaseSport.includes('TENNIS')) return Sport.Tennis;
    return Sport.Football;
};

// Formateur de date/heure partagé pour la cohérence
const formatMatchDateTime = (isoString: string) => {
    const date = new Date(isoString);
    // Formatage strict en heure de Paris (Europe/Paris) comme Flashscore
    const dateStr = date.toLocaleDateString('fr-FR', { 
        timeZone: 'Europe/Paris', 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    }).replace(/\//g, '.');
    
    const timeStr = date.toLocaleTimeString('fr-FR', { 
        timeZone: 'Europe/Paris', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    return { dateStr, timeStr };
};

interface PredictionsProps {
    language: Language;
}

const LoadingComponent: React.FC = () => {
    const loadingTexts = [
        "Connexion à NEXTWIN Engine...",
        "Analyse des marchés en temps réel...",
        "Calibration du moteur prédictif...",
        "Synchronisation des horaires officiels..."
    ];
    const [textIndex, setTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-white text-lg font-semibold">{loadingTexts[textIndex]}</p>
            <p className="text-brand-light-gray text-sm">Veuillez patienter.</p>
        </div>
    );
};

const ErrorComponent: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="text-center flex flex-col items-center justify-center min-h-[400px] text-red-400 bg-brand-card border border-red-500/30 rounded-xl p-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h3 className="text-xl font-bold mt-4 text-white">Erreur de Synchronisation</h3>
        <p className="text-sm mt-2 max-w-sm text-gray-300">NEXTWIN Engine n'a pas pu récupérer les données en temps réel.</p>
        <button onClick={onRetry} className="mt-6 rounded-md bg-gradient-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gradient-brand-hover">
            RÉESSAYER
        </button>
    </div>
);

const Predictions: React.FC<PredictionsProps> = ({ language }) => {
    const t = translations[language];
    const [activeSport, setActiveSport] = useState<Sport | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [sources, setSources] = useState<GroundingSource[]>([]);

    const fetchPredictions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const currentUTC = getCurrentUTCISO();
            const prompt = `
            Tu es NEXTWIN AI ENGINE, un moteur automatisé de pronostics sportifs de haute précision.
    
            INSTRUCTIONS SYSTÈME (OBLIGATOIRES ET STRICTES) :
            - Tu DOIS répondre UNIQUEMENT avec du JSON valide.
            - TA RÉPONSE DOIT COMMENCER PAR \`{\` ET SE TERMINER PAR \`}\`.
            - AUCUN texte ou markdown ne doit être présent en dehors du JSON.
    
            OBJECTIF :
            Générer 6 pronostics sportifs pour des matchs réels, officiellement programmés (2 Football, 2 Basketball, 2 Tennis).

            CONTRAINTE DE TEMPS ET DE SYNCHRONISATION (CRITIQUE) :
            - L'heure actuelle de référence est ${currentUTC}. Sélectionne uniquement des matchs POSTÉRIEURS à cette heure.
            - Utilise Google Search pour vérifier l'horaire exact du coup d'envoi.
            - FOURNIT L'HEURE AU FORMAT ISO 8601 UTC STRICT (ex: "2024-02-15T20:00:00Z").
            - SOIS EXTRÊMEMENT PRÉCIS : l'horaire doit correspondre à celui de Flashscore.fr. Si un match NBA a lieu à 20h à New York, l'heure UTC doit être correctement calculée (01h UTC le lendemain).
    
            FORMAT JSON :
            {
              "predictions": [
                {
                  "sport": "Football" | "Basketball" | "Tennis",
                  "league": "Nom de la ligue",
                  "match": "Équipe A vs Équipe B",
                  "betType": "Pronostic précis (ex: France Gagnant)",
                  "matchDateTimeUTC": "ISO 8601 UTC String",
                  "probability": integer (>= 70),
                  "analysis": "Analyse factuelle courte"
                }
              ]
            }
            `;
    
            const ai = getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: { tools: [{googleSearch: {}}] },
            });
    
            const rawText = response.text?.trim();
            if (!rawText) throw new Error("Réponse vide.");
    
            const jsonText = extractJson(rawText);
            const parsed = JSON.parse(jsonText);
            
            if (!parsed.predictions || !Array.isArray(parsed.predictions)) throw new Error("Format invalide.");
    
            const newSources: GroundingSource[] = [];
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                for (const chunk of groundingChunks) {
                    if (chunk.web) newSources.push({ uri: chunk.web.uri, title: chunk.web.title || '' });
                }
            }
    
            const newPredictions: Prediction[] = parsed.predictions.map((p: any, index: number) => {
                const { dateStr, timeStr } = formatMatchDateTime(p.matchDateTimeUTC);
                return {
                    id: `${p.match}-${index}-${Date.now()}`,
                    sport: mapStringToSport(p.sport),
                    match: p.match,
                    betType: p.betType,
                    date: dateStr,
                    time: timeStr,
                    probability: p.probability,
                    analysis: `[${p.league}] ${p.analysis}`,
                };
            });

            setPredictions(newPredictions);
            setSources(newSources);
        } catch (err) {
            console.error("Fetch failed:", err);
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPredictions();
    }, [fetchPredictions]);

    const filteredPredictions = useMemo(() => {
        if (!predictions) return [];
        if (activeSport === 'ALL') return predictions;
        return predictions.filter(p => p.sport === activeSport);
    }, [activeSport, predictions]);

    const sportsWithAll: ('ALL' | Sport)[] = ['ALL', ...Object.values(Sport)];

    return (
        <div>
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold text-white">{t.predictions_title}</h1>
                <p className="mt-4 text-lg text-brand-light-gray">
                    {t.predictions_subtitle}
                </p>
                 <div className="mt-6">
                    <button
                        onClick={fetchPredictions}
                        disabled={isLoading}
                        className="inline-flex items-center rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className={`-ml-1 mr-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                            <path d="M21 3v5h-5"/>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                            <path d="M3 21v-5h5"/>
                        </svg>
                        Régénérer les pronostics
                    </button>
                </div>
            </div>
            
            {isLoading && <LoadingComponent />}
            {error && <ErrorComponent message={error} onRetry={fetchPredictions} />}
            
            {!isLoading && !error && predictions && (
                <div className="transition-opacity duration-700 opacity-100">
                    <div className="flex justify-center my-8 space-x-2">
                        {sportsWithAll.map(sport => (
                            <button
                                key={sport}
                                onClick={() => setActiveSport(sport)}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${activeSport === sport ? 'bg-gradient-brand text-white shadow-lg' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                            >
                                <span>{sport === 'ALL' ? 'Tous' : sport.charAt(0) + sport.slice(1).toLowerCase()}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPredictions.map(prediction => (
                            <PredictionCard key={prediction.id} prediction={prediction} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Predictions;