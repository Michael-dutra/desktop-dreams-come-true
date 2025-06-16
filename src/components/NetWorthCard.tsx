
import { TrendingUp, DollarSign, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useFinancialData } from "@/contexts/FinancialDataContext";

const NetWorthCard = () => {
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([5]);
  
  const { getTotalAssets, getTotalLiabilities, getNetWorth } = useFinancialData();
  
  const currentAssets = getTotalAssets();
  const currentLiabilities = getTotalLiabilities();
  const currentNetWorth = getNetWorth();
  const monthlyGrowth = 32500;

  // Generate dynamic projection data based on sliders
  const generateProjectionData = () => {
    const data = [];
    const currentYear = 2024;
    const years = timeHorizon[0];
    const rate = rateOfReturn[0] / 100;
    
    for (let i = 0; i <= years; i++) {
      const year = currentYear + i;
      const netWorth = currentNetWorth * Math.pow(1 + rate, i);
      data.push({ year: year.toString(), netWorth: Math.round(netWorth) });
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  const finalValue = projectionData[projectionData.length - 1]?.netWorth || currentNetWorth;
  const totalGrowth = finalValue - currentNetWorth;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  const chartConfig = {
    netWorth: { label: "Net Worth", color: "#10b981" },
  };

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
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        {/* Main Net Worth Display */}
        <div className="text-center py-2">
          <p className="text-sm text-white/80 mb-1">Current Net Worth</p>
          <p className="text-4xl font-bold text-white mb-3">{formatCurrency(currentNetWorth)}</p>
          <div className="flex items-center justify-center space-x-2 text-green-300">
            <TrendingUp className="h-5 w-5" />
            <span className="text-lg font-medium">+${monthlyGrowth.toLocaleString()} this month</span>
          </div>
        </div>
        
        {/* Assets vs Liabilities Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/80 mb-2">Current Assets</p>
            <p className="text-xl font-bold text-white">{formatCurrency(currentAssets)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-sm text-white/80 mb-2">Current Liabilities</p>
            <p className="text-xl font-bold text-white">{formatCurrency(currentLiabilities)}</p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="p-4 bg-white/10 rounded-lg space-y-4">
          <h4 className="text-lg font-semibold text-white mb-3">Net Worth Simulation</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">Rate of Return on All Assets</span>
              <span className="text-sm font-bold text-white">{rateOfReturn[0]}%</span>
            </div>
            <div className="slider-bright-green">
              <Slider
                value={rateOfReturn}
                onValueChange={setRateOfReturn}
                max={15}
                min={1}
                step={0.5}
                className="w-full [&_.slider-track]:bg-green-400 [&_.slider-range]:bg-green-500 [&_.slider-thumb]:bg-green-500 [&_.slider-thumb]:border-green-600"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white">Time Horizon</span>
              <span className="text-sm font-bold text-white">{timeHorizon[0]} years</span>
            </div>
            <div className="slider-bright-green">
              <Slider
                value={timeHorizon}
                onValueChange={setTimeHorizon}
                max={30}
                min={1}
                step={1}
                className="w-full [&_.slider-track]:bg-green-400 [&_.slider-range]:bg-green-500 [&_.slider-thumb]:bg-green-500 [&_.slider-thumb]:border-green-600"
              />
            </div>
          </div>
        </div>

        {/* Growth Summary */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
            <Target className="h-5 w-5 text-green-300" />
            <div>
              <p className="text-xs text-white/70">Projected Net Worth</p>
              <p className="text-sm font-semibold text-white">{formatCurrency(finalValue)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-3">
            <Calendar className="h-5 w-5 text-blue-300" />
            <div>
              <p className="text-xs text-white/70">Total Growth</p>
              <p className="text-sm font-semibold text-white">+{formatCurrency(totalGrowth)}</p>
            </div>
          </div>
        </div>
        
        {/* Dynamic Projection Chart */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4">
          <div className="text-center mb-4">
            <h4 className="text-lg font-medium text-white">{timeHorizon[0]}-Year Net Worth Projection</h4>
            <p className="text-xs text-gray-300">At {rateOfReturn[0]}% annual growth</p>
          </div>
          <div className="w-full overflow-hidden">
            <ChartContainer config={chartConfig} className="h-44 w-full">
              <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={{ stroke: 'white', strokeWidth: 1 }}
                  tickLine={{ stroke: 'white' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={{ stroke: 'white', strokeWidth: 1 }}
                  tickLine={{ stroke: 'white' }}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={55}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border-2 border-green-500 rounded-lg p-3 shadow-lg">
                          <p className="text-gray-900 font-bold text-sm mb-1">{label}</p>
                          <p className="text-green-600 font-semibold text-base">
                            Net Worth: {formatCurrency(Number(payload[0].value))}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="netWorth" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="#10b981"
                  fillOpacity={0.3}
                  dot={{ fill: "white", strokeWidth: 4, r: 8, stroke: "#10b981" }}
                  activeDot={{ r: 10, fill: "white", stroke: "#10b981", strokeWidth: 5 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="text-center bg-white/5 rounded-lg p-3">
          <p className="text-sm text-white/90">
            Projected to reach <span className="font-bold text-green-300">{formatCurrency(finalValue)}</span> in {timeHorizon[0]} years
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
