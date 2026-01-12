
import React, { useState } from 'react';
import { Surah } from '../types';

interface SurahListProps {
  surahs: Surah[];
  onSelect: (surahNumber: number) => void;
  activeNumber?: number;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelect, activeNumber }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.includes(searchTerm) ||
    s.number.toString() === searchTerm
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-bottom border-slate-100 bg-slate-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Raadi suurad..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="overflow-y-auto flex-grow divide-y divide-slate-100">
        {filteredSurahs.map((surah) => (
          <button
            key={surah.number}
            onClick={() => onSelect(surah.number)}
            className={`w-full p-4 flex items-center hover:bg-emerald-50 transition-colors group text-left ${activeNumber === surah.number ? 'bg-emerald-50 border-r-4 border-emerald-600' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-4 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
              {surah.number}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-slate-800">{surah.englishName}</h3>
              <p className="text-xs text-slate-500">{surah.englishNameTranslation} • {surah.numberOfAyahs} Aayadood</p>
            </div>
            <div className="text-right">
              <p className="quran-font text-lg text-emerald-800 font-bold">{surah.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{surah.revelationType}</p>
            </div>
          </button>
        ))}
        {filteredSurahs.length === 0 && (
          <div className="p-8 text-center text-slate-500 italic">
            Ma jirto suurad laga helay raadintaada.
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahList;
