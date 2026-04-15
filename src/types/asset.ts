export interface EtoroAsset {
  instrumentId: number;
  symbol: string;
  displayName: string;
  currentPrice: number;
  previousClose: number | null;
  dailyChange: number | null;
  dailyChangePercent: number | null;
  imageUrl?: string;
}

export interface EtoroCandle {
  instrumentID: number;
  fromDate: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandlesResponse {
  interval: string;
  candles: Array<{
    instrumentId: number;
    candles: EtoroCandle[];
    rangeOpen: number;
    rangeClose: number;
    rangeHigh: number;
    rangeLow: number;
    volume: number;
  }>;
}

export interface RateData {
  instrumentID: number;
  ask: number;
  bid: number;
  lastExecution: number;
}

export interface InstrumentMetadata {
  instrumentID: number;
  instrumentDisplayName: string;
  symbolFull: string;
  images: Array<{ uri: string; width: number; height: number }>;
}
