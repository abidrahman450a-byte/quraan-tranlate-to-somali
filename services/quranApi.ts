
import { Surah, SurahDetail } from '../types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurahList = async (): Promise<Surah[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  return data.data;
};

export const fetchSurahWithTranslation = async (surahNumber: number): Promise<SurahDetail> => {
  // Fetch Arabic
  const arabicRes = await fetch(`${BASE_URL}/surah/${surahNumber}`);
  const arabicData = await arabicRes.json();
  
  // Fetch Somali Translation (Abduh translation is widely used: so.abduh)
  const somaliRes = await fetch(`${BASE_URL}/surah/${surahNumber}/so.abduh`);
  const somaliData = await somaliRes.json();

  const surah: SurahDetail = arabicData.data;
  const translationAyahs = somaliData.data.ayahs;

  // Merge translation into Arabic ayahs
  surah.ayahs = surah.ayahs.map((ayah, index) => ({
    ...ayah,
    translation: translationAyahs[index].text
  }));

  return surah;
};
