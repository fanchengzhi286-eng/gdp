import React, { useEffect, useState, useMemo, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { CountryGeoJsonProperties, CountryData } from '../types';
import { getCountryData, getColorScale } from '../data/gdpData';

interface GlobeVizProps {
  onCountrySelect: (data: CountryData | null, name: string) => void;
}

const GlobeViz: React.FC<GlobeVizProps> = ({ onCountrySelect }) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<object | null>(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    
    // Fetch GeoJSON
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries)
      .catch(err => console.error("Failed to load GeoJSON", err));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const handlePolygonClick = (polygon: any) => {
    const properties = polygon.properties as CountryGeoJsonProperties;
    const iso = properties.ISO_A3;
    const data = getCountryData(iso);
    
    // Stop rotation when user interacts
    if (globeEl.current) {
        globeEl.current.controls().autoRotate = false;
        globeEl.current.pointOfView({ lat: properties.LABEL_Y, lng: properties.LABEL_X, altitude: 1.5 }, 1000);
    }

    onCountrySelect(data, properties.NAME || properties.ADMIN);
  };

  const getPolygonLabel = (d: any) => {
    const props = d.properties as CountryGeoJsonProperties;
    const data = getCountryData(props.ISO_A3);
    
    return `
      <div class="bg-black/80 backdrop-blur px-3 py-2 rounded border border-white/20 text-white text-xs font-sans shadow-xl">
        <div class="font-bold text-sm mb-1">${props.ADMIN} (${props.ISO_A3})</div>
        ${data ? `
          <div class="text-blue-300">GDP: $${data.gdp.toLocaleString()}B</div>
          <div class="${data.gdpGrowth >= 0 ? 'text-green-400' : 'text-red-400'}">Growth: ${data.gdpGrowth}%</div>
        ` : '<div class="text-gray-500">Click for AI Analysis</div>'}
      </div>
    `;
  };

  return (
    <Globe
      ref={globeEl}
      width={width}
      height={height}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      lineHoverPrecision={0}
      polygonsData={countries.features}
      polygonAltitude={(d) => d === hoverD ? 0.12 : 0.06}
      polygonCapColor={(d: any) => {
        const iso = d.properties.ISO_A3;
        const data = getCountryData(iso);
        // Use data for color, or default if not found. Highlight hover.
        const baseColor = data ? getColorScale(data.gdp) : 'rgba(200, 200, 200, 0.1)';
        return d === hoverD ? '#ffffff' : baseColor;
      }}
      polygonSideColor={() => 'rgba(0, 0, 0, 0.5)'}
      polygonStrokeColor={() => '#111'}
      polygonLabel={getPolygonLabel}
      onPolygonHover={setHoverD}
      onPolygonClick={handlePolygonClick}
      atmosphereColor="#3b82f6"
      atmosphereAltitude={0.2}
    />
  );
};

export default GlobeViz;