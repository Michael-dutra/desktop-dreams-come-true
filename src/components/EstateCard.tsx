import { Crown, Eye, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { EstateDetailDialog } from "./EstateDetailDialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { SectionAIDialog } from "./SectionAIDialog";

const EstateCard = () => {
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [rateOfReturn, setRateOfReturn] = useState([6]);
  const [timeHorizon, setTimeHorizon] = useState([15]);
  const [isAIDialogOpen, setAIDialogOpen] = useState(false);

  // Mock estate assets data
  const mockEstateAssets = [
    { name: "TFSA", value: 125000, taxType: "Tax-Free" },
    { name: "RRSP", value: 280000, taxType: "Fully Taxable" },
    { name: "Real Estate", value: 450000, taxType: "Capital Gains" },
    { name: "Non-Registered", value: 180000, taxType: "Capital Gains" },
    { name: "Life Insurance", value: 320000, taxType: "Tax-Free" },
    { name: "Business Assets", value: 200000, taxType: "Capital Gains" }
  ];

  // Calculate projected values based on time horizon
  const calculateEstateValues = () => {
    const rate = rateOfReturn[0] / 100;
    const years = timeHorizon[0];
    
    // Calculate total estate value with growth
    const totalEstateValue = mockEstateAssets.reduce((total, asset) => {
      return total + (asset.value * Math.pow(1 + rate, years));
    }, 0);
    
    // Calculate estimated final taxes based on sliders and asset types
    let estimatedTaxes = 0;
    
    mockEstateAssets.forEach(asset => {
      const projectedValue = asset.value * Math.pow(1 + rate, years);
      
      switch (asset.taxType) {
        case "Tax-Free":
          // No tax on TFSA and Life Insurance
          estimatedTaxes += 0;
          break;
        case "Fully Taxable":
          // RRSP fully taxable at marginal rate (assume 35%)
          estimatedTaxes += projectedValue * 0.35;
          break;
        case "Capital Gains":
          // Capital gains at 50% inclusion rate, then taxed at marginal rate
          const capitalGain = projectedValue - asset.value;
          estimatedTaxes += (capitalGain * 0.5) * 0.35;
          break;
      }
    });
    
    // Add estate administration costs (approximately 3-5% of estate)
    const administrationCosts = totalEstateValue * 0.04;
    estimatedTaxes += administrationCosts;
    
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
      color: "#8b5cf6" // Purple
    },
    {
      category: "Final Taxes",
      amount: estateValues.finalTaxes,
      color: "#ef4444" // Red
    },
    {
      category: "Net to Beneficiaries",
      amount: estateValues.netToBeneficiaries,
      color: "#10b981" // Green
    }
  ];

  const chartConfig = {
    amount: { label: "Amount", color: "#8b5cf6" }
  };

  // Formatting function to show M for millions
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return `$${(value / 1000).toFixed(0)}K`;
    }
  };

  // --- Estate AI analysis generator ---
  const generateEstateAIAnalysis = () => {
    let text = `Estate Section – AI Analysis

• Projected Time Horizon: ${timeHorizon[0]} year${timeHorizon[0] > 1 ? "s" : ""} at ${rateOfReturn[0]}% rate of return.
• Total projected estate value: ${formatCurrency(estateValues.totalEstate)}
• Estimated final taxes: ${formatCurrency(estateValues.finalTaxes)}
• Estimated net to beneficiaries: ${formatCurrency(estateValues.netToBeneficiaries)}

Breakdown by asset type:
`;
    mockEstateAssets.forEach(asset => {
      const projectedValue = asset.value * Math.pow(1 + (rateOfReturn[0]/100), timeHorizon[0]);
      text += `  – ${asset.name}: ${formatCurrency(projectedValue)} (${asset.taxType})\n`;
    });
    text += `

Tips & Considerations:
- Higher returns and longer horizons increase the size of your estate—but also the taxes.
- Tax-advantaged accounts (like TFSA) grow without additional tax, maximizing legacy.
- Periodically review beneficiary designations and consider estate planning strategies to reduce taxes and complexity for heirs.

Adjust the sliders to instantly see the implication of growth and time on your legacy.`;

    return text;
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 border-orange-700 text-orange-700 hover:bg-orange-50"
              onClick={() => setShowDetailDialog(true)}
            >
              <Eye className="w-4 h-4" />
              Details
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex items-center border-indigo-600 text-indigo-700 hover:bg-indigo-50 px-3 rounded-lg shadow-sm"
              onClick={() => setAIDialogOpen(true)}
              style={{ border: '2px solid #6366f1' }}
            >
              <Bot className="w-4 h-4 mr-1 text-indigo-600" /> 
              AI
            </Button>
          </div>
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
              <p className="text-sm text-gray-600">Estate value: {formatCurrency(mockEstateAssets.reduce((sum, asset) => sum + asset.value, 0))} growing to {formatCurrency(estateValues.totalEstate)}</p>
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
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent 
                      formatter={(value, name) => [
                        formatCurrency(Number(value)), 
                        name
                      ]}
                    />}
                  />
                  <Bar 
                    dataKey="amount" 
                    radius={[4, 4, 0, 0]}
                  >
                    {estateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Summary Numbers */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: '#8b5cf6' }}>Total Estate</p>
                <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{formatCurrency(estateValues.totalEstate)}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: '#ef4444' }}>Final Taxes</p>
                <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{formatCurrency(estateValues.finalTaxes)}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: '#10b981' }}>Net Amount</p>
                <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{formatCurrency(estateValues.netToBeneficiaries)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EstateDetailDialog 
        isOpen={showDetailDialog} 
        onClose={() => setShowDetailDialog(false)} 
      />
      <SectionAIDialog
        isOpen={isAIDialogOpen}
        onClose={() => setAIDialogOpen(false)}
        title="Estate"
        content={generateEstateAIAnalysis()}
      />
    </>
  );
};

export default EstateCard;
