
import { TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";

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
          <CardTitle className="text-xl flex items-center space-x-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <span>Net Worth</span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-4xl font-bold text-white">$287,500</p>
            <div className="flex items-center space-x-1 text-green-300">
              <TrendingUp className="h-5 w-5" />
              <span className="text-base font-medium text-white">+$32,500 this month</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-base text-white opacity-80">Total Assets</p>
              <p className="text-xl font-semibold text-white">$735,000</p>
            </div>
            <div>
              <p className="text-base text-white opacity-80">Total Liabilities</p>
              <p className="text-xl font-semibold text-white">$447,500</p>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-3">
            <h4 className="text-lg font-medium mb-3 text-white">5-Year Projection</h4>
            <ChartContainer config={chartConfig} className="h-64">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 14, fill: 'white' }}
                  axisLine={{ stroke: 'white', strokeWidth: 1 }}
                  tickLine={{ stroke: 'white' }}
                />
                <YAxis 
                  tick={{ fontSize: 14, fill: 'white' }}
                  axisLine={{ stroke: 'white', strokeWidth: 1 }}
                  tickLine={{ stroke: 'white' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => [`$${value.toLocaleString()}`, "Net Worth"]}
                    labelStyle={{ color: 'black' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #ccc',
                      color: 'black'
                    }}
                  />} 
                />
                <Area 
                  type="monotone" 
                  dataKey="netWorth" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#netWorthGradient)"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5, stroke: "white" }}
                />
              </AreaChart>
            </ChartContainer>
            <p className="text-sm text-white mt-2">
              Projected to reach $530K by 2029
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
