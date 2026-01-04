import { GoogleGenAI } from "@google/genai";
import { Prediction, Sport, GroundingSource } from '../types';

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
        console.error("API key not found in Vercel environment variables.");
        throw new Error("La clé API n'est pas configurée côté serveur.");
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

export default async function handler(request: Request) {
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

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

        const sources: GroundingSource[] = [];
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
            for (const chunk of groundingChunks) {
                if (chunk.web) {
                    sources.push({ uri: chunk.web.uri, title: chunk.web.title || '' });
                }
            }
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
        
        return new Response(JSON.stringify({ predictions, sources }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error("Erreur détaillée dans /api/pronostics:", error instanceof Error ? error.stack : error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        return new Response(JSON.stringify({ error: "Échec de la récupération des pronostics depuis NEXTWIN Engine.", details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}