interface Props {
  value: number;
  onChange: (value: number) => void;
}

function formatMonths(m: number): string {
  if (m < 12) return `${m} month${m === 1 ? '' : 's'}`;
  const years = Math.floor(m / 12);
  const remaining = m % 12;
  if (remaining === 0) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years}y ${remaining}m`;
}

export function TimeSlider({ value, onChange }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-etoro-xs font-medium text-neutral-600 dark:text-neutral-400">
          Holding period
        </label>
        <span className="text-etoro-xs font-semibold text-neutral-900 dark:text-neutral-050 tabular-nums">
          {formatMonths(value)}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={60}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-neutral-500">1</span>
        <span className="text-[10px] text-neutral-500">60</span>
      </div>
    </div>
  );
}
