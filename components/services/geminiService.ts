import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async askAboutAyah(ayahText: string, translation: string, question: string) {
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
      return "Waan ka xumahay, cilad ayaa dhacday markii aan isku dayayey inaan ka jawaabo su'aashaada. Fadlan isku day markale.";
    }
  }

  async summarizeSurah(surahName: string, englishName: string) {
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