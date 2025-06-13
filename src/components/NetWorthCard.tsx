
import { TrendingUp, DollarSign, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

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

  const monthlyGrowth = 32500;
  const yearlyGrowthRate = 12.8;
  const projectedIncrease = 242500; // 530K - 287.5K

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-none text-white h-full">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center space-x-3 text-white">
            <div className="p-2 bg-white/20 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <span>Net Worth</span>
          </CardTitle>
          <div className="flex items-center space-x-1 text-green-300">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{yearlyGrowthRate}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        {/* Main Net Worth Display */}
        <div className="text-center py-2">
          <p className="text-4xl font-bold text-white mb-3">$287,500</p>
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <TrendingUp className="h-5 w-5" />
            <span className="text-lg font-medium">+${monthlyGrowth.toLocaleString()} this month</span>
          </div>
        </div>
        
        {/* Assets vs Liabilities Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/80 mb-2">Total Assets</p>
            <p className="text-xl font-bold text-white">$735,000</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/80 mb-2">Total Liabilities</p>
            <p className="text-xl font-bold text-white">$447,500</p>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
            <Target className="h-5 w-5 text-green-300" />
            <div>
              <p className="text-xs text-white/70">5-Year Goal</p>
              <p className="text-sm font-semibold text-white">$530K</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
            <Calendar className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-xs text-white/70">Growth</p>
              <p className="text-sm font-semibold text-white">+${(projectedIncrease / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
        
        {/* 5-Year Projection Chart */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-medium text-white">5-Year Projection</h4>
            <p className="text-xs text-white/70">Expected growth trajectory</p>
          </div>
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-44 w-full">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 11, fill: 'white' }}
                  axisLine={{ stroke: 'white', strokeWidth: 1 }}
                  tickLine={{ stroke: 'white' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'white' }}
                  axisLine={{ stroke: 'white', strokeWidth: 1 }}
                  tickLine={{ stroke: 'white' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  width={55}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Net Worth"]}
                    labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '2px solid #10b981',
                      borderRadius: '8px',
                      color: '#1f2937',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />} 
                />
                <Area 
                  type="monotone" 
                  dataKey="netWorth" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="#10b981"
                  fillOpacity={0.3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5, stroke: "white" }}
                  activeDot={{ r: 7, fill: "#10b981", stroke: "white", strokeWidth: 3 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="text-center bg-white/5 rounded-lg p-3">
          <p className="text-sm text-white/90">
            On track to reach <span className="font-bold text-green-300">$530K</span> by 2029
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
