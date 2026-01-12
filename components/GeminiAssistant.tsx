
import React, { useState, useEffect, useRef } from 'react';
import { Ayah, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

interface GeminiAssistantProps {
  selectedAyah?: Ayah;
  surahName: string;
  onClose: () => void;
}

const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ selectedAyah, surahName, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedAyah) {
      const intro = `Waxaad dooratay Aayadda ${selectedAyah.numberInSurah} ee Suuradda ${surahName}. Maxaad ka rabtaa inaan kaa caawiyo?`;
      setMessages([{ role: 'model', text: intro }]);
    } else {
      setMessages([{ role: 'model', text: `Ku soo dhawaaw kaaliyaha AI. Waxaan kaa caawin karaa fahamka Suuradda ${surahName}. Ma rabtaa inaan kuu soo koobo?` }]);
    }
  }, [selectedAyah, surahName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    let response = '';
    if (selectedAyah) {
      response = await geminiService.askAboutAyah(selectedAyah.text, selectedAyah.translation || '', userMsg);
    } else {
      // Default behavior if no specific ayah
      response = await geminiService.askAboutAyah('', '', `Ku saabsan suuradda ${surahName}: ${userMsg}`);
    }

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    const summary = await geminiService.summarizeSurah(surahName, surahName);
    setMessages(prev => [...prev, { role: 'model', text: summary }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
      <div className="p-4 bg-emerald-800 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-emerald-600 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold">Kaaliyaha AI</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 rounded-tl-none flex space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        {!selectedAyah && messages.length < 3 && (
          <button 
            onClick={handleSummarize}
            className="w-full mb-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 border border-emerald-100 transition-colors"
          >
            Soo Koob Suuradda
          </button>
        )}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Weydii su'aal..."
            className="flex-grow p-2 text-sm bg-slate-100 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAssistant;
