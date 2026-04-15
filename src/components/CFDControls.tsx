interface Props {
  isCfd: boolean;
  onCfdChange: (value: boolean) => void;
  leverage: number;
  onLeverageChange: (value: number) => void;
  isShort: boolean;
  onShortChange: (value: boolean) => void;
}

const LEVERAGE_OPTIONS = [1, 2, 5, 10];

export function CFDControls({
  isCfd,
  onCfdChange,
  leverage,
  onLeverageChange,
  isShort,
  onShortChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-etoro-xs font-medium text-neutral-600 dark:text-neutral-400">
          CFD Mode
        </label>
        <button
          type="button"
          role="switch"
          aria-checked={isCfd}
          onClick={() => onCfdChange(!isCfd)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            isCfd ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-700'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
              isCfd ? 'translate-x-[18px]' : 'translate-x-[2px]'
            }`}
          />
        </button>
      </div>

      {isCfd && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-[10px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Leverage
            </label>
            <div className="flex gap-1">
              {LEVERAGE_OPTIONS.map((lev) => (
                <button
                  key={lev}
                  onClick={() => onLeverageChange(lev)}
                  className={`flex-1 py-1 text-etoro-xs font-medium rounded-etoro-sm transition-colors ${
                    leverage === lev
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-[10px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
              Position
            </label>
            <div className="flex rounded-etoro-sm overflow-hidden border border-neutral-300 dark:border-neutral-700">
              <button
                onClick={() => onShortChange(false)}
                className={`flex-1 py-1 text-etoro-xs font-medium transition-colors ${
                  !isShort
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-050 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Long
              </button>
              <button
                onClick={() => onShortChange(true)}
                className={`flex-1 py-1 text-etoro-xs font-medium transition-colors ${
                  isShort
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-050 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                Short
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
