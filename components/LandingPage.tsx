
import React from 'react';

interface LandingPageProps {
  onStart: (mode: 'login' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Hero Section */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1590075865003-e284422e6781?auto=format&fit=crop&q=80&w=2070" 
            alt="Islamic Art" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-emerald-950/70 to-slate-900"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 px-4 py-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white/90 text-xs font-bold tracking-widest uppercase">Cusboonaysiin: Gemini AI Assistant hadda waa diyaar</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Baro Qur'aanka <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Af-Soomaali Ku Fahan
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-50/70 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Codadka qariyiinta caalamka, fasiraad Soomaali dhammaystiran, iyo kaaliyaha AI oo kaa caawinaya fahanka aayadaha.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => onStart('signup')}
              className="group relative w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Ku Bilow Bilaash
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
              </span>
            </button>
            <button 
              onClick={() => onStart('login')}
              className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl backdrop-blur-xl border border-white/30 transition-all"
            >
              Hore u Gal (Login)
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-20 -mt-16 container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Suuradaha', value: '114' },
            { label: 'Aayadaha', value: '6,236' },
            { label: 'Luqadda', value: 'Soomaali' },
            { label: 'Isticmaalayaasha', value: '10K+' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 text-center hover:shadow-2xl transition-all">
              <p className="text-3xl font-black text-emerald-600 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Maxaa naga dhigaya kuwa ugu wanaagsan?</h2>
            <p className="text-lg text-slate-500 leading-relaxed">Waxaan isku dubaridnay tiknoolajiyadda ugu casrisan iyo barashada diinta si aad u hesho waayo-aragnimo ka duwan kuwa kale.</p>
          </div>
          <div className="h-1.5 w-32 bg-emerald-500 rounded-full mb-4"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: 'Fasiraad Qoto-dheer',
              desc: 'Fasiraad Soomaali ah oo si fudud loo fahmi karo, kuna dhex jirta aayad kasta.',
              icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
              color: 'bg-emerald-100 text-emerald-600'
            },
            {
              title: 'Sheekh AI (Gemini)',
              desc: 'Weydii su\'aal kasta oo kusaabsan aayadaha, oo hel jawaabo cilmiyeysan oo Soomaali ah.',
              icon: 'M13 10V3L4 14h7v7l9-11h-7z',
              color: 'bg-indigo-100 text-indigo-600'
            },
            {
              title: 'Codadka Qariyiinta',
              desc: 'Dhegeyso qariyiinta ugu waaweyn caalamka adigoo raacaya qoraalka iyo fasiraadda.',
              icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
              color: 'bg-orange-100 text-orange-600'
            }
          ].map((feature, i) => (
            <div key={i} className="group p-10 bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-500">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} /></svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-24 bg-slate-900 text-center px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 relative z-10">Ma diyaar u tahay inaad bilowdo?</h2>
        <button 
          onClick={() => onStart('signup')}
          className="relative z-10 px-12 py-5 bg-white text-emerald-900 font-black rounded-2xl hover:bg-emerald-50 transition-all shadow-xl shadow-white/5"
        >
          Sameyso Koonto Bilaash ah
        </button>
      </div>

      <style>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
