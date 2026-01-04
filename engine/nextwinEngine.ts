// FIX: Create the content for the empty file to resolve the module error.
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GroundingSource } from "../types";

/**
 * Instancie et retourne un client GoogleGenAI configuré.
 * Assume que la clé API est disponible dans les variables d'environnement.
 * @returns Une instance de GoogleGenAI.
 * @throws {Error} Si la clé API n'est pas définie.
 */
const getAiClient = () => {
    // Per coding guidelines, API_KEY must be read from process.env.API_KEY
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not defined in environment variables.");
    }
    // Per coding guidelines, apiKey must be a named parameter.
    return new GoogleGenAI({ apiKey });
};

/**
 * Analyse un match de sport en utilisant l'API Gemini.
 * @param sport Le sport du match.
 * @param team1 La première équipe/joueur.
 * @param team2 La deuxième équipe/joueur.
 * @param betType Le type de pari à analyser.
 * @returns Une promesse qui se résout avec le résultat de l'analyse.
 */
export const analyzeMatch = async (
    sport: string,
    team1: string,
    team2: string,
    betType: string
): Promise<AnalysisResult> => {
    // Detailed prompt to guide the AI for a structured JSON response.
    const prompt = `
        Tâche : Analyser le match de ${sport} entre ${team1} et ${team2} pour le type de pari "${betType}". Utiliser Google Search pour obtenir les données les plus récentes et fiables.

        Règles Impératives :
        1.  **Format de Sortie** : Répondre UNIQUEMENT avec un objet JSON valide conforme au schéma. Aucun texte, commentaire ou formatage en dehors de l'objet JSON.
        2.  **Analyse Détaillée** : Fournir une analyse concise (2-3 phrases) expliquant le raisonnement derrière la probabilité.
        3.  **Données Clés** : Extraire 3 à 4 points de données statistiques cruciaux qui soutiennent l'analyse (ex: forme récente, confrontations directes, statistiques de joueurs clés).
        4.  **Recommandation** : Suggérer un pari recommandé ("recommendedBet") basé sur l'analyse globale (qui peut être différent du pari demandé si une meilleure opportunité est trouvée) et justifier la recommandation en une phrase ("recommendationReason").
        5.  **Date et Heure (CRITIQUE)** : Trouver la date et l'heure locale exacte du match, les convertir en UTC, et retourner le résultat dans une chaîne de caractères au format ISO 8601 (exemple: '2026-01-02T19:00:00.000Z'). C'est la règle la plus importante.
        6.  **Probabilité** : Estimer la probabilité de succès du pari demandé ("${betType}") en pourcentage entier.
    `;

    // Define a schema for the expected JSON response from the AI.
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            analysis: { type: Type.STRING, description: "Analyse détaillée du pari." },
            probability: { type: Type.INTEGER, description: "Probabilité de succès du pari demandé (en %)." },
            keyData: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Liste des points de données statistiques clés."
            },
            recommendedBet: { type: Type.STRING, description: "Le pari recommandé par l'IA." },
            recommendationReason: { type: Type.STRING, description: "Raison de la recommandation." },
            matchDateTimeUTC: { type: Type.STRING, description: "Date et heure du match au format ISO 8601 UTC." },
        },
        required: ["analysis", "probability", "keyData", "recommendedBet", "recommendationReason", "matchDateTimeUTC"],
    };

    try {
        const ai = getAiClient();
        // Use ai.models.generateContent to call the Gemini API.
        const response = await ai.models.generateContent({
            // Use a model that supports advanced reasoning and grounding.
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                // Enable Google Search for up-to-date information.
                tools: [{ googleSearch: {} }],
            },
        });

        // Extract grounding sources for transparency.
        const sources: GroundingSource[] = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            for (const chunk of groundingChunks) {
                if (chunk.web) {
                    sources.push({ uri: chunk.web.uri, title: chunk.web.title || '' });
                }
            }
        }

        // Use response.text property to get the AI response string.
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        // Process the UTC date/time to display in a user-friendly format.
        const matchDate = new Date(parsed.matchDateTimeUTC);
        const dateFR = matchDate.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
        const timeFR = matchDate.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });

        // Return a structured AnalysisResult object.
        return {
            analysis: parsed.analysis,
            probability: parsed.probability,
            keyData: parsed.keyData,
            recommendedBet: parsed.recommendedBet,
            recommendationReason: parsed.recommendationReason,
            matchDate: dateFR,
            matchTime: timeFR,
            sources: sources,
        };

    } catch (error) {
        console.error("Error in analyzeMatch:", error);
        throw new Error("Failed to get analysis from NEXTWIN Engine.");
    }
};
