import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";
import { Prediction, Sport, GroundingSource } from '../../../types';

// Vercel specific configuration to extend serverless function timeout
// This is crucial for AI APIs that can take longer to respond.
export const maxDuration = 30; // 30 seconds

/**
 * Instancie et retourne un client GoogleGenAI configuré.
 * S'exécute uniquement côté serveur, garantissant la sécurité de la clé API.
 * @returns Une instance de GoogleGenAI.
 * @throws {Error} Si la clé API n'est pas définie dans les variables d'environnement.
 */
const getAiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is not defined in environment variables.");
    }
    return new GoogleGenAI({ apiKey });
};

const getCurrentDateFR = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
};

const mapStringToSport = (sport: string): Sport => {
    const upperCaseSport = sport.toUpperCase();
    if (upperCaseSport.includes('BASKET')) return Sport.Basketball;
    if (upperCaseSport.includes('TENNIS')) return Sport.Tennis;
    if (upperCaseSport.includes('FOOTBALL')) return Sport.Football;
    console.warn(`Unrecognized sport: "${sport}". Defaulting to Football.`);
    return Sport.Football;
};


/**
 * Gère les requêtes GET pour récupérer les pronostics du jour.
 * Cette fonction est le point d'entrée de l'API Route.
 */
export async function GET() {
    try {
        const currentDate = getCurrentDateFR();
        const prompt = `
        Tâche : Fournir 9 pronostics sportifs pour le ${currentDate}. Utiliser Google Search pour des données à jour.
        
        Règles Impératives :
        1.  **Format de Sortie** : Répondre UNIQUEMENT avec un objet JSON valide conforme au schéma. Aucun texte en dehors du JSON.
        2.  **Contenu** : Exactement 9 pronostics, diversifiés entre Football, Basketball, et Tennis.
        3.  **Fiabilité** : Probabilité de succès de chaque pronostic ≥ 70%.
        4.  **Véracité** : Les matchs doivent être réels et confirmés pour aujourd'hui ou une date future proche.
        5.  **CRITIQUE - Heure du Match** : Pour chaque match, trouver l'heure locale, la convertir en UTC, et la retourner en string au format ISO 8601 (ex: '2026-01-02T01:00:00.000Z'). C'est la règle la plus importante.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                predictions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            sport: { type: Type.STRING },
                            league: { type: Type.STRING },
                            match: { type: Type.STRING },
                            betType: { type: Type.STRING },
                            matchDateTimeUTC: { type: Type.STRING },
                            probability: { type: Type.INTEGER },
                            analysis: { type: Type.STRING }
                        },
                        required: ["sport", "league", "match", "betType", "matchDateTimeUTC", "probability", "analysis"]
                    }
                }
            },
            required: ['predictions'],
        };

        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
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
                    sources.push({ uri: chunk.web.uri, title: chunk.web.title || '' });
                }
            }
        }
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        
        if (!parsed.predictions || !Array.isArray(parsed.predictions)) {
            throw new Error("Invalid data structure received from AI.");
        }

        const predictions: Prediction[] = parsed.predictions.map((p: any, index: number) => {
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

        return NextResponse.json({ predictions, sources });

    } catch (error) {
        console.error("Error in /api/pronostics:", error);
        // Renvoyer une réponse d'erreur standardisée
        return NextResponse.json({ error: "Failed to fetch predictions from NEXTWIN Engine." }, { status: 500 });
    }
}
