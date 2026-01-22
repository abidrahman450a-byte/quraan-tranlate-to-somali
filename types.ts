
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  translation?: string;
  audio?: string;
  audioUrls?: string[]; 
  surah?: Surah;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface PageDetail {
  number: number;
  ayahs: Ayah[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface User {
  email: string;
  name: string;
}

export type AppView = 'quran' | 'adkaar' | 'prayer' | 'page-reading' | 'voice-test';
export type AuthMode = 'login' | 'signup' | 'landing' | 'authenticated';

export interface Reciter {
  id: string;
  name: string;
  englishName: string;
}

export interface AdkaarItem {
  category: string;
  arabic: string;
  somali: string;
  count: number;
  reference: string;
}

export interface PrayerTimesData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  [key: string]: string;
}
