export interface SimulationParams {
  investmentAmount: number;
  holdingPeriodMonths: number;
  isCfd: boolean;
  leverage: number;
  isShort: boolean;
}

export interface SimulationResult {
  worstCase: OutcomeMetric;
  mostLikely: OutcomeMetric;
  bestCase: OutcomeMetric;
  liquidationProbability: number;
  riskOverTime: RiskTimePoint[];
  returnDistribution: DistributionBucket[];
  totalWindows: number;
  insufficientData: boolean;
}

export interface OutcomeMetric {
  dollarValue: number;
  percentReturn: number;
}

export interface RiskTimePoint {
  months: number;
  liquidationRisk: number;
}

export interface DistributionBucket {
  rangeStart: number;
  rangeEnd: number;
  label: string;
  count: number;
  frequency: number;
  isNegative: boolean;
}
