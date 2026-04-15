import type { CandlesResponse, RateData, InstrumentMetadata } from '../types/asset';

const BASE_URL = 'https://public-api.etoro.com/api/v1';

interface AuthContext {
  accessToken?: string;
  apiKey?: string;
  userKey?: string;
}

function getAuthHeaders(ctx: AuthContext): Record<string, string> {
  const headers: Record<string, string> = {
    'x-request-id': crypto.randomUUID(),
  };
  if (ctx.accessToken) {
    headers['Authorization'] = `Bearer ${ctx.accessToken}`;
  } else if (ctx.apiKey && ctx.userKey) {
    headers['x-api-key'] = ctx.apiKey;
    headers['x-user-key'] = ctx.userKey;
  }
  return headers;
}

let _authCtx: AuthContext = {};

export function setAuthContext(ctx: AuthContext) {
  _authCtx = ctx;
}

export async function searchInstrument(
  symbol: string
): Promise<{ instrumentId: number } | null> {
  const url = `${BASE_URL}/market-data/search?internalSymbolFull=${encodeURIComponent(symbol)}`;
  const res = await fetch(url, { headers: getAuthHeaders(_authCtx) });
  if (!res.ok) return null;
  const data = await res.json();
  const items = data?.items ?? [];
  const match = items.find(
    (item: { internalSymbolFull?: string }) =>
      item.internalSymbolFull?.toUpperCase() === symbol.toUpperCase()
  );
  return match ? { instrumentId: match.instrumentId } : items[0] ? { instrumentId: items[0].instrumentId } : null;
}

export async function getInstrumentMetadata(
  instrumentIds: number[]
): Promise<InstrumentMetadata[]> {
  const url = `${BASE_URL}/market-data/instruments?instrumentIds=${instrumentIds.join(',')}`;
  const res = await fetch(url, { headers: getAuthHeaders(_authCtx) });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.instrumentDisplayDatas ?? [];
}

export async function getInstrumentRates(
  instrumentIds: number[]
): Promise<RateData[]> {
  const url = `${BASE_URL}/market-data/instruments/rates?instrumentIds=${instrumentIds.join(',')}`;
  const res = await fetch(url, { headers: getAuthHeaders(_authCtx) });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.rates ?? [];
}

export async function getHistoricalCandles(
  instrumentId: number,
  interval: string = 'OneDay',
  count: number = 1000,
  direction: string = 'asc'
): Promise<CandlesResponse | null> {
  const url = `${BASE_URL}/market-data/instruments/${instrumentId}/history/candles/${direction}/${interval}/${count}`;
  const res = await fetch(url, { headers: getAuthHeaders(_authCtx) });
  if (!res.ok) return null;
  return res.json();
}
