import type {
  SimulationParams,
  SimulationResult,
  OutcomeMetric,
  RiskTimePoint,
  DistributionBucket,
} from '../types/simulation';

const TRADING_DAYS_PER_MONTH = 21;
const RISK_TIME_HORIZONS = [1, 3, 6, 12, 24, 36, 60];

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

interface WindowResult {
  finalReturn: number;
  liquidated: boolean;
}

function simulateWindow(
  dailyPrices: number[],
  startIdx: number,
  windowDays: number,
  leverage: number,
  isShort: boolean,
  isCfd: boolean
): WindowResult | null {
  if (startIdx + windowDays > dailyPrices.length) return null;

  const entryPrice = dailyPrices[startIdx];
  if (!entryPrice || entryPrice <= 0 || !isFinite(entryPrice)) return null;

  if (!isCfd || leverage <= 1) {
    const exitPrice = dailyPrices[startIdx + windowDays];
    if (!exitPrice || exitPrice <= 0 || !isFinite(exitPrice)) return null;
    let ret = (exitPrice - entryPrice) / entryPrice;
    if (isShort && isCfd) ret = -ret;
    return { finalReturn: ret, liquidated: false };
  }

  // CFD with leverage: path-based simulation
  for (let d = 1; d <= windowDays; d++) {
    const price = dailyPrices[startIdx + d];
    if (!price || price <= 0 || !isFinite(price)) return null;

    let dayReturn = (price - entryPrice) / entryPrice;
    if (isShort) dayReturn = -dayReturn;
    const leveragedReturn = dayReturn * leverage;

    if (leveragedReturn <= -1) {
      return { finalReturn: -1, liquidated: true };
    }
  }

  const exitPrice = dailyPrices[startIdx + windowDays];
  if (!exitPrice || exitPrice <= 0 || !isFinite(exitPrice)) return null;
  let finalRet = (exitPrice - entryPrice) / entryPrice;
  if (isShort) finalRet = -finalRet;
  return { finalReturn: finalRet * leverage, liquidated: false };
}

function computeForPeriod(
  dailyPrices: number[],
  months: number,
  params: Pick<SimulationParams, 'isCfd' | 'leverage' | 'isShort'>
): { returns: number[]; liquidatedCount: number; totalCount: number } {
  const windowDays = months * TRADING_DAYS_PER_MONTH;
  const returns: number[] = [];
  let liquidatedCount = 0;
  let totalCount = 0;

  for (let i = 0; i + windowDays < dailyPrices.length; i++) {
    const result = simulateWindow(
      dailyPrices,
      i,
      windowDays,
      params.leverage,
      params.isShort,
      params.isCfd
    );
    if (result === null) continue;
    totalCount++;
    returns.push(result.finalReturn);
    if (result.liquidated) liquidatedCount++;
  }

  return { returns, liquidatedCount, totalCount };
}

function buildDistribution(returns: number[]): DistributionBucket[] {
  const bucketEdges = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1, 1.5, 2];
  const buckets: DistributionBucket[] = [];
  const total = returns.length || 1;

  for (let i = 0; i < bucketEdges.length - 1; i++) {
    const start = bucketEdges[i];
    const end = bucketEdges[i + 1];
    const count = returns.filter((r) => r >= start && r < end).length;
    const pctStart = Math.round(start * 100);
    buckets.push({
      rangeStart: start,
      rangeEnd: end,
      label: `${pctStart >= 0 ? '+' : ''}${pctStart}%`,
      count,
      frequency: count / total,
      isNegative: (start + end) / 2 < 0,
    });
  }

  // Overflow bucket for >200%
  const overflowCount = returns.filter((r) => r >= 2).length;
  if (overflowCount > 0) {
    buckets.push({
      rangeStart: 2,
      rangeEnd: Infinity,
      label: '+200%+',
      count: overflowCount,
      frequency: overflowCount / total,
      isNegative: false,
    });
  }

  // Underflow bucket for <-100%
  const underflowCount = returns.filter((r) => r < -1).length;
  if (underflowCount > 0) {
    buckets.unshift({
      rangeStart: -Infinity,
      rangeEnd: -1,
      label: '<-100%',
      count: underflowCount,
      frequency: underflowCount / total,
      isNegative: true,
    });
  }

  return buckets;
}

export function runSimulation(
  dailyClosePrices: number[],
  params: SimulationParams
): SimulationResult {
  const { investmentAmount, holdingPeriodMonths, isCfd, leverage, isShort } = params;

  if (dailyClosePrices.length < TRADING_DAYS_PER_MONTH + 1) {
    return emptyResult();
  }

  const { returns, liquidatedCount, totalCount } = computeForPeriod(
    dailyClosePrices,
    holdingPeriodMonths,
    { isCfd, leverage, isShort }
  );

  if (totalCount === 0) {
    return emptyResult();
  }

  const sortedReturns = [...returns].sort((a, b) => a - b);

  const p10 = percentile(sortedReturns, 10);
  const p50 = percentile(sortedReturns, 50);
  const p90 = percentile(sortedReturns, 90);

  const worstCase: OutcomeMetric = {
    dollarValue: investmentAmount * p10,
    percentReturn: p10 * 100,
  };

  const mostLikely: OutcomeMetric = {
    dollarValue: investmentAmount * p50,
    percentReturn: p50 * 100,
  };

  const bestCase: OutcomeMetric = {
    dollarValue: investmentAmount * p90,
    percentReturn: p90 * 100,
  };

  const liquidationProbability =
    totalCount > 0 ? liquidatedCount / totalCount : 0;

  const riskOverTime: RiskTimePoint[] = RISK_TIME_HORIZONS
    .filter((m) => m * TRADING_DAYS_PER_MONTH < dailyClosePrices.length)
    .map((months) => {
      const result = computeForPeriod(dailyClosePrices, months, {
        isCfd,
        leverage,
        isShort,
      });
      return {
        months,
        liquidationRisk:
          result.totalCount > 0
            ? result.liquidatedCount / result.totalCount
            : 0,
      };
    });

  const returnDistribution = buildDistribution(returns);

  return {
    worstCase,
    mostLikely,
    bestCase,
    liquidationProbability,
    riskOverTime,
    returnDistribution,
    totalWindows: totalCount,
    insufficientData: false,
  };
}

function emptyResult(): SimulationResult {
  return {
    worstCase: { dollarValue: 0, percentReturn: 0 },
    mostLikely: { dollarValue: 0, percentReturn: 0 },
    bestCase: { dollarValue: 0, percentReturn: 0 },
    liquidationProbability: 0,
    riskOverTime: [],
    returnDistribution: [],
    totalWindows: 0,
    insufficientData: true,
  };
}
