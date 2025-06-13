import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { AssetsDetailDialog } from "./AssetsDetailDialog";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const AssetsBreakdown = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rateOfReturn, setRateOfReturn] = useState([7]);
  const [timeHorizon, setTimeHorizon] = useState([10]);

  const [assets] = useState([
    { name: "Real Estate", amount: "$620,000", value: 620000, color: "#3b82f6" },
    { name: "RRSP", amount: "$52,000", value: 52000, color: "#10b981" },
    { name: "TFSA", amount: "$38,000", value: 38000, color: "#8b5cf6" },
    { name: "Non-Registered", amount: "$25,000", value: 25000, color: "#f59e0b" },
  ]);

  // Calculate projected values
  const projectedAssets = assets.map(asset => {
    const projectedValue = asset.value * Math.pow(1 + rateOfReturn[0] / 100, timeHorizon[0]);
    return {
      ...asset,
      currentValue: asset.value,
      projectedValue: projectedValue,
      growth: projectedValue - asset.value
    };
  });

  const totalCurrentValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalProjectedValue = projectedAssets.reduce((sum, asset) => sum + asset.projectedValue, 0);
  const totalGrowth = totalProjectedValue - totalCurrentValue;

  const chartConfig = {
    projectedValue: { label: "Projected Value", color: "#3b82f6" },
  };

  const chartData = projectedAssets.map(asset => ({
    name: asset.name.replace(/\s+/g, '\n'),
    projected: asset.projectedValue,
    fill: asset.color
  }));

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <span>Assets</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-4">
            {/* Current Asset Breakdown List */}
            <div className="space-y-3">
              {assets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: asset.color }}></div>
                    <span className="text-lg font-medium">{asset.name}</span>
                  </div>
                  <span className="text-lg font-semibold">{asset.amount}</span>
                </div>
              ))}
            </div>

            {/* Current and Projected Totals - Compact Horizontal Layout */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-600 font-medium">Current Total</p>
                <p className="text-lg font-bold text-gray-800">${(totalCurrentValue / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-600 font-medium">Projected Total</p>
                <p className="text-lg font-bold text-blue-800">${(totalProjectedValue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-green-600 font-medium">+${(totalGrowth / 1000).toFixed(0)}K</p>
              </div>
            </div>

            {/* Interactive Controls */}
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-orange-700">
                    Rate of Return: {rateOfReturn[0]}%
                  </label>
                  <Slider
                    value={rateOfReturn}
                    onValueChange={setRateOfReturn}
                    min={1}
                    max={15}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-purple-700">
                    Time Horizon: {timeHorizon[0]} years
                  </label>
                  <Slider
                    value={timeHorizon}
                    onValueChange={setTimeHorizon}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Asset Projected Values Bar Chart */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Projected Asset Values</h3>
                <p className="text-xs text-gray-600">Future values at {rateOfReturn[0]}% return over {timeHorizon[0]} years</p>
              </div>
              
              <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Projected Value']}
                      />}
                    />
                    <Bar dataKey="projected" fill="#3b82f6" name="projected" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <AssetsDetailDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        assets={assets}
      />
    </>
  );
};

export default AssetsBreakdown;
