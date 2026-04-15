import { useState, useEffect } from 'react';
import { getHistoricalCandles } from '../services/etoroApi';
import type { EtoroAsset } from '../types/asset';

const DEMO_PRICES = generateDemoPrices();

function generateDemoPrices(): number[] {
  // ~5 years of daily prices starting around $100, with realistic drift + volatility
  const prices: number[] = [];
  let price = 100;
  const dailyDrift = 0.0003;
  const dailyVol = 0.018;
  const rand = mulberry32(42);

  for (let i = 0; i < 1300; i++) {
    prices.push(parseFloat(price.toFixed(2)));
    const u1 = rand();
    const u2 = rand();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    price = price * Math.exp(dailyDrift + dailyVol * z);
    price = Math.max(price, 1);
  }
  return prices;
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useHistoricalPrices(asset: EtoroAsset | null) {
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!asset) return;
    let cancelled = false;

    async function fetchPrices() {
      setLoading(true);
      setError(null);

      try {
        const data = await getHistoricalCandles(asset!.instrumentId, 'OneDay', 1000, 'asc');
        if (cancelled) return;

        if (data?.candles?.[0]?.candles?.length) {
          const closePrices = data.candles[0].candles
            .map((c) => c.close)
            .filter((p) => p > 0 && isFinite(p));
          if (closePrices.length > 30) {
            setPrices(closePrices);
            setLoading(false);
            return;
          }
        }

        // Fall back to demo data
        setPrices(DEMO_PRICES);
      } catch {
        if (!cancelled) {
          setError('Using simulated historical data');
          setPrices(DEMO_PRICES);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrices();
    return () => { cancelled = true; };
  }, [asset?.instrumentId]);

  return { prices, loading, error };
}
