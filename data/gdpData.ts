import { CountryData } from '../types';

// A subset of major economies for visualization purposes. 
// In a real app, this would be fetched from an API like World Bank.
export const GDP_DATA: Record<string, CountryData> = {
  USA: { id: 'USA', name: 'United States', gdp: 27360, gdpGrowth: 2.5, population: 333000000, rank: 1 },
  CHN: { id: 'CHN', name: 'China', gdp: 17790, gdpGrowth: 5.2, population: 1412000000, rank: 2 },
  DEU: { id: 'DEU', name: 'Germany', gdp: 4456, gdpGrowth: -0.3, population: 83800000, rank: 3 },
  JPN: { id: 'JPN', name: 'Japan', gdp: 4212, gdpGrowth: 1.9, population: 125100000, rank: 4 },
  IND: { id: 'IND', name: 'India', gdp: 3549, gdpGrowth: 7.8, population: 1417000000, rank: 5 },
  GBR: { id: 'GBR', name: 'United Kingdom', gdp: 3340, gdpGrowth: 0.1, population: 67300000, rank: 6 },
  FRA: { id: 'FRA', name: 'France', gdp: 3030, gdpGrowth: 0.9, population: 67900000, rank: 7 },
  ITA: { id: 'ITA', name: 'Italy', gdp: 2254, gdpGrowth: 0.7, population: 58900000, rank: 8 },
  BRA: { id: 'BRA', name: 'Brazil', gdp: 2173, gdpGrowth: 2.9, population: 215300000, rank: 9 },
  CAN: { id: 'CAN', name: 'Canada', gdp: 2140, gdpGrowth: 1.1, population: 38900000, rank: 10 },
  RUS: { id: 'RUS', name: 'Russia', gdp: 1999, gdpGrowth: 3.6, population: 144200000, rank: 11 },
  MEX: { id: 'MEX', name: 'Mexico', gdp: 1788, gdpGrowth: 3.2, population: 127500000, rank: 12 },
  KOR: { id: 'KOR', name: 'South Korea', gdp: 1712, gdpGrowth: 1.4, population: 51600000, rank: 13 },
  AUS: { id: 'AUS', name: 'Australia', gdp: 1692, gdpGrowth: 1.5, population: 26000000, rank: 14 },
  ESP: { id: 'ESP', name: 'Spain', gdp: 1580, gdpGrowth: 2.5, population: 47700000, rank: 15 },
  IDN: { id: 'IDN', name: 'Indonesia', gdp: 1371, gdpGrowth: 5.0, population: 275500000, rank: 16 },
  TUR: { id: 'TUR', name: 'Turkey', gdp: 1108, gdpGrowth: 4.5, population: 85000000, rank: 17 },
  SAU: { id: 'SAU', name: 'Saudi Arabia', gdp: 1067, gdpGrowth: -0.9, population: 36400000, rank: 18 },
  CHE: { id: 'CHE', name: 'Switzerland', gdp: 869, gdpGrowth: 0.8, population: 8700000, rank: 20 },
  NLD: { id: 'NLD', name: 'Netherlands', gdp: 1092, gdpGrowth: 0.1, population: 17700000, rank: 19 },
};

export const getCountryData = (isoCode: string): CountryData | null => {
  return GDP_DATA[isoCode] || null;
};

// Linear interpolation for color scaling
export const getColorScale = (gdp: number): string => {
  // Logarithmic scale simulation for visualization
  if (gdp > 20000) return '#ec4899'; // Pink-500 (High)
  if (gdp > 10000) return '#a855f7'; // Purple-500
  if (gdp > 5000) return '#6366f1';  // Indigo-500
  if (gdp > 2000) return '#3b82f6';  // Blue-500
  if (gdp > 1000) return '#0ea5e9';  // Sky-500
  if (gdp > 500) return '#10b981';   // Emerald-500
  if (gdp > 100) return '#84cc16';   // Lime-500
  return '#64748b'; // Slate-500 (Low/No Data)
};