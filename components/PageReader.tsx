
import React, { useState, useRef, useEffect } from 'react';
import { PageDetail, Ayah, Reciter } from '../types';
import { fetchPageWithTranslation, RECITERS } from '../quranApi';

interface PageReaderProps {
  initialPage: number;
  onAskAI: (ayah: Ayah) => void;
}

const PageReader: React.FC<PageReaderProps> = ({ initialPage, onAskAI }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageData, setPageData] = useState<PageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});
  
  // Refs for seamless speed
  const pageAyahsRef = useRef<Ayah[]>([]);
  const playingIdRef = useRef<number | null>(null);
  const isAutoplayRef = useRef<boolean>(false);

  useEffect(() => {
    loadPage(currentPage, selectedReciter);
    setPlayingId(null);
    playingIdRef.current = null;
    setIsAutoplay(false);
    isAutoplayRef.current = false;
  }, [currentPage, selectedReciter]);

  const loadPage = async (num: number, reciter: string) => {
    setLoading(true);
    try {
      const data = await fetchPageWithTranslation(num, reciter);
      setPageData(data);
      pageAyahsRef.current = data.ayahs;
    } catch (err) {
      console.error("Error loading page content");
    } finally {
      setLoading(false);
    }
  };

  const playWithFallback = (ayah: Ayah, urlIdx: number) => {
    if (!audioRef.current || !ayah.audioUrls || urlIdx >= ayah.audioUrls.length) {
      if (isAutoplayRef.current) handleNext(ayah.number);
      else {
        setPlayingId(null);
        playingIdRef.current = null;
      }
      return;
    }

    playingIdRef.current = ayah.number;
    setPlayingId(ayah.number);
    setIsBuffering(true);
    
    audioRef.current.src = ayah.audioUrls[urlIdx];
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        setIsBuffering(false);
      }).catch(err => {
        if (err.name !== 'AbortError') {
          playWithFallback(ayah, urlIdx + 1);
        }
      });
    }

    ayahRefs.current[ayah.number]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleNext = (currentId: number) => {
    const list = pageAyahsRef.current;
    const idx = list.findIndex(a => a.number === currentId);
    if (idx !== -1 && idx < list.length - 1) {
      playWithFallback(list[idx + 1], 0);
    } else {
      setPlayingId(null);
      playingIdRef.current = null;
      setIsAutoplay(false);
      isAutoplayRef.current = false;
    }
  };

  const toggleAudio = (ayah: Ayah) => {
    if (playingId === ayah.number) {
      audioRef.current?.pause();
      setPlayingId(null);
      playingIdRef.current = null;
      setIsAutoplay(false);
      isAutoplayRef.current = false;
    } else {
      setIsAutoplay(false);
      isAutoplayRef.current = false;
      playWithFallback(ayah, 0);
    }
  };

  const onAudioEnded = () => {
    if (isAutoplayRef.current && playingIdRef.current) {
      handleNext(playingIdRef.current);
    } else {
      setPlayingId(null);
      playingIdRef.current = null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <audio 
        ref={audioRef} 
        onEnded={onAudioEnded} 
        onWaiting={() => setIsBuffering(true)} 
        onPlaying={() => setIsBuffering(false)} 
        onError={() => playingIdRef.current && handleNext(playingIdRef.current)} 
        preload="auto"
      />
      
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 gap-4 sticky top-20 z-30">
          <div className="flex items-center space-x-2">
            <button onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)} disabled={currentPage === 1 || loading} className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <div className="text-center min-w-[100px]">
              <h2 className="text-xl font-bold text-slate-800">Bogga {currentPage}</h2>
            </div>
            <button onClick={() => currentPage < 604 && setCurrentPage(p => p + 1)} disabled={currentPage === 604 || loading} className="p-2 hover:bg-slate-100 rounded-full disabled:opacity-30"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <select value={selectedReciter} onChange={(e) => setSelectedReciter(e.target.value)} className="bg-transparent text-sm font-bold text-emerald-700 outline-none">
                {RECITERS.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <button 
              onClick={() => { 
                setIsAutoplay(true); 
                isAutoplayRef.current = true;
                if (pageData) playWithFallback(pageData.ayahs[0], 0); 
              }} 
              className={`px-4 py-2 font-bold rounded-xl shadow-md transition-all ${isAutoplay ? 'bg-emerald-800 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
            >
              {isAutoplay ? 'Codka waa shidanyahay (Toos)' : 'Dhegeyso Bogga'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-24"><div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div><p className="text-slate-500">Waa la soo raryayaa...</p></div>
      ) : (
        <div className="space-y-8 pb-12">
          {pageData?.ayahs.map((ayah) => (
            <div key={ayah.number} className="group relative" ref={el => { ayahRefs.current[ayah.number] = el; }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${playingId === ayah.number ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{ayah.surah?.englishName} : {ayah.numberInSurah}</span>
                  <button onClick={() => toggleAudio(ayah)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${playingId === ayah.number ? 'bg-emerald-600 text-white shadow-lg' : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50'}`}>
                    {isBuffering && playingId === ayah.number ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : playingId === ayah.number ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg> : <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>}
                  </button>
                </div>
                <button onClick={() => onAskAI(ayah)} className="text-xs text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">AI</button>
              </div>
              <div className={`rounded-3xl p-6 sm:p-8 border transition-all ${playingId === ayah.number ? 'bg-emerald-50/70 border-emerald-300 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}>
                <p className="quran-font text-3xl sm:text-4xl text-right text-slate-800 mb-8 leading-[1.6]" dir="rtl">{ayah.text}</p>
                <div className="border-t pt-8"><p className="text-lg sm:text-xl text-slate-700 leading-relaxed">{ayah.translation}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageReader;
