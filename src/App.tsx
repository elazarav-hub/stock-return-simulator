import { useState, useMemo } from 'react';
import { useEtoroAsset } from './hooks/useEtoroAsset';
import { useHistoricalPrices } from './hooks/useHistoricalPrices';
import { useSimulation } from './hooks/useSimulation';
import { useTheme } from './hooks/useTheme';
import { useChartTheme } from './hooks/useChartTheme';
import { AssetHeader } from './components/AssetHeader';
import { ControlsSection } from './components/ControlsSection';
import { ResultsSection } from './components/ResultsSection';
import { LiquidationRiskBar } from './components/LiquidationRiskBar';
import { RiskOverTimeChart } from './components/RiskOverTimeChart';
import { ReturnDistributionChart } from './components/ReturnDistributionChart';
import { DisclaimerSection } from './components/DisclaimerSection';
import { ThemeToggle } from './components/ThemeToggle';
import type { SimulationParams } from './types/simulation';

function Divider() {
  return <div className="h-px bg-neutral-300 dark:bg-neutral-700 transition-colors" />;
}

function LoadingState() {
  return (
    <div className="py-12 flex flex-col items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-etoro-xs text-neutral-600 dark:text-neutral-400">
        Loading asset data...
      </span>
    </div>
  );
}

function InsufficientDataNotice() {
  return (
    <div className="py-8 text-center">
      <p className="text-etoro-sm text-neutral-600 dark:text-neutral-400">
        Insufficient historical data for this holding period.
      </p>
      <p className="text-etoro-xs text-neutral-500 mt-1">
        Try a shorter holding period or check back later.
      </p>
    </div>
  );
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const chartTheme = useChartTheme(isDark);

  const { asset, loading: assetLoading } = useEtoroAsset();
  const { prices, loading: pricesLoading } = useHistoricalPrices(asset);

  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [holdingPeriod, setHoldingPeriod] = useState(12);
  const [isCfd, setIsCfd] = useState(false);
  const [leverage, setLeverage] = useState(2);
  const [isShort, setIsShort] = useState(false);

  const params: SimulationParams = useMemo(
    () => ({
      investmentAmount,
      holdingPeriodMonths: holdingPeriod,
      isCfd,
      leverage: isCfd ? leverage : 1,
      isShort: isCfd ? isShort : false,
    }),
    [investmentAmount, holdingPeriod, isCfd, leverage, isShort]
  );

  const { result, computing } = useSimulation(prices, params);

  const isLoading = assetLoading || pricesLoading;
  const showResults = result && !result.insufficientData && !isLoading;
  const showCfdSections = isCfd && showResults;

  return (
    <div className="max-w-md mx-auto bg-neutral-050 dark:bg-neutral-900 min-h-screen transition-colors">
      <div className="px-4">
        {/* Toolbar row */}
        <div className="flex items-center justify-between pt-3 pb-1">
          <span className="text-etoro-xs font-semibold text-neutral-500 tracking-wider uppercase">
            Return Simulator
          </span>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>

        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {asset && <AssetHeader asset={asset} />}

            <Divider />

            <div className="py-4">
              <ControlsSection
                investmentAmount={investmentAmount}
                onInvestmentAmountChange={setInvestmentAmount}
                holdingPeriod={holdingPeriod}
                onHoldingPeriodChange={setHoldingPeriod}
                isCfd={isCfd}
                onCfdChange={setIsCfd}
                leverage={leverage}
                onLeverageChange={setLeverage}
                isShort={isShort}
                onShortChange={setIsShort}
              />
            </div>

            <Divider />

            <div className="py-4 relative">
              {computing && (
                <div className="absolute inset-0 bg-neutral-050/60 dark:bg-neutral-900/60 flex items-center justify-center z-10 transition-colors">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {result?.insufficientData ? (
                <InsufficientDataNotice />
              ) : showResults ? (
                <div className="space-y-4">
                  <ResultsSection result={result} />

                  {showCfdSections && (
                    <>
                      <Divider />
                      <LiquidationRiskBar
                        probability={result.liquidationProbability}
                      />
                    </>
                  )}

                  {showCfdSections &&
                    result.riskOverTime.length > 1 && (
                      <>
                        <Divider />
                        <RiskOverTimeChart
                          data={result.riskOverTime}
                          currentPeriod={holdingPeriod}
                          chartTheme={chartTheme}
                        />
                      </>
                    )}

                  <Divider />
                  <ReturnDistributionChart
                    data={result.returnDistribution}
                    chartTheme={chartTheme}
                  />
                </div>
              ) : null}
            </div>

            <Divider />

            <div className="py-4 pb-8">
              <DisclaimerSection />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
