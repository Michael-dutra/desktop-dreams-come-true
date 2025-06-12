
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface GrowthChartProps {
  data: Array<{
    year: number;
    baseline: number;
    optimized: number;
  }>;
  title: string;
}

export const GrowthChart = ({ data, title }: GrowthChartProps) => {
  const chartConfig = {
    baseline: {
      label: "Current",
      color: "#ef4444", // red
    },
    optimized: {
      label: "Optimized", 
      color: "#22c55e", // green
    },
  };

  const formatValue = (value: number) => {
    if (value >= 999000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatYAxisTick = (value: number) => {
    if (value >= 999000) {
      const millions = value / 1000000;
      if (millions >= 10) {
        return `${millions.toFixed(0)}M`;
      } else {
        return `${millions.toFixed(2)}M`;
      }
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  const getYAxisTicks = () => {
    const maxValue = Math.max(...data.map(d => Math.max(d.baseline, d.optimized)));
    const minValue = Math.min(...data.map(d => Math.min(d.baseline, d.optimized)));
    
    if (maxValue >= 999000) {
      // For values in millions, create ticks in increments
      const maxM = maxValue / 1000000;
      const minM = minValue / 1000000;
      const ticks = [];
      
      let start = Math.floor(minM * 100) / 100; // Round down to nearest 0.01M
      let end = Math.ceil(maxM * 100) / 100; // Round up to nearest 0.01M
      
      // Generate ticks in 0.01M increments for smaller ranges, or larger for bigger ranges
      const range = end - start;
      let increment = 0.01;
      if (range > 1) increment = 0.1;
      if (range > 10) increment = 1;
      
      for (let i = start; i <= end; i += increment) {
        ticks.push(Math.round(i * 1000000));
      }
      
      return ticks;
    } else {
      // For values in thousands, use default behavior
      return undefined;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={formatYAxisTick}
                ticks={getYAxisTicks()}
                width={80}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    formatValue(Number(value)), 
                    name === 'baseline' ? 'Current' : 'Optimized'
                  ]}
                />} 
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="baseline"
              />
              <Line 
                type="monotone" 
                dataKey="optimized" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                name="optimized"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
