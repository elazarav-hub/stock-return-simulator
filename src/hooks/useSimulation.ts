import { useState, useEffect, useRef } from 'react';
import type { SimulationParams, SimulationResult } from '../types/simulation';
import { runSimulation } from '../services/simulation';

const DEBOUNCE_MS = 150;

export function useSimulation(
  dailyPrices: number[],
  params: SimulationParams
) {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [computing, setComputing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dailyPrices.length === 0) {
      setResult(null);
      return;
    }

    setComputing(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const simResult = runSimulation(dailyPrices, params);
      setResult(simResult);
      setComputing(false);
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    dailyPrices,
    params.investmentAmount,
    params.holdingPeriodMonths,
    params.isCfd,
    params.leverage,
    params.isShort,
  ]);

  return { result, computing };
}
