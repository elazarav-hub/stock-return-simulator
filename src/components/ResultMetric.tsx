import type { OutcomeMetric } from '../types/simulation';

interface Props {
  label: string;
  metric: OutcomeMetric;
  variant: 'worst' | 'likely' | 'best';
}

function formatDollar(value: number): string {
  const abs = Math.abs(value);
  const prefix = value >= 0 ? '+' : '-';
  if (abs >= 1000) {
    return `${prefix}$${abs.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }
  return `${prefix}$${abs.toFixed(0)}`;
}

function formatPercent(value: number): string {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(0)}%`;
}

export function ResultMetric({ label, metric, variant }: Props) {
  const baseClasses = 'flex-1 rounded-etoro-lg px-3 py-2.5 border transition-colors';

  const variantClasses = {
    worst: 'bg-negative-050 dark:bg-negative-600/10 border-negative-100 dark:border-negative-700/30',
    likely: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700',
    best: 'bg-primary-050 dark:bg-primary-600/10 border-primary-100 dark:border-primary-700/30',
  };

  const textClasses = {
    worst: 'text-negative-600 dark:text-negative-400',
    likely: 'text-neutral-900 dark:text-neutral-050',
    best: 'text-primary-700 dark:text-primary-500',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className={`text-[10px] font-medium mb-1 ${textClasses[variant]}`}>
        {label}
      </div>
      <div className={`text-etoro-base font-semibold tabular-nums ${textClasses[variant]}`}>
        {formatDollar(metric.dollarValue)}
      </div>
      <div className={`text-etoro-xs tabular-nums ${textClasses[variant]} opacity-70`}>
        {formatPercent(metric.percentReturn)}
      </div>
    </div>
  );
}
