
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  mode: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onAuthSuccess, onSwitchMode, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Simple validation
    if (password.length < 6) {
      setError("Password-ku waa inuu ka badnaadaa 6 xaraf.");
      setLoading(false);
      return;
    }

    // Simulating API call for account management
    setTimeout(() => {
      try {
        const user: User = { 
          email: email.toLowerCase(), 
          name: name || email.split('@')[0] 
        };
        
        // Save session
        localStorage.setItem('quran_user', JSON.stringify(user));
        
        // If it was a signup, we might want to track registration date etc.
        if (mode === 'signup') {
          console.log('User registered:', user.email);
        }

        onAuthSuccess(user);
      } catch (err) {
        setError("Cilad ayaa dhacday, fadlan isku day markale.");
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-emerald-900/5 border border-white p-8 md:p-12">
        <button 
          onClick={onBack} 
          className="group mb-8 text-slate-400 hover:text-emerald-600 flex items-center space-x-2 text-sm font-bold transition-all"
        >
          <div className="p-2 bg-slate-50 group-hover:bg-emerald-50 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </div>
          <span>Ku laabo hore</span>
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-600/20 rotate-3 transform hover:rotate-0 transition-transform cursor-default">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Ku soo dhawaaw' : 'Ku soo biir app-ka'}
          </h2>
          <p className="text-slate-500 font-medium mt-2">Xogtaada waa ammaan, si sir ah ayaana loo hayaa.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-2xl flex items-center space-x-3 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Magacaaga oo buuxa</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                  placeholder="Axmed Cali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <svg className="w-5 h-5 text-slate-300 absolute left-4 top-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email-kaaga</label>
            <div className="relative">
              <input 
                type="email" 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                placeholder="email@tusaale.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <svg className="w-5 h-5 text-slate-300 absolute left-4 top-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-800"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <svg className="w-5 h-5 text-slate-300 absolute left-4 top-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <button type="button" className="text-xs font-black text-emerald-600 hover:text-emerald-700">Ma ilowday password-ka?</button>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full relative group"
          >
            <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center space-x-2">
              {loading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{mode === 'login' ? 'Gali' : 'Is-diiwaangeli'}</span>
              )}
            </div>
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 font-bold">
            {mode === 'login' ? 'Ma lahadid koonto?' : 'Hubaal koonto hore u lahayd?'}
            <button 
              onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
              className="ml-2 text-emerald-600 font-black hover:text-emerald-700 decoration-2 hover:underline underline-offset-4 transition-all"
            >
              {mode === 'login' ? 'Sameyso hadda' : 'Gali halkan'}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Auth;
