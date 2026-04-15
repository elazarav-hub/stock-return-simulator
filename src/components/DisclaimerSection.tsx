export function DisclaimerSection() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        <svg className="shrink-0 w-3.5 h-3.5 mt-0.5 text-neutral-400" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" />
          <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="8" cy="5" r="0.6" fill="currentColor" />
        </svg>
        <p className="text-[10px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          CFDs are complex instruments and come with a high risk of losing money
          rapidly due to leverage.
        </p>
      </div>
      <div className="flex items-start gap-2">
        <svg className="shrink-0 w-3.5 h-3.5 mt-0.5 text-neutral-400" viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5L1.5 13.5h13L8 1.5z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
          <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.6" fill="currentColor" />
        </svg>
        <p className="text-[10px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  );
}
