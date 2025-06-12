
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthChartProps {
  data: Array<{ year: number; value: number }>;
  currentValue: number;
  futureValue: number;
  years: number;
  color: string;
  baselineData?: Array<{ year: number; value: number }>;
  showBaseline?: boolean;
}

export const GrowthChart = ({ 
  data, 
  currentValue, 
  futureValue, 
  years, 
  color, 
  baselineData,
  showBaseline = false 
}: GrowthChartProps) => {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
          <Tooltip 
            formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]}
            labelFormatter={(year) => `Year ${year}`}
          />
          {showBaseline && baselineData && (
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={false}
              name="Baseline"
              data={baselineData}
            />
          )}
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={false}
            name="Optimized"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
