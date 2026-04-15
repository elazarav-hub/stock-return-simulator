interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function InvestmentInput({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-etoro-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
        Investment amount
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-etoro-sm text-neutral-500">
          $
        </span>
        <input
          type="number"
          min={1}
          step={100}
          value={value}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v) && v >= 0) onChange(v);
          }}
          className="w-full pl-7 pr-3 py-2 text-etoro-sm font-medium text-neutral-900 dark:text-neutral-050 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-etoro-md focus:outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600/20 tabular-nums transition-colors"
        />
      </div>
    </div>
  );
}
