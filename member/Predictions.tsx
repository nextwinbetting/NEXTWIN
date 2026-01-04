import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Prediction, Sport, GroundingSource, Language } from '../types';
import PredictionCard from '../components/PredictionCard';
import { translations } from '../translations';

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
            const response = await fetch('/api/pronostics');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.details || data.error || `Erreur du serveur: ${response.status}`);
            }
            
            if (!data.predictions) {
                throw new Error("La réponse du serveur ne contient pas de pronostics.");
            }

            setPredictions(data.predictions);
            setSources(data.sources || []);
        } catch (err) {
            console.error("Failed to fetch predictions from API route:", err);
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