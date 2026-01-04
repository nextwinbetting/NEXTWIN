import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prediction, Sport, GroundingSource, Language } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';
import { GoogleGenAI } from "@google/genai";

// --- AI LOGIC MOVED HERE FOR AI STUDIO COMPATIBILITY ---
const extractJson = (rawText: string): string => {
    const match = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1];
    }
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}');
    if (startIndex > -1 && endIndex > -1) {
        return rawText.substring(startIndex, endIndex + 1);
    }
    throw new Error("Aucun objet JSON valide n'a été trouvé dans la réponse de l'IA.");
};

const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API key not found in environment variables.");
        throw new Error("La clé API n'est pas configurée dans l'environnement.");
    }
    return new GoogleGenAI({ apiKey });
};

const getCurrentDateFR = (): string => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR');
};

const mapStringToSport = (sport: string): Sport => {
    const upperCaseSport = sport.toUpperCase();
    if (upperCaseSport.includes('BASKET')) return Sport.Basketball;
    if (upperCaseSport.includes('TENNIS')) return Sport.Tennis;
    return Sport.Football;
};
// --- END OF AI LOGIC ---

interface PredictionsProps {
    language: Language;
}

const LoadingComponent: React.FC = () => {
    const loadingTexts = [
        "Connexion à NEXTWIN Engine...",
        "Analyse des marchés en temps réel...",
        "Calibration du moteur prédictif...",
        "Croisement des données multi-sources..."
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
        <h3 className="text-xl font-bold mt-4 text-white">Erreur de Connexion</h3>
        <p className="text-sm mt-2 max-w-sm text-gray-300">NEXTWIN Engine n'a pas pu récupérer les pronostics. Voici les détails :</p>
        <p className="text-xs mt-2 text-gray-400 bg-gray-900/50 p-2 rounded-md max-w-sm">{message}</p>
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
            const currentDate = getCurrentDateFR();
            const prompt = `
            Tu es NEXTWIN AI ENGINE, un moteur automatisé de pronostics sportifs.
    
            INSTRUCTIONS SYSTÈME (OBLIGATOIRES ET STRICTES) :
            - Tu DOIS répondre UNIQUEMENT avec du JSON valide.
            - TA RÉPONSE DOIT COMMENCER PAR \`{\` ET SE TERMINER PAR \`}\`.
            - AUCUN texte, commentaire, ou markdown (comme \`\`\`json) ne doit être présent en dehors de l'objet JSON principal.
            - Si tu ne peux pas générer une réponse valide, retourne EXACTEMENT : \`{"predictions": []}\`.
    
            OBJECTIF :
            Générer 6 pronostics sportifs exclusifs pour le ${currentDate}. Il doit y avoir EXACTEMENT 2 pronostics pour le Football, 2 pour le Basketball, et 2 pour le Tennis.
    
            FORMAT JSON OBLIGATOIRE :
            La réponse doit être un objet JSON unique contenant une clé "predictions". Cette clé contient un tableau de 6 objets, chacun avec les champs suivants :
            - "sport": "Football", "Basketball", ou "Tennis"
            - "league": Nom de la compétition (string)
            - "match": "Équipe A vs Équipe B" (string)
            - "betType": Le type de pari (string)
            - "matchDateTimeUTC": Date et heure du match en UTC, format ISO 8601 (string)
            - "probability": Indice de confiance (integer, ≥ 70)
            - "analysis": Analyse courte et factuelle (string)
            `;
    
            const ai = getAiClient();
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
                config: {
                    tools: [{googleSearch: {}}],
                },
            });
    
            const rawText = response.text?.trim();
            if (!rawText) {
                throw new Error("La réponse de NEXTWIN Engine est vide.");
            }
    
            const jsonText = extractJson(rawText);
            
            let parsed;
            try {
                parsed = JSON.parse(jsonText);
            } catch (e) {
                console.error("Erreur de parsing JSON. Texte reçu de l'IA:", jsonText);
                throw new Error(`Le format de la réponse de l'IA est invalide. Contenu : "${jsonText.slice(0, 200)}..."`);
            }
    
            if (!parsed.predictions || !Array.isArray(parsed.predictions)) {
                throw new Error("La réponse JSON de l'IA n'a pas le format attendu (tableau 'predictions' manquant).");
            }
    
            const newSources: GroundingSource[] = [];
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                for (const chunk of groundingChunks) {
                    if (chunk.web) {
                        newSources.push({ uri: chunk.web.uri, title: chunk.web.title || '' });
                    }
                }
            }
    
            const newPredictions: Prediction[] = parsed.predictions.map((p: any, index: number) => {
                const matchDate = new Date(p.matchDateTimeUTC);
                const dateFR = matchDate.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
                const timeFR = matchDate.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });
    
                return {
                    id: `${p.match.replace(/\s/g, '-')}-${index}-${Date.now()}`,
                    sport: mapStringToSport(p.sport),
                    match: p.match,
                    betType: p.betType,
                    date: dateFR,
                    time: timeFR,
                    probability: p.probability,
                    analysis: `[${p.league}] ${p.analysis}`,
                };
            });

            setPredictions(newPredictions);
            setSources(newSources);
        } catch (err) {
            console.error("Failed to fetch predictions directly from AI:", err);
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

                    {sources.length > 0 && (
                        <div className="my-8 p-4 bg-brand-card border border-gray-800 rounded-xl max-w-4xl mx-auto">
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                Sources utilisées par NEXTWIN Engine
                            </h4>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {sources.map((source, index) => (
                                    <a key={index} href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate" title={source.title}>
                                        {source.title || new URL(source.uri).hostname}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

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