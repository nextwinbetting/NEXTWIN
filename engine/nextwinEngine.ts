import { GoogleGenAI, Type } from "@google/genai";
import { Prediction, Sport, GroundingSource, AnalysisResult } from '../types';

/**
 * Instancie et retourne un client GoogleGenAI configuré.
 * Cette fonction est appelée "juste-à-temps" pour garantir que process.env.API_KEY 
 * est disponible dans l'environnement d'exécution et pour permettre une gestion
 * d'erreurs robuste si la clé est manquante.
 * @returns Une instance de GoogleGenAI.
 */
const getAiClient = () => {
    // Cette initialisation peut échouer si la clé API est manquante.
    // En l'appelant à l'intérieur d'un bloc try/catch, nous évitons un crash de l'application.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};


/**
 * Récupère la date actuelle au format DD/MM/YYYY.
 * @returns La date du jour formatée.
 */
const getCurrentDateFR = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};


/**
 * Mappe une chaîne de caractères au type énuméré Sport pour garantir la cohérence des types de manière flexible.
 * @param sport La chaîne de caractères du sport retournée par l'IA.
 * @returns La valeur de l'énumération Sport correspondante.
 */
const mapStringToSport = (sport: string): Sport => {
    const upperCaseSport = sport.toUpperCase();
    // Utilise .includes() pour une correspondance plus flexible, corrigeant le bug de catégorisation.
    if (upperCaseSport.includes('BASKET')) {
        return Sport.Basketball;
    }
    if (upperCaseSport.includes('TENNIS')) {
        return Sport.Tennis;
    }
    // 'FOOTBALL' est un bon cas par défaut, mais on le vérifie explicitement pour la clarté.
    if (upperCaseSport.includes('FOOTBALL')) {
        return Sport.Football;
    }
    // Log de sécurité si un sport vraiment inattendu est reçu
    console.warn(`Sport non reconnu reçu: "${sport}". Assignation par défaut à Football.`);
    return Sport.Football;
};

/**
 * Interroge NEXTWIN Engine pour obtenir les 9 pronostics du jour.
 * @returns Une promesse résolue avec un tableau de 9 objets Prediction et leurs sources.
 */
