import React, { useState } from 'react';
import GlobeViz from './components/GlobeViz';
import InfoPanel from './components/InfoPanel';
import { CountryData } from './types';
import { Globe2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<{data: CountryData | null, name: string} | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleCountrySelect = (data: CountryData | null, name: string) => {
    setSelectedCountry({ data, name });
    setShowWelcome(false);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      
      {/* 3D Globe Layer */}
      <div className="absolute inset-0 z-0">
        <GlobeViz onCountrySelect={handleCountrySelect} />
      </div>

      {/* Top Left Branding */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/50">
            <Globe2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">GlobalGDP<span className="text-blue-400">.ai</span></h1>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Real-time Economic Intelligence</p>
          </div>
        </div>
      </div>

      {/* Welcome Tooltip / Instructions */}
      {showWelcome && !selectedCountry && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="bg-black/60 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/10 shadow-2xl text-sm font-medium">
            Click on any country to explore its economy
          </div>
        </div>
      )}

      {/* Right Panel (Drawer) */}
      {selectedCountry && (
        <InfoPanel 
          country={selectedCountry.data} 
          geoJsonName={selectedCountry.name}
          onClose={() => setSelectedCountry(null)} 
        />
      )}
      
      {/* Simple Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 text-xs pointer-events-none hidden md:block">
        <div className="text-gray-400 mb-2 uppercase font-bold tracking-wider">GDP Scale (Billions)</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div> &gt; $20T</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> &gt; $10T</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> &gt; $5T</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> &gt; $2T</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> &lt; $1T</div>
        </div>
      </div>

    </div>
  );
};

export default App;