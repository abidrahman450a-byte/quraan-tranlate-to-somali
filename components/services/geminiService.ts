
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Fallback to empty string to prevent immediate crash if key is missing
    const apiKey = process.env.API_KEY || "MISSING_KEY";
    this.ai = new GoogleGenAI({ apiKey });
  }

  async askAboutAyah(ayahText: string, translation: string, question: string) {
    // Check key before calling API to give friendly error
    if (!process.env.API_KEY) {
      return "Fadlan marka hore geli API Key-ga (Netlify Environment Variables).";
    }

    const prompt = `
      Macluumaadka soo socda waa aayad ka mid ah Qur'aanka kariimka ah:
      Carabi: "${ayahText}"
      Af-Soomaali: "${translation}"

      Su'aasha isticmaalaha waa: "${question}"

      Fadlan bixi sharaxaad kooban oo faahfaahsan adigoo adeegsanaya afka Soomaaliga. Haddii ay jirto xikmad ama sabab loo soo dejiyey (Asbaabu-nuzuul), fadlan sheeg haddii aad ogtahay. 
      U hadal si ixtiraam leh oo diini ah.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return "Waan ka xumahay, cilad ayaa dhacday markii aan isku dayayey inaan ka jawaabo su'aashaada. Fadlan hubi Internet-ka ama API Key-ga.";
    }
  }

  async summarizeSurah(surahName: string, englishName: string) {
    if (!process.env.API_KEY) return "API Key lama helin.";

    const prompt = `
      Fadlan bixi dulmar guud (Summary) oo ku saabsan Suuradda ${surahName} (${englishName}) ee Qur'aanka kariimka ah. 
      Dulmarku ha ku qornaado Af-Soomaali, kana koobnaado:
      1. Mawduucyada ugu muhiimsan ee suuraddu ka hadasho.
      2. Xikmadaha ku jira.
      3. Haddii ay tahay Makki ama Madani iyo waxa ay taasi ka dhigan tahay.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return "Ma awoodin inaan soo koobo suuradda hadda.";
    }
  }

  async getVoiceTips() {
    if (!process.env.API_KEY) return "API Key lama helin.";

    const prompt = `
      Fadlan bixi 5 talo oo muhiim ah oo ku saabsan sida loo hagaajiyo codka iyo akhriska Qur'aanka (Tajwiidka iyo laxanka).
      Talooyinka ha ku qornaadaan Af-Soomaali, si dhiirigelin lehna u qor.
      U hadal sidii macalin Qur'aan oo kale.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Gemini API error:', error);
      return "Ma awoodin inaan helo talooyinka hadda.";
    }
  }
}

export const geminiService = new GeminiService();
