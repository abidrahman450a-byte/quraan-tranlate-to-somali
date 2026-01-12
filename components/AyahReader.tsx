
import React from 'react';
import { Ayah, SurahDetail } from '../types';

interface AyahReaderProps {
  surah: SurahDetail;
  onAskAI: (ayah: Ayah) => void;
}

const AyahReader: React.FC<AyahReaderProps> = ({ surah, onAskAI }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{surah.englishName}</h2>
        <p className="quran-font text-4xl text-emerald-700 mb-4">{surah.name}</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
          <span className="bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">{surah.revelationType}</span>
          <span>•</span>
          <span className="bg-slate-100 px-3 py-1 rounded-full">{surah.numberOfAyahs} Aayadood</span>
        </div>
      </div>

      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center mb-12 py-8 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="quran-font text-3xl text-emerald-800">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <p className="text-emerald-600 mt-2 font-medium italic">Magaca Eebe ee Naxariis guud iyo mid gaaraba Naxariista.</p>
        </div>
      )}

      <div className="space-y-12">
        {surah.ayahs.map((ayah) => {
          // Remove Bismillah from text if it's the first ayah of surahs (except Fatiha)
          let displayText = ayah.text;
          if (surah.number !== 1 && ayah.numberInSurah === 1) {
            displayText = displayText.replace('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ', '');
            displayText = displayText.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
          }

          return (
            <div key={ayah.number} className="group relative">
              <div className="flex items-start justify-between mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  {ayah.numberInSurah}
                </span>
                <button
                  onClick={() => onAskAI(ayah)}
                  className="flex items-center space-x-1 text-xs text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-50 px-3 py-1 rounded-lg hover:bg-emerald-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Weydii AI</span>
                </button>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                <p className="quran-font text-3xl leading-relaxed text-right text-slate-800 mb-6 tracking-wide" dir="rtl">
                  {displayText}
                </p>
                <div className="border-t border-slate-50 pt-6">
                  <p className="text-lg text-slate-700 leading-relaxed font-normal">
                    {ayah.translation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AyahReader;
