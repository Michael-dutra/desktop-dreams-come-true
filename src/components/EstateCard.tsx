
import { Crown, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { EstateDetailDialog } from "./EstateDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

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

  // Calculate projected values based on time horizon
  const calculateEstateValues = () => {
    const rate = rateOfReturn[0] / 100;
    const years = timeHorizon[0];
    
    // Calculate total estate value with growth
    const totalEstateValue = estateAssets.reduce((total, asset) => {
      return total + (asset.currentValue * Math.pow(1 + rate, years));
    }, 0);
    
    // Calculate estimated final taxes based on sliders (simplified calculation)
    // Higher rate of return and longer time horizon = higher taxes due to more growth
    const baseTaxRate = 0.03; // 3% base rate
    const rateMultiplier = 1 + (rateOfReturn[0] - 6) * 0.001; // Adjust based on rate
    const timeMultiplier = 1 + (timeHorizon[0] - 15) * 0.002; // Adjust based on time
    const estimatedTaxes = totalEstateValue * baseTaxRate * rateMultiplier * timeMultiplier;
    
    // Net to beneficiaries
    const netToBeneficiaries = totalEstateValue - estimatedTaxes;
    
    return {
      totalEstate: totalEstateValue,
      finalTaxes: estimatedTaxes,
      netToBeneficiaries: netToBeneficiaries
    };
  };

  const estateValues = calculateEstateValues();

  const estateData = [
    {
      category: "Estate",
      amount: estateValues.totalEstate,
      color: "#10b981" // Green
    },
    {
      category: "Final Taxes",
      amount: estateValues.finalTaxes,
      color: "#ef4444" // Red
    },
    {
      category: "Net to Beneficiaries",
      amount: estateValues.netToBeneficiaries,
      color: "#3b82f6" // Blue
    }
  ];

  const chartConfig = {
    amount: { label: "Amount", color: "#8b5cf6" }
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
        <CardContent className="space-y-6">
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

          {/* Estate Values Chart */}
          <div className="p-6 bg-gradient-to-r from-purple-50 to-green-50 border border-purple-200 rounded-xl">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Final Tax Simulation ({timeHorizon[0]} years)</h3>
            </div>
            
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                        name
                      ]}
                    />}
                  />
                  <Bar 
                    dataKey="amount" 
                    radius={[4, 4, 0, 0]}
                  >
                    {estateData.map((entry, index) => (
                      <Bar key={`cell-${index}`} dataKey="amount" fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Summary Numbers */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-lg font-bold text-green-800">Total Estate</p>
                <p className="text-2xl font-bold text-green-900">${(estateValues.totalEstate / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-red-800">Estate Taxes</p>
                <p className="text-2xl font-bold text-red-900">${(estateValues.finalTaxes / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-800">Net Amount</p>
                <p className="text-2xl font-bold text-blue-900">${(estateValues.netToBeneficiaries / 1000).toFixed(0)}K</p>
              </div>
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
