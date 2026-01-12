
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SurahList from './components/SurahList';
import AyahReader from './components/AyahReader';
import GeminiAssistant from './components/GeminiAssistant';
import { fetchSurahList, fetchSurahWithTranslation } from './services/quranApi';
import { Surah, SurahDetail, Ayah } from './types';

const App: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | undefined>(undefined);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await fetchSurahList();
        setSurahs(data);
      } catch (error) {
        console.error("Error loading Surahs", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadSurahs();
  }, []);

  const handleSelectSurah = async (surahNumber: number) => {
    setLoadingSurah(true);
    try {
      const detail = await fetchSurahWithTranslation(surahNumber);
      setSelectedSurah(detail);
      setSelectedAyah(undefined);
      // Auto open assistant on mobile or keep status on desktop? 
      // Let's just scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error loading Surah detail", error);
    } finally {
      setLoadingSurah(false);
    }
  };

  const handleAskAI = (ayah: Ayah) => {
    setSelectedAyah(ayah);
    setIsAssistantOpen(true);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h1 className="text-xl font-bold text-emerald-800">Qur'aan iyo Soomaali</h1>
        <p className="text-emerald-600 animate-pulse">Waa la soo raryaa...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex h-[calc(100vh-116px)] overflow-hidden">
        {/* Sidebar Surah List */}
        <aside className="hidden lg:block w-80 flex-shrink-0 bg-white shadow-inner">
          <SurahList 
            surahs={surahs} 
            onSelect={handleSelectSurah} 
            activeNumber={selectedSurah?.number} 
          />
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto bg-slate-50 relative">
          {!selectedSurah ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-16 h-16 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Ku soo dhawaaw Qur'aan iyo Soomaali</h2>
              <p className="text-slate-600 max-w-md">
                Fadlan dhinac ka dooro suurad aad rabto inaad akhriso ama aad fahamkeeda weydiiso kaaliyaha AI.
              </p>
              
              <div className="lg:hidden mt-8 w-full max-w-sm">
                 <SurahList surahs={surahs} onSelect={handleSelectSurah} />
              </div>
            </div>
          ) : (
            <div className="relative">
              {loadingSurah ? (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : null}
              
              <div className="lg:hidden p-4 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between">
                <button 
                  onClick={() => setSelectedSurah(null)}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="font-bold text-slate-800">{selectedSurah.englishName}</h3>
                <button 
                  onClick={() => setIsAssistantOpen(true)}
                  className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>

              <AyahReader surah={selectedSurah} onAskAI={handleAskAI} />
            </div>
          )}
        </div>

        {/* AI Assistant Sidebar */}
        <aside className={`${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl lg:relative lg:translate-x-0 lg:z-0 lg:shadow-none ${!isAssistantOpen && 'lg:hidden'}`}>
          {selectedSurah && (
            <GeminiAssistant 
              selectedAyah={selectedAyah}
              surahName={selectedSurah.englishName}
              onClose={() => setIsAssistantOpen(false)}
            />
          )}
        </aside>

        {/* Global Floating AI Toggle (Mobile/Tablet) */}
        {!isAssistantOpen && selectedSurah && (
          <button 
            onClick={() => setIsAssistantOpen(true)}
            className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-transform hover:scale-110 z-40"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
        )}
      </div>
    </Layout>
  );
};

export default App;
