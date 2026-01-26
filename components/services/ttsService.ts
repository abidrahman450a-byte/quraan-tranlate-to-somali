import { GoogleGenAI, Modality } from "@google/genai";

export class TTSService {
  private ai: GoogleGenAI;
  private currentSource: AudioBufferSourceNode | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateSomaliAudio(text: string): Promise<Uint8Array | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `U akhri fasiraaddan si degan oo ixtiraam leh, adigoo isticmaalaya lahjada Soomaaliga: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return this.decodeBase64(base64Audio);
      }
      return null;
    } catch (error) {
      console.error("TTS Error:", error);
      return null;
    }
  }

  async reciteArabicAyah(arabicText: string): Promise<Uint8Array | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Recite this Quranic verse in Arabic with proper Tajweed and a beautiful, slow, reverent recitation style: ${arabicText}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck often has a deeper, more formal tone suitable for Arabic
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return this.decodeBase64(base64Audio);
      }
      return null;
    } catch (error) {
      console.error("AI Recitation Error:", error);
      return null;
    }
  }

  private decodeBase64(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async playAudio(data: Uint8Array): Promise<void> {
    this.stopAudio();
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const audioBuffer = await this.decodeAudioData(data, this.audioCtx, 24000, 1);
    const source = this.audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioCtx.destination);
    this.currentSource = source;
    
    return new Promise((resolve) => {
      source.onended = () => {
        this.currentSource = null;
        resolve();
      };
      source.start();
    });
  }

  stopAudio() {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {}
      this.currentSource = null;
    }
  }

  private async decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
}

export const ttsService = new TTSService();