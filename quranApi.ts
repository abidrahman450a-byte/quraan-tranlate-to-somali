
import { Surah, SurahDetail, PageDetail, Reciter } from './types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export const RECITERS: Reciter[] = [
  { id: 'ar.abdurrahmaansudais', name: 'Cabdiraxmaan Al-Sudays', englishName: 'Abdul Rahman Al-Sudais' },
  { id: 'ar.abdullahmatroud', name: 'Cabdullaahi Matruud', englishName: 'Abdullah Matroud' }
];

const getAudioUrlList = (reciterId: string, ayahGlobalIndex: number, surahNumber: number, ayahInSurah: number): string[] => {
  const globalNum = Math.max(1, Math.min(6236, Math.floor(ayahGlobalIndex)));
  const sStr = surahNumber.toString().padStart(3, '0');
  const aStr = ayahInSurah.toString().padStart(3, '0');
  const everyAyahFile = `${sStr}${aStr}.mp3`;
  
  const folderMap: Record<string, string> = {
    'ar.abdurrahmaansudais': 'Abdurrahmaan_As-Sudais_192kbps',
    'ar.abdullahmatroud': 'Abdullah_Matroud_128kbps'
  };

  const folder = folderMap[reciterId];

  return [
    `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalNum}.mp3`,
    folder ? `https://everyayah.com/data/${folder}/${everyAyahFile}` : null,
    `https://audio.alquran.cloud/media/audio/ayah/${reciterId}/${globalNum}`
  ].filter(Boolean) as string[];
};

export const fetchSurahList = async (): Promise<Surah[]> => {
  const response = await fetch(`${BASE_URL}/surah`);
  const data = await response.json();
  return data.data;
};

export const fetchSurahWithTranslation = async (surahNumber: number, reciterId: string = 'ar.abdurrahmaansudais'): Promise<SurahDetail> => {
  try {
    const [arabicRes, somaliRes] = await Promise.all([
      fetch(`${BASE_URL}/surah/${surahNumber}`),
      fetch(`${BASE_URL}/surah/${surahNumber}/so.abduh`)
    ]);

    const [arabicData, somaliData] = await Promise.all([
      arabicRes.json(),
      somaliRes.json()
    ]);

    if (!arabicData.data) throw new Error("Suuradda lama helin");

    const surah: SurahDetail = arabicData.data;
    const translationAyahs = somaliData.data.ayahs;

    surah.ayahs = surah.ayahs.map((ayah, index) => {
      const urls = getAudioUrlList(reciterId, ayah.number, surah.number, ayah.numberInSurah);
      return {
        ...ayah,
        translation: translationAyahs[index]?.text || "Translation-ka lama heli karo",
        audioUrls: urls,
        audio: urls[0] || ""
      };
    });

    return surah;
  } catch (error) {
    console.error("fetchSurahWithTranslation failed:", error);
    throw error;
  }
};

export const fetchPageWithTranslation = async (pageNumber: number, reciterId: string = 'ar.abdurrahmaansudais'): Promise<PageDetail> => {
  try {
    const [arabicRes, somaliRes] = await Promise.all([
      fetch(`${BASE_URL}/page/${pageNumber}/quran-uthmani`),
      fetch(`${BASE_URL}/page/${pageNumber}/so.abduh`)
    ]);

    const [arabicData, somaliData] = await Promise.all([
      arabicRes.json(),
      somaliRes.json()
    ]);

    const arabicAyahs = arabicData.data?.ayahs || [];
    const translationAyahs = somaliData.data?.ayahs || [];

    const ayahs = arabicAyahs.map((ayah: any, index: number) => {
      const urls = getAudioUrlList(reciterId, ayah.number, ayah.surah.number, ayah.numberInSurah);
      return {
        ...ayah,
        translation: translationAyahs[index]?.text || "Translation-ka lama heli karo",
        audioUrls: urls,
        audio: urls[0] || "",
        surah: ayah.surah
      };
    });

    return { number: pageNumber, ayahs };
  } catch (error) {
    console.error("fetchPageWithTranslation failed:", error);
    throw error;
  }
};
