import type { EtoroAsset } from '../types/asset';

interface Props {
  asset: EtoroAsset;
}

export function AssetHeader({ asset }: Props) {
  const hasChange = asset.dailyChangePercent !== null && asset.dailyChange !== null;
  const isPositive = (asset.dailyChange ?? 0) >= 0;

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-2">
        <span className="text-etoro-sm font-semibold text-neutral-900 dark:text-neutral-050 tracking-wide">
          {asset.symbol}
        </span>
        <span className="text-etoro-sm text-neutral-600 dark:text-neutral-400">
          {asset.displayName}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-etoro-sm font-semibold text-neutral-900 dark:text-neutral-050 tabular-nums">
          ${asset.currentPrice.toFixed(2)}
        </span>
        {hasChange && (
          <span
            className={`text-etoro-xs font-medium tabular-nums ${
              isPositive ? 'text-primary-600' : 'text-negative-600 dark:text-negative-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {asset.dailyChangePercent!.toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}
