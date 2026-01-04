import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { Prediction, Sport, GroundingSource } from '../../../types';

export const maxDuration = 30;

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
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
        console.error("API key not found in environment variables.");
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

export async function GET() {
    try {
        const currentDate = getCurrentDateFR();
        const prompt = `
        Tâche : Fournir 5 analyses de matchs sportifs pour le ${currentDate}. Ta réponse doit être un objet JSON avec une clé "predictions". Utilise Google Search pour des données à jour.

        RÈGLES ABSOLUES :
        1.  **FORMAT JSON STRICT**: Ta réponse doit être UNIQUEMENT un objet JSON valide. Elle doit commencer par \`{\` et se terminer par \`}\`. N'inclus AUCUN texte, AUCUNE explication, et AUCUNE balise markdown comme \`\`\`json avant ou après le JSON.
        2.  **STRUCTURE**: Le JSON doit contenir une clé "predictions", un tableau de 5 objets. Chaque objet doit avoir: "sport" (string), "league" (string), "match" (string), "betType" (string), "matchDateTimeUTC" (string ISO 8601), "probability" (integer), "analysis" (string).
        3.  **SI TU NE PEUX PAS RÉPONDRE**: Si tu ne peux pas trouver 5 matchs, retourne un JSON valide avec un tableau vide: \`{"predictions": []}\`. NE PAS retourner de message d'erreur en texte.
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

        return NextResponse.json({ predictions, sources });

    } catch (error) {
        console.error("Erreur détaillée dans /api/pronostics:", error instanceof Error ? error.stack : error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        return NextResponse.json(
          { error: "Échec de la récupération des pronostics depuis NEXTWIN Engine.", details: errorMessage },
          { status: 500 }
        );
    }
}