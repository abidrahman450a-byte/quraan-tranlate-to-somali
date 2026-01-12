
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
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
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-emerald-200 transition-colors">Hoyga</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Suuradaha</a>
            <a href="#" className="hover:text-emerald-200 transition-colors">Kutubta Ducooyinka</a>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Qur'aan iyo Soomaali. Dhammaan xuquuqdu waa dhowran tahay.</p>
          <p className="text-xs mt-2">Waxaa ku shaqaynaya Gemini AI & Alquran Cloud API</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
