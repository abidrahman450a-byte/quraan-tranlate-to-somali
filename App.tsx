import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SurahList from './components/SurahList';
import AyahReader from './components/AyahReader';
import GeminiAssistant from './components/GeminiAssistant';
import PrayerTimes from './components/PrayerTimes';
import Adkaar from './components/Adkaar';
import PageReader from './components/PageReader';
import LandingPage from './LandingPage';
import Auth from './components/Auth';
import VoiceTest from './components/VoiceTest';
import { fetchSurahList, fetchSurahWithTranslation } from './quranApi';
import { Surah, SurahDetail, Ayah, AppView, AuthMode, User } from './types';

const App: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('quran');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<SurahDetail | null>(null);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<Ayah | undefined>(undefined);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('quran_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAuthMode('authenticated');
    }

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

  const handleLogout = () => {
    localStorage.removeItem('quran_user');
    setUser(null);
    setAuthMode('landing');
    setSelectedSurah(null);
    setView('quran');
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

  // Auth Routing
  if (authMode === 'landing') {
    return <LandingPage onStart={(mode) => setAuthMode(mode)} />;
  }

  if (authMode === 'login' || authMode === 'signup') {
    return (
      <Auth 
        mode={authMode as 'login' | 'signup'} 
        onAuthSuccess={(u) => { setUser(u); setAuthMode('authenticated'); }}
        onSwitchMode={(mode) => setAuthMode(mode)}
        onBack={() => setAuthMode('landing')}
      />
    );
  }

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.name.includes(searchTerm) ||
    s.number.toString() === searchTerm
  );

  const renderContent = () => {
    switch (view) {
      case 'adkaar':
        return <Adkaar />;
      case 'prayer':
        return <PrayerTimes />;
      case 'voice-test':
        return <VoiceTest />;
      case 'page-reading':
        return (
          <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-116px)] overflow-hidden">
            <div className="flex-grow overflow-y-auto bg-slate-50 relative">
              <PageReader initialPage={1} onAskAI={handleAskAI} />
            </div>
            <aside className={`${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl lg:relative lg:translate-x-0 lg:z-0 lg:shadow-none ${!isAssistantOpen && 'lg:hidden'}`}>
                <GeminiAssistant 
                  selectedAyah={selectedAyah}
                  surahName={selectedAyah?.surah?.englishName || "Qur'aanka"}
                  onClose={() => setIsAssistantOpen(false)}
                />
            </aside>
          </div>
        );
      case 'quran':
      default:
        return (
          <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-116px)] overflow-hidden">
            <aside className="hidden lg:block w-80 flex-shrink-0 bg-white shadow-inner border-r border-slate-200">
              <SurahList 
                surahs={surahs} 
                onSelect={handleSelectSurah} 
                activeNumber={selectedSurah?.number} 
              />
            </aside>

            <div className="flex-grow overflow-y-auto bg-slate-50 relative">
              {!selectedSurah ? (
                <div className="container mx-auto px-4 py-8">
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Suuradaha Qur'aanka</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                      Ku soo dhawaaw {user?.name}, ka baro Qur'aanka Kariimka ah adigoo adeegsanaya translation-ka Soomaaliga ah.
                    </p>
                    <div className="max-w-xl mx-auto relative">
                      <input
                        type="text"
                        placeholder="Raadi suurad magaceeda ama lambarkeeda..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <svg className="w-6 h-6 text-slate-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredSurahs.map((s) => (
                      <button
                        key={s.number}
                        onClick={() => handleSelectSurah(s.number)}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex items-center group text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 font-bold mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {s.number}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">{s.englishName}</h3>
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{s.revelationType} • {s.numberOfAyahs} Aayadood</p>
                        </div>
                        <div className="text-right">
                          <p className="quran-font text-xl text-emerald-800 font-bold">{s.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {loadingSurah && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between shadow-sm">
                    <button 
                      onClick={() => { setSelectedSurah(null); setSelectedAyah(undefined); }}
                      className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="font-semibold hidden sm:inline">Ku laabo</span>
                    </button>
                    <div className="text-center">
                      <h3 className="font-bold text-slate-800">{selectedSurah.englishName}</h3>
                      <p className="text-[10px] text-slate-400 uppercase tracking-tighter">{selectedSurah.revelationType}</p>
                    </div>
                    <button 
                      onClick={() => setIsAssistantOpen(true)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-50"
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

            <aside className={`${isAssistantOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 fixed inset-y-0 right-0 z-50 w-full sm:w-96 shadow-2xl lg:relative lg:translate-x-0 lg:z-0 lg:shadow-none ${!isAssistantOpen && 'lg:hidden'}`}>
              {(selectedSurah || selectedAyah) && (
                <GeminiAssistant 
                  selectedAyah={selectedAyah}
                  surahName={selectedSurah?.englishName || selectedAyah?.surah?.englishName || "Qur'aanka"}
                  onClose={() => setIsAssistantOpen(false)}
                />
              )}
            </aside>
          </div>
        );
    }
  };

  return (
    <Layout 
      activeView={view} 
      onViewChange={(v) => { setView(v); setIsAssistantOpen(false); if (v === 'quran') setSelectedSurah(null); }}
      onLogout={handleLogout}
      user={user}
    >
      {renderContent()}
      
      {(view === 'quran' || view === 'page-reading') && !isAssistantOpen && (selectedSurah || selectedAyah) && (
        <button 
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-transform hover:scale-110 z-40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
    </Layout>
  );
};

export default App;