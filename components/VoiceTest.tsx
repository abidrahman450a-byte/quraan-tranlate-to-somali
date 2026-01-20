
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from './services/geminiService';

const VoiceTest: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [aiTips, setAiTips] = useState<string | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [visualData, setVisualData] = useState<number[]>(new Array(30).fill(10));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Setup Visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      updateVisualizer();
    } catch (err) {
      alert("Fadlan oggolow makarafoonka si aad u duubto codkaaga.");
    }
  };

  const updateVisualizer = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Smooth and map the data
    const points = Array.from(dataArray).slice(0, 30).map(v => Math.max(10, v / 3));
    setVisualData(points);
    
    animationFrameRef.current = requestAnimationFrame(updateVisualizer);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const fetchAiTips = async () => {
    setLoadingTips(true);
    const tips = await geminiService.getVoiceTips();
    setAiTips(tips);
    setLoadingTips(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-900 mb-4">Tijaabi Codkaaga</h2>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
          Ku duub halkan akhriskaaga Qur'aanka, dib u dhegeyso si aad u ogaato meelaha u baahan hagaajinta, kana hel talooyin Gemini AI.
        </p>
      </div>

      <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-8 md:p-12 mb-8">
        <div className="flex flex-col items-center justify-center">
          {/* Visualizer */}
          <div className="flex items-center justify-center space-x-1 h-32 mb-12">
            {visualData.map((h, i) => (
              <div 
                key={i} 
                className={`w-1.5 rounded-full transition-all duration-75 ${isRecording ? 'bg-emerald-500' : 'bg-slate-200'}`}
                style={{ height: `${h}px` }}
              ></div>
            ))}
          </div>

          <div className="relative mb-12">
            {isRecording && (
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-2xl animate-pulse opacity-20"></div>
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${
                isRecording ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {isRecording ? (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h12v12H6z" /></svg>
              ) : (
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
              )}
            </button>
            <p className="mt-4 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">
              {isRecording ? 'Waa la duubayaa...' : 'Riix si aad u bilowdo'}
            </p>
          </div>

          {audioURL && !isRecording && (
            <div className="w-full max-w-md bg-slate-50 rounded-3xl p-6 border border-slate-200 animate-slideUp">
              <h4 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest text-center">Duubistaadii u dambaysay</h4>
              <audio src={audioURL} controls className="w-full h-10" />
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => setAudioURL(null)}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Masax duubistan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-emerald-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full translate-x-10 -translate-y-10 blur-2xl"></div>
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Talooyin AI
          </h3>
          
          {aiTips ? (
            <div className="text-emerald-50 leading-relaxed text-sm whitespace-pre-wrap animate-slideUp">
              {aiTips}
              <button 
                onClick={fetchAiTips}
                className="mt-6 block text-xs font-bold text-emerald-400 hover:text-white transition-colors"
              >
                Cusboonaysii talooyinka →
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-emerald-200/60 text-sm mb-6">Ma rabtaa in Gemini ku siiyo 5 talo oo ku saabsan akhriska?</p>
              <button 
                onClick={fetchAiTips}
                disabled={loadingTips}
                className="px-8 py-3 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-all disabled:opacity-50"
              >
                {loadingTips ? 'Waa la raadinayaa...' : 'Hel Talooyin'}
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[40px] p-8 border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Sida loo isticmaalo</h3>
          <ul className="space-y-4">
            {[
              'Riix badhanka cagaaran ee makarafoonka si aad u bilowdo duubista.',
              'Akhri aayad ama suurad aad jeceshahay si degan.',
              'Riix badhanka gaduudka ah si aad u joojiso.',
              'Dib u dhegeyso codkaaga adigoo fiiro gaar ah u leh makhrajka.',
              'Weydii AI-ga talooyin lagu horumarinayo akhriskaaga.'
            ].map((step, i) => (
              <li key={i} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span className="text-sm text-slate-500 leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceTest;