export const getDailyPredictions = async (): Promise<{ predictions: Prediction[], sources: GroundingSource[] }> => {
    const currentDate = getCurrentDateFR();
    const prompt = `Agis en tant qu'expert en analyse de données sportives pour mon service 'NEXTWIN Engine', destiné à un public français. La date d'aujourd'hui est le ${currentDate}. Ta mission est de fournir exactement 9 pronostics de paris sportifs en te basant sur des informations VÉRIFIÉES et à jour via Google Search.
    Règles critiques et non négociables :
    1. VÉRACITÉ DES MATCHS : Les matchs doivent être des événements RÉELS et CONFIRMÉS qui auront lieu à partir d'aujourd'hui. Ne jamais inventer un match.
    2. RÈGLE D'OR - FUSEAU HORAIRE : C'est la règle la plus critique pour éviter les erreurs. Tu dois trouver la date et l'heure locale du match, puis la convertir et la retourner IMPÉRATIVEMENT sous forme de chaîne de caractères au format ISO 8601 en UTC.
        - EXEMPLE : Un match à 19h00, heure de New York (EST), le 1er janvier 2026, doit être retourné comme '2026-01-02T00:00:00.000Z' (ou '2026-01-02T01:00:00.000Z' en fonction de l'heure d'été). Le calcul doit être exact. Ce format ISO 8601 UTC est la SEULE sortie acceptable pour l'heure.
    3. PROBABILITÉ : La probabilité de succès doit être d'au moins 70%.
    4. DIVERSITÉ : Les sports doivent être répartis entre Football, Basketball, et Tennis.
    5. FORMAT : Réponds uniquement avec un objet JSON qui correspond au schéma fourni.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            predictions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        sport: { type: Type.STRING, description: "Le sport: 'FOOTBALL', 'BASKETBALL', ou 'TENNIS'." },
                        league: { type: Type.STRING, description: "La ligue ou compétition." },
                        match: { type: Type.STRING, description: "Les deux équipes/joueurs. Ex: 'Real Madrid vs Bayern Munich'." },
                        betType: { type: Type.STRING, description: "Le type de pari. Ex: 'PLUS DE 2.5 BUTS'." },
                        matchDateTimeUTC: { type: Type.STRING, description: "Date et heure complètes du match au format ISO 8601 en UTC. Ex: '2026-01-02T01:00:00.000Z'." },
                        probability: { type: Type.INTEGER, description: "Probabilité de succès (nombre entier entre 70 et 100)." },
                        analysis: { type: Type.STRING, description: "Analyse courte et professionnelle." }
                    },
                    required: ["sport", "league", "match", "betType", "matchDateTimeUTC", "probability", "analysis"]
                }
            }
        },
        required: ['predictions'],
    };

    try {
        const ai = getAiClient(); // Initialisation juste-à-temps
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                tools: [{googleSearch: {}}],
            },
        });

        const sources: GroundingSource[] = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            for (const chunk of groundingChunks) {
                if (chunk.web) {
                    sources.push({ uri: chunk.web.uri, title: chunk.web.title });
                }
            }
        }
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (parsed.predictions && Array.isArray(parsed.predictions)) {
            const predictions = parsed.predictions.map((p: any, index: number) => {
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
            return { predictions, sources };
        }
        throw new Error("Structure de données invalide reçue de l'IA.");

    } catch (error) {
        console.error("Erreur lors de la récupération des pronostics depuis NEXTWIN Engine:", error);
        throw error; // Propage l'erreur pour qu'elle soit gérée par le composant.
    }
};

/**
 * Interroge NEXTWIN Engine pour analyser un match spécifique.
 * @param sport Le sport sélectionné.
 * @param team1 La première équipe/joueur.
 * @param team2 La seconde équipe/joueur.
 * @param betType Le type de pari à analyser.
 * @returns Une promesse résolue avec l'objet de l'analyse.
 */
export const analyzeMatch = async (sport: string, team1: string, team2: string, betType: string): Promise<AnalysisResult> => {
    const currentDate = getCurrentDateFR();
    const prompt = `Agis en tant qu'expert en analyse de données sportives pour mon service 'NEXTWIN Engine', destiné à un public français. La date d'aujourd'hui est le ${currentDate}. En utilisant Google Search, analyse le PROCHAIN match à venir et VÉRIFIÉ de ${sport} entre ${team1} et ${team2} pour le type de pari "${betType}".

    Règles critiques et non négociables :
    1. VÉRACITÉ DU MATCH : Trouve le prochain match confirmé entre ces deux adversaires. Ne pas inventer un match.
    2. RÈGLE D'OR - FUSEAU HORAIRE : C'est la règle la plus critique pour éviter les erreurs. Tu dois trouver la date et l'heure locale du match, puis la convertir et la retourner IMPÉRATIVEMENT sous forme de chaîne de caractères au format ISO 8601 en UTC.
        - EXEMPLE : Un match à 19h00, heure de New York (EST), le 1er janvier 2026, doit être retourné comme '2026-01-02T00:00:00.000Z' (ou '2026-01-02T01:00:00.000Z' en fonction de l'heure d'été). Ce format ISO 8601 UTC est la SEULE sortie acceptable.
    3. ANALYSE ET PROBABILITÉ : Fournis une analyse détaillée, les points de données clés, et la probabilité de succès pour le type de pari demandé ("${betType}").
    4. RECOMMANDATION CLAIRE : Donne une recommandation principale de pari ("recommendedBet") qui te semble la plus pertinente pour ce match (cela peut être le pari demandé ou un autre si tu le juges meilleur) et explique brièvement pourquoi ("recommendationReason").
    5. FORMAT : Réponds uniquement avec un objet JSON qui correspond au schéma fourni.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            analysis: { type: Type.STRING, description: "Analyse textuelle détaillée du pari demandé." },
            probability: { type: Type.INTEGER, description: "Probabilité de succès (0-100) pour le pari demandé." },
            keyData: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Un tableau de 3 points de données clés pour l'analyse."
            },
            matchDateTimeUTC: { type: Type.STRING, description: "Date et heure complètes du match au format ISO 8601 en UTC. Ex: '2026-01-02T01:00:00.000Z'." },
            recommendedBet: { type: Type.STRING, description: "Le pari principal que l'IA recommande pour ce match." },
            recommendationReason: { type: Type.STRING, description: "Explication courte et claire de la recommandation." }
        },
        required: ["analysis", "probability", "keyData", "matchDateTimeUTC", "recommendedBet", "recommendationReason"]
    };

    try {
        const ai = getAiClient(); // Initialisation juste-à-temps
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                tools: [{googleSearch: {}}],
            },
        });

        const sources: GroundingSource[] = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            for (const chunk of groundingChunks) {
                if (chunk.web) {
                    sources.push({ uri: chunk.web.uri, title: chunk.web.title });
                }
            }
        }

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);

        const matchDateObj = new Date(parsed.matchDateTimeUTC);
        const dateFR = matchDateObj.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
        const timeFR = matchDateObj.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });

        const { matchDateTimeUTC, ...restOfParsed } = parsed;

        return { 
            ...restOfParsed,
            matchDate: dateFR,
            matchTime: timeFR,
            sources 
        };

    } catch (error) {
        console.error("Erreur lors de la récupération de l'analyse depuis NEXTWIN Engine:", error);
        throw error; // Propage l'erreur.
    }
};