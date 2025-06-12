
import { TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const NetWorthCard = () => {
  const projectionData = [
    { year: "2024", netWorth: 287500 },
    { year: "2025", netWorth: 325000 },
    { year: "2026", netWorth: 368000 },
    { year: "2027", netWorth: 416000 },
    { year: "2028", netWorth: 470000 },
    { year: "2029", netWorth: 530000 },
  ];

  const chartConfig = {
    netWorth: { label: "Net Worth", color: "#10b981" },
  };

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-none text-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2 text-white">
            <DollarSign className="h-5 w-5" />
            <span>Net Worth</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold text-white">$287,500</p>
            <div className="flex items-center space-x-1 text-green-300">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+$32,500 this month</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-blue-100">Total Assets</p>
              <p className="text-lg font-semibold text-white">$735,000</p>
            </div>
            <div>
              <p className="text-sm text-blue-100">Total Liabilities</p>
              <p className="text-lg font-semibold text-red-300">$447,500</p>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-3">
            <h4 className="text-sm font-medium mb-2 text-white">5-Year Projection</h4>
            <ChartContainer config={chartConfig} className="h-32">
              <LineChart data={projectionData}>
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 10, fill: 'white' }}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'white' }}
                  axisLine={{ stroke: 'white' }}
                  tickLine={{ stroke: 'white' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Net Worth"]}
                    labelStyle={{ color: 'white' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid white',
                      color: 'white'
                    }}
                  />} 
                />
                <Line 
                  type="monotone" 
                  dataKey="netWorth" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ChartContainer>
            <p className="text-xs text-white mt-1">
              Projected to reach $530K by 2029
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
