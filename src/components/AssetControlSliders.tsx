
import { Slider } from "@/components/ui/slider";

interface AssetControlSlidersProps {
  growthRate: number[];
  setGrowthRate: (value: number[]) => void;
  projectionYears: number[];
  setProjectionYears: (value: number[]) => void;
}

export const AssetControlSliders = ({ 
  growthRate, 
  setGrowthRate, 
  projectionYears, 
  setProjectionYears 
}: AssetControlSlidersProps) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Growth Rate</label>
          <span className="text-sm text-muted-foreground">{growthRate[0]}% annually</span>
        </div>
        <Slider
          value={growthRate}
          onValueChange={setGrowthRate}
          max={15}
          min={0}
          step={0.1}
          className="w-full"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Projection Years</label>
          <span className="text-sm text-muted-foreground">{projectionYears[0]} years</span>
        </div>
        <Slider
          value={projectionYears}
          onValueChange={setProjectionYears}
          max={40}
          min={1}
          step={1}
          className="w-full"
        />
      </div>
    </div>
  );
};
