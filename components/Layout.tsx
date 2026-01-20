
import React, { useState } from 'react';
import { AppView, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  onLogout: () => void;
  user: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, onLogout, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleShareApp = async () => {
    const shareData = {
      title: "Qur'aan iyo Soomaali",
      text: "Baro Qur'aanka Kariimka ah adigoo adeegsanaya translation-ka Soomaaliga ah.",
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Xiriirka (Link-ga) app-ka waa la nuqulay!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onViewChange('quran')}>
              <div className="bg-white p-1 rounded-full">
                <svg className="w-8 h-8 text-emerald-800" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Qur'aan iyo Soomaali</h1>
                <p className="text-xs text-emerald-200 uppercase tracking-widest">Akhris iyo Faham</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:hidden">
              <button 
                onClick={handleShareApp}
                className="p-2 hover:bg-emerald-700 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
              </button>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center font-bold text-xs"
              >
                {user?.name?.[0]?.toUpperCase()}
              </button>
            </div>
          </div>

          <nav className="flex space-x-1 sm:space-x-2 bg-emerald-900/50 p-1 rounded-xl overflow-x-auto max-w-full">
            {[
              { id: 'quran', label: 'Suuradaha' },
              { id: 'page-reading', label: 'Bog-bog' },
              { id: 'voice-test', label: 'Tijaabi Codka' },
              { id: 'adkaar', label: 'Adkaar' },
              { id: 'prayer', label: 'Salaadda' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id as AppView)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeView === tab.id 
                    ? 'bg-white text-emerald-800 shadow-md' 
                    : 'text-emerald-100 hover:bg-emerald-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleShareApp}
              className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-emerald-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 12.684a3 3 0 100-2.684 3 3 0 000 2.684z" /></svg>
              <span>Faafi</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-emerald-700 hover:bg-emerald-600 rounded-full flex items-center justify-center font-bold transition-all border border-emerald-600"
              >
                {user?.name?.[0]?.toUpperCase()}
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-[100] text-slate-800">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase">Koontada</p>
                    <p className="text-sm font-bold truncate">{user?.name}</p>
                  </div>
                  <button 
                    onClick={() => { onLogout(); setShowUserMenu(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
                  >
                    Ka bax (Logout)
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile User Menu Overlay */}
          {showUserMenu && (
            <div className="md:hidden absolute top-20 right-4 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[100] text-slate-800">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Koontada</p>
                <p className="text-sm font-bold truncate">{user?.name}</p>
              </div>
              <button 
                onClick={() => { onLogout(); setShowUserMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
              >
                Ka bax (Logout)
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Qur'aan iyo Soomaali. Dhammaan xuquuqdu waa dhowran tahay.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
