import type { SimulationResult } from '../types/simulation';
import { ResultMetric } from './ResultMetric';

interface Props {
  result: SimulationResult;
}

export function ResultsSection({ result }: Props) {
  return (
    <div className="flex gap-2">
      <ResultMetric label="Worst case" metric={result.worstCase} variant="worst" />
      <ResultMetric
        label="Most likely outcome"
        metric={result.mostLikely}
        variant="likely"
      />
      <ResultMetric label="Best case" metric={result.bestCase} variant="best" />
    </div>
  );
}
