import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource } from '../../../types';

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

export async function POST(request: Request) {
    try {
        const { sport, team1, team2, betType } = await request.json();

        if (!sport || !team1 || !team2 || !betType) {
            return NextResponse.json({ error: "Paramètres manquants dans la requête." }, { status: 400 });
        }
        
        const prompt = `
        Tu es NEXTWIN AI ENGINE, un moteur automatisé d'analyse sportive.

        INSTRUCTIONS SYSTÈME (OBLIGATOIRES ET STRICTES) :
        - Tu DOIS répondre UNIQUEMENT avec du JSON valide.
        - TA RÉPONSE DOIT COMMENCER PAR \`{\` ET SE TERMINER PAR \`}\`.
        - AUCUN texte, commentaire, ou markdown (comme \`\`\`json) ne doit être présent en dehors de l'objet JSON principal.
        - Si tu ne peux pas générer une analyse valide, retourne EXACTEMENT ce JSON d'erreur : \`{"error": "Analyse impossible, données insuffisantes pour ce match."}\`.

        OBJECTIF :
        Analyser le match de ${sport} entre ${team1} et ${team2} pour le pari "${betType}", en utilisant Google Search pour des données à jour.

        FORMAT JSON OBLIGATOIRE :
        La réponse doit être un objet JSON unique avec les champs suivants :
        - "analysis": Analyse détaillée (string)
        - "probability": Indice de confiance pour le pari demandé (integer)
        - "keyData": Tableau de 3-4 points statistiques clés (array of strings)
        - "recommendedBet": Suggestion de pari basée sur l'analyse globale (string)
        - "recommendationReason": Justification de cette suggestion (string)
        - "matchDateTimeUTC": Date et heure du match en UTC, format ISO 8601 (string)
        `;
        
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
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
        
        if (parsed.error) {
            throw new Error(parsed.error);
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
        
        const matchDate = new Date(parsed.matchDateTimeUTC);
        const dateFR = matchDate.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });
        const timeFR = matchDate.toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' });

        const result: AnalysisResult = {
            analysis: parsed.analysis,
            probability: parsed.probability,
            keyData: parsed.keyData,
            recommendedBet: parsed.recommendedBet,
            recommendationReason: parsed.recommendationReason,
            matchDate: dateFR,
            matchTime: timeFR,
            sources: sources,
        };

        return NextResponse.json(result);

    } catch (error) {
        console.error("Erreur détaillée dans /api/analyzer:", error instanceof Error ? error.stack : error);
        const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue est survenue.";
        return NextResponse.json({ error: "Échec de l'analyse par NEXTWIN Engine.", details: errorMessage }, { status: 500 });
    }
}