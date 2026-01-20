
import React, { useState, useRef, useEffect } from 'react';
import { Surah, Ayah, Reciter } from '../types';
import { RECITERS, fetchSurahWithTranslation } from '../quranApi';

interface SurahListProps {
  surahs: Surah[];
  onSelect: (surahNumber: number) => void;
  activeNumber?: number;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSelect, activeNumber }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  const [playingSurah, setPlayingSurah] = useState<{number: number, ayahIndex: number} | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Refs for seamless transitions
  const audioAyahsRef = useRef<Ayah[]>([]);
  const playingContextRef = useRef<{number: number, ayahIndex: number} | null>(null);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.includes(searchTerm) ||
    s.number.toString() === searchTerm
  );

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    setPlayingSurah(null);
    playingContextRef.current = null;
    setIsBuffering(false);
    audioAyahsRef.current = [];
  };

  const handleTogglePlay = async (e: React.MouseEvent, surah: Surah) => {
    e.stopPropagation();

    if (playingSurah?.number === surah.number) {
      stopAudio();
      return;
    }

    setPlayingSurah({ number: surah.number, ayahIndex: 0 });
    playingContextRef.current = { number: surah.number, ayahIndex: 0 };
    setIsBuffering(true);

    try {
      const detail = await fetchSurahWithTranslation(surah.number, selectedReciter);
      audioAyahsRef.current = detail.ayahs;
      playAyahWithFallback(detail.ayahs, 0, surah.number, 0);
    } catch (err) {
      alert("Cilad ayaa dhacday soo raryidda codka.");
      stopAudio();
    }
  };

  const playAyahWithFallback = (queue: Ayah[], ayahIdx: number, surahNum: number, urlIdx: number) => {
    if (ayahIdx >= queue.length || !audioRef.current) {
      stopAudio();
      return;
    }

    const ayah = queue[ayahIdx];
    const urls = ayah.audioUrls || [];

    if (urlIdx >= urls.length) {
      playAyahWithFallback(queue, ayahIdx + 1, surahNum, 0);
      return;
    }

    playingContextRef.current = { number: surahNum, ayahIndex: ayahIdx };
    setPlayingSurah({ number: surahNum, ayahIndex: ayahIdx });
    setIsBuffering(true);

    audioRef.current.src = urls[urlIdx];
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsBuffering(false);
      }).catch(error => {
        if (error.name !== 'AbortError') {
          playAyahWithFallback(queue, ayahIdx, surahNum, urlIdx + 1);
        }
      });
    }
  };

  const onAudioEnded = () => {
    if (playingContextRef.current && audioAyahsRef.current.length > 0) {
      const { number, ayahIndex } = playingContextRef.current;
      playAyahWithFallback(audioAyahsRef.current, ayahIndex + 1, number, 0);
    } else {
      stopAudio();
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <audio 
        ref={audioRef} 
        onEnded={onAudioEnded}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onError={() => onAudioEnded()}
        preload="auto"
      />

      <div className="p-4 space-y-3 border-bottom border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Qaariga:</span>
          <select 
            value={selectedReciter}
            onChange={(e) => { setSelectedReciter(e.target.value); stopAudio(); }}
            className="flex-grow bg-transparent text-xs font-bold text-emerald-700 outline-none cursor-pointer"
          >
            {RECITERS.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Raadi suurad..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
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
          <div
            key={surah.number}
            onClick={() => onSelect(surah.number)}
            className={`w-full p-4 flex items-center hover:bg-emerald-50 transition-colors group cursor-pointer relative ${activeNumber === surah.number ? 'bg-emerald-50 border-r-4 border-emerald-600' : ''}`}
          >
            <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold mr-4 transition-colors ${playingSurah?.number === surah.number ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700'}`}>
              {surah.number}
            </div>
            <div className="flex-grow pr-2">
              <h3 className={`font-semibold text-sm sm:text-base ${playingSurah?.number === surah.number ? 'text-emerald-700' : 'text-slate-800'}`}>{surah.englishName}</h3>
              <p className="text-[10px] text-slate-500">{surah.englishNameTranslation} • {surah.numberOfAyahs}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="quran-font text-lg text-emerald-800 font-bold">{surah.name}</p>
              </div>
              <button
                onClick={(e) => handleTogglePlay(e, surah)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${playingSurah?.number === surah.number ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 shadow-sm'}`}
              >
                {isBuffering && playingSurah?.number === surah.number ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : playingSurah?.number === surah.number ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                ) : (
                  <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      {playingSurah && (
        <div className="p-3 bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-between">
          <span>HADDA: {surahs.find(s => s.number === playingSurah.number)?.englishName} ({playingSurah.ayahIndex + 1})</span>
          <button onClick={stopAudio} className="hover:text-emerald-200">JOOJI</button>
        </div>
      )}
    </div>
  );
};

export default SurahList;
