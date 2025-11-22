import React, { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, Users, Activity, MessageSquare, Send, Sparkles } from 'lucide-react';
import { CountryData, ChatMessage } from '../types';
import { fetchEconomicAnalysis, streamChatResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import StatsChart from './StatsChart';

interface InfoPanelProps {
  country: CountryData | null;
  geoJsonName?: string;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ country, geoJsonName, onClose }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  
  const displayName = country?.name || geoJsonName || 'Unknown Region';
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayName) {
      setAnalysis('');
      setChatHistory([]);
      loadAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayName]);

  const loadAnalysis = async () => {
    setLoadingAnalysis(true);
    const result = await fetchEconomicAnalysis(displayName, country);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    try {
      const historyForApi = chatHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      // Add context about the current country to the history if it's the first message
      if (historyForApi.length === 0) {
        historyForApi.push({
             role: 'user',
             parts: [{text: `I am looking at ${displayName}. Context: ${analysis}`}]
        });
         historyForApi.push({
             role: 'model',
             parts: [{text: `Understood. I will answer questions about ${displayName}.`}]
        });
      }

      const stream = streamChatResponse(historyForApi, userMsg);
      
      let fullResponse = "";
      setChatHistory(prev => [...prev, { role: 'model', text: '' }]); // Placeholder

      for await (const chunk of stream) {
          if (chunk) {
            fullResponse += chunk;
            setChatHistory(prev => {
                const newHist = [...prev];
                newHist[newHist.length - 1].text = fullResponse;
                return newHist;
            });
          }
      }
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-black/40 backdrop-blur-xl border-l border-white/10 text-white shadow-2xl z-50 flex flex-col transition-transform duration-300">
      
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-r from-blue-900/20 to-transparent">
        <div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            {displayName}
          </h2>
          {country && <span className="text-sm text-blue-300 font-mono tracking-wider">RANK #{country.rank}</span>}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
              <Activity size={14} /> GDP (Est)
            </div>
            <div className="text-2xl font-bold">
              {country ? `$${country.gdp.toLocaleString()}B` : 'N/A'}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
              <TrendingUp size={14} /> Growth
            </div>
            <div className={`text-2xl font-bold ${country && country.gdpGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {country ? `${country.gdpGrowth}%` : 'N/A'}
            </div>
          </div>
          <div className="col-span-2 bg-white/5 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-wider mb-1">
              <Users size={14} /> Population
            </div>
            <div className="text-xl font-semibold">
              {country ? `${(country.population / 1000000).toFixed(1)}M` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Chart */}
        {country && <StatsChart countryName={displayName} baseGdp={country.gdp} />}

        {/* AI Analysis Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-semibold border-b border-white/10 pb-2">
            <Sparkles size={18} />
            <span>AI Economic Insight</span>
          </div>
          
          {loadingAnalysis ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
            </div>
          ) : (
            <div className="text-sm text-gray-300 leading-relaxed prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="pt-4 border-t border-white/10">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-4">
            <MessageSquare size={16} /> Ask about {displayName}
          </h3>
          
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white/10 text-gray-200 rounded-bl-none'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
             <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatting}
              placeholder={`Ask about ${displayName}'s economy...`}
              className="w-full bg-black/50 border border-white/20 rounded-full py-3 px-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!chatInput.trim() || isChatting}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default InfoPanel;