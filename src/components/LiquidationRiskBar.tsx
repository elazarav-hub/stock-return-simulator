interface Props {
  probability: number;
}

function riskLabel(p: number): string {
  if (p < 0.1) return 'Low risk';
  if (p < 0.3) return 'Moderate risk';
  if (p < 0.6) return 'High risk';
  return 'Very high risk';
}

function riskBarColor(p: number): string {
  if (p < 0.1) return 'bg-primary-600';
  if (p < 0.3) return 'bg-accent-orange';
  if (p < 0.6) return 'bg-negative-500';
  return 'bg-negative-600';
}

function riskTextColor(p: number): string {
  if (p < 0.1) return 'text-primary-600';
  if (p < 0.3) return 'text-accent-orange';
  if (p < 0.6) return 'text-negative-500';
  return 'text-negative-600 dark:text-negative-400';
}

export function LiquidationRiskBar({ probability }: Props) {
  const pct = Math.round(probability * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-etoro-xs font-medium text-neutral-600 dark:text-neutral-400">
          Chance of liquidation
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`text-etoro-sm font-semibold tabular-nums ${riskTextColor(probability)}`}>
            {pct}%
          </span>
          <span className={`text-[10px] ${riskTextColor(probability)}`}>
            ({riskLabel(probability)})
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${riskBarColor(probability)}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}
