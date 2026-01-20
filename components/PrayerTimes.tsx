
import React, { useState, useEffect } from 'react';
import { getPrayerTimes, getQiblaDirection } from './prayerService';
import { PrayerTimesData } from '../types';

const PrayerTimes: React.FC = () => {
  const [times, setTimes] = useState<PrayerTimesData | null>(null);
  const [qibla, setQibla] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Goobtaada (Geolocation) lama heli karo biraawsarkaan.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const { timings } = await getPrayerTimes(latitude, longitude);
          const direction = await getQiblaDirection(latitude, longitude);
          setTimes(timings);
          setQibla(direction);
        } catch (err) {
          setError("Ma awoodin inaan soo rarno waqtiyada salaadda.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Fadlan oggolow helitaanka goobtaada si aan kuu tuso waqtiyada salaadda.");
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600">Raadinaya waqtiyada salaadda ee goobtaada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-8 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center">
        <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="font-semibold mb-2">Cilad dhacday</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  const prayerLabels: Record<string, string> = {
    Fajr: "Subax",
    Sunrise: "Qorrax soo bax",
    Dhuhr: "Duhur",
    Asr: "Casar",
    Maghrib: "Magrib",
    Isha: "Cishaha"
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Prayer Times List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Waqtiyada Salaadda
          </h2>
          <div className="space-y-4">
            {times && Object.entries(prayerLabels).map(([key, label]) => (
              <div key={key} className="flex justify-between items-center p-3 rounded-xl hover:bg-emerald-50 transition-colors group">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="text-lg font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  {(times as any)[key]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Qibla Direction */}
        <div className="bg-emerald-800 rounded-3xl shadow-lg p-8 text-white flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-8">U jihayso Qiblada</h2>
          <div className="relative w-48 h-48 bg-emerald-700/50 rounded-full flex items-center justify-center border-4 border-emerald-400/30">
            <div 
              className="absolute w-full h-full flex flex-col items-center pt-2 transition-transform duration-1000"
              style={{ transform: `rotate(${qibla || 0}deg)` }}
            >
              <div className="w-4 h-4 bg-red-500 rounded-full mb-2 shadow-lg"></div>
              <div className="w-1 h-20 bg-gradient-to-t from-emerald-400 to-white rounded-full"></div>
              <span className="mt-2 font-bold text-xs uppercase tracking-widest">Kacbada</span>
            </div>
            <div className="text-2xl font-black opacity-20">N</div>
          </div>
          <p className="mt-8 text-emerald-200 text-sm">
            Kaabada waxay u jirtaa <span className="text-white font-bold">{qibla?.toFixed(1)}°</span> xagga waqooyiga.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrayerTimes;
