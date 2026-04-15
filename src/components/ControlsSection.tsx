import { InvestmentInput } from './InvestmentInput';
import { TimeSlider } from './TimeSlider';
import { CFDControls } from './CFDControls';

interface Props {
  investmentAmount: number;
  onInvestmentAmountChange: (value: number) => void;
  holdingPeriod: number;
  onHoldingPeriodChange: (value: number) => void;
  isCfd: boolean;
  onCfdChange: (value: boolean) => void;
  leverage: number;
  onLeverageChange: (value: number) => void;
  isShort: boolean;
  onShortChange: (value: boolean) => void;
}

export function ControlsSection({
  investmentAmount,
  onInvestmentAmountChange,
  holdingPeriod,
  onHoldingPeriodChange,
  isCfd,
  onCfdChange,
  leverage,
  onLeverageChange,
  isShort,
  onShortChange,
}: Props) {
  return (
    <div className="space-y-4">
      <InvestmentInput
        value={investmentAmount}
        onChange={onInvestmentAmountChange}
      />
      <TimeSlider value={holdingPeriod} onChange={onHoldingPeriodChange} />
      <CFDControls
        isCfd={isCfd}
        onCfdChange={onCfdChange}
        leverage={leverage}
        onLeverageChange={onLeverageChange}
        isShort={isShort}
        onShortChange={onShortChange}
      />
    </div>
  );
}
