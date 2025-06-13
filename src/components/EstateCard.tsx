
import { Crown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { EstateDetailDialog } from "./EstateDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const EstateCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rateOfReturn, setRateOfReturn] = useState([6]);
  const [timeHorizon, setTimeHorizon] = useState([15]);

  // Current estate assets with tax implications
  const estateAssets = [
    {
      name: "Real Estate",
      currentValue: 620000,
      acquisitionCost: 450000,
      taxStatus: "Capital Gains", // 50% inclusion rate
      color: "#8b5cf6"
    },
    {
      name: "RRSP", 
      currentValue: 52000,
      acquisitionCost: 35000,
      taxStatus: "Fully Taxable", // 100% taxable at marginal rate
      color: "#10b981"
    },
    {
      name: "TFSA",
      currentValue: 38000,
      acquisitionCost: 30000,
      taxStatus: "Tax-Free", // No tax implications
      color: "#06b6d4"
    },
    {
      name: "Non-Registered",
      currentValue: 25000,
      acquisitionCost: 20000,
      taxStatus: "Capital Gains", // 50% inclusion rate
      color: "#f59e0b"
    }
  ];

  // Calculate future values and tax implications
  const calculateProjections = () => {
    const rate = rateOfReturn[0] / 100;
    const years = timeHorizon[0];
    const marginalTaxRate = 0.43; // Assume 43% marginal tax rate
    
    return estateAssets.map(asset => {
      // Calculate future value
      const futureValue = asset.currentValue * Math.pow(1 + rate, years);
      const totalGain = futureValue - asset.acquisitionCost;
      
      // Calculate current tax implications (if sold today)
      const currentGain = asset.currentValue - asset.acquisitionCost;
      let currentTax = 0;
      let futureTax = 0;
      
      switch (asset.taxStatus) {
        case "Fully Taxable":
          currentTax = asset.currentValue * marginalTaxRate;
          futureTax = futureValue * marginalTaxRate;
          break;
        case "Capital Gains":
          currentTax = Math.max(0, currentGain * marginalTaxRate * 0.5); // 50% inclusion
          futureTax = Math.max(0, totalGain * marginalTaxRate * 0.5);
          break;
        case "Tax-Free":
          currentTax = 0;
          futureTax = 0;
          break;
      }
      
      return {
        ...asset,
        futureValue,
        currentTax,
        futureTax,
        taxDifference: futureTax - currentTax,
        currentNetValue: asset.currentValue - currentTax,
        futureNetValue: futureValue - futureTax
      };
    });
  };

  const projectedAssets = calculateProjections();
  const totalCurrentValue = projectedAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalFutureValue = projectedAssets.reduce((sum, asset) => sum + asset.futureValue, 0);
  const totalCurrentTax = projectedAssets.reduce((sum, asset) => sum + asset.currentTax, 0);
  const totalFutureTax = projectedAssets.reduce((sum, asset) => sum + asset.futureTax, 0);
  const totalCurrentNet = projectedAssets.reduce((sum, asset) => sum + asset.currentNetValue, 0);
  const totalFutureNet = projectedAssets.reduce((sum, asset) => sum + asset.futureNetValue, 0);

  // Chart data comparing current vs future tax implications
  const chartData = [
    {
      category: "Current Estate",
      grossValue: totalCurrentValue,
      taxes: totalCurrentTax,
      netValue: totalCurrentNet,
      color: "#8b5cf6"
    },
    {
      category: "Future Estate",
      grossValue: totalFutureValue,
      taxes: totalFutureTax,
      netValue: totalFutureNet,
      color: "#f59e0b"
    }
  ];

  const chartConfig = {
    grossValue: { label: "Gross Value", color: "#8b5cf6" },
    taxes: { label: "Taxes", color: "#ef4444" },
    netValue: { label: "Net Value", color: "#10b981" }
  };

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-50 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Crown className="h-6 w-6 text-orange-700" />
            </div>
            <span>Estate</span>
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2 border-orange-700 text-orange-700 hover:bg-orange-50"
            onClick={() => setShowDetailDialog(true)}
          >
            <Eye className="w-4 h-4" />
            Details
          </Button>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Interactive Controls */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-700">
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">
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

          {/* Estate Tax Comparison Chart */}
          <div className="p-5 bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200 rounded-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Estate Tax Projection</h3>
              <p className="text-sm text-gray-600">Current vs projected tax implications</p>
            </div>
            
            <ChartContainer config={chartConfig} className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        `$${Number(value).toLocaleString()}`, 
                        name === 'grossValue' ? 'Gross Value' :
                        name === 'taxes' ? 'Taxes' :
                        name === 'netValue' ? 'Net Value' : name
                      ]}
                    />}
                  />
                  <Bar dataKey="grossValue" fill="#8b5cf6" name="Gross Value" />
                  <Bar dataKey="taxes" fill="#ef4444" name="Taxes" />
                  <Bar dataKey="netValue" fill="#10b981" name="Net Value" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Summary Numbers */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Current ({new Date().getFullYear()})</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <p className="text-xs text-purple-700 font-medium">Gross</p>
                    <p className="text-sm font-bold text-purple-800">${(totalCurrentValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <p className="text-xs text-red-700 font-medium">Taxes</p>
                    <p className="text-sm font-bold text-red-800">${(totalCurrentTax / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">Net</p>
                    <p className="text-sm font-bold text-green-800">${(totalCurrentNet / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Projected ({new Date().getFullYear() + timeHorizon[0]})</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <p className="text-xs text-purple-700 font-medium">Gross</p>
                    <p className="text-sm font-bold text-purple-800">${(totalFutureValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <p className="text-xs text-red-700 font-medium">Taxes</p>
                    <p className="text-sm font-bold text-red-800">${(totalFutureTax / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <p className="text-xs text-green-700 font-medium">Net</p>
                    <p className="text-sm font-bold text-green-800">${(totalFutureNet / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Breakdown with Tax Status */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-3">Asset Tax Breakdown</h4>
            <div className="space-y-3">
              {projectedAssets.map((asset, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">{asset.name}</span>
                      <p className="text-xs text-gray-500">{asset.taxStatus}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${(asset.futureValue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-red-600">Tax: ${(asset.futureTax / 1000).toFixed(0)}K</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <EstateDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
      />
    </>
  );
};

export default EstateCard;
