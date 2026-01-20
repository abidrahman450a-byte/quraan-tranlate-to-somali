
import React, { useState, useRef, useEffect } from 'react';
import { Ayah, SurahDetail, Reciter } from '../types';
import { RECITERS, fetchSurahWithTranslation } from '../quranApi';
import { ttsService } from './services/ttsService';

interface AyahReaderProps {
  surah: SurahDetail;
  onAskAI: (ayah: Ayah) => void;
}

const AyahReader: React.FC<AyahReaderProps> = ({ surah: initialSurah, onAskAI }) => {
  const [surah, setSurah] = useState<SurahDetail>(initialSurah);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [playingTafseerId, setPlayingTafseerId] = useState<number | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState<string>(RECITERS[0].id);
  const [loadingAudioData, setLoadingAudioData] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const ayahsRef = useRef<Ayah[]>(initialSurah.ayahs);
  const isAutoplayRef = useRef<boolean>(true);
  const playingIdRef = useRef<number | null>(null);
  const isAiReciterSelected = selectedReciter === 'ai.gemini';

  useEffect(() => {
    setSurah(initialSurah);
    ayahsRef.current = initialSurah.ayahs;
    stopCurrentAudio();
  }, [initialSurah]);

  useEffect(() => {
    isAutoplayRef.current = isAutoplay;
  }, [isAutoplay]);

  useEffect(() => {
    if (playingId && ayahRefs.current[playingId]) {
      ayahRefs.current[playingId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [playingId]);

  const updateReciter = async (reciterId: string) => {
    setSelectedReciter(reciterId);
    setLoadingAudioData(true);
    stopCurrentAudio();
    try {
      const updated = await fetchSurahWithTranslation(surah.number, reciterId);
      setSurah(updated);
      ayahsRef.current = updated.ayahs;
    } catch (error) {
      console.error("Reciter update failed");
    } finally {
      setLoadingAudioData(false);
    }
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }
    ttsService.stopAudio();
    setPlayingId(null);
    playingIdRef.current = null;
    setIsBuffering(false);
  };

  const playAyah = async (ayah: Ayah, urlIdx: number) => {
    stopCurrentAudio();
    playingIdRef.current = ayah.number;
    setPlayingId(ayah.number);
    setIsBuffering(true);

    if (isAiReciterSelected) {
      // Use Gemini TTS for Arabic recitation
      const audioData = await ttsService.reciteArabicAyah(ayah.text);
      setIsBuffering(false);
      if (audioData) {
        await ttsService.playAudio(audioData);
        if (isAutoplayRef.current && playingIdRef.current === ayah.number) {
          handleNext(ayah.number);
        } else {
          setPlayingId(null);
          playingIdRef.current = null;
        }
      } else {
        alert("Cilad ayaa dhacday soo raryidda codka AI.");
        stopCurrentAudio();
      }
    } else {
      // Standard MP3 Playback
      if (!audioRef.current || !ayah.audioUrls || urlIdx >= ayah.audioUrls.length) {
        if (isAutoplayRef.current) handleNext(ayah.number);
        else stopCurrentAudio();
        return;
      }

      audioRef.current.src = ayah.audioUrls[urlIdx];
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsBuffering(false);
        }).catch(err => {
          if (err.name !== 'AbortError') {
            playAyah(ayah, urlIdx + 1);
          }
        });
      }
    }
  };

  const handleNext = (currentId: number) => {
    const list = ayahsRef.current;
    const currentIndex = list.findIndex(a => a.number === currentId);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      const nextAyah = list[currentIndex + 1];
      playAyah(nextAyah, 0);
    } else {
      stopCurrentAudio();
    }
  };

  const handleEnded = () => {
    if (isAutoplayRef.current && playingIdRef.current !== null) {
      handleNext(playingIdRef.current);
    } else {
      stopCurrentAudio();
    }
  };

  const toggleAudio = (ayah: Ayah) => {
    if (playingId === ayah.number) {
      stopCurrentAudio();
    } else {
      playAyah(ayah, 0);
    }
  };

  const playTafseer = async (ayah: Ayah) => {
    if (!ayah.translation) return;
    if (playingTafseerId === ayah.number) return;
    
    setPlayingTafseerId(ayah.number);
    const audioData = await ttsService.generateSomaliAudio(ayah.translation);
    if (audioData) {
      await ttsService.playAudio(audioData);
    } else {
      alert("Waan ka xumahay, fasiraadda maqalka ah hadda lama heli karo.");
    }
    setPlayingTafseerId(null);
  };

  const handleShare = async (ayah: Ayah) => {
    const shareText = `📖 ${surah.englishName} (Aayadda ${ayah.numberInSurah})\n\n🌙 Carabi: ${ayah.text}\n\n✨ Somali: ${ayah.translation}\n\nKa baro Qur'aanka: ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Qur'aan iyo Soomaali - ${surah.englishName}`,
          text: shareText,
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <audio 
        ref={audioRef} 
        onEnded={handleEnded}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onError={() => playingIdRef.current && handleNext(playingIdRef.current)}
        preload="auto"
      />
      
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl text-sm font-bold flex items-center space-x-2 share-toast">
          <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          <span>Waa la nuqulay (Copied)!</span>
        </div>
      )}

      <div className="text-center mb-12 relative">
        {loadingAudioData && (
          <div className="absolute inset-0 bg-white/60 z-30 flex flex-col items-center justify-center rounded-3xl">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm font-bold text-emerald-800">Soo raryaya codka...</p>
          </div>
        )}
        <h2 className="text-3xl font-bold text-slate-900 mb-2">{surah.englishName}</h2>
        <p className="quran-font text-4xl text-emerald-700 mb-4">{surah.name}</p>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
            <span className="bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">{surah.revelationType}</span>
            <span>•</span>
            <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold">{surah.numberOfAyahs} Aayadood</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className={`flex items-center space-x-2 p-3 rounded-2xl border shadow-sm ring-1 transition-all ${isAiReciterSelected ? 'bg-emerald-50 border-emerald-300 ring-emerald-100' : 'bg-white border-slate-100 ring-slate-100'}`}>
              <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase">Reciter:</span>
              <select 
                value={selectedReciter}
                onChange={(e) => updateReciter(e.target.value)}
                className={`px-3 py-1 text-sm border-none bg-transparent outline-none font-bold cursor-pointer ${isAiReciterSelected ? 'text-emerald-800' : 'text-emerald-700'}`}
              >
                {RECITERS.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {isAiReciterSelected && (
                <div className="flex space-x-1 ml-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsAutoplay(!isAutoplay)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl border transition-all text-xs font-bold ${
                isAutoplay 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 shadow-sm'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isAutoplay ? 'bg-white animate-pulse' : 'bg-slate-300'}`}></div>
              <span>{isAutoplay ? 'AUTO-PLAY: ON' : 'AUTO-PLAY: OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-12 pb-20">
        {surah.ayahs.map((ayah) => {
          let displayText = ayah.text;
          if (surah.number !== 1 && ayah.numberInSurah === 1) {
            const basmala = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
            const basmala2 = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';
            displayText = displayText.replace(basmala, '').replace(basmala2, '').trim();
          }

          return (
            <div 
              key={ayah.number} 
              className="group relative" 
              ref={el => { ayahRefs.current[ayah.number] = el; }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center border transition-all ${playingId === ayah.number ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {ayah.numberInSurah}
                  </span>
                  <button
                    onClick={() => toggleAudio(ayah)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      playingId === ayah.number 
                        ? 'bg-emerald-600 text-white shadow-lg' 
                        : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 shadow-sm'
                    }`}
                  >
                    {isBuffering && playingId === ayah.number ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : playingId === ayah.number ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                   <button 
                    onClick={() => playTafseer(ayah)} 
                    disabled={playingTafseerId === ayah.number}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                        playingTafseerId === ayah.number 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : 'bg-white text-emerald-600 border-emerald-100 hover:bg-emerald-50'
                    }`}
                   >
                     {playingTafseerId === ayah.number ? (
                         <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                     )}
                     <span className="hidden xs:inline">{playingTafseerId === ayah.number ? 'Codka...' : 'Fasiraadda'}</span>
                   </button>
                   
                   <button 
                    onClick={() => handleShare(ayah)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    title="Share"
                   >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
                   </button>

                   <button onClick={() => onAskAI(ayah)} className="text-xs text-emerald-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-50 px-3 py-1 rounded-lg hover:bg-emerald-100 border border-emerald-100">AI</button>
                </div>
              </div>
              <div className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${playingId === ayah.number ? 'bg-emerald-50/70 border-emerald-300 shadow-xl ring-2 ring-emerald-200' : 'bg-white border-slate-100 shadow-sm'}`}>
                {surah.number !== 1 && ayah.numberInSurah === 1 && (
                   <p className="quran-font text-2xl text-center text-emerald-900 mb-6 opacity-60">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                )}
                <p className="quran-font text-3xl sm:text-4xl text-right text-slate-800 mb-8 leading-[1.8]" dir="rtl">{displayText}</p>
                {isAiReciterSelected && playingId === ayah.number && (
                  <div className="flex justify-center mb-6">
                    <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 shadow-inner">
                      <span className="w-2 h-2 bg-emerald-600 rounded-full animate-ping"></span>
                      <span>AI Generative Recitation</span>
                    </div>
                  </div>
                )}
                <div className="border-t pt-8">
                  <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">{ayah.translation}</p>
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
