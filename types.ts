export interface CountryGeoJsonProperties {
  NAME: string;
  ISO_A3: string;
  POP_EST: number;
  GDP_MD_EST?: number; // Some GeoJSONs have this, but we will overwrite with our data
  [key: string]: any;
}

export interface CountryData {
  id: string; // ISO_A3
  name: string;
  gdp: number; // In billions USD
  gdpGrowth: number; // Percentage
  population: number;
  rank: number;
}

export interface AnalysisState {
  loading: boolean;
  content: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum ViewMode {
  GLOBE = 'GLOBE',
  CHARTS = 'CHARTS'
}