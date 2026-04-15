import { useState, useEffect } from 'react';
import type { EtoroAsset } from '../types/asset';
import {
  searchInstrument,
  getInstrumentMetadata,
  getInstrumentRates,
} from '../services/etoroApi';

/**
 * Resolves the current asset from the eToro page context.
 * In a real eToro plugin, the instrumentId/symbol would come from a
 * postMessage or SDK context. Here we read from URL params or a global,
 * falling back to a demo asset.
 */
export function useEtoroAsset() {
  const [asset, setAsset] = useState<EtoroAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      setLoading(true);
      setError(null);

      try {
        // Try to read context from URL, global, or postMessage
        const symbol = getSymbolFromContext();
        const instrumentIdFromCtx = getInstrumentIdFromContext();

        let instrumentId: number | null = instrumentIdFromCtx;

        if (!instrumentId && symbol) {
          const result = await searchInstrument(symbol);
          instrumentId = result?.instrumentId ?? null;
        }

        if (!instrumentId) {
          // Demo fallback: AAPL
          setAsset(createDemoAsset());
          setLoading(false);
          return;
        }

        const [metadataList, rates] = await Promise.all([
          getInstrumentMetadata([instrumentId]),
          getInstrumentRates([instrumentId]),
        ]);

        if (cancelled) return;

        const meta = metadataList[0];
        const rate = rates[0];

        if (!meta) {
          setAsset(createDemoAsset());
          setLoading(false);
          return;
        }

        const currentPrice = rate?.lastExecution ?? rate?.ask ?? 0;

        setAsset({
          instrumentId,
          symbol: meta.symbolFull,
          displayName: meta.instrumentDisplayName,
          currentPrice,
          previousClose: null,
          dailyChange: null,
          dailyChangePercent: null,
          imageUrl: meta.images?.[0]?.uri,
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load asset');
          setAsset(createDemoAsset());
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, []);

  return { asset, loading, error };
}

function getSymbolFromContext(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('symbol') || params.get('s') || null;
}

function getInstrumentIdFromContext(): number | null {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('instrumentId') || params.get('id');
  if (id) {
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? null : parsed;
  }
  // Check global context (eToro plugin SDK may inject this)
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.etoroInstrumentId === 'number') return w.etoroInstrumentId;
  return null;
}

function createDemoAsset(): EtoroAsset {
  return {
    instrumentId: 1002,
    symbol: 'AAPL',
    displayName: 'Apple Inc.',
    currentPrice: 145.30,
    previousClose: 143.60,
    dailyChange: 1.70,
    dailyChangePercent: 1.18,
  };
}
