
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface AssetControlSlidersProps {
  currentValue: number[];
  onCurrentValueChange: (value: number[]) => void;
  monthlyContribution: number[];
  onMonthlyContributionChange: (value: number[]) => void;
  growthRate: number[];
  onGrowthRateChange: (value: number[]) => void;
  years: number[];
  onYearsChange: (value: number[]) => void;
  grossIncome?: number;
}

export const AssetControlSliders = ({
  currentValue,
  onCurrentValueChange,
  monthlyContribution,
  onMonthlyContributionChange,
  growthRate,
  onGrowthRateChange,
  years,
  onYearsChange,
  grossIncome = 100000
}: AssetControlSlidersProps) => {
  const monthlyIncomePercentage = grossIncome > 0 ? (monthlyContribution[0] * 12 / grossIncome * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Current Value</label>
          <Input 
            type="number" 
            value={currentValue[0]} 
            onChange={(e) => onCurrentValueChange([parseInt(e.target.value) || 0])}
            className="w-24 h-8 text-sm"
          />
        </div>
        <Slider
          value={currentValue}
          onValueChange={onCurrentValueChange}
          max={2000000}
          min={0}
          step={1000}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <label className="text-sm font-medium">Monthly Contribution</label>
            <span className="text-xs text-muted-foreground">
              {monthlyIncomePercentage.toFixed(1)}% of gross income
            </span>
          </div>
          <Input 
            type="number" 
            value={monthlyContribution[0]} 
            onChange={(e) => onMonthlyContributionChange([parseInt(e.target.value) || 0])}
            className="w-24 h-8 text-sm"
          />
        </div>
        <Slider
          value={monthlyContribution}
          onValueChange={onMonthlyContributionChange}
          max={5000}
          min={0}
          step={50}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Growth Rate (%)</label>
          <Input 
            type="number" 
            value={growthRate[0]} 
            onChange={(e) => onGrowthRateChange([parseFloat(e.target.value) || 0])}
            className="w-24 h-8 text-sm"
            step="0.1"
          />
        </div>
        <Slider
          value={growthRate}
          onValueChange={onGrowthRateChange}
          max={20}
          min={0}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Time Horizon (years)</label>
          <Input 
            type="number" 
            value={years[0]} 
            onChange={(e) => onYearsChange([parseInt(e.target.value) || 0])}
            className="w-24 h-8 text-sm"
          />
        </div>
        <Slider
          value={years}
          onValueChange={onYearsChange}
          max={40}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
